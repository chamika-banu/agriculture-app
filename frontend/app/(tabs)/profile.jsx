import {
	View,
	Text,
	StyleSheet,
	TextInput,
	FlatList,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	Pressable,
} from "react-native"
import { useEffect, useState } from "react"
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
import DropDownPicker from "react-native-dropdown-picker"
import {
	uploadImageToFirebase,
	deleteImageFromFirebase,
} from "../../utils/firebaseImage"

const profile = () => {
	const [open, setOpen] = useState(false)
	const [image, setImage] = useState(null)
	const { logout } = useAuth()
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
	const districtOptions = [
		{ label: "Ampara", value: "Ampara" },
		{ label: "Anuradhapura", value: "Anuradhapura" },
		{ label: "Badulla", value: "Badulla" },
		{ label: "Batticaloa", value: "Batticaloa" },
		{ label: "Colombo", value: "Colombo" },
		{ label: "Galle", value: "Galle" },
		{ label: "Gampaha", value: "Gampaha" },
		{ label: "Hambantota", value: "Hambantota" },
		{ label: "Jaffna", value: "Jaffna" },
		{ label: "Kalutara", value: "Kalutara" },
		{ label: "Kandy", value: "Kandy" },
		{ label: "Kegalle", value: "Kegalle" },
		{ label: "Kilinochchi District", value: "Kilinochchi District" },
		{ label: "Kurunegala", value: "Kurunegala" },
		{ label: "Mannar", value: "Mannar" },
		{ label: "Matale", value: "Matale" },
		{ label: "Matara", value: "Matara" },
		{ label: "Monaragala District", value: "Monaragala District" },
		{ label: "Mullaitivu District", value: "Mullaitivu District" },
		{ label: "Nuwara Eliya", value: "Nuwara Eliya" },
		{ label: "Polonnaruwa", value: "Polonnaruwa" },
		{ label: "Puttalam", value: "Puttalam" },
		{ label: "Ratnapura", value: "Ratnapura" },
		{ label: "Trincomalee", value: "Trincomalee" },
		{ label: "Vavuniya", value: "Vavuniya" },
		{ label: "Mullaitivu", value: "Mullaitivu" },
	]

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

		if (updatedData.password.trim() && updatedData.password.length < 6) {
			setError("Password must contain at least 6 characters")
			setIsLoading(false)
			return false
		}

		return true
	}

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
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

		if (
			updatedData.fullName !== userData.fullName &&
			updatedData.fullName.trim()
		) {
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

	// Create a simple data array for FlatList
	const profileData = [{ id: "profile" }]

	const renderProfileContent = ({ item }) => {
		return (
			<>
				{isEditing && (
					<Pressable
						onPress={() => {
							setIsEditing(false)
							setUpdatedData({
								fullName: "",
								email: "",
								profileImage: "",
								contactNo: "",
								location: "",
								password: "",
							})
						}}
					>
						<View className="flex flex-row gap-2 items-center">
							<Feather
								name="chevron-left"
								size={32}
								color="black"
								className="ml-6"
							/>
							<Text className="font-psemibold text-lg">Update Profile</Text>
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
							<Text className="font-psemibold text-2xl line-clamp-1 px-8">
								{userData.fullName}
							</Text>
						</View>

						<View className="flex gap-12 mt-12">
							<View className="px-12">
								<View className="flex flex-row justify-between items-center">
									<View className="flex flex-row gap-4 items-center">
										<Feather name="mail" size={24} color="#2bbc49" />
										<Text className="font-pmedium">Mail</Text>
									</View>
									<Text className="font-pmedium">{userData.email}</Text>
								</View>
							</View>
							<View className="px-12">
								<View className="flex flex-row justify-between items-center">
									<View className="flex flex-row gap-4 items-center">
										<Feather name="phone" size={24} color="#2bbc49" />
										<Text className="font-pmedium ">Phone</Text>
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
										<Text className="font-pmedium">District</Text>
									</View>
									<Text className="font-pmedium">
										{userData.location || "-"}
									</Text>
								</View>
							</View>
						</View>

						<TouchableOpacity onPress={handleEditing} activeOpacity={0.8}>
							<View className="flex flex-row justify-center items-center gap-4 mt-12 border-2 bg-black py-3 rounded-3xl mx-8">
								<Feather name="edit-2" size={24} color="white" />
								<Text className="font-pmedium text-white">Update Profile</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity onPress={handleDeletion} activeOpacity={0.8}>
							<View className="flex flex-row justify-center items-center gap-4 mt-8 border-2 border-red-600 py-3 rounded-3xl mx-8">
								<Feather name="trash" size={24} color="#dc2626" />
								<Text className="font-pmedium text-red-600">
									Delete Account
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
							<View className="flex flex-row justify-center items-center gap-4 mt-8 border-2 border-red-600 py-3 rounded-3xl mx-8">
								<Feather name="log-out" size={24} color="#dc2626" />
								<Text className="font-pmedium text-red-600">Logout</Text>
							</View>
						</TouchableOpacity>
					</>
				) : (
					<>
						<View className="flex justify-center items-center gap-4 mt-2">
							<TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
								<View>
									<Image
										source={image || userData.profileImage}
										style={[styles.profileImage]}
										contentFit="cover"
									/>
									<TouchableOpacity
										className="absolute -right-1 -bottom-1 bg-gray-100 border border-gray-200 p-1 rounded-full"
										onPress={pickImage}
										activeOpacity={0.8}
									>
										<Feather name="camera" size={20} color="grey" />
									</TouchableOpacity>
								</View>
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
								<Text className="font-pmedium">District:</Text>
								<DropDownPicker
									open={open}
									value={updatedData.location}
									items={districtOptions}
									setOpen={setOpen}
									setValue={(callback) => {
										const newValue = callback(updatedData.location)
										setUpdatedData((prev) => ({
											...prev,
											location: newValue,
										}))
										if (error) setError("")
									}}
									placeholder={
										userData.location ? userData.location : "Select district"
									}
									style={{
										borderColor: "#ccc",
										borderRadius: 10,
										paddingHorizontal: 10,
										backgroundColor: "F2F2F2",
									}}
									dropDownContainerStyle={{
										borderColor: "#d1d5db",
										borderRadius: 10,
									}}
									textStyle={{
										fontSize: 14,
										color: "black",
										fontFamily: "Poppins-Regular",
									}}
									placeholderStyle={{
										color: "#A0AEC0",
										fontSize: 14,
									}}
									ArrowDownIconComponent={() => (
										<Feather name="chevron-down" size={24} color="gray" />
									)}
									ArrowUpIconComponent={() => (
										<Feather name="chevron-up" size={24} color="gray" />
									)}
									autoScroll={true}
									listMode="SCROLLVIEW"
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

						<TouchableOpacity
							onPress={handleUpdate}
							disabled={isLoading}
							activeOpacity={0.8}
						>
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
			</>
		)
	}

	return (
		<SafeAreaView className="flex-1 bg-[#F2F2F2] mt-4">
			<FlatList
				data={profileData}
				renderItem={renderProfileContent}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 20 }}
				nestedScrollEnabled={true}
			/>
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
