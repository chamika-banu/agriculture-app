import React, { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import SwitchSelector from "react-native-switch-selector"
import teaGuidance from "../../assets/data/teaPlantationGuidance.json"
import teaServices from "../../assets/data/teaPlantationServices.json"
import cinnamonGuidance from "../../assets/data/cinnamonPlantationGuidance.json"
import cinnamonServices from "../../assets/data/cinnamonPlantationServices.json"

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
		} catch (err) {
			console.error("Failed to open URL:", err)
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
						className="font-pregular text-justify text-base mt-2"
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
			<View key={index} className="p-4 my-2 rounded-lg shadow-lg bg-white border border-gray-200">
				
				{section.content && (
					<Text className="text-lg font-pbold">{section.content}</Text>
				)}
				{section.details?.map((detail, dIndex) => (
					<View key={dIndex} className="mt-2">
						<Text className="text-base font-pmedium">{detail.location}</Text>
						{detail.links?.map((link, lIndex) => (
							<View key={lIndex} className="self-start">
								<TouchableOpacity
									key={lIndex}
									onPress={() => handleLinkPress(link.url)}
								>
									<Text className="text-blue-500 font-pregular underline mt-2">
									    {link.title}
									</Text>
								</TouchableOpacity>
							</View>
						))}
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
					Plantation Info
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
