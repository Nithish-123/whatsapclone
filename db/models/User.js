import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Message from "./Message";
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
		validate(value) {
			if (value.toLowerCase().includes("password"))
				throw new Error("password is not taken");
		},
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		validate(value) {
			if (!validator.isEmail(value)) throw new Error("incorrect email");
		},
	},
	groups: [{ type: String }],
	token: {
		type: String,
	},
});

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.token;
	return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) throw new Error("invalid email");
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error("invalid password");
	return user;
};

userSchema.methods.tokenproduction = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
	user.token = token;
	user.save();

	return token;
};

userSchema.pre("remove", async function (next) {
	await Message.deleteMany({ userid: this._id });
	next();
});

//middleware before saving
userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const User = mongoose.model("User", userSchema);
export default User;
