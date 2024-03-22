import { transmitData } from "../index.js";
import IncomingCallsCrm from "../Models/IncomingCallsCrm.js";
import moment from "jalali-moment";
import DetailedCalls from "../Models/DetailedCalls.js"
export const SendBack = async (params,type,res)=>{
    const callid = Math.floor(Math.random() * 90000) + 10000
    const realPhoneNumber = normalizePhoneNumber(params)
    function normalizePhoneNumber(phoneNumber) {
        // Remove any non-digit characters from the phone number
        let digitsOnly = phoneNumber.replace(/\D/g, '');
    
        // Check if the number starts with '98' and remove the prefix
        if (digitsOnly.startsWith('98')) {
            digitsOnly = digitsOnly.substring(2);
        } 
        // Check if the number starts with '0' and remove the prefix
        else if (digitsOnly.startsWith('0')) {
            digitsOnly = digitsOnly.substring(1);
        }
    
        // After removing the prefixes, the number is expected to be in the correct format
        // You can add further validations here if needed
    
        return digitsOnly; // Return the normalized phone number
    }
    
    try{
        const response = await DetailedCalls.findAll({
            where:{
                Phone : realPhoneNumber
            }
        })
        if(response.length > 0){
            
            transmitData({section : type, serverRes: response, type : "haveBackGround", Time : moment().locale('fa').format('YYYY/MM/DD HH:mm:ss')})
            await IncomingCallsCrm.create({
                Phone : realPhoneNumber,
                IsResponse : 0,
                Time : moment().locale('fa').format('YYYY/MM/DD HH:mm:ss'),
                CallId : callid,
                Section: type
            })
        }else{
            const object = {Phone : realPhoneNumber, CallId: callid, Section : type}
            transmitData({section : type,serverRes: object, type : "firstCall", Time : moment().locale('fa').format('YYYY/MM/DD HH:mm:ss')})
            await IncomingCallsCrm.create({
                Phone : realPhoneNumber,
                IsResponse : 0,
                Time : moment().locale('fa').format('YYYY/MM/DD HH:mm:ss'),
                CallId : callid,
                Section: type
            })
            
        }
        
    }catch(error){
        res.status(404)
    }
    
    res.send("ok")

    

}