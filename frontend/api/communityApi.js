import axiosInstance from "./axiosInstance"

export const getPostsFromAllUsersCommunities = async (userId) => {
	const response = await axiosInstance.get(`/community-posts/${userId}`)
	return response.data
}

export const getAllCommunities = async (userId) => {
	const response = await axiosInstance.get(`/communities/${userId}`)
	// console.log(response)
	return response.data
}

export const getCommunityById = async (communityId) => {
	const response = await axiosInstance.get(
		`/communities/community/${communityId}`
	)
	// console.log(response)
	return response.data
}

export const getCommunityMembers = async (communityId) => {
	const response = await axiosInstance.get(
		`/communities/members/${communityId}`
	)
	// console.log(response)
	return response.data
}

export const removeMemberFromCommunity = async (communityId, memberId) => {
	const response = await axiosInstance.delete(
		`/communities/community/${communityId}/members/${memberId}`
	)
	// console.log(response)
	return response.data
}

export const deleteCommunityById = async (communityId) => {
	const response = await axiosInstance.delete(
		`/communities/delete/${communityId}`
	)
	// console.log(response)
	return response.data
}

export const createCommunity = async (data) => {
	const response = await axiosInstance.post(`/communities/create`, data)
	// console.log(response)
	return response.data
}

export const updateCommunity = async (communityId, data) => {
	const response = await axiosInstance.put(
		`/communities/update/${communityId}`,
		data
	)
	// console.log(response)
	return response.data
}

export const createPost = async (data) => {
	const response = await axiosInstance.post(`/community-posts/create`, data)
	// console.log(response)
	return response.data
}

export const deletePost = async (postId) => {
	const response = await axiosInstance.delete(`/community-posts/delete/${postId}`)
	// console.log(response)
	return response.data
}

export const getPostById = async (postId) => {
	const response = await axiosInstance.get(`/community-posts/post/${postId}`)
	// console.log(response)
	return response.data
}

export const joinCommunity = async (communityId) => {
	const response = await axiosInstance.post(`/communities/join/${communityId}`)
	// console.log(response)
	return response.data
}

export const leaveCommunity = async (communityId) => {
	const response = await axiosInstance.post(`/communities/leave/${communityId}`)
	// console.log(response)
	return response.data
}

export const likeUnlikePost = async (postId) => {
	const response = await axiosInstance.post(
		`/community-posts/like-unlike/${postId}`
	)
	// console.log(response)
	return response.data
}

export const createReply = async (data) => {
	const response = await axiosInstance.post(`/community-replies/create/`, data)
	// console.log(response)
	return response.data
}
export const getRepliesForPost = async (postId) => {
	const response = await axiosInstance.get(`/community-replies/post/${postId}`)
	// console.log(response)
	return response.data
}

export const getReplyById = async (replyId) => {
	const response = await axiosInstance.get(`/community-replies/reply/${replyId}`)
	// console.log(response)
	return response.data
}

export const deleteReply = async (replyId) => {
	const response = await axiosInstance.delete(
		`/community-replies/delete/${replyId}`
	)
	// console.log(response)
	return response.data
}

export const likeUnlikeReply = async (replyId) => {
	const response = await axiosInstance.post(
		`/community-replies/like-unlike/${replyId}`
	)
	// console.log(response)
	return response.data
}
