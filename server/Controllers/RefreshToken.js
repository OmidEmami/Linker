import AdminUsers from "../Models/AdminUsers.js";
import jwt from "jsonwebtoken";
 
export const refreshToken = async(req, res) => {
    try {
        
        const refreshToken = req.cookies.refreshToken;
        
        if(!refreshToken) return res.sendStatus(401);
        
        const user = await AdminUsers.findAll({
            where:{
                RefreshToken: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const name = user[0].FullName;
            const email = user[0].UserName;
            const phoneNumber = user[0].Phone;
            const accessType = user[0].AccessType;
            const accessToken = jwt.sign({userId, name, email,phoneNumber, accessType}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '1d'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        res.sendStatus(403);
    }
}