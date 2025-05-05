import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import React, { useState } from "react"
import { Link, useRouter } from "expo-router"
import { loginUser } from "../../api/authApi"
import AuthContainer from "../../components/AuthContainer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAuth } from "../../context/authContext"

const SignIn = () => {
	const router = useRouter()
	const { setUser, setIsLogged } = useAuth()
	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
	})

	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		// Reset Errors
		setError("")
		let hasErrors = false
		
		if (!credentials.email.trim() || !credentials.password.trim()) {
			setError("All fields are required")
			hasErrors = true
		}

		if (!/\S+@\S+\.\S+/.test(credentials.email)) {
			setError("Invalid email format")
			hasErrors = true
			return
		}

		if (hasErrors) return

		setLoading(true)

		try {
			const response = await loginUser(credentials)

			AsyncStorage.setItem("token", response.token)
			AsyncStorage.setItem("userId", response.user._id)
			AsyncStorage.setItem("fullName", response.user.fullName)

			setUser({ fullName: response.user.fullName, userId: response.user._id })
			setIsLogged(true)

			router.replace("/home")
		} catch (error) {
			console.log(error.response)	
			setError(error.response?.data?.error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<AuthContainer>
			<Text className="font-psemibold text-lg mx-auto m-6"> Welcome Back </Text>
			<View className="flex px-12 gap-2">
				<View>
					<TextInput
						className="mt-2 p-4 outline-none border rounded-3xl border-gray-400 font-pregular placeholder:text-gray-600"
						placeholder="Email"
						maxLength={254}
						value={credentials.email}
						onChangeText={(text) => {
							setCredentials((prev) => ({ ...prev, email: text }))
							if (error) setError("")
						}}
					/>
				</View>
				<View>
					<TextInput
						className="mt-2 p-4 outline-none border rounded-3xl border-gray-400 font-pregular placeholder:text-gray-600"
						placeholder="Password"
						maxLength={128}
						value={credentials.password}
						secureTextEntry={true}
						onChangeText={(text) => {
							setCredentials((prev) => ({ ...prev, password: text }))
							if (error) setError("")
						}}
					/>
				</View>
				{error && (
					<Text className="mt-2 font-pmedium text-sm text-red-500 ml-1">
						{error}
					</Text>
				)}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={handleSubmit}
					className="p-4 mt-4 bg-[#52d66d] rounded-3xl "
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator color="white" />
					) : (
						<>
							<Text className="text-center font-psemibold text-white ">
								Login
							</Text>
						</>
					)}
				</TouchableOpacity>
				<Text className="font-pmedium mt-2 ml-1">
					Dont have an account?{" "}
					<Link href="/sign-up" className="underline text-green-600">
						Register here!
					</Link>
				</Text>
			</View>
		</AuthContainer>
	)
}

export default SignIn
