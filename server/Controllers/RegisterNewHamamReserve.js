import HamamReserveDetail from "../Models/HamamReserveDetail.js";
export const regNewHamamReserve = async(req,res)=>{
    try{
        const response = HamamReserveDetail.create({
            UniqueId:req.body.RequestKey,
            FullName:req.body.FullName,
            Phone:req.body.Phone,
            Date:req.body.CertainDate,
            Hours:req.body.CertainHour,
            CustomerType:req.body.CustomerType,
            ServiceType:req.body.ServiceType,
            SelectedService:req.body.SelectedService,
            AccoStatus:req.body.AccoStatus,
            CateringDetails:req.body.CateringDetails,
            MassorNames:req.body.MassorNames,
            Desc:req.body.Desc
        })
        res.json(response)
    }catch(error){
        console.log(error)
    }
}


