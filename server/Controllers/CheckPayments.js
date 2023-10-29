import Reserves from "../Models/Reserves.js";
import Payments from "../Models/Payments.js"
import axios from "axios";
import moment from 'jalali-moment' ;
import request from "request"
import { farazSendPattern } from "@aspianet/faraz-sms";
export const toPaySt = async(req,res)=>{
  try{
    const response = await axios.post('https://api.zarinpal.com/pg/v4/payment/request.json', {
        merchant_id: '63203523-fe22-485f-963d-6ca28477d320',
        callback_url: 'https://gmhotel.ir/checkout',
        amount : req.body.amount,
        description : req.body.description,
        metadata : req.body.metadata

      });
      if(response.data.data.code === 100 && response.data.data.message === "Success" ){
        
        await Payments.create({
          ClientName : req.body.ClientName,
          ClientEmail: req.body.metadata.email,
          ClientPhone : req.body.metadata.mobile,
          ClientAmount : req.body.amount,
          ClientDescription : req.body.description,
          payDate : moment().locale('fa').format('YYYY-MM-DD HH:mm:ss'),
          AuthCode : response.data.data.authority,
          TransactionCode : "Pending",
          ReserveId : req.body.ReserveDetails[0].ReserveId
        })
        res.json(response.data)
      }else{
        res.status(404).json({ error: 'An error occurred while making the request.' });
      }
      
    }catch(error){
      res.status(500).json({ error: 'An error occurred while making the request.' });
      return;
    }
}
export const toPaynd = async(req,res)=>{
  try {
      
    const findPay = await Payments.findOne({
      where:{
        
        AuthCode : req.body.authority
      }
    
    })
    
    if(findPay !== null){
      
      const response = await axios.post('https://api.zarinpal.com/pg/v4/payment/verify.json', 
      {
        merchant_id: '63203523-fe22-485f-963d-6ca28477d320',
        amount: findPay.ClientAmount,
        authority:req.body.authority
      }
      );
      
      if(response.data.data.code === 100){
        

        try{
        const patternCode = "xxgdc4qh2euhqbl";
        const omid =await farazSendPattern( patternCode, "+983000505", findPay.ClientPhone, {link:"https://gmhotel.ir/pdf/"+findPay.ReserveId, reserve:findPay.ReserveId });
       
      }catch(error){
       
        }
        
        const findReserveRequests = await Reserves.findAll({
          where:{
            ReserveId : findPay.ReserveId,
            Status : "pending"
          }
        })
        if(findReserveRequests !== null){
          for(let i = 0 ; i < findReserveRequests.length ; i++){
            const response = await axios.post('http://192.168.1.2:84/HotelReservationWebService.asmx', 
  `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
      <postingPaymnets xmlns="http://tempuri.org/">
      <bookingNumber>${findReserveRequests[i].Tariana}</bookingNumber>
      <postingCode>121212</postingCode>
      <price>${(findReserveRequests[i].Price * findReserveRequests[i].AccoCount)}</price>
    </postingPaymnets>
      </soap:Body>
  </soap:Envelope>`, {
  headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://tempuri.org/postingPaymnets'
  }
})

      await Reserves.update({
        Status :"Paid",
      },{
        where:{
          ReserveId:findReserveRequests[i].ReserveId,
          Tariana : findReserveRequests[i].Tariana
        }
      }
      )
          }
          const patternCodeToOperator = "y606cvhv1bx07g9";
        await farazSendPattern( patternCodeToOperator, "+983000505", "09387829919", { reserve: findPay.ReserveId});
        await farazSendPattern( patternCodeToOperator, "+983000505", "09012222347", { reserve: findPay.ReserveId});
      }
        else{
          res.status(404).json({ error: 'An error occurred while making the request.' });
        }
        await Payments.update({
          Status : "Paid",
          TransactionCode:response.data.data.ref_id,
          CardPan : response.data.data.card_pan
  
        },
          {
            where:{
              AuthCode:req.body.authority
            }
          })
          
        
        
        res.json({status : "ok", ref_id : response.data.data.ref_id, reserveid : findPay.ReserveId})
      }else if(response.data.data.code === 101){
        res.json({status : "ok", ref_id : response.data.data.ref_id, reserveid : findPay.ReserveId})
      }
      else{
        res.status(404).json({ error: 'An error occurred while making the request.' });
      }
      
      
    }
    
    else{

      res.status(404).json({ error: 'An error occurred while making the request.' });
    }
    
  } catch (error) {

    res.status(404)
    // res.status(404).json({ error: 'An error occurred while making the request.' }).end();
    return;
  }
}
export const getpayments = async(req,res) => {
  try{
    const response = await Payments.findAll({})
    res.json(response)
  }catch{
    res.status(404)
  }
}
export const getReserves = async(req,res) =>{
  try{
    const response =await Reserves.findAll({})
    res.json(response)
  }catch(error){
    res.status(404)
  }
}

export const manualcancel = async(req,res) =>{
  try{
    const response = await Reserves.update({
      Status : "کنسل : " + req.body.User
    },{
      where:{
        ReserveId : req.body.reserveId,
        Status : "pending"
      }
    }
    )
    //res.json(response)
    if(response[0] === 1){
      const findtarianacode = await Reserves.findAll({
        where:{
          ReserveId : req.body.reserveId
        }
      })
      const responseTarianaFinal = await axios.post('http://192.168.1.2:84/HotelReservationWebService.asmx/CancelBooking',{
                      PrimaryKey: "0S9T2QDG8C2dG7BxrLAFdwldpMuHE0Pat4KWiHVq0SU=",
                      BookingNumber : findtarianacode[0].Tariana
                      
                    })
                    
                   if(responseTarianaFinal.data.d === "Succeeded"){
                    res.json(1)
                    
                   }else{
                    
                    res.json(0)
                   }
    }else{
      res.json(0)
      
    }
  }catch(error){
    res.status(404)
  }
}