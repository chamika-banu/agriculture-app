import { View } from "react-native"
import React from "react"
import { Slot } from "expo-router"


const AuthLayout = () => {
	return (
		<View className="flex-1">			
			<Slot />
		</View>
	)
}

export default AuthLayout
