import UserModel from "../models/userModel.js"
import {
	hashPassword,
	comparePassword,
	generateToken,
} from "../middlewares/auth.js"

// Register a new user
export const registerUser = async (req, res) => {
	try {
		const { fullName, email, password, profileImage } = req.body

		const existingEmail = await UserModel.findOne({ email })

		if (existingEmail) {
			return res.status(400).json({ error: "Email already exists" })
		}				

		const existingName = await UserModel.findOne({ fullName })

		if (existingName) {
			return res.status(400).json({ error: "Name already exists" })
		}


		const hashedPassword = await hashPassword(password)

		const newUser = new UserModel({
			fullName,
			email,
			password: hashedPassword,
			profileImage,
		})

		await newUser.save()

		const token = generateToken(newUser)
		res.status(201).json({ token, user: newUser })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Something went wrong in the server" })
	}
}

// Login
export const loginUser = async (req, res) => {
	try {		
		const { email, password } = req.body

		const user = await UserModel.findOne({ email })
		if (!user) {
			return res.status(404).json({ error: "Invalid credentials" })
		}

		const passwordMatch = await comparePassword(password, user.password)
		if (!passwordMatch) {
			return res.status(400).json({ error: "Invalid credentials" })
		}

		const token = generateToken(user)
		res.status(200).json({ message: "Login successful", token, user })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Something went wrong in the server" })
	}
}

// Get user profile
export const getUserProfile = async (req, res) => {
	try {
		const userId = req.user.id
		const user = await UserModel.findById(userId).select("-password") // Exclude password
		if (!user) {
			return res.status(404).json({ error: "User not found" })
		}
		res.status(200).json(user)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Something went wrong in the server" })
	}
}

// Delete user
export const deleteUser = async (req, res) => {
	try {
		const userId = req.user.id

		const user = await UserModel.findByIdAndDelete(userId)
		if (!user) {
			return res.status(404).json({ error: "User not found" })
		}

		res.status(200).json({ message: "User deleted successfully" })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Something went wrong in the server" })
	}
}

// Update user profile
export const updateUserProfile = async (req, res) => {
	try {
		const userId = req.user.id
		const updateData = { ...req.body }

		if (updateData.fullName) {
			const existingName = await UserModel.findOne({ fullName: updateData.fullName })

			if (existingName) {
				return res.status(400).json({ error: "Name already exists" })
			}
		}

		if (updateData.email) {
			const existingEmail = await UserModel.findOne({ email: updateData.email })

			if (existingEmail) {
				return res.status(400).json({ error: "Email already exists" })
			}
		}				
		
		if (updateData.password) {
			updateData.password = await hashPassword(updateData.password)
		}

		const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
			new: true,
		}).select("-password")

		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" })
		}

		res.status(200).json({
			message: "User profile updated successfully",
			user: updatedUser,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Something went wrong in the server" })
	}
}

