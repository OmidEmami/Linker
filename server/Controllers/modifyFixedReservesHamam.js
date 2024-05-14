import HamamReserveDetail from "../Models/HamamReserveDetail.js";
export const modifyFixedReserves = async(req,res)=>{
   
    try{
        console.log(req.body)
        const response = await HamamReserveDetail.update({
            FullName:req.body.FullName,
            Phone:req.body.Phone,
            Date:req.body.Date,
            Hours:req.body.Hours,
            CustomerType:req.body.CustomerType,
            ServiceType:req.body.ServiceType,
            SelectedService:req.body.SelectedService,
            AccoStatus:req.body.AccoStatus,
            CateringDetails:req.body.CateringDetails,
           
            Desc:req.body.Desc,
            FinalPrice:req.body.FinalPrice,
            CurrentStatus:req.body.CurrentStatus,
            SatisfactionText:req.body.SatisfactionText,
            Satisfaction:req.body.Satisfaction,
            SelectedMassorNames: req.body.SelectedMassors,
            SelectedPackage: req.body.SelectedPackage
        },{
            where:{
                UniqueId:req.body.UniqueId
            }
          })
          res.json(response)
    }catch(error){
        console.log(error)
        res.status(404).json({ error: 'An error occurred while making the request.' , error2 : error});
    }
    
}

export const removeHamamReserve = async(req,res)=>{
    
    try{
        const response = await HamamReserveDetail.destroy({
            where:{
                UniqueId:req.body.UniqueId,
                FullName:req.body.FullName,
                Phone:req.body.Phone,
                Date:req.body.Date,
        
            }
        })
        res.json(response)
        
    }catch(error){
        res.status(400).json({msg:"error"})
    }
}