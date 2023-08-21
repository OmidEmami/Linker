import Reserves from "../Models/Reserves.js";
import axios from "axios";
import schedule from "node-schedule";
import { farazSendPattern } from "@aspianet/faraz-sms";
export const stLinkGenerator = async(req,res)=>{
  
    const ReserveId = Math.floor(Math.random() * 9000) + 1000
    var tarianaResponse = []
        try{
            console.log(req.body.Room.length)
            for(let i = 0 ; i < req.body.Room.length ; i++){
console.log("omid")
try{
               const responseTariana = await axios.post('http://192.168.1.2:84/HotelReservationWebService.asmx/NewBooking',{
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
                  console.log(responseTariana.data)
                  if(responseTariana.data.d !== "No available room"){
                  tarianaResponse.push(responseTariana.data.d.slice(26,32))
                  try{
                    const response = await Reserves.create({
            FullName : req.body.Name,
            Phone: req.body.Phone,
            CheckIn : req.body.CheckIn,
            CheckOut : req.body.CheckOut,
            RoomType : req.body.Room[i].value,
            RoomName : req.body.Room[i].roomname,
            Status : "pending",
            Price : req.body.Room[i].price,
            ReserveId : ReserveId,
            AccoCount : req.body.AccoCount,
            Tariana : responseTariana.data.d.slice(26,32)
                })
           
                  }catch(error){

                  }
                  }else{
                    
                  }
                }catch(error){
                    res.status(500).json({ error: 'An error occurred while making the request.' , error2 : error});
                    console.log(error)
                }
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
           
              }
              const patternCodeToGuestGenerateLink = "b4rnjphxqpno0pk";
              await farazSendPattern( patternCodeToGuestGenerateLink, "+983000505", req.body.Phone, { link : "http://87.248.152.131/pay/"+ReserveId});
              const patternCodeToOperator = "b5ydvmj9wxggr80" 
              await farazSendPattern( patternCodeToOperator, "+983000505", "09909327409", { name :req.body.Name, phone :req.body.Phone, reserve :ReserveId });
              res.json(tarianaResponse)
            //   res.json("ok")  
            
            }
            
            catch(error){
                res.status(500).json({ error: 'An error occurred while making the request.' , error2 : error});
                console.log(error)
            }
    
            const taskScheduleTime = new Date();
            taskScheduleTime.setSeconds(taskScheduleTime.getSeconds() + 30);
        
            const job = schedule.scheduleJob(taskScheduleTime, async () => {
              try {
                // Your task to run after 30 minutes
                for(let i = 0 ; i < tarianaResponse.length ; i++){
                const responseFinal = await Reserves.findAll({
                    where:{
                        Tariana : tarianaResponse[i],
                        Status:"pending"
                    }
                })
                if(responseFinal.length !== 0){
                    const responseTarianaFinal = await axios.post('http://192.168.1.2:84/HotelReservationWebService.asmx/CancelBooking',{
                    PrimaryKey: "0S9T2QDG8C2dG7BxrLAFdwldpMuHE0Pat4KWiHVq0SU=",
                    BookingNumber : tarianaResponse[i]
                    
                  })
                  console.log(responseTarianaFinal + "omidtariana")
                  const responseFinalCancel = await Reserves.update({
                    Status : "cancel"
                  },{
                    where:{
                        Tariana : tarianaResponse[i],
                        Status:"pending"
                    }
                }
                )
                console.log(responseFinalCancel + "cancel")
                }
            }
              } catch (error) {
                console.error('Error in scheduled task:', error);
              }
            });
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