import express from "express";
const router = express.Router();
import { registerNewUser } from "../Controllers/RegisterUser.js";
import { loginUser } from "../Controllers/LoginUser.js";
import { stLinkGenerator, toPay } from "../Controllers/GenerateLink.js";
import {toPaySt, toPaynd, getpayments, getReserves} from "../Controllers/CheckPayments.js";
import { farazSMS } from '@aspianet/faraz-sms';

farazSMS.init("US2xh4FqhIak1kXefKNXaGMTjMkSGytYbTq6xdgB2og=");
router.post("/api/newuser", registerNewUser)
router.post("/api/loginUser", loginUser)
router.post("/api/sendGuestLink",stLinkGenerator)
router.post("/api/topay",toPay)
router.post("/api/topayfirst", toPaySt)
router.post("/api/payfinal",toPaynd)
router.get("/api/getpayments", getpayments)
router.get("/api/getReserves",getReserves)
export default router;