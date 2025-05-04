import mongoose from "mongoose"
const { Schema } = mongoose

const communitySchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	imageUrl: { type: String },
	admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
	members: [{ type: Schema.Types.ObjectId, ref: "User" }],
	posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
	createdAt: { type: Date, default: Date.now },
})

const CommunityModel = mongoose.model("Community", communitySchema)

export default CommunityModel
