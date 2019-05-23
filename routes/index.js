var express = require("express");
var request = require("request");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


var Photo   = require("../models/photo");
var Follow = require("../models/follow");


//root route
router.get('/', async function(req, res) {
    if (!req.user) {
        res.render("landing");
    } else {
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
    }
});


// show register form
router.get("/register",function(req,res){
    if (req.user) {
        res.redirect('/');
    } else {
        res.render("registration");
    }
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({ 
        username: req.body.username,
        fullname: req.body.fullname,
        image:    req.body.image,
        description: req.body.description
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("registration");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Instagram " + user.username);
           res.redirect("/"); 
        });
    });
});

//show login form
router.get("/login",function(req,res){
    if(req.user){
        res.redirect("/");
    } else {
        res.render("login")
    }
});
// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req,res){
        req.flash("success", "Welcome to Instagram " + user.username);
});

//logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/");
})

router.get("/search", async function(req,res){
  var name = req.query.name;
  console.log(name);
  const users = await User.find({'username': new RegExp(name,"i")});
  console.log(users);
  res.render("search", {users:users});
})

module.exports = router;