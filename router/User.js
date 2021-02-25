import express from "express";
import User from "../db/models/User";
import auth from "../middleware/auth";
import errorHandler from "../middleware/errorHandler";

const router = new express.Router();

router.post("/user/signup", async (req, res) => {
	try {
		await User.init();
		const user = new User(req.body);
		console.log(user);
		await user.save();
		const token = await user.tokenproduction();
		res.send({ user, token }).status(201);
	} catch (error) {
		console.log(error);
		res.json({ message: error }).status(404);
	}
});
router.post("/user/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.tokenproduction();
		res.send({ user, token }).status(200);
	} catch (error) {
		res.json({ message: "invalid credentials" }).status(400);
	}
});
router.get("/addfriends", auth, async (req, res) => {
	try {
		const email = req.user.groups;
		const friends = [];

		for (let i = 0; i < email.length; i++) {
			try {
				const friend = await User.findOne({ username: email[i] });
				friend.groups = undefined;
				friends.push(friend);
			} catch (error) {}
		}

		res.send(friends).status(200);
	} catch (error) {
		console.log(error);
	}
});
router.post("/addfriend", auth, async (req, res) => {
	try {
		const ifpresent = req.user.groups.includes(req.body.username);
		const ifexist = await User.findOne({ username: req.body.username });
		if (ifpresent) res.send({ message: "user already present in groups list" });
		else if (ifexist) {
			req.user.groups.push(ifexist.username);
			await req.user.save();
			ifexist.groups.push(req.user.username);
			await ifexist.save();
			ifexist.groups = undefined;
			res.send(ifexist).status(200);
		} else {
			res.send({ message: "user not found" }).status(200);
		}
	} catch (error) {
		console.log(error);
	}
});

router.post("/user/logout", auth, async (req, res) => {
	req.user.token = "null";
	await req.user.save();
	res.status(200).send("signed out");
});
router.patch("/user/update", auth, async (req, res) => {
	const allowedUpdates = ["email", "password", "username", "addgroup"];
	const update = Object.keys(req.body);
	const isAllowedupdate = update.every((ele) => allowedUpdates.includes(ele));
	if (!isAllowedupdate) return errorHandler("cannot update");
	const user = req.user;

	update.forEach((ele) => {
		if (ele === "addgroup") user.groups.push(req.body["addgroup"]);
		user[ele] = req.body[ele];
	});
	await user.save();
	res.send({ user }).status(201);
});

router.delete("/user/delete", auth, async (req, res) => {
	const user = req.user;
	await user.remove();
	res.status(500).send(user);
});

export default router;
