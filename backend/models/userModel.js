import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	profileImage: {
		type: String,
		default:
			"https://firebasestorage.googleapis.com/v0/b/maternify-4de04.firebasestorage.app/o/other%2Favatar.png?alt=media&token=c7287ed5-7766-464b-aa07-f725fb9e7ce2",
	},
	location: { type: String },
	contactNo: { type: String },
	createdAt: { type: Date, default: Date.now },
})

const UserModel = mongoose.model("User", userSchema)
export default UserModel
