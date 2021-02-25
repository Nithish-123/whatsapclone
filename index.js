import express from "express";
import "./db/mongoose";
import userRouter from "./router/User";
import { router, messagesave } from "./router/Message";
import cors from "cors";
import http from "http";
import socketio from "socket.io";
const Port = process.env.Port || 3001;
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: "*",
	},
});

app.use(express.json());
app.use(cors());
let users = {};
io.on("connection", (socket) => {
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
});

app.use(userRouter);
app.use(router);

server.listen(Port, () => {
	console.log("server listening on", Port);
});
