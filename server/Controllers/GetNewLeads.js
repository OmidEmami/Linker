import NewLeads from "../Models/NewLeads.js";
export const getNewLeads = async (req,res)=>{
    try{
        const response = await NewLeads.findAll({})
        res.json(response)
    }catch(error2){
        res.status(404).json({ error: 'An error occurred while making the request.' , error2 : error2});
    }
}