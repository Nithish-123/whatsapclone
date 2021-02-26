/* import jwt from "jsonwebtoken";
import errorHandler from "./errorHandler";
import User from "../db/models/User"; */

const jwt=require("jsonwebtoken")
const User=require("../db/models/User")

const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		if (!token) throw new Error();
		const decodedid = jwt.verify(token, "NiThIsH12");
		const user = await User.findOne({ _id: decodedid._id, token: token });
		if (!user) throw new Error();
		req.user = user;
		next();
	} catch (error) {
		res.status(401).send("unable to login:Please authenticate");
	}
};
module.exports=auth
/* export default auth; */
