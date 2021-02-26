/* import mongoose from "mongoose"; */
const mongoose = require("mongoose");
/* import User from "./models/User"; */
const connectionURL = process.env.MONGODB_URL;

mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});
/* const messageSchema = new mongoose.Schema(
	{
		message: String,
		name: String,
	},
	{
		timestamps: true,
	}
);

const Message = mongoose.model("Message", messageSchema);
const msg1 = new Message({
	message: "hi there how are you",
	name: "prashanth",
});
msg1
	.save()
	.then(() => {
		console.log(msg1._id);
	})
	.catch((err) => {
		console.log("something went wrong");
	}); */
