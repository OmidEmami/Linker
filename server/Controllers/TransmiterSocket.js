import transmitData from "../index.js";
import IncomingCallsCrm from "../Models/IncomingCallsCrm.js";
import moment from "jalali-moment";
import DetailedCalls from "../Models/DetailedCalls.js"
export const SendBack = async (params,type,res)=>{
    const callid = Math.floor(Math.random() * 90000) + 10000
    try{
        const response = await DetailedCalls.findAll({
            where:{
                Phone : params
            }
        })
        if(response.length > 0){
            
            transmitData({serverRes: response, type : "haveBackGround", Time : moment().locale('fa').format('YYYY/MM/DD HH:mm:ss')})
            await IncomingCallsCrm.create({
                Phone : params,
                IsResponse : 0,
                Time : moment().locale('fa').format('YYYY/MM/DD HH:mm:ss'),
                CallId : callid
            })
        }else{
            const object = {Phone : params, CallId: callid}
            transmitData({serverRes: object, type : "firstCall", Time : moment().locale('fa').format('YYYY/MM/DD HH:mm:ss')})
            await IncomingCallsCrm.create({
                Phone : params,
                IsResponse : 0,
                Time : moment().locale('fa').format('YYYY/MM/DD HH:mm:ss'),
                CallId : callid
            })
            
        }
        
    }catch(error){
        res.status(404)
    }
    
    res.send("ok")

    

}