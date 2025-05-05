import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Pressable,
	RefreshControl,
} from "react-native"
import React, { useState, useCallback } from "react"
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { getRepliesForPost } from "../../../api/communityApi"
import ReplyCard from "../../../components/ReplyCard"
import { useCommunity } from "../../../context/communityContext"
import { Image } from "expo-image"
import { formatTime, formatDate } from "../../../utils/timeAgo"
import PostActionSection from "../../../components/PostActionSection"
import { useAuth } from "../../../context/authContext"
import LoadingSpinner from "../../../components/LoadingSpinner"
import Feather from "@expo/vector-icons/Feather"
import { deletePost, getPostById } from "../../../api/communityApi"

const Post = ({ community }) => {
	const blurhash = "LCKMX[}@I:OE00Eg$%Na0eNHWp-B"
	const { user: authUser } = useAuth()
	const userId = authUser?.userId
	const { postId } = useLocalSearchParams()
	const { posts, handleLikeUnlike, fetchData, selectPost } = useCommunity()
	const [showMenu, setShowMenu] = useState(false)
	const [replies, setReplies] = useState([])
	const router = useRouter()
	const [post, setPost] = useState(null)
	const [refreshing, setRefreshing] = useState(false)
	const [loading, setLoading] = useState(true)

	// Fetch replies when the screen is focused
	useFocusEffect(
		useCallback(() => {
			let isActive = true

			const loadData = async () => {
				try {
					setLoading(true)
					const [postData, repliesData] = await Promise.all([
						getPostById(postId),
						getRepliesForPost(postId),
					])
					if (isActive) {
						setPost(postData)
						setReplies(repliesData)
					}
				} catch (error) {
					console.log(error)
				} finally {
					if (isActive) setLoading(false)
				}
			}

			loadData()

			return () => {
				isActive = false
			}
		}, [postId, posts])
	)

	const onRefresh = async () => {
		setRefreshing(true)
		try {
			const [postData, repliesData] = await Promise.all([
				getPostById(postId),
				getRepliesForPost(postId),
			])
			setPost(postData)
			setReplies(repliesData)
		} catch (error) {
			console.log(error)
		} finally {
			setRefreshing(false)
		}
	}

	// Show loading spinner if data is not yet fetched
	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-[#E7EDEF]">
				<View className="flex-1 justify-center items-center">
					<LoadingSpinner />
				</View>
			</SafeAreaView>
		)
	}

	if (!post) {
		return (
			<SafeAreaView className="flex-1 bg-[#E7EDEF]">
				<View className="flex-1 justify-center items-center">
					<Text>Post not found</Text>
				</View>
			</SafeAreaView>
		)
	}

	const admin = userId === post.userId._id

	// Destructure post data
	const {
		userId: postAuthor,
		communityId,
		createdAt,
		imageUrl,
		content,
		likes,
		replies: postReplies,
	} = post

	// Derive liked and likeCount from the post.likes array
	const liked = likes.includes(userId) 
	const likeCount = likes.length

	// Toggle menu visibility
	const toggleMenu = () => {
		setShowMenu(!showMenu)
	}

	// Handle post deletion
	const onDelete = async () => {
		try {
			await deletePost(postId)
			toggleMenu()
			fetchData("posts")
			router.back()
		} catch (error) {
			console.log(error)
		}
	}

	// Handle reply navigation
	const handleReply = () => {
		selectPost(post)
		router.push(`/community/post/reply/${postId}`)
	}

	return (
		<SafeAreaView className="flex-1 mt-4 bg-[#F2F2F2]">
			<Pressable
				onPress={() => {
					router.back()
				}}
			>
				<Feather
					name="chevron-left"
					size={32}
					color="black"
					className="ml-2 mb-4"
				/>
			</Pressable>
			<ScrollView
				className="px-4"
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View className="flex flex-row items-center">
					<Image
						source={{ uri: postAuthor.profileImage }}
						style={styles.profileImage}
						contentFit="cover"
						placeholder={{ blurhash }}
					/>
					<View className="ml-4 flex ">
						<Text className="font-pmedium text-lg">{postAuthor.fullName}</Text>
						<Pressable
							onPress={() => router.push(`/community/${communityId._id}`)}
						>
							<Text className="text-gray-500 font-pmedium text-base">
								@
								{(communityId?.name || community?.name)
									?.replace(/\s+/g, "")
									?.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())}
							</Text>
						</Pressable>
					</View>
				</View>
				<Text className="mt-4 text-lg font-pregular">{content}</Text>
				{imageUrl && (
					<View className="flex mt-4 items-center w-full overflow-hidden rounded-2xl">
						<Image
							source={{ uri: imageUrl }}
							style={[styles.postImage]}
							contentFit="cover"
							transition={300}
						/>
					</View>
				)}
				<View className="flex flex-row mt-4 gap-2 border-b border-gray-400 pb-4">
					<Text className="font-plight text-base">{formatTime(createdAt)}</Text>
					<Text>•</Text>
					<Text className="font-plight text-base">{formatDate(createdAt)}</Text>
				</View>

				<PostActionSection
					liked={liked}
					likeCount={likeCount}
					onLike={() => handleLikeUnlike(postId)}
					onReply={handleReply}
					onToggleMenu={toggleMenu}
					onDelete={onDelete}
					showMenu={showMenu}
					replyCount={postReplies.length}
					admin={admin}
				/>
				<Text className="border-t border-gray-400 mt-4"></Text>

				<View className="mb-4">
					{replies.length === 0 ? (
						<Text className="text-center font-pmedium pt-8">
							This post has no replies yet
						</Text>
					) : (
						replies.map((reply) => (
							<ReplyCard
								key={reply._id}
								reply={reply}
								admin={userId === reply.userId._id}
							/>
						))
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
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
