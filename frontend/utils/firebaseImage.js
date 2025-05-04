import {
	ref,
	uploadBytes,
	getDownloadURL,
	getStorage,
	deleteObject,
} from "firebase/storage"
import { storage } from "../firebaseConfig"

export const uploadImageToFirebase = async (uri, folder = "profile_pics") => {
	try {
		// Convert image to blob
		const response = await fetch(uri)
		const blob = await response.blob()

		// Generate a unique filename
		const fileName = `${Date.now()}-${uri.split("/").pop()}`

		// Create a reference for the storage path dynamically
		const storageRef = ref(storage, `${folder}/${fileName}`)

		// Upload the file
		await uploadBytes(storageRef, blob)

		// Get the download URL and add a timestamp to prevent caching
		const downloadURL = await getDownloadURL(storageRef)
		const downloadURLWithTimestamp = `${downloadURL}?timestamp=${new Date().getTime()}`

		return downloadURLWithTimestamp
	} catch (error) {
		console.error("Error uploading image: ", error)
		throw error
	}
}

// Function to delete a Image
export const deleteImageFromFirebase = async (imageUrl) => {
	try {
		// Extract the file path from the image URL
		const filePath = decodeURIComponent(imageUrl.split("/o/")[1].split("?")[0])		

		// Reference to the file to delete
		const storage = getStorage()
		const imageRef = ref(storage, filePath)

		// Delete the file
		await deleteObject(imageRef)		
	} catch (error) {
		console.error("Error deleting image: ", error)
	}
}
