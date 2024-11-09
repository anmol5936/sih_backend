import express from "express";
import { wasteManagement } from "../controller/waste.controller.js";

const wasteRoute = express.Router();
wasteRoute.post("/waste", wasteManagement);

export default wasteRoute;
