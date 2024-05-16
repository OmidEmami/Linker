import HamamReserveDetail from "../Models/HamamReserveDetail.js";
import NewLeads from "../Models/NewLeads.js";
export const regNewHamamReserve = async(req,res)=>{

    try{
console.log(req.body)
           
                const responseI = await HamamReserveDetail.create({
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
                    Desc:req.body.Desc,
                    FinalPrice:req.body.FinalPrice,
                    CurrentStatus :"Fixed",
                    User:req.body.User,
                    SelectedMassorNames : req.body.MassorNames,
                    SelectedPackage : req.body.SelectedPackage
                })
                const response = await NewLeads.update({
                    Status : "Reserve Finalized"
                },{
                    where:{
                        UniqueId : req.body.RequestKey
                    }
                })
                res.json({response ,responseI})
    
    }catch(error){
        console.log(error)
        res.status(500).json({ msg: "An error occurred", error: error.message });
    }
}


