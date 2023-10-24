import express from "express";
const router = express.Router();
import { registerNewUser } from "../Controllers/RegisterUser.js";
import { loginUser } from "../Controllers/LoginUser.js";
import { stLinkGenerator, toPay } from "../Controllers/GenerateLink.js";
import {toPaySt, toPaynd, getpayments, getReserves, manualcancel} from "../Controllers/CheckPayments.js";
import { farazSMS } from '@aspianet/faraz-sms';
import { refreshToken } from "../Controllers/RefreshToken.js";
import { changeaccesstype, getUsersToManage } from "../Controllers/ManageUsers.js";
import { findReserveForPdf } from "../Controllers/GeneratePdf.js";
import { sendRoomcatalog, sendhamam, sendrestaurantmenu } from "../Controllers/SendLinks.js";
import { Logout } from "../Controllers/Logout.js";
import { verifyToken } from "../Controllers/VerifyToken.js";
farazSMS.init("US2xh4FqhIak1kXefKNXaGMTjMkSGytYbTq6xdgB2og=");
router.post("/api/newuser", registerNewUser)
router.post("/api/loginUser", loginUser)
router.post("/api/sendGuestLink",verifyToken,stLinkGenerator)
router.post("/api/topay",toPay)
router.post("/api/topayfirst", toPaySt)
router.post("/api/payfinal",toPaynd)
router.get("/api/getpayments",verifyToken, getpayments)
router.get("/api/getReserves",verifyToken,getReserves);
router.post("/api/manualcancel",verifyToken,manualcancel)
router.get("/api/token", refreshToken)
router.get("/api/getusermanager", verifyToken,getUsersToManage)
router.post("/api/changeaccesstype", verifyToken,changeaccesstype)
router.post("/api/findReserveForPdf", findReserveForPdf)
router.post('/api/sendroomcatalog', sendRoomcatalog);
router.post('/api/sendrestaurantmenu', sendrestaurantmenu);
router.post('/api/sendhamam', sendhamam);
router.delete('/api/logout', Logout);
export default router;