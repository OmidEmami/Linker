import HamamReserveDetail from "../Models/HamamReserveDetail.js";
export const getFixedReserves = async(req,res)=>{
    try{
        const response = await HamamReserveDetail.findAll({})
        res.json(response)
    }catch(error){
        console.log(error)
    }
}