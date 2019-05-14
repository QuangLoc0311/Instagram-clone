var mongoose = require("mongoose");

var photoSchema = new mongoose.Schema({
	image: String,
	caption: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],

	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	]
// 	photo_tag: [
// 		{
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref:"Photo_tag"
// 		}
// 	]
});

module.exports = mongoose.model("Photo",photoSchema);
