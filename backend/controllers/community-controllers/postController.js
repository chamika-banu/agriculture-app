import PostModel from "../../models/community-models/postModel.js"
import CommunityModel from "../../models/community-models/communityModel.js"

// Create a new post
export const createPost = async (req, res) => {
    try {
        console.log("creatign post")

        const { content, communityId, imageUrl } = req.body

        const userId = req.user.id

        if (!content) {
            return res.status(400).json({ error: "Content required" })
        }

        if (!communityId) {
            return res.status(400).json({ error: "Community ID required" })
        }

        const newPost = new PostModel({
            content,
            userId,
            communityId,
            imageUrl,
        })

        await newPost.save()

        await CommunityModel.findByIdAndUpdate(communityId, {
            $push: { posts: newPost._id },
        })

        res
            .status(201)
            .json({ message: "Post created successfully", post: newPost })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to create post" })
    }
}

// Get post by ID
export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params
        const post = await PostModel.findById(postId)
            .populate("userId", "fullName profileImage")
            .populate("communityId", "name")

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        return res.status(200).json(post)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

// Get all posts in a community
export const getPostsByCommunity = async (req, res) => {
    try {
        const { communityId } = req.params

        // Find the community by id
        const community = await CommunityModel.findById(communityId)

        if (!community) {
            return res.status(404).json({ message: "Community not found" })
        }

        const posts = await PostModel.find({ communityId: communityId }).sort({
            createdAt: -1,
        })

        return res.status(200).json(posts)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

// Get all posts belonging to all communities that the user has joined
export const getPostsByAllCommunities = async (req, res) => {
    try {
        const { userId } = req.params

        // Find the communities that the user is a member of
        const userCommunities = await CommunityModel.find({
            members: userId,
        }).select("_id")

        if (!userCommunities || userCommunities.length === 0) {
            return res
                .status(200)
                .json({ message: "User has not joined any community", posts: [] })
        }

        // Get all posts from the communities the user has joined
        const communityIds = userCommunities.map((community) => community._id)

        const posts = await PostModel.find({
            communityId: { $in: communityIds },
        })
            .populate("userId", "fullName profileImage") // Populate user details
            .populate("communityId", "name") // Populate community name
            .sort({ createdAt: -1 })

        console.log(posts)
        return res.status(200).json(posts)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

// // Delete a post
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params

        const post = await PostModel.findByIdAndDelete(postId)

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

// Like or unlike a post
export const likeUnlikePost = async (req, res) => {
    try {
        const { postId } = req.params
        const userId = req.user.id

        const post = await PostModel.findById(postId)

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        let message = ""
        if (post.likes.includes(userId)) {
            // Unlike the post
            post.likes = post.likes.filter(
                (id) => id.toString() !== userId.toString()
            )
            message = "Post unliked"
        } else {
            // Like the post
            post.likes.push(userId)
            message = "Post liked"
        }

        await post.save()
        return res.status(200).json(post)
    } catch (error) {
        console.error("Error liking/unliking post:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
