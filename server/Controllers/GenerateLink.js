import Reserves from "../Models/Reserves.js";
export const stLinkGenerator = async(req,res)=>{
    const ReserveId = Math.floor(Math.random() * 9000) + 1000
    console.log(req.body.Room)
        try{
            for(let i = 0 ; i < req.body.Room.length ; i++){
            const response = await Reserves.create({
            FullName : req.body.Name,
            Phone: req.body.Phone,
            CheckIn : req.body.CheckIn,
            CheckOut : req.body.CheckOut,
            RoomType : req.body.Room[i].value,
            Status : "pending",
            Price : req.body.Room[i].price,
            ReserveId : ReserveId
                })
              }
              res.json("ok")  
            }
            
            catch(error){
                res.json(error)
            }
    
    
}
