import NewLeads from "../Models/NewLeads.js";
import MassorModel from "../Models/MassorModel.js";
import PackageModel from "../Models/PackageModel.js";
export const getNewLeads = async (req,res)=>{
    try{
        const response = await NewLeads.findAll({})
        const massors = await MassorModel.findAll({})
        const packages = await PackageModel.findAll({})
        res.json({response, massors, packages})
    }catch(error2){
        res.status(404).json({ error: 'An error occurred while making the request.' , error2 : error2});
    }
}