import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import React from "react"
import newsData from "../../assets/data/newsData.json"
import Feather from "@expo/vector-icons/Feather"

const News = () => {
	const handleLinkPress = async (url) => {
		try {
			await Linking.openURL(url)
		} catch (error) {
			console.error("Failed to open URL:", error)
		}
	}

	return (
		<SafeAreaView
			className="flex-1 bg-[#f9fafb]"
			edges={["top", "left", "right"]}
		>
			<ScrollView className="px-4 mt-4">
				<Text className="font-psemibold text-2xl text-[#22c55e] mb-4">
					Latest News and Updates
				</Text>
				{newsData.map((item, index) => (
					<View
						key={index}
						className="mb-5 bg bg-white p-4 border border-gray-200 shadow-lg rounded-lg"
					>
						<Text className="text-lg font-psemibold">{item.title}</Text>
						<Text className="text-sm font-pmedium text-gray-600">
							{item.date}
						</Text>
						<Text className="text-base font-pregular text-justify text-gray-700 mt-3 mb-2">
							{item.summary}
						</Text>

						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => handleLinkPress(item.url)}
							className="px-3 py-1 mt-4 rounded-full border border-green-500/20 bg-green-500/10 flex-row justify-center items-center gap-2 w-36"
						>
							<Feather name="globe" size={14} color="#22c55e" />
							<Text className="text-green-500 font-pregular mt-[2px]">
								Read More
							</Text>
						</TouchableOpacity>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	)
}

export default News
