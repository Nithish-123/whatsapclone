import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
	groupname: String,
	message: String,
	sender: String,
	createdAt: String,
	userid: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
