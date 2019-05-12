const mongoose = require('mongoose');

const User = require('./models/user');
const Photo = require('./models/photo');
const Follow = require('./models/follow');

mongoose.connect("mongodb://localhost/instagram-v2", { useNewUrlParser: true });

(async () => {
  console.log("test");
  // const userList = User.find();

  const user = await User.findOne({"username": "duy"}).populate('photos');
  console.log(user);
  const userId = user._id;

  let followerList = await Follow.find({'followee': userId}).populate('follower');
  let followeeList = await Follow.find({'follower': userId}).populate('followee');

  followerList = followerList.map(follow => follow.follower);
  followeeList = followeeList.map(follow => follow.followee);

  console.log("Enter follow page");
  console.log(followeeList);
  console.log(followerList);



  // const p = await Photo.findById("5c2335b101dc8b0f47cfd136");
  // console.log(p.likes);
  // console.log(user._id);

  // // console.log(typeof p.likes[0]);
  // console.log(p.likes.filter(id => id.toString() === user._id.toString()));
  // p.likes = p.likes.filter(id => id.toString() !== user._id.toString());
  // await p.save();
  // console.log(p)
})()
