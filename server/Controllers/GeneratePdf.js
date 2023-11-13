import Reserves from "../Models/Reserves.js";
export const findReserveForPdf = async(req,res)=>{
    try{
        const response = await Reserves.findAll({
           where :{
            ReserveId : req.body.ReserveKey,

            Status : "Paid"
           }
        })
        res.json(response)
        console.log(response)
    }catch(error){
        res.status(404)
    }
}