import React, { useState, useEffect } from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Modal,
	StyleSheet,
	ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import {
	getCommunityMembers,
	removeMemberFromCommunity,
} from "../api/communityApi"
import { Image } from "expo-image"
import { useCommunity } from "../context/communityContext"

const MembersList = ({ visible, onClose, community }) => {
	const blurhash = "LCKMX[}@I:OE00Eg$%Na0eNHWp-B"
	const { fetchData } = useCommunity()
	const [communityMembers, setCommunityMembers] = useState([])
	useEffect(() => {
		fetchCommunityMembers()
	}, [community])

	const fetchCommunityMembers = async () => {
		try {
			const { members } = await getCommunityMembers(community._id)
			setCommunityMembers(members)			
		} catch (error) {
			console.log(error)
		}
	}

	// Function to handle modal close and reset state
	const handleClose = () => {
		onClose()
	}

	const handleRemove = async (memberId) => {
		try {
			const response = await removeMemberFromCommunity(community._id, memberId)
			fetchCommunityMembers()
			fetchData()			
		} catch (error) {
			console.log(error)
		}
	}	

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={handleClose}
			statusBarTranslucent={true}
		>
			<View style={styles.modal}>
				<SafeAreaView className="w-11/12 h-5/6 bg-white rounded-lg">
					<ScrollView>
						<View className="flex-row justify-between items-center p-4">
							<Text className="font-psemibold text-lg">Members</Text>

							<TouchableOpacity onPress={handleClose}>
								<Ionicons name="close" size={24} color="black" />
							</TouchableOpacity>
						</View>
						<View className="flex flex-row items-center justify-between flex-1 p-2 border-b border border-gray-200 mx-4 mb-2 rounded-lg">
							<View className="flex flex-row items-center gap-3">
								<Image
									source={{ uri: community.admin.profileImage }}
									style={styles.profileImage}
								/>
								<Text className="text-base font-pregular">
									{community.admin.fullName}
								</Text>
							</View>
							<View className="flex-row items-center px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/10">
								<Text className="text-green-500 font-pmedium">Admin</Text>
							</View>
						</View>
						<View className="flex gap-2">
							{communityMembers.length > 0 &&
								communityMembers.map((member, index) => (
									<View
										key={index}
										className="flex flex-row items-center justify-between flex-1 p-2 border-b border border-gray-200 mx-4 mb-2 rounded-lg"
									>
										<View className="flex flex-row items-center gap-3">
											<Image
												source={{ uri: member.profileImage }}
												style={styles.profileImage}
												placeholder={{ blurhash }}
												contentFit="cover"
												transition={300}
											/>
											<Text className="text-base font-pregular">
												{member.fullName}
											</Text>
										</View>
										<TouchableOpacity
											className="flex-row items-center px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/10"
											onPress={() => handleRemove(member.id)}
										>
											<Text className="text-red-500 font-pmedium">Remove</Text>
										</TouchableOpacity>
									</View>
								))}
						</View>
					</ScrollView>
				</SafeAreaView>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},

	profileImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
})

export default MembersList
