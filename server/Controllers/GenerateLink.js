import Reserves from "../Models/Reserves.js";
import axios from "axios"
export const stLinkGenerator = async(req,res)=>{
    const ReserveId = Math.floor(Math.random() * 9000) + 1000
    var responseTariana;
        try{
            for(let i = 0 ; i < req.body.Room.length ; i++){
console.log("omid")
                responseTariana = await axios.post('http://192.168.1.2:84/HotelReservationWebService.asmx/NewBooking',{
                    PrimaryKey: "0S9T2QDG8C2dG7BxrLAFdwldpMuHE0Pat4KWiHVq0SU=",
                    First_Name:req.body.Name,
                    Last_Name:req.body.Name,
                    Email_Address:"net@net.com",
                    Phone_Number:req.body.Phone,
                    Arrival_Date_Eng:req.body.CheckIn,
                    Departure_Date_Eng :req.body.CheckOut,
                    Adult:"2",
                    Children:"2",
                    RoomType_ID:req.body.Room[i].value,                                
                    RoomType_Name:req.body.Room[i].roomname,
                    Rate:req.body.Room[i].price,
                    
                  })
                  console.log("omid2")
console.log(responseTariana)
            // const response = await Reserves.create({
            // FullName : req.body.Name,
            // Phone: req.body.Phone,
            // CheckIn : req.body.CheckIn,
            // CheckOut : req.body.CheckOut,
            // RoomType : req.body.Room[i].value,
            // RoomName : req.body.Room[i].roomname,
            // Status : "pending",
            // Price : req.body.Room[i].price,
            // ReserveId : ReserveId,
            // AccoCount : req.body.AccoCount
            //     })
            res.json(responseTariana)
              }
            //   res.json("ok")  
            }
            
            catch(error){
                res.json(responseTariana)
            }
    
    
}
export const toPay = async(req,res)=>{
    const reserveId= req.body.ReserveId;
    try{
        const response = await Reserves.findAll({
            where:{
                ReserveId : reserveId,
                Status : "pending"
            }
        })
        res.json(response)
    }catch(error){
        res.json(error)
    }
}