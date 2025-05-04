import { View, Text } from "react-native"
import React from "react"

const ErrorMessage = ({ error, styles }) => {
	return (
		<View className={`flex-1 justify-center items-center ${styles}`}>
			<Text className="text-red-500 font-pregular text-base mx-8 text-center">{error}</Text>
		</View>
	)
}

export default ErrorMessage
