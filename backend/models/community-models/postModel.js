import mongoose from "mongoose"
const { Schema } = mongoose

const postSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	communityId: {
		type: Schema.Types.ObjectId,
		ref: "Community",
	},
	createdAt: { type: Date, default: Date.now },
	likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
	imageUrl: { type: String },
})

const PostModel = mongoose.model("Post", postSchema)

export default PostModel
