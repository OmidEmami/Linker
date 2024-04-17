import DetailedCalls from "../Models/DetailedCalls.js";
import IncomingCallsCrm from "../Models/IncomingCallsCrm.js";
import RestaurantEntry from "../Models/RestaurantEntry.js";
import HamamEntry from "../Models/HamamEntry.js";
import { farazSendPattern } from "@aspianet/faraz-sms";
export const regData = async(req,res)=>{
   console.log(req.body.RegUser)
    try{
        const setInComingCalls = await IncomingCallsCrm.update({
            IsResponse : 1,
        },{
            where:{
                CallId : req.body.callId
            }
        }
        )
        const setDetailedCalls = await DetailedCalls.create({
            Phone : req.body.phone,
            LastCall : req.body.lastcalldate,
            FullName : req.body.guestName,
            CallId : req.body.callId,
            FirstCall : req.body.firstcalldate,
            RequestType : req.body.requestType,
            BackGround : req.body.background,
            Result : req.body.result,
            customerSource: req.body.customerSource,
            RegUser : req.body.RegUser,
            Section : req.body.Section,
            RequestDateAcco  : req.body.RequestDateAcco,
            AccoRequestType : req.body.AccoRequestType,
            ActionEghamat : req.body.ActionEghamat,
            ActionEghamatZarfiat : req.body.ActionEghamatZarfiat,
            OtherAccoTypes : req.body.OtherAccoTypes,
            OtherguestRequestType : req.body.OtherguestRequestType
        });
        if(req.body.requestType ==="رستوران" ){
            console.log(req.body.requestType)
            const response = await RestaurantEntry.create({
                Phone : req.body.phone
            })
            const patternCodeToGuestGenerateLink = "e8v47k4821nq8nc";
                const sms = await farazSendPattern( patternCodeToGuestGenerateLink,
                     "+983000505", req.body.phone,
                      { link : "https://B2n.ir/f41377"});
        }else if(req.body.requestType === "حمام سنتی"){
                
            const response = await HamamEntry.create({
                Phone : req.body.phone
            })
            const patternCodeToGuestGenerateLink = "sarcxme665chieb";
                const sms = await farazSendPattern( patternCodeToGuestGenerateLink,
                     "+983000505", req.body.phone,
                      { link : "https://B2n.ir/z91568"});
        }
        res.json("ok")
    }catch(error){

    }
}