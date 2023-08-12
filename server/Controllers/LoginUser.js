import AdminUsers from "../Models/AdminUsers.js"
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
export const loginUser = async(req,res) =>{
    const user = req.body.user;
    const pass = req.body.pass;
    try{
        const response = await AdminUsers.findAll({
            where:{
                UserName : user
            }
        })
        console.log(response)
        const match = await bcrypt.compare(pass, response[0].Password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = response[0].id;
        const name = response[0].FullName;
        const email = response[0].UserName;
        const phone = response[0].Phone
        const accessToken = jwt.sign({userId, name, email,phone}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, name, email,phone}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await AdminUsers.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

      
        res.json({ accessToken });
    
    }catch(error){
        res.status(404).json({msg:"Email not found"});
        console.log(error)
    }
}