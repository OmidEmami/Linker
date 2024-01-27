import HamamReserveDetail from "../Models/HamamReserveDetail.js";
import NewLeads from "../Models/NewLeads.js";
export const regNewHamamReserve = async(req,res)=>{

    try{
        const checkRepReserveOne = await HamamReserveDetail.findAll({
            where:{
                Date:req.body.CertainDate
            }
        })
        if(checkRepReserveOne.length > 0){
            for(let i = 0 ; i < checkRepReserveOne.length ; i++){}
            const arrayA = JSON.parse(checkRepReserveOne[0].dataValues.Hours)
            const arrayB = JSON.parse(req.body.CertainHour)
            const existsInB = arrayA.some(item => arrayB.includes(item));
            const existsInA = arrayB.some(item => arrayA.includes(item));
            if (existsInB || existsInA) {
                res.status(400).json({msg:"interference"})
            }else{
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
                    Desc:req.body.Desc
                })
                const response = await NewLeads.update({
                    Status : "Reserve Finalized"
                },{
                    where:{
                        UniqueId : req.body.RequestKey
                    }
                })
                res.json(response)
            }
        }else{
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
            Desc:req.body.Desc
        })
        const response = await NewLeads.update({
            Status : "Reserve Finalized"
        },{
            where:{
                UniqueId : req.body.RequestKey
            }
        })
        res.json(response)
    }
    }catch(error){
        console.log(error)
        res.status(500).json({ msg: "An error occurred", error: error.message });
    }
}


