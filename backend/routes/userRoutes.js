import express from "express"
import { authenticate } from "../middlewares/auth.js"
import { registerUser, loginUser, getUserProfile, deleteUser, updateUserProfile } from "../controllers/userController.js"

const router = express.Router()

// Public Routes
router.post("/register", registerUser)
router.post("/login", loginUser)

// Protected Routes
router.get("/profile", authenticate, getUserProfile)
router.delete("/profile", authenticate, deleteUser)
router.put("/profile", authenticate, updateUserProfile)

export default router
