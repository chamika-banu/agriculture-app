import { View, Text, TextInput, TouchableOpacity } from "react-native"
import React, { useState } from "react"
import axiosInstance from "../../api/axiosInstance"

import AuthContainer from "../../components/AuthContainer"
import { registerUser } from "../../api/authApi"
import { Link, useRouter } from "expo-router"

const SignUp = () => {
	const router = useRouter()
	const [credentials, setCredentials] = useState({
		fullName: "",
		email: "",
		password: "",
	})

	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)	

	const handleSubmit = async () => {
		setError("")		

		if (
			!credentials.email.trim() ||
			!credentials.password.trim() ||
			!credentials.fullName.trim()
		) {
			setError("All fields are required")			
			return
		}

		if (!/\S+@\S+\.\S+/.test(credentials.email)) {
			setError("Invalid email format")			
			return
		}

		if (credentials.password.length < 6) {
			setError("Password must contain at least 6 characters")			
			return
		}

		try {
			const response = await registerUser(credentials)

			router.replace("/sign-in")
		} catch (error) {
			console.log(error.response)
			setError(error.response?.data?.error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<AuthContainer>
			<Text className="font-psemibold text-lg mx-auto m-6">
				Let's Get Started
			</Text>

			<View className="flex px-12 gap-2">
				<View>
					<TextInput
						className="mt-2 p-4 outline-none border rounded-3xl border-gray-400 font-pregular placeholder:text-gray-600"
						placeholder="Name"
						maxLength={50}
						value={credentials.fullName}
						onChangeText={(text) => {
							setCredentials((prev) => ({ ...prev, fullName: text }))
							if (error) setError("")
						}}
					/>
				</View>
				<View>
					<TextInput
						className="mt-2 p-4 outline-none border rounded-3xl border-gray-400 font-pregular placeholder:text-gray-600"
						placeholder="Email"
						maxLength={154}
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
					onPress={handleSubmit}
					className="p-4 mt-4 bg-[#52d66d] rounded-3xl "
				>
					<Text className="text-center font-psemibold text-white ">
						Register
					</Text>
				</TouchableOpacity>
				<Text className="font-pmedium mt-2 ml-1">
					Already have an account?{" "}
					<Link href="/sign-in" className="underline text-green-600">
						Login here!
					</Link>
				</Text>
			</View>
		</AuthContainer>
	)
}

export default SignUp
