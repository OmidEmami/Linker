import DetailedCalls from "../Models/DetailedCalls.js";
import IncomingCallsCrm from "../Models/IncomingCallsCrm.js";
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
            Section : req.body.Section
        });
        res.json("ok")
    }catch(error){

    }
}