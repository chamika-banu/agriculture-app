import express from "express"
import { authenticate } from "../../middlewares/auth.js"
import {
	createPost,
	getPostById,
	getPostsByCommunity,
	getPostsByAllCommunities,
	deletePost,
	likeUnlikePost,
} from "../../controllers/community-controllers/postController.js"

const router = express.Router()

// Create a new post
router.post("/create", authenticate, createPost)

// Get a specific post by its ID
router.get("/post/:postId", authenticate, getPostById)

// Get all posts from a specific community
router.get("/community/:communityId", authenticate, getPostsByCommunity)

// Get all posts from all communities by a specific user
router.get("/:userId", authenticate, getPostsByAllCommunities)

// Delete a post
router.delete("/delete/:postId", authenticate, deletePost)

// Like or unlike a post
router.post("/like-unlike/:postId", authenticate, likeUnlikePost)

export default router
