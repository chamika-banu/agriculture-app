import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import React, { useState } from "react"
import { Image } from "expo-image"
import { SafeAreaView } from "react-native-safe-area-context"
import * as ImagePicker from "expo-image-picker"
import SwitchSelector from "react-native-switch-selector"
import LoadingSpinner from "../../components/LoadingSpinner"
import axiosInstance from "../../api/axiosInstance"

import { useAuth } from "../../context/authContext"

const Home = () => {
	const { user } = useAuth()
	const [plantType, setPlantType] = React.useState("tea")
	const [image, setImage] = useState(null)
	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState(null)

	// Pick image from gallery
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			quality: 1,
		})

		if (!result.canceled) {
			setImage(result.assets[0].uri)
		}
	}

	// Capture image from camera
	const captureImage = async () => {
		let result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			quality: 1,
		})

		if (!result.canceled) {
			setImage(result.assets[0].uri)
		}
	}

	const handleUpload = async () => {
		if (!image) return

		setLoading(true)

		try {
			const extension = image.split(".").pop().toLowerCase()

			const mimeType =
				{
					jpg: "image/jpeg",
					jpeg: "image/jpeg",
					png: "image/png",
					gif: "image/gif",
					webp: "image/webp",
				}[extension] || "image/jpeg"			

			// Create FormData
			const formData = new FormData()
			formData.append("image", {
				uri: image,
				type: mimeType,
				name: `upload_${Date.now()}.${extension}`,
			})			

			formData.append("plantType", plantType)

			const response = await axiosInstance.post("/analyze-plant/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})

			let rawAnalysis = response.data.data.analysis
				.replace(/```json|```/g, "")
				.trim()
			let parsed = JSON.parse(rawAnalysis)
			setResult(parsed)

			console.log(parsed)
		} catch (error) {
			console.error(error)
			setResult(null)
		} finally {
			setLoading(false)
		}
	}

	return (
		<SafeAreaView
			className="flex-1 bg-[#F2F2F2]"
			edges={["top", "left", "right"]}
		>
			<ScrollView className="px-4 mt-4">
				<Text className="font-psemibold text-lg">
					Hello, {user.fullName} 👋
				</Text>
				<Text className="font-psemibold text-2xl text-[#22c55e] mt-2">
					Plant Disease Analysis
				</Text>

				<SwitchSelector
					initial={0}
					onPress={(value) => setPlantType(value)}
					textColor="#6b7280"
					selectedColor="#fff"
					buttonColor="#22c55e"
					borderColor="#22c55e"
					hasPadding
					borderRadius={8}
					valuePadding={2}
					options={[
						{ label: "Tea", value: "tea" },
						{ label: "Cinnamon", value: "cinnamon" },
					]}
					style={{
						marginVertical: 20,
					}}
					textStyle={{ fontFamily: "Poppins-Regular" }}
					selectedTextStyle={{ fontFamily: "Poppins-Regular" }}
					fontSize={14}
				/>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={pickImage}
					className="bg-black p-3 rounded-xl mb-4 mt-4"
				>
					<Text className="text-white text-center font-pmedium">
						Pick Image from Gallery
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={captureImage}
					className="bg-black p-3 rounded-xl"
				>
					<Text className="text-white text-center font-pmedium">
						Capture Image from Camera
					</Text>
				</TouchableOpacity>

				{image && (
					<>
						<View className="mt-5">
							<Image
								source={{ uri: image }}
								style={{ width: "100%", height: 300, borderRadius: 10 }}
								contentFit="cover"
							/>
						</View>

						{!result ? (
							<TouchableOpacity
								onPress={handleUpload}
								activeOpacity={0.8}
								className="bg-black p-3 rounded-xl mt-4"
							>
								{loading ? (
									<LoadingSpinner />
								) : (
									<Text className="text-white text-center font-pmedium">
										Analyze Image
									</Text>
								)}
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									setResult(null)
								}}
								className="bg-red-500 p-3 rounded-xl mt-4"
							>
								<Text className="text-white text-center font-pmedium">
									Clear analysis
								</Text>
							</TouchableOpacity>
						)}
					</>
				)}

				{result ? (
					<>
						{result.predictions && result.predictions.length > 0 ? (
							result.predictions.map((prediction, index) => (
								<View
									key={index}
									className="bg-white p-4 my-4 rounded-xl shadow-md"
								>
									<Text className="font-bold text-xl mb-2">
										{prediction.disease}
									</Text>

									<Text className="font-psemibold mb-1">
										Accuracy: {prediction.accuracy}%
									</Text>

									<Text className="font-pregular text-base mb-2">
										{prediction.description}
									</Text>

									<Text className="font-psemibold mt-3 mb-1">Treatments:</Text>
									{prediction.treatment.map((t, tIndex) => (
										<View key={tIndex} className="mb-3 pl-4">
											<Text
												className={`font-psemibold ${
													t.type === "eco-friendly"
														? "text-green-500"
														: "text-blue-500"
												}`}
											>
												{t.type === "eco-friendly"
													? "🌱 Eco-Friendly"
													: "🧪 Chemical"}
											</Text>
											<Text className="font-pregular text-base">
												{t.method}
											</Text>
										</View>
									))}
								</View>
							))
						) : result.error ? (
							<Text className="text-gray-700 text-center font-psemibold mt-8">
								{result.error}
							</Text>
						) : result.unknown ? (
							<Text className="text-base text-center font-psemibold mt-8 text-gray-700">
								{result.unknown}
							</Text>
						) : null}
					</>
				) : image !== null ? null : (
					<>
						<Text className="text-base font-pmedium mt-8 text-center">
							Upload an image for analysis.
						</Text>
						<View className="mt-6 p-4 bg-white rounded-xl shadow-sm">
							<Text className="font-bold text-lg font-pmedium">
								Capturing Tips
							</Text>
							<View className="mt-2 flex gap-1">
								<Text className="font-pmedium text-gray-700">
									📸 Take photos in good lighting.
								</Text>
								<Text className="font-pmedium text-gray-700">
									🌿 Make sure the leaf is clearly visible.
								</Text>
								<Text className="font-pmedium text-gray-700">
									📷 Keep the camera steady and focused.
								</Text>
								<Text className="font-pmedium text-gray-700">
									🔍 Capture close-up shots of the affected area.
								</Text>
								<Text className="font-pmedium text-gray-700">
									🚫 Avoid blurry or shadowy images.
								</Text>
							</View>
						</View>
					</>
				)}
			</ScrollView>
		</SafeAreaView>
	)
}

export default Home
