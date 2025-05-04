import {
	View,
	Text,
	StyleSheet,
	TextInput,
	ScrollView,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	Pressable,
} from "react-native"
import React, { useEffect, useState } from "react"
import { getProfile } from "../../api/profileApi"
import { SafeAreaView } from "react-native-safe-area-context"
import { Image } from "expo-image"
import Feather from "@expo/vector-icons/Feather"
import avatar from "../../assets/images/avatar.png"
import { deleteProfile } from "../../api/profileApi"
import { router } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAuth } from "../../context/authContext"
import { updateProfile } from "../../api/profileApi"
import * as ImagePicker from "expo-image-picker"
import { DEFAULT_AVATAR_IMAGE_URL } from "../../utils/constants"
import {
	uploadImageToFirebase,
	deleteImageFromFirebase,
} from "../../utils/firebaseImage"

const profile = () => {
	const [image, setImage] = useState(null)
	const { setUser, logout } = useAuth()
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [userData, setUserData] = useState({
		fullName: "",
		email: "",
		profileImage: "",
		contactNo: "",
		location: "",
	})
	const [updatedData, setUpdatedData] = useState({
		fullName: "",
		email: "",
		profileImage: "",
		contactNo: "",
		location: "",
		password: "",
	})
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await getProfile()
				if (response) {
					setUserData({
						fullName: response.fullName,
						email: response.email,
						profileImage: response.profileImage,
						contactNo: response.contactNo,
						location: response.location,
					})
				}
			} catch (error) {
				console.error(error)
			}
		}

		fetchProfile()
	}, [])

	const handleEditing = () => {
		setIsEditing(true)
		setUpdatedData({
			fullName: userData.fullName,
			email: userData.email,
			profileImage: userData.profileImage,
			contactNo: userData.contactNo,
			location: userData.location,
			password: "",
		})
	}

	const handleDeletion = async () => {
		Alert.alert(
			"Confirm Deletion",
			"Are you sure you want to permanently delete your account?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							await deleteProfile()
							await AsyncStorage.clear()
							router.replace("/sign-in")
						} catch (error) {
							console.error("Error deleting profile:", error)
						}
					},
				},
			],
			{ cancelable: true }
		)
	}

	const handleLogout = async () => {
		await logout()
	}

	const validateInput = (changes) => {
		setError("")

		// Only validate fields that are being changed
		if ("email" in changes && !/\S+@\S+\.\S+/.test(updatedData.email)) {
			setError("Invalid email format")
			setIsLoading(false)
			return false
		}

		if ("contactNo" in changes && !/^\d{10}$/.test(updatedData.contactNo)) {
			setError("Contact number must be 10 digits")
			setIsLoading(false)
			return false
		}

		if ("location" in changes && !/^[a-zA-Z\s]+$/.test(updatedData.location)) {
			setError("Location must contain only letters")
			setIsLoading(false)
			return false
		}

		if (updatedData.password.trim() && updatedData.password.length < 6) {
			setError("Password must contain at least 6 characters")
			setIsLoading(false)
			return false
		}

		return true
	}

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

	const handleUpdate = async () => {
		setError("")
		setIsLoading(true)

		// Create an object with only changed fields
		const changes = {}

		if (updatedData.fullName !== userData.fullName && updatedData.fullName.trim()) {
			changes.fullName = updatedData.fullName
		}

		if (updatedData.email !== userData.email && updatedData.email.trim()) {
			changes.email = updatedData.email
		}

		if (
			updatedData.contactNo !== userData.contactNo &&
			updatedData.contactNo.trim()
		) {
			changes.contactNo = updatedData.contactNo
		}

		if (
			updatedData.location !== userData.location &&
			updatedData.location.trim()
		) {
			changes.location = updatedData.location
		}

		if (updatedData.password.trim()) {
			changes.password = updatedData.password
		}

		if (image && image !== userData.profileImage) {
			try {
				const imageUrl = await uploadImageToFirebase(image)
				changes.profileImage = imageUrl
			} catch (error) {
				setError("Error uploading image")
				setIsLoading(false)
				return
			}
		}

		// If the profile image is being changed and the old image is not the default avatar, delete the old image
		if (
			changes.profileImage &&
			userData.profileImage &&
			userData.profileImage !== DEFAULT_AVATAR_IMAGE_URL
		) {
			await deleteImageFromFirebase(userData.profileImage)
		}

		if (
			updatedData.profileImage &&
			updatedData.profileImage !== userData.profileImage
		) {
			changes.profileImage = updatedData.profileImage
		}

		// Check if any changes were made
		if (Object.keys(changes).length === 0) {
			setError("No changes detected")
			setIsLoading(false)
			return
		}

		if (!validateInput(changes)) {
			return
		}

		try {
			const response = await updateProfile(changes)

			setUserData((prev) => ({
				...prev,
				...response.user,
			}))
			setUpdatedData({
				fullName: "",
				email: "",
				profileImage: "",
				contactNo: "",
				location: "",
				password: "",
			})
			setIsEditing(false)
			setImage(null)
		} catch (error) {
			console.error("Error updating profile:", error)
			setError(error.response?.data?.error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-[#F2F2F2]">
			<ScrollView className="py-2">
				{isEditing && (
					<Pressable
						onPress={() => {
							setIsEditing(false)
						}}
					>
						<View className="flex flex-row gap-2 items-center">
							<Feather
								name="chevron-left"
								size={32}
								color="black"
								className="ml-6"
							/>
							<Text className="font-psemibold text-lg">Update profile</Text>
						</View>
					</Pressable>
				)}
				{!isEditing ? (
					<>
						<View className="flex justify-center items-center gap-6 mt-2">
							<Image
								source={
									userData.profileImage
										? { uri: userData.profileImage }
										: avatar
								}
								style={[styles.profileImage]}
								contentFit="cover"
							/>
							<Text className="font-psemibold text-2xl">
								{userData.fullName}
							</Text>
						</View>

						<View className="flex gap-12 mt-12">
							<View className="px-12">
								<View className="flex flex-row justify-between items-center">
									<View className="flex flex-row gap-4 items-center">
										<Feather name="mail" size={24} color="#2bbc49" />
										<Text className="font-pmedium text-sm">Mail</Text>
									</View>
									<Text className="font-pmedium">{userData.email}</Text>
								</View>
							</View>
							<View className="px-12">
								<View className="flex flex-row justify-between items-center">
									<View className="flex flex-row gap-4 items-center">
										<Feather name="phone" size={24} color="#2bbc49" />
										<Text className="font-pmedium text-sm">Phone</Text>
									</View>
									<Text className="font-pmedium">
										{userData.contactNo || "-"}
									</Text>
								</View>
							</View>
							<View className="px-12">
								<View className="flex flex-row justify-between items-center">
									<View className="flex flex-row gap-4 items-center">
										<Feather name="map-pin" size={24} color="#2bbc49" />
										<Text className="font-pmedium text-sm">Location</Text>
									</View>
									<Text className="font-pmedium">
										{userData.location || "-"}
									</Text>
								</View>
							</View>
						</View>

						<TouchableOpacity onPress={handleEditing}>
							<View className="flex flex-row justify-center items-center gap-4 mt-12 border-2 bg-black py-3 rounded-3xl mx-8">
								<Feather name="edit-2" size={24} color="white" />
								<Text className="font-pmedium text-white">Update Profile</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity onPress={handleDeletion}>
							<View className="flex flex-row justify-center items-center gap-4 mt-8 border-2 border-red-600 py-3 rounded-3xl mx-8">
								<Feather name="trash" size={24} color="#dc2626" />
								<Text className="font-pmedium text-red-600">
									Delete Account
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity onPress={handleLogout}>
							<View className="flex flex-row justify-center items-center gap-4 mt-8 border-2 border-red-600 py-3 rounded-3xl mx-8">
								<Feather name="log-out" size={24} color="#dc2626" />
								<Text className="font-pmedium text-red-600">Logout</Text>
							</View>
						</TouchableOpacity>
					</>
				) : (
					<>
						<View className="flex justify-center items-center gap-4 mt-2">
							<TouchableOpacity onPress={pickImage}>
								<Image
									source={image || userData.profileImage}
									style={[styles.profileImage]}
									contentFit="cover"
								/>
							</TouchableOpacity>
						</View>

						<View className="flex gap-8 mt-4">
							<View className="px-8">
								<Text className="font-pmedium">Name:</Text>
								<TextInput
									className="mt-2 p-3 outline-none border rounded-xl border-gray-300 font-pregular placeholder:text-gray-400"
									placeholder={userData.fullName}
									maxLength={50}
									value={updatedData.fullName}
									onChangeText={(text) => {
										setUpdatedData((prev) => ({ ...prev, fullName: text }))
										if (error) setError("")
									}}
								/>
							</View>

							<View className="px-8">
								<Text className="font-pmedium">Email:</Text>
								<TextInput
									className="mt-2 p-3 outline-none border rounded-xl border-gray-300 font-pregular placeholder:text-gray-400"
									placeholder={userData.email}
									maxLength={128}
									value={updatedData.email}
									onChangeText={(text) => {
										setUpdatedData((prev) => ({ ...prev, email: text }))
										if (error) setError("")
									}}
								/>
							</View>

							<View className="px-8">
								<Text className="font-pmedium">Contact No:</Text>
								<TextInput
									className="mt-2 p-3 outline-none border rounded-xl border-gray-300 font-pregular placeholder:text-gray-400"
									placeholder={userData.contactNo}
									maxLength={10}
									keyboardType="numeric"
									value={updatedData.contactNo}
									onChangeText={(text) => {
										setUpdatedData((prev) => ({ ...prev, contactNo: text }))
										if (error) setError("")
									}}
								/>
							</View>

							<View className="px-8">
								<Text className="font-pmedium">Location(city):</Text>
								<TextInput
									className="mt-2 p-3 outline-none border rounded-xl border-gray-300 font-pregular placeholder:text-gray-400"
									placeholder={userData.location}
									maxLength={50}
									value={updatedData.location}
									onChangeText={(text) => {
										setUpdatedData((prev) => ({ ...prev, location: text }))
										if (error) setError("")
									}}
								/>
							</View>

							<View className="px-8">
								<Text className="font-pmedium">Password:</Text>
								<TextInput
									className="mt-2 p-3 outline-none border rounded-xl border-gray-300 font-pregular placeholder:text-gray-400"
									placeholder=""
									maxLength={154}
									secureTextEntry={true}
									value={updatedData.password}
									onChangeText={(text) => {
										setUpdatedData((prev) => ({ ...prev, password: text }))
										if (error) setError("")
									}}
								/>
							</View>
						</View>

						{error && (
							<Text className="font-pmedium text-base text-red-500 px-8 mt-4">
								{error}
							</Text>
						)}

						<TouchableOpacity onPress={handleUpdate} disabled={isLoading}>
							<View className="flex flex-row justify-center items-center gap-4 mt-12 border-2 bg-black py-3 rounded-xl mx-8">
								{isLoading ? (
									<ActivityIndicator color="white" />
								) : (
									<>
										<Feather name="save" size={24} color="white" />
										<Text className="font-pmedium text-white">
											Save Changes
										</Text>
									</>
								)}
							</View>
						</TouchableOpacity>
					</>
				)}
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	profileImage: {
		width: 96,
		height: 96,
		borderRadius: 48,				
	},
})

export default profile
