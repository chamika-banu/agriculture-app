import { createContext, useContext, useState, useEffect } from "react"
import {
	getAllCommunities,
	joinCommunity,
	leaveCommunity,
	getPostsFromAllUsersCommunities,	
	likeUnlikePost
} from "../api/communityApi"
import { useAuth } from "./authContext"

const CommunityContext = createContext()

export const CommunityProvider = ({ children }) => {
	const { user } = useAuth()
	const userId = user?.userId
	const [userCommunities, setUserCommunities] = useState([])
	const [nonUserCommunities, setNonUserCommunities] = useState([])
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)
	const [communityError, setCommunityError] = useState(null)
	const [postsError, setPostsError] = useState(null)
	const [selectedPost, setSelectedPost] = useState(null)

	useEffect(() => {
		if (userId) {
			fetchData()
		}
	}, [userId])

	const fetchData = async (fetchType = "both") => {
		if (!userId) {
			console.error("No user id provided")
			return
		}

		setCommunityError(null)
		setPostsError(null)

		if (fetchType === "communities" || fetchType === "both") {
			try {				
				// console.log("Fetching communities for user: ", userId)
				const { userCommunities, nonUserCommunities } = await getAllCommunities(
					userId
				)
				setUserCommunities(userCommunities || [])
				setNonUserCommunities(nonUserCommunities || [])
			} catch (error) {
				console.error("Error fetching communities:", error)
				setCommunityError(
					"Failed to fetch communities. Please try again later."
				)
			}
		}

		// Fetch posts
		if (fetchType === "posts" || fetchType === "both") {
			try {	
				// console.log("Fetching posts for user: ", userId)
				const postsData = await getPostsFromAllUsersCommunities(userId)
				setPosts(postsData || [])
			} catch (error) {
				console.error("Error fetching posts:", error)
				setPostsError("Failed to fetch posts. Please try again later.")
			}
		}

		setLoading(false)
	}

	// Refresh data (re-fetch both communities and posts)
	const refreshData = async () => {
		setLoading(true)
		await fetchData()
	}

	// Like/Unlike functionality
	const handleLikeUnlike = async (postId) => {
		// console.log("Like/Unlike post id:", postId)
		try {
			const { likes } = await likeUnlikePost(postId)
			setPosts((prevPosts) =>
				prevPosts.map((post) =>
					post._id === postId ? { ...post, likes } : post
				)
			)
		} catch (error) {
			console.error(error)
		}
	}

	// Set selected post
	const selectPost = (post) => {
		setSelectedPost(post)
	}

	const handleJoinCommunity = async (communityId) => {
		try {
			await joinCommunity(communityId)			

			fetchData()
		} catch (error) {
			console.error(error)
		}
	}

	const handleLeaveCommunity = async (communityId) => {
		try {
			await leaveCommunity(communityId)

			fetchData()
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<CommunityContext.Provider
			value={{
				fetchData,
				refreshData,
				userCommunities,
				nonUserCommunities,
				setUserCommunities,
				posts,
				setPosts,
				loading,
				postsError,
				communityError,
				handleLikeUnlike,
				handleJoinCommunity,
				handleLeaveCommunity,
				selectPost,
				selectedPost,
			}}
		>
			{children}
		</CommunityContext.Provider>
	)
}

export const useCommunity = () => useContext(CommunityContext)