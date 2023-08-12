import express from "express";
const router = express.Router();
import { registerNewUser } from "../Controllers/RegisterUser.js";
router.post("/newuser", registerNewUser)
export default router;