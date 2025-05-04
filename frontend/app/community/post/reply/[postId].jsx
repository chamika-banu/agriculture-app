import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import React, { useState, useEffect } from "react"
import { useCommunity } from "../../../../context/communityContext"
import Post from "../../../../components/Post"
import { createReply, getReplyById } from "../../../../api/communityApi"
import { useRouter, useLocalSearchParams } from "expo-router"

const reply = () => {
	const router = useRouter()
	const { selectedPost, fetchData } = useCommunity()
	const { parentReplyId } = useLocalSearchParams()
	const [loading, setLoading] = useState(false)

	// State for the user being replied to (either the post creator or a reply author)
	const [replyingUser, setReplyingUser] = useState(null)

	// Effect to set the replyingUser if it's a direct reply to the post (not a reply to another comment)
	useEffect(() => {
		if (!parentReplyId && selectedPost) {
			setReplyingUser(selectedPost.userId || null)
		}
	}, [selectedPost])

	const [replyData, setReplyData] = useState({
		content: "",
		postId: selectedPost?._id || null,
		communityId: selectedPost?.communityId?._id || null,
		parentReplyId: parentReplyId || null,
	})

	// Effect to fetch the original reply data when replying to another reply
	useEffect(() => {
		if (parentReplyId) {
			const fetchReply = async () => {
				try {
					const response = await getReplyById(parentReplyId)
					setReplyData((prev) => ({
						...prev,
						postId: response?.postId?._id || null,
						communityId: response?.communityId?._id || null,
					}))

					setReplyingUser(response?.userId || null)
				} catch (error) {
					console.error("Error fetching reply data:", error)
				}
			}

			fetchReply()
		}
	}, [parentReplyId])

	const handleSubmit = async () => {
		if (!replyData.content) {
			return
		}
		setLoading(true)

		try {
			console.log(replyData)
			const response = await createReply(replyData)
			setLoading(false)
			fetchData("posts")
			router.back()
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-[#E7EDEF]">
			<ScrollView className="px-4 pb-28">
				<Post
					post={selectedPost}
					replying={true}
				/>
				<Text className="text-base font-pmedium text-green-500 py-2">
					Replying to {replyingUser?.fullName}
				</Text>
				<View className="bg-white p-4 my-2 rounded-2xl">
					<View className="border border-gray-400 mt-2 transition duration-300 rounded-lg px-4 pt-4 mb-4 pb-2 bg-white">
						<TextInput
							className="mb-4 outline-none font-pregular"
							placeholder="What's on your mind?"
							scrollEnabled={true}
							value={replyData.content}
							maxLength={300}
							multiline
							onChangeText={(text) =>
								setReplyData((prev) => ({ ...prev, content: text }))
							}
						/>
						<Text className="text-gray-400 font-pmedium text-right">
							{replyData.content.length}/300
						</Text>
					</View>
					<TouchableOpacity
						onPress={handleSubmit}
						className="bg-green-500 p-2 rounded-lg items-center mt-4"
						disabled={loading}
					>
						<Text className="text-white text-lg font-psemibold">
							{loading ? "Replying..." : "Reply"}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default reply
