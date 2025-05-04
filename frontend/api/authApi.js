import axiosInstance from "./axiosInstance"

// User registration
export const registerUser = async (userData) => {
	const response = await axiosInstance.post("/users/register", userData)
	console.log(response)
	return response.data
}

// User login
export const loginUser = async (credentials) => {
	const response = await axiosInstance.post("/users/login", credentials)
	console.log(response)
	return response.data
}
