import AdminUsers from "../Models/AdminUsers.js";
export const getUsersToManage = async(req,res)=>{
    try{
        const response = await AdminUsers.findAll({})
        res.json(response)
    }catch(error){
        res.status(404)
    }
}
export const changeaccesstype = async(req,res)=>{
    const data = req.body.data
    try{
        for(let i = 0 ; i < data.length ; i++){
            await AdminUsers.update({
                AccessType : data[i].AccessType
            },{
                where:{
                    id : data[i].id,
                    UserName : data[i].UserName
                }
            }
            )
        }
        res.json("ok")
    }catch(error){
res.status(404)
    }
}