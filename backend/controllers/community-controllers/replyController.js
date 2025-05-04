import ReplyModel from "../../models/community-models/replyModel.js"
import PostModel from "../../models/community-models/postModel.js"
import CommunityModel from "../../models/community-models/communityModel.js"
import UserModel from "../../models/userModel.js"

// Create a new reply
export const createReply = async (req, res) => {
	const { content, postId, communityId, parentReplyId } = req.body
	const userId = req.user.id // Assuming the user is logged in and their ID is available in req.user

	try {
		// Validate input
		if (!content || !postId || !communityId) {
			return res
				.status(400)
				.json({ message: "Content, postId, and communityId are required" })
		}

		// Check if post exists		
		const post = await PostModel.findById(postId)
		if (!post) {
			return res.status(404).json({ message: "Post not found" })
		}

		// Create the new reply
		const newReply = new ReplyModel({
			content,
			userId,
			postId,
			communityId,
			parentReplyId: parentReplyId || null, // Parent reply ID if it's a nested reply
		})

		await newReply.save()

		// post.replies.push(newReply._id)

		// Update the parent reply or the post with the new reply
		if (parentReplyId) {
			// If it's a nested reply, update the parent reply's replies array
			await ReplyModel.findByIdAndUpdate(parentReplyId, {
				$push: { replies: newReply._id },
			})
		} else {
			// If it's a top-level reply, update the post's replies array
			post.replies.push(newReply._id)
			await post.save()
		}

		await post.save()

		res.status(201).json(newReply)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Server error" })
	}
}

// Fetch replies for a post, including nested replies
export const getRepliesForPost = async (req, res) => {
	const { postId } = req.params

	try {
		const replies = await ReplyModel.find({ postId, parentReplyId: null })
			.populate("communityId", "name _id")
			.populate("userId", "fullName profileImage")
			.populate("parentReplyId")
			.populate({
				path: "postId",
				select: "_id userId",
				populate: {
					path: "userId",
					select: "fullName",
				},
			})

		const fetchNestedReplies = async (reply) => {
			const nestedReplies = await ReplyModel.find({ parentReplyId: reply._id })
				.populate("communityId", "name _id")
				.populate("userId", "fullName profileImage")
				.populate({
					path: "replies",
					populate: {
						path: "userId",
						select: "fullName profileImage",
					},
				})
				.populate({
					path: "parentReplyId",
					select: "userId fullName",
					populate: {
						path: "userId",
						select: "fullName profileImage",
					},
				})

			reply.replies = nestedReplies

			for (const nestedReply of nestedReplies) {
				await fetchNestedReplies(nestedReply)
			}
		}

		for (const reply of replies) {
			await fetchNestedReplies(reply)
		}

		res.status(200).json(replies)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Server error" })
	}
}

export const getReplyById = async (req, res) => {
	try {
		const { replyId } = req.params
		const reply = await ReplyModel.findById(replyId)
			.populate("userId", "fullName profileImage")
			.populate("postId", "title")
			.populate("communityId", "name")

		if (!reply) {
			return res.status(404).json({ message: "Reply not found" })
		}

		return res.status(200).json(reply)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// Like or unlike a reply
export const likeUnlikeReply = async (req, res) => {
	try {
		const { replyId } = req.params
		const userId = req.user.id

		const reply = await ReplyModel.findById(replyId)

		if (!reply) {
			return res.status(404).json({ message: "Reply not found" })
		}

		let message = ""
		if (reply.likes.includes(userId)) {
			// Unlike the reply
			reply.likes = reply.likes.filter(
				(id) => id.toString() !== userId.toString()
			)
			message = "Reply unliked"
		} else {
			// Like the reply
			reply.likes.push(userId)
			message = "Reply liked"
		}

		await reply.save()
		return res.status(200).json({ message, likes: reply.likes })
	} catch (error) {
		console.error("Error liking/unliking reply:", error)
		return res.status(500).json({ message: "Internal server error" })
	}
}

export const deleteReply = async (req, res) => {	
	try {
		const { replyId } = req.params
		const userId = req.user.id // Assuming the user is logged in and their ID is available in req.user
		// Check if reply exists
		const reply = await ReplyModel.findById(replyId)

		if (!reply) {
			return res.status(404).json({ message: "Reply not found" })
		}

		// Delete the reply
		await ReplyModel.findByIdAndDelete(replyId)

		// Optionally, remove the reply from the parent post or parent reply
		if (reply.parentReplyId) {
			await ReplyModel.findByIdAndUpdate(reply.parentReplyId, {
				$pull: { replies: replyId },
			})
		} else {
			await PostModel.findByIdAndUpdate(reply.postId, {
				$pull: { replies: replyId },
			})
		}

		return res.status(200).json({ message: "Reply deleted successfully" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Server error" })
	}
}

