import { View, Text, Pressable } from "react-native"
import React from "react"
import Feather from "@expo/vector-icons/Feather"
import { useRouter } from "expo-router"

const Header = ({ backLink, title }) => {
	const router = useRouter()

	const handleBackPress = () => {
		if (backLink) {						
			router.push(backLink) 			
		} else {
			router.back() 
		}
	}

	return (
		<View className="px-4 pt-4 pb-6 flex flex-row items-center bg-[#E7EDEF]">
			<Pressable								
				onPress={handleBackPress}
				className="mr-2"
			>				
				<Feather
					name="chevron-left"
					size={28}
					color="black"
				/>
			</Pressable>
			<Text className="text-2xl font-bold">{title}</Text>
		</View>
	)
}

export default Header
