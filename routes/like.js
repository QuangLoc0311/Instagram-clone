var express = require("express");
var router  = express.Router({mergeParams: true});
var Photo   = require("../models/photo");
var middleware = require("../middleware");
var bodyParser = require("body-parser");
var User =  require("../models/user");




router.post("/",middleware.isLoggedIn,function(req, res){
	Photo.findById(req.params.id, function(err, photo){
		if(err){
			console.log(err);
			res.sendStatus(500);
		} else {
			photo.likes.push(req.user._id);
			photo.save();
			res.sendStatus(200);
		}
	});
});

router.delete("/",middleware.isLoggedIn,function(req, res){
	Photo.findById(req.params.id, function(err, photo){
		if(err){
			console.log(err);
			res.sendStatus(500);
		} else {
			photo.likes = photo.likes.filter(id => id.toString() !== req.user._id.toString());
			photo.save();
			res.sendStatus(200);
		}
	});
});

module.exports = router;