import axiosInstance from "./axiosInstance"

export const getProfile = async () => {
	const response = await axiosInstance.get("/users/profile")
	return response.data
}

export const updateProfile = async (data) => {
	const response = await axiosInstance.put("/users/profile", data)
	console.log(response)
	return response.data
}

export const deleteProfile = async (data) => {
	const response = await axiosInstance.delete("/users/profile", data)
	console.log(response)
	return response.data
}
