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
import { sendRoomcatalog, sendhamam, sendrestaurantmenu, sendyalda } from "../Controllers/SendLinks.js";
import { Logout } from "../Controllers/Logout.js";
import { verifyToken } from "../Controllers/VerifyToken.js";
import { newLead } from "../Controllers/GenerateLead.js";
import { getNewLeads } from "../Controllers/GetNewLeads.js";
import { manualNewLead, modifyLeads } from "../Controllers/ModifyLeads.js";
import { regNewHamamReserve } from "../Controllers/RegisterNewHamamReserve.js";
import { getFixedReserves } from "../Controllers/getFixedReserves.js";
import { modifyFixedReserves } from "../Controllers/modifyFixedReservesHamam.js";

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
router.post("/api/createNewLead", newLead);
router.get("/api/getNewLeads",getNewLeads);
router.post("/api/regFollowLead", modifyLeads)
router.post("/api/HamamReserveDetail",regNewHamamReserve);
router.get("/api/getFixedReserves",getFixedReserves);
router.post("/api/modifyFixedReserves",modifyFixedReserves)
router.post("/api/sendyalda", sendyalda)
router.post("/api/manualNewLead",manualNewLead )
export default router;