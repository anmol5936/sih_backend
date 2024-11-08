import express from "express";
import { cleanlinessScore } from "../controller/cleanlinessController.js";

const cleanlinessRoute = express.Router();

cleanlinessRoute.post("/score", cleanlinessScore);

export default cleanlinessRoute;
