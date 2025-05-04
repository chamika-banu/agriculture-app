import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY
const { sign, verify } = jwt
const { genSalt, hash, compare } = bcrypt

export async function hashPassword(password) {
	const salt = await genSalt(10)
	const hashedPassword = await hash(password, salt)
	return hashedPassword
}

export async function comparePassword(password, hashedPassword) {
	const isValid = await compare(password, hashedPassword)
	return isValid
}

export function generateToken(user) {
	const payload = {
		id: user._id,
		username: user.email,
		role: user.role,
	}
	const token = sign(payload, SECRET_KEY, { expiresIn: "24h" }) // Changed to 24 hours
	return token
}

export function verifyToken(token) {
	try {
		const decoded = verify(token, SECRET_KEY)
		return decoded
	} catch (err) {
		return null
	}
}

export async function authenticate(req, res, next) {
	const authHeader = req.headers["authorization"]
	if (!authHeader) {
		return res.status(401).send("Access Denied")
	}
	const token = authHeader.split(" ")[1]
	try {
		const verified = verify(token, SECRET_KEY)
		console.log("Verified user:", verified)
		req.user = verified
		next()
	} catch (err) {
		console.error(err)
		res.status(401).send("Invalid Token")
	}
}
