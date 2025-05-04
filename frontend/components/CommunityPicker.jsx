import React, { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { Image } from "expo-image"
import Feather from "@expo/vector-icons/Feather"

const CommunityPicker = ({ items, selectedValue, onValueChange }) => {
	const [dropdownVisible, setDropdownVisible] = useState(false)

	const toggleDropdown = () => {
		setDropdownVisible(!dropdownVisible)
	}

	// Function to handle selection of an item
	const handleSelect = (value) => {
		onValueChange(value)
		setDropdownVisible(false)
	}

	// Find the selected item from the list
	const selectedItem = items.find((item) => item.value === selectedValue)

	return (
		<View>
			{items.length > 0 && (
				<TouchableOpacity
					className="flex flex-row items-center justify-between border border-gray-200 rounded-lg p-2 bg-white"
					onPress={toggleDropdown}
				>
					
					{selectedItem ? (
						<View className="flex flex-row gap-4 items-center">
							<Image
								source={{ uri: selectedItem.imageUrl }}
								style={styles.communityImage}
							/>
							<Text className="font-pregular">{selectedItem.label}</Text>
						</View>
					) : (
						<Text>Select community</Text>
					)}
					{dropdownVisible ? (
						<Feather
							name="chevron-up"
							size={20}
							color="black"
						/>
					) : (
						<Feather
							name="chevron-down"
							size={20}
							color="black"
						/>
					)}
				</TouchableOpacity>
			)}

			
			{items.length === 0 && (
				<Text className="text-center font-pregular text-base text-red-500">
					Join a community to start creating posts.
				</Text>
			)}

			{dropdownVisible && (
				<View className="mt-2 rounded-md">
					<ScrollView
						className="py-2 border border-gray-200 rounded-lg bg-white"
						nestedScrollEnabled={true}
					>
						{items.map((item) => (
							<TouchableOpacity
								key={item.value}
								className="flex flex-row items-center gap-4 p-2"
								onPress={() => handleSelect(item.value)}
							>
								<Image
									source={{ uri: item.imageUrl }}
									style={styles.communityImage}
								/>
								<Text>{item.label}</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	communityImage: {
		width: 26,
		height: 26,
		borderRadius: 50,
	},
})

export default CommunityPicker