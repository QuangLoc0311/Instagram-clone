var express = require("express");
var router  = express.Router({mergeParams: true});
var Photo   = require("../models/photo");
var Comment = require("../models/comment");
var middleware = require("../middleware");



//Comment Create
router.post("/",middleware.isLoggedIn,function(req, res){
	Photo.findById(req.params.id, function(err, photo){
		if(err){
			console.log(err);
			res.redirect("/photos");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error","Something went wrong!");
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					photo.comments.push(comment._id);
					photo.save();
					console.log(comment);
					req.flash("success","Successfully added comment");
					res.redirect('/photos/' + photo._id);
				}
			});
		}
	});
});


// COMMENT DESTROY ROUTE
// router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
//     //findByIdAndRemove
//     Comment.findByIdAndRemove(req.params.comment_id, function(err){
//        if(err){
//            res.redirect("back");
//        } else {
//            req.flash("success", "Comment deleted")
//            res.redirect("/campgrounds/" + req.params.id);
//        }
//     });
// });


module.exports = router;
