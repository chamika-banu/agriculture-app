import express from "express"
import { authenticate } from "../../middlewares/auth.js"
import {
	createReply,
	getRepliesForPost,
	getReplyById,
	likeUnlikeReply,
	deleteReply,
} from "../../controllers/community-controllers/replyController.js"

const router = express.Router()

// Create a new reply
router.post("/create", authenticate, createReply)

// Get all replies for a post
router.get("/post/:postId", authenticate, getRepliesForPost)

// Get a reply by its ID
router.get("/reply/:replyId", authenticate, getReplyById)

// Like or unlike a reply
router.post("/like-unlike/:replyId", authenticate, likeUnlikeReply)

// Delete a reply
router.delete("/delete/:replyId", authenticate, deleteReply)

export default router
