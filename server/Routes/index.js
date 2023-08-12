import express from "express";
const router = express.Router();
import { registerNewUser } from "../Controllers/RegisterUser.js";
import { loginUser } from "../Controllers/LoginUser.js";
import { stLinkGenerator } from "../Controllers/GenerateLink.js";
router.post("/newuser", registerNewUser)
router.post("/loginUser", loginUser)
router.post("/sendGuestLink",stLinkGenerator)
export default router;