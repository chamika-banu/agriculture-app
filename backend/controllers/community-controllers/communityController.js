import CommunityModel from "../../models/community-models/communityModel.js"

// Get both user communities and non-user communities
export const getAllCommunities = async (req, res) => {	
	try {
		const { userId } = req.params
		if (!userId) return res.status(400).json({ error: "User ID is required" })

		const userCommunities = await CommunityModel.find({ members: userId })
		const nonUserCommunities = await CommunityModel.find({
			members: { $ne: userId }, // $ne means "not equal"
		})

		res.status(200).json({ userCommunities, nonUserCommunities })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to fetch communities" })
	}
}

// Create a new community
export const createCommunity = async (req, res) => {
	try {
		let { name, description, imageUrl } = req.body
		const admin = req.user.id

		if (!name) {
			return res.status(400).json({ error: "Name required" })
		}

		if (!description) {
			return res.status(400).json({ error: "Community description required" })
		}				

		name = name.trim()
		description = description.trim()

		const newCommunity = new CommunityModel({
			name,
			description,
			imageUrl,
			admin,
			members: [admin],
		})

		await newCommunity.save()

		res.status(201).json({
			message: "Community created successfully",
			community: newCommunity,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to create community" })
	}
}

export const updateCommunity = async (req, res) => {
	try {
		const { communityId } = req.params
		let { name, description, imageUrl } = req.body
		const userId = req.user.id

		// Find the community by ID
		const community = await CommunityModel.findById(communityId)

		if (!community) {
			return res.status(404).json({ error: "Community not found" })
		}

		// Only the admin can update the community
		if (community.admin.toString() !== userId) {
			return res
				.status(403)
				.json({ error: "You are not authorized to update this community" })
		}

		// Validate the required fields
		if (name) {
			name = name.trim()
			community.name = name
		}

		if (description) {
			description = description.trim()
			community.description = description
		}

		// Update the image URL if a new image is provided
		if (imageUrl) {
			community.imageUrl = imageUrl
		}

		// Save the updated community
		await community.save()

		// Send the response
		res.status(200).json({
			message: "Community updated successfully",
			community,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to update community" })
	}
}


// Get community by Id
export const getCommunityById = async (req, res) => {
	try {
		const { communityId } = req.params

		const community = await CommunityModel.findById(communityId)
			.populate("admin", "fullName profileImage")
			.populate({
				path: "posts", // Populates the posts array
				options: { sort: { createdAt: -1 } }, // Sort posts by createdAt in descending order
				populate: [
					{
						path: "userId", // Further populates the user inside each post
						select: "fullName profileImage email", // Fetches only these fields from the user
					},
					{
						path: "communityId", // Populate community details inside each post
						select: "name", // Include only the community name
					},
				],
			})

		if (!community) {
			return res.status(404).json({ error: "Community not found" })
		}

		res.status(200).json(community)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// Delete a community
export const deleteCommunity = async (req, res) => {
	try {
		const { communityId } = req.params

		// Find the community by id and delete it
		const community = await CommunityModel.findByIdAndDelete(communityId)

		if (!community) {
			return res.status(404).json({ error: "Community not found" })
		}

		res.status(200).json({ message: "Community deleted successfully" })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Internal server error" })
	}
}

// Join community
export const joinCommunity = async (req, res) => {
	try {
		const { communityId } = req.params
		const userId = req.user.id

		const community = await CommunityModel.findById(communityId)
		if (!community) {
			return res.status(404).json({ message: "Community not found" })
		}
		if (community.members.includes(userId)) {
			return res
				.status(400)
				.json({ message: "User is already a member of the community" })
		}
		community.members.push(userId)
		await community.save()
		res.status(200).json({ message: "Joined community successfully" })
	} catch (error) {
		res.status(500).json({ message: "Server error", error })
	}
}

// Leave community
export const leaveCommunity = async (req, res) => {
	try {
		const { communityId } = req.params
		const userId = req.user.id
		const community = await CommunityModel.findById(communityId)
		if (!community) {
			return res.status(404).json({ message: "Community not found" })
		}
		if (!community.members.includes(userId)) {
			return res
				.status(400)
				.json({ message: "User is not a member of the community" })
		}
		community.members = community.members.filter(
			(member) => member.toString() !== userId.toString()
		)
		
		await community.save()
		res.status(200).json({ message: "Left community successfully" })
	} catch (error) {
		res.status(500).json({ message: "Server error", error })
	}
}

// Controller to get the members list of a community
export const getCommunityMembers = async (req, res) => { 
	try {
		const { communityId } = req.params

		// Find the community by ID and populate the members' details
		const community = await CommunityModel.findById(communityId).populate(
			"members",
			"_id fullName profileImage"
		)

		if (!community) {
			return res.status(404).json({ error: "Community not found" })
		}

		// Extract members' details and exclude the admin
		const members = community.members
			.filter((member) => member._id.toString() !== community.admin.toString())
			.map((member) => ({
				id: member._id,
				fullName: member.fullName,
				profileImage: member.profileImage,
			}))

		// Send the extracted members' details as response
		res.status(200).json({ members })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to get community members" })
	}
}

// Remove member from community
export const removeMember = async (req, res) => {
	try {
		const { communityId, memberId } = req.params
		const userId = req.user.id

		// Find the community by ID
		const community = await CommunityModel.findById(communityId)
		if (!community) {
			return res.status(404).json({ message: "Community not found" })
		}

		// Check if the requesting user is the admin of the community
		if (community.admin.toString() !== userId.toString()) {
			return res
				.status(403)
				.json({ message: "Only the admin can remove members" })
		}

		// Check if the member to be removed is part of the community
		if (!community.members.includes(memberId)) {
			return res
				.status(400)
				.json({ message: "User is not a member of the community" })
		}

		// Remove the member from the community
		community.members = community.members.filter(
			(member) => member.toString() !== memberId.toString()
		)

		await community.save()
		res.status(200).json({ message: "Member removed successfully" })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Server error", error })
	}
}

