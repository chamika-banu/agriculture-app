import { View, Text, ImageBackground } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import React from "react"
import coverImage from "../assets/images/c.jpg"

const AuthContainer = ({ children }) => {
	return (
		<SafeAreaView className="h-screen justify-between">
			<ImageBackground
				source={coverImage}
				resizeMode="cover"
				style={{
					width: "auto",
					height: 300,
				}}
			>
				<View className="flex items-center gap-2 mt-24">
					<Text className="font-pextrabold text-4xl uppercase">
						PlantGuard SL
					</Text>
					<Text className="font-pmedium">Growing Smarter, Farming Better.</Text>
				</View>
			</ImageBackground>
			<View className="w-full h-3/4 bg-[#F2F2F2] border border-t-2 rounded-3xl border-green-500">
				{children}
			</View>
		</SafeAreaView>
	)
}

export default AuthContainer
