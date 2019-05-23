var Photo   = require("../models/photo");
var middleware = require("../middleware");

exports.photo_get = (req, res) => {
  res.render('photos/index');
}

exports.photo_new_get = (req, res) => {
  res.render('photos/new');
}

exports.photo_new_post = (req,res) => {
  var caption = req.body.caption;
	var image = req.body.image;
	var author =  {
		id: req.user._id,
		username: req.user.username
	}

	var newPhoto = {caption: caption, image: image, author:author}
	//Create a new photo and save to DB
	Photo.create(newPhoto, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to photos page
			console.log(newlyCreated);
			res.redirect("/photos");
		}
	})
}

exports.photo_delete = (req, res) => {

}

exports.photo_edit = (req, res) => {

}
