import AdminUsers from "../Models/AdminUsers.js"
import bcrypt from "bcrypt"
export const registerNewUser = async(req,res)=>{
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.pass, salt);
    try{
        const response = await AdminUsers.create({
            FullName : req.body.fullName,
            UserName : req.body.email,
            Phone : req.body.phone,
            Password : hashPassword
        })
        res.json("success")
    }catch(error){
        res.json(error)
    }
}