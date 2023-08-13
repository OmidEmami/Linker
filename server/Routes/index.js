import express from "express";
const router = express.Router();
import { registerNewUser } from "../Controllers/RegisterUser.js";
import { loginUser } from "../Controllers/LoginUser.js";
import { stLinkGenerator, toPay } from "../Controllers/GenerateLink.js";
import {toPaySt} from "../Controllers/CheckPayments.js"
router.post("/newuser", registerNewUser)
router.post("/loginUser", loginUser)
router.post("/sendGuestLink",stLinkGenerator)
router.post("/topay",toPay)
router.post("/toPaySt", toPaySt)
export default router;