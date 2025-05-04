import mongoose from "mongoose"

const connectMongoDB = async () => {
	try {		
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		console.log(`MongoDB connected successfully: ${mongoose.connection.host}`)
	} catch (error) {
		console.log("MongoDB connection failed:", error.message)
		process.exit(1)
	}
}

export default connectMongoDB
