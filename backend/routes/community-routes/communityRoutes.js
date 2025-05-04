import express from "express"
import { authenticate } from "../../middlewares/auth.js"
import {
	getAllCommunities,
	getCommunityById,
	createCommunity,
	updateCommunity,
	deleteCommunity,
	joinCommunity,
	leaveCommunity,
	getCommunityMembers,
	removeMember,
} from "../../controllers/community-controllers/communityController.js"

const router = express.Router()

// Get all communities by a specific user
router.get("/:userId", authenticate, getAllCommunities)

// Get a specific community by its ID
router.get("/community/:communityId", authenticate, getCommunityById)

// Create a new community
router.post("/create", authenticate, createCommunity)

// Update a community
router.put("/update/:communityId", authenticate, updateCommunity)

// Delete a community
router.delete("/delete/:communityId", authenticate, deleteCommunity)

// Join a community
router.post("/join/:communityId", authenticate, joinCommunity)

// Leave a community
router.post("/leave/:communityId", authenticate, leaveCommunity)

router.get("/members/:communityId", authenticate, getCommunityMembers)

router.delete(
	"/community/:communityId/members/:memberId", authenticate, removeMember
)

export default router
