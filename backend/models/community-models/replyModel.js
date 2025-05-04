import mongoose from "mongoose"
const { Schema } = mongoose

const replySchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	postId: {
		type: Schema.Types.ObjectId,
		ref: "Post",
		required: true,
	},
	communityId: {
		type: Schema.Types.ObjectId,
		ref: "Community",
		required: true, // Ensure a reply is tied to a community
	},
	parentReplyId: {
		type: Schema.Types.ObjectId,
		ref: "Reply", // Reference to another reply for nested replies
		default: null, // If it's a top-level reply, it will be null
	},
	createdAt: { type: Date, default: Date.now },
	likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
})

const ReplyModel = mongoose.model("Reply", replySchema)

export default ReplyModel
