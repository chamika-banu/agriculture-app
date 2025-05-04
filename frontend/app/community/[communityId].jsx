import { View, Text, ScrollView, Pressable, RefreshControl, TouchableOpacity } from "react-native"
import React, { useEffect, useState } from "react"
import { useLocalSearchParams } from "expo-router"
import CommunityDetails from "../../components/CommunityDetails"
import { getCommunityById } from "../../api/communityApi"
import Post from "../../components/Post"
import { useCommunity } from "../../context/communityContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import LoadingSpinner from "../../components/LoadingSpinner"
import MembersList from "../../components/MembersList"
import Feather from "@expo/vector-icons/Feather"

const Community = () => {
	const router = useRouter()
	const { communityId } = useLocalSearchParams()
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [community, setCommunity] = useState(null)	
	const { posts, handleJoinCommunity, handleLeaveCommunity, selectPost, loading, refreshData } =
		useCommunity()

	// Fetch the community details on mount and when communityId or posts change
	useEffect(() => {		
		fetchCommunityDetails()
	}, [posts])

	const fetchCommunityDetails = async () => {
		try {			
			const fetchedCommunity = await getCommunityById(communityId)			
			setCommunity(fetchedCommunity)
		} catch (error) {
			console.log(error)
		}
	}

	const handleNavigation = (postId, post) => {
		selectPost(post)
		router.push(`/community/post/${postId}`)
	}

	if (!community) { 
		return (
			<SafeAreaView className="flex-1 bg-[#F2F2F2]">
				<View className="flex-1 justify-center items-center">
					<LoadingSpinner />
				</View>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView className="flex-1 bg-[#F2F2F2]">
			<Pressable
				onPress={() => {
					router.push("/communities")
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
					<RefreshControl refreshing={loading} onRefresh={refreshData} />
				}
			>
				{community && (
					<View>
						{/* Display community details */}
						<CommunityDetails
							community={community}
							handleJoin={handleJoinCommunity}
							handleLeave={handleLeaveCommunity}
							setIsMembersModalVisible={setIsModalVisible}
						/>
						{community.posts.length > 0 ? (
							<View>
								{community.posts.map((post, index) => (
									<Pressable
										key={index}
										onPress={() => handleNavigation(post._id, post)}
									>
										<Post key={index} post={post} community={community} />
									</Pressable>
								))}
							</View>
						) : (
							// If there are no posts in the community, display a message
							<Text className="text-gray-500 text-base font-pmedium text-center mt-8 leading-relaxed">
								There are no posts in this community yet.{"\n"}Be the first to
								share!
							</Text>
						)}
					</View>
				)}
				<MembersList
					visible={isModalVisible}
					onClose={() => {
						setIsModalVisible(false)
						fetchCommunityDetails()
					}}
					community={community}
				/>
			</ScrollView>
		</SafeAreaView>
	)
}

export default Community
