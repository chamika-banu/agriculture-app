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
		<SafeAreaView className="flex-1 bg-[#F2F2F2]">
			<ScrollView className="px-4 mt-2">
				<Text className="font-psemibold text-lg">
					Welcome, {user.fullName} 👋
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
					fontSize={16}
				/>

				<View className="mt-4">
					<TouchableOpacity
						onPress={pickImage}
						className="bg-black p-3 rounded-xl mb-4"
					>
						<Text className="text-white text-center font-pmedium">
							Pick Image from Gallery
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={captureImage}
						className="bg-black p-3 rounded-xl"
					>
						<Text className="text-white text-center font-pmedium">
							Capture Image from Camera
						</Text>
					</TouchableOpacity>
				</View>

				{image && (
					<>
						<View className="mt-12">
							<Image
								source={{ uri: image }}
								style={{ width: "100%", height: 300, borderRadius: 10 }}
								contentFit="cover"
							/>
						</View>

						<TouchableOpacity
							onPress={handleUpload}
							className="bg-black p-3 rounded-xl mt-4"
						>
							{loading ? (
								<LoadingSpinner />
							) : (
								<Text className="text-white text-center font-pmedium">
									Upload image for disease analysis
								</Text>
							)}
						</TouchableOpacity>
					</>
				)}

				{result ? (
					<>
						{result.predictions && result.predictions.length > 0 ? (
							result.predictions.map((prediction, index) => (
								<View
									key={index}
									className="bg-white p-4 mt-4 rounded-xl shadow-md"
								>
									<Text className="font-bold text-lg mb-2">
										{index + 1}. {prediction.disease}
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
							<Text className="text-red-500 text-center font-psemibold mt-8">
								{result.error}
							</Text>
						) : (
							<Text className="text-base text-center mt-4">
								No disease predictions found.
							</Text>
						)}
					</>
				) : (
					<Text className="text-base font-medium mt-8 text-center">
						Upload an image for analysis.
					</Text>
				)}
			</ScrollView>
		</SafeAreaView>
	)
}

export default Home
