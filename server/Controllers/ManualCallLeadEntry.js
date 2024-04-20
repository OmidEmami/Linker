import DetailedCalls from "../Models/DetailedCalls.js"
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
           res.json(response)
    }catch(error){
        res.json(error)
    }
}