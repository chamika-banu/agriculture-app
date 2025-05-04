import express from "express"
import { authenticate } from "../middlewares/auth.js"
import { analyzePlant } from "../controllers/analyzePlantController.js"
import multer from "multer"

const upload = multer()
const router = express.Router()

router.post("/", authenticate, upload.single("image"), analyzePlant)

export default router