import DetailedCalls from "../Models/DetailedCalls.js";
import NewLeads from "../Models/NewLeads.js";
import moment from 'jalali-moment'

export const setmanualcalllead = async(req,res)=>{
    try{
        const response = await DetailedCalls.create({
            Phone : req.body.Phone,
            LastCall : req.body.LastCall,
            FullName : req.body.FullName,
            CallId : req.body.CallId,
            RequestType : req.body.RequestType,
            customerSource: req.body.customerSource,
            RegUser :req.body.RegUser ,
            Section : req.body.Section,
            RequestDateAcco  : req.body.RequestDateAcco,
            AccoRequestType : req.body.AccoRequestType,
            ActionEghamat : req.body.ActionEghamat,
            ActionEghamatZarfiat : req.body.ActionEghamatZarfiat,
            OtherAccoTypes : req.body.OtherAccoTypes,
            OtherguestRequestType : req.body.OtherguestRequestType
        })
        const responseNd = await NewLeads.create({
            FullName : req.body.FullName,
            Phone : req.body.Phone, 
            UniqueId : req.body.CallId,
            FirstFollow : "ثبت از طریق رزرو لطفا پیگیری شود",
            Source : "Phone",
            Status : "Pending",
            User: req.body.RegUser,
            RequestDate : moment().locale('fa').format('YYYY-MM-DD')
        })
           res.json(response)
    }catch(error){
        res.json(error)
    }
}