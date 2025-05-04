import { View, Text } from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"

import { useAuth } from "../../context/authContext"

const Home = () => {
	const { user } = useAuth()
	return (
		<SafeAreaView className="flex-1 bg-[#F2F2F2]">
			<Text className="">Welcome, {user.fullName} 🐶</Text>
		</SafeAreaView>
	)
}

export default Home
