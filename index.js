/* import express from "express"; */
const express = require("express");
/* import "./db/mongoose"; */
require("./db/mongoose");
/* import userRouter from "./router/User"; */
const userRouter = require("./router/User");
/* import { router, messagesave } from "./router/Message"; */
const { router, messagesave } = require("./router/Message");
/* import cors from "cors"; */
const cors = require("cors");
/* import http from "http"; */
const http = require("http");
/* import socketio from "socket.io"; */
const socketio = require("socket.io");
const Port = process.env.Port || 3000;
const app = express();

const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: "https://nithish-chatapp.herokuapp.com",
		methods: ["GET", "POST"],
	},
});
const corsOpts = {
	origin: "https://nithish-chatapp.herokuapp.com",
	methods: ["GET", "POST"],
};
app.use(express.json());
app.use(cors(corsOpts));
let users = {};
/* io.on("connection", (socket) => {
	socket.on("clientsidejoined", (message) => {
		users[message] = socket.id;
		console.log(users);
	});
	socket.on("chat-message", async (message, callback) => {
		callback();
		const message1 = Object.assign({}, message);
		delete message.friendid;
		await messagesave(message);
		console.log(message1);

		io.to(users[message1.friendid]).emit(`${message1.friendid}`, message);
	});
	socket.on("disconnect", () => console.log("userdiconnected"));
}); */

app.use(userRouter);
app.use(router);

server.listen(Port, () => {
	console.log("server listening on", Port);
});
