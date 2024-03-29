import Reserves from "../Models/Reserves.js";
import axios from "axios";
import schedule from "node-schedule";
import { farazSendPattern } from "@aspianet/faraz-sms";
import moment from 'jalali-moment' ;
export const stLinkGenerator = async(req,res)=>{
  
    const ReserveId = Math.floor(Math.random() * 90000) + 10000
    var tarianaResponse = []
        try{
            
            for(let i = 0 ; i < req.body.Room.length ; i++){
              

try{
               const responseTariana = await axios.post('http://37.255.231.141:84/HotelReservationWebService.asmx/NewBooking',{
                    PrimaryKey: "0S9T2QDG8C2dG7BxrLAFdwldpMuHE0Pat4KWiHVq0SU=",
                    First_Name:req.body.Name,
                    Last_Name:req.body.Name,
                    Email_Address:"net@net.com",
                    Phone_Number:req.body.Phone,
                    Arrival_Date_Eng:req.body.CheckIn,
                    Departure_Date_Eng :req.body.CheckOut,
                    Adult:"2",
                    Children:"0",
                    RoomType_ID:req.body.Room[i].value,                                
                    RoomType_Name:req.body.Room[i].roomname,
                    Rate:req.body.Room[i].price,
                    
                  })
                  
                  if(responseTariana.data.d !== "No available room"){
                  tarianaResponse.push(responseTariana.data.d.slice(26,32))
                  try{
                    var extraService;
                      if(req.body.Room[i].extraService !== undefined){
                        extraService = req.body.Room[i].extraService
                      }else{
                        extraService = null
                      }
                    
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
            Tariana : responseTariana.data.d.slice(26,32),
            RequestDate : moment().locale('fa').format('YYYY-MM-DD'),
            LoggedUser : req.body.User,
            Percent : req.body.Percent,
            ExtraService : extraService
                })
           
                  }catch(error){

                  }
                  }else{
                    
                  }
                }catch(error){
                    res.status(404).json({ error: 'An error occurred while making the request.' , error2 : error});
               
                    return;
                }
         
           
              }
              try{
                
              const patternCodeToGuestGenerateLink = "b4rnjphxqpno0pk";
              if(req.body.TimeValue === "1"){
                await farazSendPattern( patternCodeToGuestGenerateLink, "+983000505", req.body.Phone, { link : "https://gmhotel.ir/pay/"+ReserveId , timeValue : "1"});
              }else if(req.body.TimeValue === "2"){
                await farazSendPattern( patternCodeToGuestGenerateLink, "+983000505", req.body.Phone, { link : "https://gmhotel.ir/pay/"+ReserveId , timeValue : "12"});
              }else if(req.body.TimeValue === "3"){
                await farazSendPattern( patternCodeToGuestGenerateLink, "+983000505", req.body.Phone, { link : "https://gmhotel.ir/pay/"+ReserveId , timeValue : "24"});
              }
              const patternCodeToOperator = "b5ydvmj9wxggr80"
              
              const smsName = req.body.Name
              const smsPhone = req.body.Phone
              await farazSendPattern( patternCodeToOperator, "+983000505", "09387829919", { name :smsName, phone :smsPhone, reserve :ReserveId.toString() });
              await farazSendPattern( patternCodeToOperator, "+983000505", "09012222347", { name :smsName, phone :smsPhone, reserve :ReserveId.toString() });
            }catch(error){

             }
              res.json(tarianaResponse)
            //   res.json("ok")  
            
            }
            
            catch(error){
                res.status(500).json({ error: 'An error occurred while making the request.' , error2 : error});
             
                return;
            }
            
            const cancelpatternGuest = "c7t3lyp134zs3v6"
            const cancelPatternUser = "4zti2uww3ug514s"
            const taskScheduleTime = new Date();
            if(req.body.TimeValue === "1"){
              taskScheduleTime.setHours(taskScheduleTime.getHours() + 1);
              
              const job = schedule.scheduleJob(taskScheduleTime, async () => {
                
                try {
               var smsConf = false
                  for(let i = 0 ; i < tarianaResponse.length ; i++){
                    
                  const responseFinal = await Reserves.findAll({
                      where:{
                          Tariana : tarianaResponse[i],
                          Status:"pending"
                      }
                  })
                  if(responseFinal.length !== 0){
                    smsConf = true;
                      const responseTarianaFinal = await axios.post('http://37.255.231.141:84/HotelReservationWebService.asmx/CancelBooking',{
                      PrimaryKey: "0S9T2QDG8C2dG7BxrLAFdwldpMuHE0Pat4KWiHVq0SU=",
                      BookingNumber : tarianaResponse[i]
                      
                    })
                    
                    
                    
                    const responseFinalCancel = await Reserves.update({
                      Status : "cancel"
                    },{
                      where:{
                          Tariana : tarianaResponse[i],
                          Status:"pending"
                      }
                  }
                  )
                  
                  }
              }
              if(smsConf === true){
              await farazSendPattern( cancelpatternGuest, "+983000505", req.body.Phone , { reserveId: ReserveId.toString() });
              await farazSendPattern( cancelPatternUser, "+983000505", "09387829919" , { reserveId: ReserveId.toString() });
              await farazSendPattern( cancelPatternUser, "+983000505", "09012222347" , { reserveId: ReserveId.toString() });  
            }
                } catch (error) {
      
                }
              });
            }else if(req.body.TimeValue === "2"){
              taskScheduleTime.setHours(taskScheduleTime.getHours() + 12);
        
              const job = schedule.scheduleJob(taskScheduleTime, async () => {
                try {
                  var smsConf2 = false
                  for(let i = 0 ; i < tarianaResponse.length ; i++){
                  const responseFinal = await Reserves.findAll({
                      where:{
                          Tariana : tarianaResponse[i],
                          Status:"pending"
                      }
                  })
                  if(responseFinal.length !== 0){
                    smsConf2 = true
                      const responseTarianaFinal = await axios.post('http://37.255.231.141:84/HotelReservationWebService.asmx/CancelBooking',{
                      PrimaryKey: "0S9T2QDG8C2dG7BxrLAFdwldpMuHE0Pat4KWiHVq0SU=",
                      BookingNumber : tarianaResponse[i]
                      
                    })
                    
                    const responseFinalCancel = await Reserves.update({
                      Status : "cancel"
                    },{
                      where:{
                          Tariana : tarianaResponse[i],
                          Status:"pending"
                      }
                  }
                  )
                  
                  }
              }
              if(smsConf2 === true){
              await farazSendPattern( cancelpatternGuest, "+983000505", req.body.Phone , { reserveId: ReserveId.toString() });
              await farazSendPattern( cancelPatternUser, "+983000505", "09387829919" , { reserveId: ReserveId.toString() });
              await farazSendPattern( cancelPatternUser, "+983000505", "09012222347" , { reserveId: ReserveId.toString() });
            }
                } catch (error) {
                 
                }
              });
            }else if(req.body.TimeValue === "3"){
              taskScheduleTime.setHours(taskScheduleTime.getHours() + 24);
        
              const job = schedule.scheduleJob(taskScheduleTime, async () => {
                try {
                  var smsConf3 = false
                  for(let i = 0 ; i < tarianaResponse.length ; i++){
                  const responseFinal = await Reserves.findAll({
                      where:{
                          Tariana : tarianaResponse[i],
                          Status:"pending"
                      }
                  })
                  if(responseFinal.length !== 0){
                    smsConf3= true
                      const responseTarianaFinal = await axios.post('http://37.255.231.141:84/HotelReservationWebService.asmx/CancelBooking',{
                      PrimaryKey: "0S9T2QDG8C2dG7BxrLAFdwldpMuHE0Pat4KWiHVq0SU=",
                      BookingNumber : tarianaResponse[i]
                      
                    })
                    
                    const responseFinalCancel = await Reserves.update({
                      Status : "cancel"
                    },{
                      where:{
                          Tariana : tarianaResponse[i],
                          Status:"pending"
                      }
                  }
                  )
                  
                  }
              }
              if(smsConf3 === true){
              await farazSendPattern( cancelpatternGuest, "+983000505", req.body.Phone , { reserveId: ReserveId.toString() });
              await farazSendPattern( cancelPatternUser, "+983000505", "09387829919" , { reserveId: ReserveId.toString() });
              await farazSendPattern( cancelPatternUser, "+983000505", "09012222347" , { reserveId: ReserveId.toString() });
            }
                } catch (error) {
                 
                }
              });
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