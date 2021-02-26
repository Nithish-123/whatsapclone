/* import express from "express";
import User from "../db/models/User";
import auth from "../middleware/auth";
import Message from "../db/models/Message"; */

const express = require("express");
const auth = require("../middleware/auth");
const Message = require("../db/models/Message");
const router = new express.Router();

router.post("/messages/", auth, async (req, res) => {
	const message = new Message({
		...req.body,
	});
	try {
		await message.save();
		res.send(message).status(201);
	} catch (error) {
		console.log(error);
		res.send(error).status(404);
	}
});

const messagesave = async (user) => {
	const message = new Message({
		...user,
	});
	await message.save();
};

router.post("/messages/get/:username", auth, async (req, res) => {
	try {
		let messages = await Message.find({
			userid: { $in: [req.body.userid, req.body.friendid] },
			groupname: { $in: [req.params.username, req.body.username] },
		});
		/* const messagesfrom = await Message.find({
			userid: req.body.friendid,
			groupname: req.body.username,
		}); */

		res.status(200).send(messages);
	} catch (error) {
		console.log(error);
	}
});

router.delete("/messages/delete/:id", auth, async (req, res) => {
	const message = await Message.findByIdAndDelete({ _id: req.params.id });
	res.status(200).send(message);
});
module.exports = { router, messagesave };
/* export { router, messagesave }; */
