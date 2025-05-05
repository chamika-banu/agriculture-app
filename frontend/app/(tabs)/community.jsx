import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Pressable,
	RefreshControl,
	StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import React, { useState, useEffect, useContext, useRef } from "react"
import Post from "../../components/Post"
import ErrorMessage from "../../components/ErrorMessage"
import CreatePost from "../../components/CreatePost"
import { useCommunity } from "../../context/communityContext"
import LoadingSpinner from "../../components/LoadingSpinner"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Image } from "expo-image"
import { useAuth } from "../../context/authContext"
import axiosInstance from "../../api/axiosInstance"

const Community = () => {
	const blurhash = "LCKMX[}@I:OE00Eg$%Na0eNHWp-B"
	const router = useRouter()
	const {
		posts,
		loading,
		postsError: error,
		selectPost,
		refreshData,
	} = useCommunity()
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { user } = useAuth()
	const userId = user?.userId
	const [isButtonVisible, setIsButtonVisible] = useState(true)
	const hideTimeout = useRef(null)
	const [profileImage, setProfileImage] = useState()

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axiosInstance.get("/users/profile")
				setProfileImage(response.data.profileImage)
			} catch (error) {
				console.log(error)
			}
		}

		fetchUser()
	}, [])

	// Function to show the button
	const showButton = () => {
		// Clear any existing timeout
		if (hideTimeout.current) {
			clearTimeout(hideTimeout.current)
		}

		// Show the button
		setIsButtonVisible(true)

		// Set timeout to hide button after 3 seconds of inactivity
		hideTimeout.current = setTimeout(() => {
			setIsButtonVisible(false)
		}, 2000)
	}

	// Show button on component mount
	useEffect(() => {
		showButton()

		// Clean up timeout on unmount
		return () => {
			if (hideTimeout.current) {
				clearTimeout(hideTimeout.current)
			}
		}
	}, [])

	const handleNavigation = (postId, post) => {
		selectPost(post)
		router.push(`/community/post/${postId}`)
	}

	const handleNavigateToProfile = () => {
		router.push({
			pathname: `/communityUser/${userId}`,
		})
	}

	return (
		<SafeAreaView
			className="flex-1 bg-[#F2F2F2] mt-4"
			edges={["top", "left", "right"]}
			onTouchStart={showButton}
		>
			<ScrollView
				className="px-4"
				refreshControl={
					<RefreshControl refreshing={loading} onRefresh={refreshData} />
				}
				onScrollBeginDrag={showButton}
				onTouchStart={showButton}
			>
				<View className="flex flex-row justify-between my-2 items-center">
					<Pressable onPress={handleNavigateToProfile}>
						<Image
							source={{ uri: profileImage }}
							style={styles.profileImage}
							placeholder={{ blurhash }}
							transition={300}
						/>
					</Pressable>
					<TouchableOpacity
						onPress={() => router.push("communities")}
						activeOpacity={0.8}
					>
						<View>
							<Text className="text-[#2bbc49] text-lg font-pmedium  bg-[#2bbc49]/10 px-3 py-1 rounded-md border border-[#2bbc49]">
								Communities
							</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View className="flex flex-row justify-between">
					<Text className="text-xl font-pmedium my-2">Your feed</Text>
				</View>
				<CreatePost
					visible={isModalVisible}
					onClose={() => setIsModalVisible(false)}
				/>
				{loading ? (
					<LoadingSpinner styles={"mt-44"} />
				) : error ? (
					<ErrorMessage error={error} styles="mt-44" />
				) : posts.length > 0 ? ( // If no error, check for posts
					<View>
						{posts.map((post, index) => (
							<Pressable
								key={index}
								onPress={() => handleNavigation(post._id, post)}
							>
								<Post post={post} />
							</Pressable>
						))}
					</View>
				) : (
					<View className="flex-1 justify-center items-center mt-52">
						<Text className="text-gray-500 text-base font-pmedium text-center">
							No posts to show. Explore and find communities to join!
						</Text>
					</View>
				)}
			</ScrollView>

			{isButtonVisible && (
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						setIsModalVisible(true)
						showButton()
					}}
					className="absolute right-4 bottom-5 z-10 bg-green-200/70 text-green-500 border border-green-500 w-20 h-20 pb-.5 flex justify-center items-center rounded-full"
				>
					<Ionicons name="duplicate-outline" size={28} color="#22c55e" />
				</TouchableOpacity>
			)}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	profileImage: {
		width: 60,
		height: 60,
		borderRadius: 50,
	},
})

export default Community
