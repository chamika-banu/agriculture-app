import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8070/api"

const axiosInstance = axios.create({
	baseURL: API_URL,
	headers: { "Content-Type": "application/json" },
})

axiosInstance.interceptors.request.use(
	async (config) => {
		const token = await AsyncStorage.getItem("token")
		// console.log("Request - Attaching Token:", token);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			console.log("401 Error Detected - Token might be invalid or expired")
            await AsyncStorage.clear()
            router.replace("/sign-in")
		}
		return Promise.reject(error)
	}
)

export default axiosInstance
