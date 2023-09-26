import HamamEntry from "../Models/HamamEntry.js";
import RestaurantEntry from "../Models/RestaurantEntry.js";
import RoomEntry from "../Models/RoomEntry.js";
import { farazSendPattern } from "@aspianet/faraz-sms";
export const sendRoomcatalog = async(req,res)=>{
        try{
            const response = await RoomEntry.create({
                FullName : req.body.name ,
                Phone : req.body.phone ,
                Date : req.body.date,
            })
            const patternCodeToGuestGenerateLink = "lxnetlkd2udbjv5";
            const sms = await farazSendPattern( patternCodeToGuestGenerateLink,
                 "+983000505", req.body.phone,
                  { name : req.body.name});
                  res.json("ok")
        }catch(error){
            res.status(500).json({ error: 'An error occurred while making the request.'});
        }
}
export const sendrestaurantmenu = async(req,res)=>{
    try{
        const response = await RestaurantEntry.create({
            Phone : req.body.Phone
        })
        const patternCodeToGuestGenerateLink = "e8v47k4821nq8nc";
            const sms = await farazSendPattern( patternCodeToGuestGenerateLink,
                 "+983000505", req.body.Phone,
                  { link : "https://B2n.ir/n87891"});
        res.json("ok")
    }catch(error){
        res.status(500).json({ error: 'An error occurred while making the request.'});
    }
}
export const sendhamam = async(req,res)=>{
    try{
        const response = await HamamEntry.create({
            Phone : req.body.Phone
        })
        const patternCodeToGuestGenerateLink = "sarcxme665chieb";
            const sms = await farazSendPattern( patternCodeToGuestGenerateLink,
                 "+983000505", req.body.Phone,
                  { link : "https://B2n.ir/z91568"});
                  res.json("ok")
    }catch(error){
        res.status(500).json({ error: 'An error occurred while making the request.'});
    }
}