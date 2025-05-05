import {
	View,
	Text,
	TextInput,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	Pressable,
	RefreshControl,
} from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import React, { useEffect, useState, useRef, useCallback } from "react"
import { useFocusEffect, useRouter } from "expo-router"
import CommunityCard from "../components/CommunityCard"
import CreateCommunity from "../components/CreateCommunity"
import { useCommunity } from "../context/communityContext"
import ErrorMessage from "../components/ErrorMessage"
import LoadingSpinner from "../components/LoadingSpinner"
import Feather from "@expo/vector-icons/Feather"

const Communities = () => {
	const [searchQuery, setSearchQuery] = useState("")
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [searching, setSearching] = useState(false)
	const [searchResults, setSearchResults] = useState([])
	const [isButtonVisible, setIsButtonVisible] = useState(true)
	const hideTimeout = useRef(null)

	const {
		userCommunities,
		setUserCommunities,
		nonUserCommunities,
		handleJoinCommunity,
		handleLeaveCommunity,
		communityError: error,
		loading,
		fetchData,
		refreshData,
	} = useCommunity()
	const router = useRouter()
	const allCommunities = userCommunities.concat(nonUserCommunities)

	useFocusEffect(
		useCallback(() => {			
			fetchData()
		}, [])
	)

	// Function to show the button and hide it after 3 seconds of inactivity
	const showButton = () => {
		// Clear any existing timeout
		if (hideTimeout.current) {
			clearTimeout(hideTimeout.current)
		}

		setIsButtonVisible(true)

		// Set timeout to hide button after 3 seconds of inactivity
		hideTimeout.current = setTimeout(() => {
			setIsButtonVisible(false)
		}, 3000)
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

	useEffect(() => {
		if (searching) {
			if (searchQuery.trim() === "") {
				setSearchResults(allCommunities) // Show all communities when search is empty
			} else {
				// Filter communities based on the search query
				const results = allCommunities.filter((community) =>
					community.name.toLowerCase().includes(searchQuery.toLowerCase())
				)
				setSearchResults(results)
			}
		}
	}, [searchQuery, searching])

	// Fetch data when search is active
	useEffect(() => {		
		if (searching) {			
			fetchData()
		}
	}, [searching])

	const handleNavigateToCommunity = (communityId) => {
		router.push(`/community/${communityId}`)
	}

	return (
		<SafeAreaView
			className="flex-1 bg-[#F2F2F2] mt-4"
			onTouchStart={showButton}
		>
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
			<View className="relative flex justify-center px-4">
				<Ionicons
					name="search-outline"
					size={20}
					color={"#d1d5db"}
					className="absolute left-6 bottom-7 z-10"
				/>

				<TextInput
					onFocus={() => {
						setSearching(true)
						showButton()
					}}
					className="h-12 pl-10 pr-4 border border-gray-300 text-base font-pregular rounded-3xl bg-white mb-4 focus:outline-none"
					placeholder="Search communities..."
					value={searchQuery}
					onChangeText={(value) => setSearchQuery(value)}
				/>
			</View>

			{searching ? (
				<ScrollView
					className=" mx-4 bg-white rounded-xl mb-4 "
					onScrollBeginDrag={showButton}
					onTouchStart={showButton}
				>
					<View className="flex flex-row items-center px-4 mt-4 mb-2">
						<Text className="text-xl font-psemibold flex-1">
							Search results
						</Text>
						<Pressable onPress={() => setSearching(false)}>
							<Ionicons name="close" size={24} color="black" />
						</Pressable>
					</View>

					<View className="flex gap-4 p-4">
						{searchResults.length === 0 && searchQuery.trim() !== "" ? (
							<View className="flex flex-row gap-4 items-center justify-center py-6">
								<Feather name="alert-circle" size={24} color="gray" />
								<Text className="text-gray-500 text-lg font-pmedium">
									We couldn't find what you're looking for.
								</Text>
							</View>
						) : (
							// Display each community in search results
							searchResults.map((community, index) => (
								<Pressable
									key={index}
									onPress={() => handleNavigateToCommunity(community._id)}
								>
									<View className="flex flex-row gap-4 items-center">
										<Image
											source={{ uri: community.imageUrl }}
											contentFit="cover"
											style={styles.communityImage}
										/>
										<View>
											<Text className="font-bold text-lg">
												{community.name}
											</Text>
											<Text className="text-base">{community.description}</Text>
										</View>
									</View>
								</Pressable>
							))
						)}
					</View>
				</ScrollView>
			) : (
				<ScrollView
					className="px-4"
					refreshControl={
						<RefreshControl refreshing={loading} onRefresh={refreshData} />
					}
					onScrollBeginDrag={showButton}
					onTouchStart={showButton}
				>
					<Text className="text-xl my-4 font-pmedium">Your communities</Text>
					<View>
						{loading ? (
							<LoadingSpinner styles={"my-16"} />
						) : error ? (
							<ErrorMessage
								error={
									"Something went wrong while fetching communities. Please try again later."
								}
								styles={"my-8"}
							/>
						) : userCommunities && userCommunities.length > 0 ? (
							userCommunities.map((community, index) => (
								<Pressable
									key={index}
									onPress={() => handleNavigateToCommunity(community._id)}
								>
									<CommunityCard
										community={community}
										isMember={true}
										handleJoin={handleJoinCommunity}
										handleLeave={handleLeaveCommunity}
									/>
								</Pressable>
							))
						) : (
							<View className="flex-1 justify-center items-center my-4">
								<Text className="text-gray-500 text-base font-pmedium text-center">
									Explore and find communities to join or create your own!
								</Text>
							</View>
						)}
					</View>

					<Text className="text-xl mt-8 my-4 font-pmedium">
						Discover new communities
					</Text>
					<View>
						{loading ? (
							<LoadingSpinner styles={"my-16"} />
						) : error ? (
							<ErrorMessage
								error={
									"Something went wrong while fetching communities. Please try again later."
								}
								styles={"my-8"}
							/>
						) : nonUserCommunities && nonUserCommunities.length > 0 ? (
							nonUserCommunities.map((community, index) => (
								<Pressable
									key={index}
									onPress={() => handleNavigateToCommunity(community._id)}
								>
									<CommunityCard
										community={community}
										isMember={false}
										handleJoin={handleJoinCommunity}
										handleLeave={handleLeaveCommunity}
									/>
								</Pressable>
							))
						) : (
							<View className="flex-1 justify-center items-center mt-4 mb-12">
								<Text className="text-gray-500 text-base font-pmedium text-center">
									There are currently no new communities available. Check back
									later.
								</Text>
							</View>
						)}
					</View>
				</ScrollView>
			)}

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

			<CreateCommunity
				visible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
				onCommunityCreated={(newCommunity) =>
					setUserCommunities((prevCommunities) => [
						...prevCommunities,
						newCommunity,
					])
				}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	communityImage: {
		width: 50,
		height: 50,
		borderRadius: 50,
	},
})

export default Communities