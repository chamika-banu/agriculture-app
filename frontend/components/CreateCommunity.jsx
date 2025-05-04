import { View, Text, Modal, TextInput, StyleSheet, Alert } from "react-native"
import React, { useState, useEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Image } from "expo-image"
import { createCommunity, updateCommunity } from "../api/communityApi"
import {
	uploadImageToFirebase,
	deleteImageFromFirebase,
} from "../utils/firebaseImage"
import { DEFAULT_COMMUNITY_IMAGE_URL } from "../utils/constants"

const CreateCommunity = ({
	editing,
	community,
	visible,
	onClose,
	onCommunityCreated,
}) => {
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState({
		name: "",
		description: "",
		server: "",
	})
	const [communityDetails, setCommunityDetails] = useState(
		editing
			? { name: community.name, description: community.description }
			: { name: "", description: "" }
	)

	const [image, setImage] = useState(
		editing && community?.imageUrl ? community.imageUrl : null
	)

	useEffect(() => {
		if (visible) {
			setCommunityDetails(
				editing
					? { name: community?.name, description: community?.description }
					: { name: "", description: "" }
			)
			setImage(editing ? community?.imageUrl : null)
		}
	}, [visible, editing, community]) // Only runs when modal visibility changes

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,			
			quality: 1,
		})

		if (!result.canceled) {
			const imageUri = result.assets[0].uri
			setImage(imageUri)
		}
	}

	const handleSubmit = async () => {
		// Reset errors
		setErrors({ name: "", description: "", server: "" })

		let hasErrors = false

		// Validate community name
		if (!communityDetails.name.trim()) {
			setErrors((prevErros) => ({
				...prevErros,
				name: "Community name is required",
			}))
			hasErrors = true
		}

		// Validate community description
		if (!communityDetails.description.trim()) {
			setErrors((prevErros) => ({
				...prevErros,
				description: "Community description is required",
			}))
			hasErrors = true
		}

		// Check if there are no changes when editing
		if (
			editing &&
			communityDetails.name === community.name &&
			communityDetails.description === community.description &&
			image === community.imageUrl
		) {
			setErrors((prevErros) => ({
				...prevErros,
				server: "No changes detected",
			}))
			hasErrors = true
			return
		}

		if (hasErrors) {
			return
		}

		setLoading(true)

		try {
			let imageUrl = DEFAULT_COMMUNITY_IMAGE_URL			

			// Check if a new image is selected and upload it
			if (image && (!editing || image !== community.imageUrl)) {
				if (
					editing &&
					community.imageUrl &&
					community.imageUrl !== DEFAULT_COMMUNITY_IMAGE_URL
				) {															
					await deleteImageFromFirebase(community.imageUrl) 
				}				
				imageUrl = await uploadImageToFirebase(image, "community")
			} else if (editing && !image) {
				// If editing and no new image is selected, keep the old image
				imageUrl = community.imageUrl
			}

			if (editing) {
				const response = await updateCommunity(community._id, {
					...communityDetails,
					imageUrl,
				})

				onCommunityCreated({
					...communityDetails,
					imageUrl,
				})
			} else {
				const response = await createCommunity({
					...communityDetails,
					imageUrl,
				})
				onCommunityCreated(response.community)
			}
			setLoading(false)
			handleClose()
		} catch (error) {
			setErrors({ ...errors, server: "Something went wrong! Try again later." })
			console.log(error)
			setLoading(false)
		}
	}

	const handleClose = () => {
		setCommunityDetails({ name: "", description: "" })
		setImage(null)
		setErrors({ name: "", description: "", server: "" })
		onClose()
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
				<SafeAreaView className="w-11/12 bg-white rounded-lg">
					<View className="flex-row items-center mb-4 p-4">
						<TouchableOpacity onPress={handleClose}>
							<Ionicons name="close" size={24} color="black" />
						</TouchableOpacity>
						<Text className="text-xl font-psemibold ml-4">
							{editing ? "Update Community" : "Create Community"}
						</Text>
					</View>
					<View className="p-3 m-2 rounded-lg flex gap-4">
						<View className="flex justify-center items-center">
							{image ? (
								<View>
									<Image
										source={{ uri: image }}
										style={[styles.postImage]}
										contentFit="cover"
										transition={1000}
									/>
									<TouchableOpacity
										className="absolute -right-2 -bottom-2 bg-gray-100 border border-gray-200 p-1 rounded-full"
										onPress={pickImage}
									>
										<Ionicons name="image" size={20} color="grey" />
									</TouchableOpacity>
								</View>
							) : (
								<TouchableOpacity
									onPress={pickImage}
									className="flex justify-center items-center rounded-lg border border-dashed border-gray-300 p-8 w-fit"
								>
									<Ionicons name="images" size={20} color="grey" />
								</TouchableOpacity>
							)}
						</View>
						<View>
							<Text className="font-plight">Community Name</Text>
							{errors.name && (
								<Text className="text-red-500 mt-1 font-pregular">*{errors.name}</Text>
							)}
							<TextInput
								className="mt-2 py-2 mb-1 outline-none font-pregular border-b border-gray-300 focus:border-b-2 focus:border-blue-500 transition-all duration-300"
								placeholder=""
								maxLength={40}
								value={communityDetails.name}
								onChangeText={(text) => {
									setCommunityDetails((prev) => ({ ...prev, name: text }))
									setErrors((prevErrors) => ({
										...prevErrors,
										name: "",
										server: "",
									}))
								}}
							/>
						</View>

						<View>
							<Text className="font-plight">Description</Text>
							{errors.description && (
								<Text className="text-red-500 mt-1 font-pregular">*{errors.description}</Text>
							)}
							<TextInput
								className="mt-2 py-2 mb-1 outline-none font-pregular border-b border-gray-300 focus:border-b-2 focus:border-blue-500 transition-all duration-300"
								placeholder=""
								maxLength={100}
								value={communityDetails.description}
								multiline={true}
								onChangeText={(text) => {
									setCommunityDetails((prev) => ({
										...prev,
										description: text,
									}))
									setErrors((prevErrors) => ({
										...prevErrors,
										description: "",
										server: "",
									}))
								}}
							/>
						</View>
						{errors.server && (
							<Text className="text-red-500 font-pregular">{errors.server}</Text>
						)}
						<TouchableOpacity
							className="bg-green-500 items-center py-3 rounded-md"
							onPress={handleSubmit}
							disabled={loading}
						>
							<Text className="font-psemibold text-white">
								{loading
									? editing
										? "Updating..."
										: "Creating..."
									: editing
									? "Update Community"
									: "Create Community"}
							</Text>
						</TouchableOpacity>
					</View>
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
		zIndex: 1,
	},

	postImage: {
		width: 100,
		height: undefined,
		aspectRatio: 1,
		borderRadius: 10,
	},
})

export default CreateCommunity
