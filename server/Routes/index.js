import express from "express";
import multer from 'multer';
const router = express.Router();
import { registerNewUser } from "../Controllers/RegisterUser.js";
import { loginUser } from "../Controllers/LoginUser.js";
import { stLinkGenerator, toPay } from "../Controllers/GenerateLink.js";
import { toPaySt, toPaynd, getpayments, getReserves, manualcancel, testiano } from "../Controllers/CheckPayments.js";
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
import { modifyFixedReserves, removeHamamReserve } from "../Controllers/modifyFixedReservesHamam.js";
import { SendBack } from "../Controllers/TransmiterSocket.js";
import { regData } from "../Controllers/ModifyData.js";
import { getMissedCalls } from "../Controllers/GetMissedCalls.js";
import { downloadHamamDetails } from "../Controllers/downloadHamamDetails.js";
import { getAllCallsReport,getCallsReport, receptionGetRawLeads, receptionModifyLead, receptionPutRawLeads, regDataReceptionLeadSocket } from "../Controllers/ReceptionLeadsEntry.js";
import { setmanualcalllead } from "../Controllers/ManualCallLeadEntry.js";
import { addNewMassor, addNewPackage, getAllMassors, getAllPackages, modifyPackages, removeMassor, removePackage } from "../Controllers/ControllerDynamicItems.js";
import { uploadHamamDetailsToSheet } from "../Controllers/UploadHamamDetails.js";
import { getReservesDetails } from "../Controllers/UploadCallsDetails.js";
import { sendGuestLinkMiddleWare } from "../Controllers/GenerateMiddleReserve.js";
import { fileUploader } from "../Controllers/MiddleReserveFileUpload.js";
import { confirmreceitreserve, ConfMiddleReserve, Downloadreceit, GetMiddleReservePaymentData, GetMiddleReserves } from "../Controllers/ConfMiddleReserve.js";


const upload = multer({ storage: multer.memoryStorage() })

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
router.get("/api/getNewLeads",verifyToken,getNewLeads);
router.post("/api/regFollowLead",verifyToken, modifyLeads)
router.post("/api/HamamReserveDetail",verifyToken,regNewHamamReserve);
router.post("/api/getFixedReserves",verifyToken,getFixedReserves);
router.post("/api/modifyFixedReserves",verifyToken,modifyFixedReserves)
router.post("/api/sendyalda", sendyalda)
router.post("/api/manualNewLead",verifyToken,manualNewLead )
router.post("/api/removeHamamReserve",removeHamamReserve)
router.get('/api/:phone-:type',(req,res)=>SendBack(req.params.phone,req.params.type,res))
router.post('/api/regData', regData)
router.get('/api/getmissedcalls', getMissedCalls);
router.get('/api/downloadhamamdetails', verifyToken,downloadHamamDetails);
router.get('/api/uploadhamamdetails',uploadHamamDetailsToSheet);
router.get('/api/getFreshLeadsReception', receptionGetRawLeads)
router.post('/api/receptionPutRawLeads', verifyToken,receptionPutRawLeads);
router.post('/api/receptionModifyLead',receptionModifyLead);
router.post('/api/receptionManualNewLead',receptionPutRawLeads)
router.get('/api/getCallsReport',getCallsReport);
router.post('/api/setmanualcalllead', setmanualcalllead);
router.post('/api/regDataReception',regDataReceptionLeadSocket)
router.get('/api/getAllCallsReport',getAllCallsReport);
router.get('/api/getallpackages', getAllPackages);
router.get('/api/getallmassornames', getAllMassors);
router.post('/api/regnewmassor', addNewMassor);
router.post('/api/removemassor', removeMassor);
router.post('/api/removehamampackage', removePackage)
router.post('/api/addnewpackage', addNewPackage);
router.post('/api/modifypackages', modifyPackages)
router.get('/api/getreservesdetails', getReservesDetails)
router.post('/api/testiano', testiano);
router.post('/api/sendGuestLinkMiddleWare',verifyToken,sendGuestLinkMiddleWare)
router.post('/api/uploadfilemiddlereserve', upload.single('file') , fileUploader )
router.post('/api/getMiddleReserveData', ConfMiddleReserve )
router.post('/api/getMiddleReservePaymentData', GetMiddleReservePaymentData)
router.post('/api/downloadreceit',Downloadreceit);
router.get('/api/getMiddleReserves', GetMiddleReserves)
router.post('/api/confirmreceitreserve', confirmreceitreserve)
export default router;