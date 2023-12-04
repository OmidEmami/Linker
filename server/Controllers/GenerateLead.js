import NewLeads from "../Models/NewLeads.js";
import moment from 'jalali-moment';
import { farazSendPattern } from "@aspianet/faraz-sms";
export const newLead = async(req,res)=>{
    const UniqueId = Math.floor(Math.random() * 9000) + 1000

    try{
        const response = await NewLeads.create({
            FullName : req.body.FullName,
            Phone:req.body.Phone,
            HamamType:req.body.HamamType,
            RequestDate:moment().locale('fa').format('YYYY-MM-DD'),
            PreferedDate:req.body.PreferedDate,
            UniqueId:UniqueId,
            Source:"Instagram",
            Status :"Pending"
        })
        res.json({msg : "newLeadGenerated"})
    }catch(error){
        res.status(404).json({ error: 'An error occurred while making the request.' , error2 : error});
    }
}