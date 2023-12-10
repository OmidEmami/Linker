import NewLeads from "../Models/NewLeads.js";
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
                SecondFollow:data[i].SecondFollow,
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