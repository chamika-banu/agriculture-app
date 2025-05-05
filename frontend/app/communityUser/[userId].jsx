import {
	View,
	Text,
	FlatList,
	ScrollView,
	TouchableOpacity,
	Pressable,
	StyleSheet,
} from "react-native"
import { useLocalSearchParams } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { Image } from "expo-image"
import React, { useState, useEffect } from "react"
import Feather from "@expo/vector-icons/Feather"
import { useCommunity } from "../../context/communityContext"
import CompactCommunityCard from "../../components/CompactCommunityCard"
import Post from "../../components/Post"
import axiosInstance from "../../api/axiosInstance"
import { useRouter } from "expo-router"

const CommunityUserProfile = () => {
	const blurhash = "LCKMX[}@I:OE00Eg$%Na0eNHWp-B"
	const { userId } = useLocalSearchParams()
	const [user, setUser] = useState()
	const { userCommunities, posts, selectPost } = useCommunity()
	const [userPosts, setUserPosts] = useState([])
	const router = useRouter()

	// Fetch user data and filter posts related to this user
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axiosInstance.get("/users/profile") // Fetch user profile info
				setUser(response.data)
			} catch (error) {
				console.log(error)
			}
		}

		fetchUser()

		// Filter posts that belong to the current user
		if (userCommunities.length > 0 && posts.length > 0) {
			const filteredPosts = posts.filter((post) => {
				return post.userId._id === userId
			})
			setUserPosts(filteredPosts)
		} else {
			setUserPosts([])
		}
	}, [posts])

	const handleNavigation = (postId, post) => {
		selectPost(post)
		router.push(`/community/post/${postId}`)
	}

	const renderHeader = () => (
		<View className="relative">
			<Pressable
				onPress={() => {
					router.push("/community")
				}}
			>
				<Feather
					name="chevron-left"
					size={32}
					color="black"
					className="ml-2 mb-4"
				/>
			</Pressable>
			<View className="bg-white p-4 rounded-2xl mx-4 shadow-sm">
				<View className="flex-row items-center">
					<Image
						source={{ uri: user?.profileImage }}
						style={styles.profileImage}
						placeholder={{ blurhash }}
						contentFit="cover"
						transition={300}
					/>

					<View className="flex-1 ml-4">
						<Text className="text-2xl font-pbold  mb-1 text-center">
							{user?.fullName}
						</Text>

						<View className="flex-row bg-green-100 px-3 py-2 rounded-lg gap-4 justify-center">
							<View className="items-center">
								<Text className="text-lg font-psemibold text-green-500">
									{userCommunities.length}
								</Text>
								<Text className="text-sm font-pmedium text-gray-600">
									Communities
								</Text>
							</View>
							<View className="items-center">
								<Text className="text-lg font-psemibold text-green-500">
									{userPosts.length}
								</Text>
								<Text className="text-sm font-pmedium text-gray-600">
									Posts
								</Text>
							</View>
						</View>
					</View>
				</View>
			</View>

			{/* Communities Section */}
			<View className="mt-8">
				<View className=" flex-row items-center ml-4 mb-2">
					<Feather name="users" size={20} />
					<Text className="ml-4 text-xl font-pmedium">Communities</Text>
				</View>
				{userCommunities.length === 0 ? (
					<View className="flex items-center my-8 gap-4">
						<Text className="text-gray-500 text-base font-pmedium ">
							You have not joined any community yet.
						</Text>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => router.push("communities")}
							className="center"
						>
							<View>
								<Text className="text-blue-500 text-lg font-pmedium  bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500">
									Explore Communities
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				) : (
					// Display list of communities the user has joined
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						className="pl-2 py-2"
					>
						{userCommunities.map((community, index) => (
							<CompactCommunityCard
								key={community._id}
								community={community}
								classname={index === userCommunities.length - 1 ? "mr-6" : ""}
							/>
						))}
					</ScrollView>
				)}
			</View>

			{/* Posts Section */}
			<View className="mt-8">
				<View className="flex-row items-center ml-4 mb-2">
					<Feather name="file-text" size={20} />
					<Text className="ml-4 text-xl font-pmedium">Posts</Text>
				</View>
			</View>
		</View>
	)

	return (
		<SafeAreaView className="flex-1 bg-[#F2F2F2] mt-4">
			<FlatList
				data={userPosts}
				keyExtractor={(post) => post._id}
				renderItem={({ item }) => (
					<View className="px-4">
						<Pressable onPress={() => handleNavigation(item._id, item)}>
							<Post post={item} />
						</Pressable>
					</View>
				)}
				ListHeaderComponent={renderHeader}
				contentContainerStyle={{ paddingBottom: 16 }}
				// Show a message if there are no posts
				ListEmptyComponent={() => (
					<View className="flex items-center justify-center mt-8">
						<Text className="text-gray-500 text-base font-pmedium">
							You have not posted anything yet.
						</Text>
					</View>
				)}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	profileImage: {
		width: 80,
		height: 80,
		borderRadius: 50,
	},
})

export default CommunityUserProfile
