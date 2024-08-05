import ReservesMiddleWare from "../Models/ReservesMiddleWare.js";
import axios from "axios";
import schedule from "node-schedule";
import { farazSendPattern } from "@aspianet/faraz-sms";
import PaymentConf from "../Models/PaymentConf.js";
import moment from 'jalali-moment' ;
export const sendGuestLinkMiddleWare = async(req,res)=>{
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
                    Rate:((req.body.Room[i].price)-(((req.body.Room[i].price)*req.body.Room[i].offRate)/100)),
                    
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
                    
                    const response = await ReservesMiddleWare.create({
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
            ExtraService : extraService,
            OffRate : req.body.Room[i].offRate,
            ReserveOrigin : req.body.ReserveOrigin,
            AccountDetail :  JSON.stringify(req.body.HesabAccount),
                })
           
                  }catch(error){
                    console.log(error)
                    res.status(404).json({ error: 'An error occurred while making the request.' , error2 : error});
                  }
                  }else{
                    
                  }
                }catch(error){

                  console.log(error)
                    res.status(404).json({ error: 'An error occurred while making the request.' , error2 : error});
               
                    return;
                }
         
           
              }
              if(req.body.ReserveOrigin === "direct"){
                try{
                  const response = await PaymentConf.create({
                      ReserveId:ReserveId,
                      Conf1 : false,
                      Conf2 : false,
                      Conf1User : false,
                      Conf2User : false
                  })

                }catch(error){
                  console.log(error)

                  res.status(404).json({ error: 'An error occurred while making the request.' , error2 : error});
                }
                try{
                  const patternCodeToGuestGenerateLink = "5susk413jjcbt4s";
                    await farazSendPattern( patternCodeToGuestGenerateLink, "+983000505", req.body.Phone, { link : "https://gmhotel.ir/mrcheck/"+ReserveId});
                }catch(error){
                  console.log(error)
                }
              }
              res.json(tarianaResponse)
            
            }catch(error){
              console.log(error)

              res.status(404).json({ error: 'An error occurred while making the request.' , error2 : error});
            }
            
           
            
            
             
}