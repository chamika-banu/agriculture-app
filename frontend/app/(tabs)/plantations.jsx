import React, { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import SwitchSelector from "react-native-switch-selector"
import teaGuidance from "../../assets/data/teaPlantationGuidance.json"
import teaServices from "../../assets/data/teaPlantationServices.json"
import cinnamonGuidance from "../../assets/data/cinnamonPlantationGuidance.json"
import cinnamonServices from "../../assets/data/cinnamonPlantationServices.json"
import Feather from "@expo/vector-icons/Feather"

const plantationsData = {
	tea: {
		guidance: teaGuidance,
		services: teaServices,
	},
	cinnamon: {
		guidance: cinnamonGuidance,
		services: cinnamonServices,
	},
}

const Plantations = () => {
	const [plantationType, setPlantationType] = useState("tea")
	const [infoType, setInfoType] = useState("guidance")

	const handleLinkPress = async (url) => {
		try {
			await Linking.openURL(url)
		} catch (error) {
			console.error("Failed to open URL:", error)
		}
	}

	const renderGuidance = () => {
		const guidance = plantationsData[plantationType].guidance
		return guidance.sections.map((section, index) => (
			<View
				key={index}
				className="p-4 bg-white border border-gray-200 shadow-lg rounded-lg my-2"
			>
				<Text className="font-pbold text-lg">{section.title}</Text>
				{section.content.map((para, pIndex) => (
					<Text
						key={pIndex}
						className="font-pregular text-justify text-base text-gray-700 mt-2"
					>
						• {para}
					</Text>
				))}
			</View>
		))
	}

	const renderServices = () => {
		const services = plantationsData[plantationType].services
		return services.sections.map((section, index) => (			
			<View
				key={index}
				className="p-4 my-2 rounded-lg shadow-lg bg-white border border-gray-200"
			>
				{section.content && (
					<Text className="text-lg font-pbold">{section.content}</Text>
				)}
				{section.title && (
					<Text className="text-base font-pbold text-gray-700">{section.title}</Text>
				)}
				{section.details?.map((detail, dIndex) => (
					<View key={dIndex} className="mt-2">
						<Text className="text-base font-pmedium text-gray-700">
							{detail.location}
						</Text>

						<View className="flex-row gap-4">
							{detail.links?.map((link, lIndex) => {
								let iconName = "external-link"
								let linkText = ""

								if (link.url.startsWith("tel:")) {
									iconName = "phone"
									linkText = "Call"
								} else if (link.url.startsWith("mailto:")) {
									iconName = "mail"
									linkText = "Email"
								} else if (link.url.startsWith("http")) {
									iconName = "globe"
									linkText = "Visit"
								}

								return (
									<View key={lIndex} className="self-start">
										<TouchableOpacity
											onPress={() => handleLinkPress(link.url)}
											className="px-3 py-1 mt-4 rounded-full border border-green-500/20 bg-green-500/10 flex-row justify-center items-center gap-2"
										>
											<Feather name={iconName} size={14} color="#22c55e" />
											<Text className="text-green-500 font-pregular mt-[2px]">
												{linkText}
											</Text>
										</TouchableOpacity>
									</View>
								)
							})}
						</View>
					</View>
				))}
			</View>
		))
	}

	return (
		<SafeAreaView
			className="flex-1 bg-[#f9fafb]"
			edges={["top", "left", "right"]}
		>
			<ScrollView className="px-4">
				<Text className="font-psemibold text-2xl text-[#22c55e] mt-2">
					Plantation Care and Services
				</Text>

				<SwitchSelector
					initial={0}
					onPress={setPlantationType}
					textColor="#6b7280"
					selectedColor="#fff"
					buttonColor="#22c55e"
					borderColor="#22c55e"
					hasPadding
					borderRadius={8}
					valuePadding={2}
					style={{ marginTop: 20 }}
					options={[
						{ label: "Tea", value: "tea" },
						{ label: "Cinnamon", value: "cinnamon" },
					]}
					textStyle={{ fontFamily: "Poppins-Regular" }}
					selectedTextStyle={{ fontFamily: "Poppins-Regular" }}
					fontSize={14}
				/>

				<SwitchSelector
					initial={0}
					onPress={setInfoType}
					textColor="#6b7280"
					selectedColor="#fff"
					buttonColor="#22c55e"
					borderColor="#22c55e"
					hasPadding
					borderRadius={8}
					valuePadding={2}
					style={{ marginTop: 10, marginBottom: 20 }}
					options={[
						{ label: "Guidance", value: "guidance" },
						{ label: "Services", value: "services" },
					]}
					textStyle={{ fontFamily: "Poppins-Regular" }}
					selectedTextStyle={{ fontFamily: "Poppins-Regular" }}
					fontSize={14}
				/>

				{infoType === "guidance" && renderGuidance()}
				{infoType === "services" && renderServices()}
			</ScrollView>
		</SafeAreaView>
	)
}

export default Plantations
