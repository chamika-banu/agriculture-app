import React, { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const router = useRouter()
	const [isLogged, setIsLogged] = useState(false)
	const [user, setUser] = useState({
		fullName: "",
		userId: "",
	})	

	const logout = async () => {
		await AsyncStorage.clear()
		setUser({ fullName: "", userId: "" })
		setIsLogged(false)
		router.replace("/sign-in")
	}

	useEffect(() => {
		const loadUser = async () => {
			try {
				const [token, userId, fullName] = await Promise.all([
					AsyncStorage.getItem("token"),
					AsyncStorage.getItem("userId"),
					AsyncStorage.getItem("fullName"),										
				])

				if (!token) { 
					await logout()
					return
				}

				setUser({
					fullName: fullName || "",
					userId: userId || "",
				})				
				
				setIsLogged(true)
				
			} catch (error) {
				console.error("AsyncStorage read failed:", error)
			}
		}

		loadUser()
	}, [])

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				isLogged,
				setIsLogged,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
