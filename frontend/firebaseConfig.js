// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
	apiKey: "AIzaSyAO2QTedPLqpe0-RaTbUpAHb53_h_cefMQ",
	authDomain: "maternify-4de04.firebaseapp.com",
	projectId: "maternify-4de04",
	storageBucket: "maternify-4de04.firebasestorage.app",
	messagingSenderId: "262430201856",
	appId: "1:262430201856:web:d3b5f8bfb838ebfce2e0e5",
	measurementId: "G-QM4399K2TD",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Get a reference to the storage service, which is now ready to use.
const storage = getStorage(app)

export { storage }
