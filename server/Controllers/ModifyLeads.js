import NewLeads from "../Models/NewLeads.js";
import moment from 'jalali-moment'
export const modifyLeads = async(req,res)=>{
    const data = req.body.data
    try{
        
        for(let i = 0 ; i < data.length ; i++){
            const response = await NewLeads.update({
                FullName:data[i].FullName,
                Phone:data[i].Phone,
                HamamType:data[i].HamamType, 
                RequestDate:data[i].RequestDate,
                PreferedDate:data[i].PreferedDate,
                UniqueId:data[i].UniqueId,
                FirstFollow:data[i].FirstFollow,
                Status :data[i].Status
            },{
                where:{
                    UniqueId:data[i].UniqueId
                }
              })
        }
    
          res.json("Omid")
    }catch(error){
        res.status(404).json({ error: 'An error occurred while making the request.' , error2 : error});
    }
}
export const manualNewLead = async(req,res)=>{
    const UniqueId = Math.floor(Math.random() * 9000) + 1000

    try{
        const response = await NewLeads.create({
            FullName:req.body.Name,
            Phone:req.body.Phone,
            PreferedDate:req.body.Dates,
            HamamType:req.body.HamamType,
            Source:req.body.LeadSource,
            UniqueId:UniqueId,
            RequestDate:moment().locale('fa').format('YYYY-MM-DD'),
            Status :"Pending"
        })
        res.json("ok")
    }catch(error){
        res.status(404).json({ msg: 'An error occurred while making the request.' , error2 : error});
    }
}