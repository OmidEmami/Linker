import express from "express";
const router = express.Router();
import { registerNewUser } from "../Controllers/RegisterUser.js";
import { loginUser } from "../Controllers/LoginUser.js";
import { stLinkGenerator, toPay } from "../Controllers/GenerateLink.js";
import {toPaySt, toPaynd} from "../Controllers/CheckPayments.js"
router.post("/api/newuser", registerNewUser)
router.post("/api/loginUser", loginUser)
router.post("/api/sendGuestLink",stLinkGenerator)
router.post("/api/topay",toPay)
router.post("/api/toPaySt", toPaySt)
router.post("/api/toPaynd",toPaynd)
export default router;