import AdminUsers from "../Models/AdminUsers.js";
export const getUsersToManage = async(req,res)=>{
    try{
        const response = await AdminUsers.findAll({})
        res.json(response)
    }catch(error){
        res.json(404)
    }
}