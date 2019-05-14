var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");

var Photo   = require("../models/photo");
var User =  require("../models/user");
var Follow = require("../models/follow");


// INDEX - show all photos
router.get("/",middleware.isLoggedIn, async function(req,res){
  const user = await User.findById(req.user._id).populate('photos');

  const fList = await Follow
    .find({"follower": user._id})
    .populate({path: "followee", populate: {path: "photos"}})
    .then(list => list.map(f => f.followee.photos));

  const photos = [].concat(...fList, ...user.photos)
                      .sort((a,b) => a._id.getTimestamp > b._id.getTimestamp);

  for (var p of photos) {
    if (p.likes.length !== 0) {
      console.log(p.likes[0].toString());
      console.log(typeof p.likes[0].toString());
      console.log(req.user._id.toString());
      console.log(typeof req.user._id.toString());

	//   console.log(p.likes[0].toString() == req.user._id.toString());
	  console.log(p.likes.filter(id => id.toString() == req.user._id.toString()));

    }
  }
	res.render('home', {photos: photos})

});




//NEW - show form to create new photo
router.get("/new", middleware.isLoggedIn ,function(req,res){
	res.render("photos/new");
})



//CREATE - create new photo
router.post("/", middleware.isLoggedIn ,function(req,res) {
	User.findById(req.user._id, function(err,user){
		if(err){
			console.log(err);
		}
		var caption = req.body.caption;
		var image = req.body.image;
		var author = {
			id: req.user._id,
			username: req.user.username
		}
		var newPhoto = {caption:caption, image:image, author:author};
		// console.log(newPhoto);
		Photo.create(newPhoto, function(err,photo){
			if(err){
				console.log(err);
			}
			console.log(photo);
			user.photos.push(photo);
			user.save();
			res.redirect('/');
		});
	});
});

//SHOW - shows more info about the photo
router.get("/:id", function(req,res){
	Photo.findById(req.params.id).populate("comments").exec(function(err,foundPhoto){
		if(err){
			console.log(err);
		} else {
			console.log(foundPhoto);
			res.render("photos/show",{photo: foundPhoto});
		}
	});
});



module.exports = router;
