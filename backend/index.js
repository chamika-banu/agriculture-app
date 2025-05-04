import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import session from "express-session"
import dotenv from "dotenv"
import connectMongoDB from "./config/db.js"

import userRoutes from './routes/userRoutes.js'
import communityRoutes from "./routes/community-routes/communityRoutes.js"
import postRoutes from "./routes/community-routes/postRoutes.js"
import replyRoutes from "./routes/community-routes/replyRoutes.js"

dotenv.config()
const app = express()
connectMongoDB()

// Middleware
app.use(
	cors({
		origin: ["http://localhost:8081", "http://192.168.43.214:8070"],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
	session({
		secret: process.env.SECRET_KEY,
		resave: false,
		saveUninitialized: true,
	})
)

app.use("/api/users", userRoutes)
app.use("/api/communities", communityRoutes)
app.use("/api/community-posts", postRoutes)
app.use("/api/community-replies", replyRoutes)

// Test connection
app.get("/", (res) => {
	res.send("Server is up running")
})

app.listen(process.env.PORT || 8070, () => {
	console.log(`Server is running on port ${process.env.PORT}.`)
})
