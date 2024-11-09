import express from "express";
import { health, signin, signup } from "../controller/user.controller.js";

const userRoute = express.Router();
userRoute.post("/signup", signup);
userRoute.get("/signin", signin);
userRoute.get("/health", health);

export default userRoute;
