import express from "express";
const router = express.Router();
import { registerNewUser } from "../Controllers/RegisterUser.js";
import { loginUser } from "../Controllers/LoginUser.js";
import { stLinkGenerator, toPay } from "../Controllers/GenerateLink.js";
router.post("/newuser", registerNewUser)
router.post("/loginUser", loginUser)
router.post("/sendGuestLink",stLinkGenerator)
router.post("/topay",toPay)
export default router;