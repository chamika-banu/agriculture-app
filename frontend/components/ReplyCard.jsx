import { View, Text, Pressable, StyleSheet } from "react-native"
import { useState, useContext } from "react"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import { likeUnlikeReply, deleteReply } from "../api/communityApi"
import { timeAgo } from "../utils/timeAgo"
import { useRouter } from "expo-router"
import { useAuth } from "../context/authContext"
import { useCommunity } from "../context/communityContext"
import PostActionSection from "./PostActionSection"

const ReplyCard = ({ reply, admin, nestLevel = 0, isLastReply = false }) => {
	const blurhash = "LCKMX[}@I:OE00Eg$%Na0eNHWp-B"
	const { user } = useAuth()
	const userId = user?.userId
	const { fetchData, selectPost } = useCommunity()
	const router = useRouter()
	const {
		content,
		userId: replyAuthor, 
		postId,
		createdAt,
		likes,
		_id: replyId,
		replies,
		parentReplyId,
	} = reply

	// State variables for like count, liked status, menu visibility, and nested replies visibility
	const [likeCount, setLikeCount] = useState(likes.length)
	const [liked, setLiked] = useState(likes.includes(userId)) 
	const [showMenu, setShowMenu] = useState(false)
	const [showNestedReplies, setShowNestedReplies] = useState(false)
	admin = userId === replyAuthor._id 

	const handleLikeUnlike = async () => {
		try {
			const { likes } = await likeUnlikeReply(replyId)
			setLikeCount(likes.length)
			setLiked(likes.includes(userId))
		} catch (error) {
			console.error(error)
		}
	}

	const toggleMenu = () => {
		setShowMenu(!showMenu)
	}

	const onDelete = async () => {
		try {
			await deleteReply(replyId)
			toggleMenu()
			fetchData("posts")
		} catch (error) {
			console.log(error)
		}
	}

	const onReply = () => {
		selectPost(reply)
		router.push({
			pathname: `/community/post/reply/${postId}`,
			params: { parentReplyId: replyId },
		})
	}

	const toggleNestedReplies = () => {
		setShowNestedReplies(!showNestedReplies)
	}

	return (
		<View className={`relative mt-3 ${nestLevel === 0 ? "pl-0" : "pl-4"}`}>
			{nestLevel > 0 && (
				<View
					className="absolute left-0 top-0 w-0.5 bg-green-500"
					style={{ height: isLastReply ? "50%" : "100%" }}
				/>
			)}

			<View className="bg-white rounded-xl p-4">
				<View className="flex-row items-center mb-1.5">
					<Image
						source={{ uri: replyAuthor.profileImage }} 
						style={styles.profileImage}
						contentFit="cover"
						placeholder={{ blurhash }}
					/>

					<View className="ml-2.5">
						<Text className="font-psemibold text-lg text-gray-900">
							{replyAuthor.fullName}
						</Text>
						<Text className="text-sm text-gray-500">{timeAgo(createdAt)}</Text>
					</View>
				</View>

				<Text className="text-gray-500 font-pmedium mb-2">
					Replying to{" "}
					<Text className="text-base font-pmedium text-gray-600">
						{reply.postId?.userId?.fullName || parentReplyId?.userId?.fullName}{" "}						
					</Text>
				</Text>

				<Text className="text-lg font-pregular mb-3">{content}</Text>

				<PostActionSection
					liked={liked}
					likeCount={likeCount}
					onLike={handleLikeUnlike}
					onReply={onReply}
					onToggleMenu={toggleMenu}
					onDelete={onDelete}
					showMenu={showMenu}
					replyCount={replies.length}
					admin={admin}
				/>
			</View>

			{replies.length > 0 && (
				<View className="">
					<Pressable
						className="flex-row items-center mt-2 mb-1 py-1.5"
						onPress={toggleNestedReplies}
					>
						<Text className="text-green-500 text-sm font-pmedium">
							{showNestedReplies
								? "Hide replies"
								: `Show ${replies.length} ${
										replies.length === 1 ? "reply" : "replies"
								  }`}
						</Text>
						<Ionicons
							name={showNestedReplies ? "chevron-up" : "chevron-down"}
							size={14}
							color="#3B82F6"
							className="ml-2"
						/>
					</Pressable>

					{showNestedReplies &&
						replies.map((nestedReply, index) => (
							<ReplyCard
								key={nestedReply._id}
								reply={nestedReply}
								admin={admin}
								nestLevel={nestLevel + 1}
								isLastReply={index === replies.length - 1}
							/>
						))}
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	profileImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
})

export default ReplyCard
