import IncomingCallsCrm from "../Models/IncomingCallsCrm.js"
export const getMissedCalls = async(req,res)=>{
    try{
        const response = await IncomingCallsCrm.findAll({
            where:{
                IsResponse : 0
            }
        })
        res.json(response)
    }
    catch(error){

    }
}