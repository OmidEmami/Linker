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
                  console.log(responseTariana)
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
                    res.status(404).json({ error: 'An error occurred while making the request.' , error2 : error});
                    console.log(error)
                    return;
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
              try{
                
              const patternCodeToGuestGenerateLink = "b4rnjphxqpno0pk";
              await farazSendPattern( patternCodeToGuestGenerateLink, "+983000505", req.body.Phone, { link : "https://gmhotel.ir/pay/"+ReserveId});
              const patternCodeToOperator = "b5ydvmj9wxggr80"
              
              const smsName = req.body.Name
              const smsPhone = req.body.Phone
              await farazSendPattern( patternCodeToOperator, "+983000505", "09120086619", { name :smsName, phone :smsPhone, reserve :ReserveId.toString() });
             }catch(error){console.log(error)}
              res.json(tarianaResponse)
            //   res.json("ok")  
            
            }
            
            catch(error){
                res.status(500).json({ error: 'An error occurred while making the request.' , error2 : error});
                console.log(error)
                return;
            }
    
            const taskScheduleTime = new Date();
            taskScheduleTime.setMinutes(taskScheduleTime.getMinutes() + 35);
        
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