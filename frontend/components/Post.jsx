import { View, Text, StyleSheet } from "react-native"
import React, { useState, useEffect, useContext } from "react"
import { Image } from "expo-image"
import { deletePost } from "../api/communityApi"
import { useCommunity } from "../context/communityContext"
import { useRouter } from "expo-router"
import { timeAgo } from "../utils/timeAgo"
import PostActionSection from "./PostActionSection"
import { useAuth } from "../context/authContext"

const Post = ({ post, community, replying }) => {
	const blurhash = "LCKMX[}@I:OE00Eg$%Na0eNHWp-B"
	const { user } = useAuth()
	const userId = user?.userId
	const router = useRouter()
	const { selectPost, fetchData, handleLikeUnlike } = useCommunity()
	const {
		_id: postId,
		likes,
		userId: postAuthor,
		communityId,
		createdAt,
		imageUrl,
		content,
		replies,
	} = post

	// Check if the logged-in user is the admin (author) of the post
	const admin = userId === postAuthor._id 
	const [showMenu, setShowMenu] = useState(false)

	// Check if the logged-in user has liked the post
	const liked = likes.includes(userId)
	const likeCount = likes.length

	const toggleMenu = () => {
		setShowMenu(!showMenu)
	}

	const onLike = async () => {
		handleLikeUnlike(postId)
	}

	const onDelete = async () => {
		try {
			const response = await deletePost(postId)
			toggleMenu()
			fetchData("posts")
		} catch (error) {
			console.log(error)
		}
	}

	const onReply = () => {
		selectPost(post)
		router.push(`/community/post/reply/${postId}`)
	}

	return (
		<View className="bg-white p-4 my-2 rounded-2xl">
			<View className="flex flex-row items-center">
				<Image
					source={{ uri: postAuthor.profileImage }}
					style={styles.profileImage}
					contentFit="cover"
					placeholder={{ blurhash }}
				/>
				<View className="ml-4 flex">
					<View className="flex flex-row items-center">
						<Text className="font-psemibold text-lg mr-2">
							{postAuthor.fullName}
						</Text>
						<Text className="mt-1">•</Text>
						<Text className="font-pregular text-sm ml-1">
							{timeAgo(createdAt)}
						</Text>
					</View>

					<Text className="text-gray-500 font-pmedium text-base">
						@
						{(communityId?.name || community?.name)
							?.replace(/\s+/g, "")
							?.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())}
					</Text>
				</View>
			</View>

			<Text className="mt-4 font-pregular text-base">{content}</Text>

			{imageUrl && (
				<View className="flex my-4 items-center w-full overflow-hidden rounded-2xl">
					<Image
						source={{ uri: imageUrl }}
						style={[styles.postImage]}
						contentFit="cover"
						transition={300}
					/>
				</View>
			)}

			{!replying && (
				<PostActionSection
					liked={liked}
					likeCount={likeCount}
					onLike={onLike}
					onReply={onReply}
					replyCount={replies.length}
					onToggleMenu={toggleMenu}
					onDelete={onDelete}
					showMenu={showMenu}
					admin={admin}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	profileImage: {
		width: 50,
		height: 50,
		borderRadius: 50,
	},
	postImage: {
		width: "100%",
		height: undefined,
		aspectRatio: 1,
	},
})

export default Post
