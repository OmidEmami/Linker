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
                  res.json(response +""+ sms)
        }catch(error){

        }
}
export const sendrestaurantmenu = async(req,res)=>{

}
export const sendhamam = async(req,res)=>{
    
}