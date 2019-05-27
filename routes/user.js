var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");
var User =  require("../models/user");
var Follow = require("../models/follow");

router.get("/:id",middleware.isLoggedIn, async function(req,res) {
	const user = await User.findById(req.params.id).populate('photos');
	const followList = await Follow.find(
		{$or: [{'follower': req.params.id},
			   {'followee': req.params.id}]}
	);
	
	const isFollow = followList.filter(f => f.follower === req.user._id);

	const followerList = followList.filter(f => f.followee.toString() === req.params.id.toString());
	const followeeList = followList.filter(f => f.follower.toString() === req.params.id.toString());
	console.log(followeeList, followerList);


	if(!req.user._id.equals(req.params.id)) {
		// render page of otherUser

		res.render("users/index", 
			{user,
			isFollow, 
			followerList, 
			followeeList});
	} else {
		// render page of currentUser
		res.render("users/index", 
			{user:user, 
			isFollow: null,
			followerList: followerList, 
			followeeList: followeeList});
	}
});

router.post("/:id/follow", function(req, res) {
	Follow.create({
		follower: req.user.id,
		followee: req.params.id
	}, function(err, follow) {
		if(err) {
			console.log(err);
			res.sendStatus(500);
		}
		// console.log(follow);
		res.sendStatus(200);
	})
})



router.delete("/:id/follow", function(req, res) {
	Follow.remove({
		follower: req.user.id,
		followee: req.params.id
	}, function(err) {
		if(err) {
			console.log(err);
			res.sendStatus(500);
		}
		res.sendStatus(200);
	})
})


router.get("/:id/follow",async function(req,res){
	
	let followerList = await Follow.find({'followee':req.params.id}).populate('follower');
	let followeeList = await Follow.find({'follower':req.params.id}).populate('followee');

	followerList = followerList.map(follow => follow.follower);
	followeeList = followeeList.map(follow => follow.followee);

	console.log("Enter follow page");
	console.log(followeeList, followerList);



	res.render("users/follow", {
		followerList: followerList,
		followeeList: followeeList
	});
});


//UPDATE 
router.get("/:id/edit", function(req,res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			res.redirect("/users" + req.params.id);
		} else {
			res.render("users/edit", {user: foundUser});
		}
	});
});

router.put("/:id", function(req,res){
	User.findByIdAndUpdate(req.params.id, req.body.user , function(err, updatedUser){
		if(err){
			console.log(err);
		} else {
			console.log(updatedUser);
			res.redirect("/users/" + req.params.id);
		}
	});

});

module.exports = router;
