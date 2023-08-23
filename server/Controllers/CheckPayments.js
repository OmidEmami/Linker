import Reserves from "../Models/Reserves.js";
import Payments from "../Models/Payments.js"
import axios from "axios";
import moment from 'jalali-moment' ;
import request from "request"
import { farazSendPattern } from "@aspianet/faraz-sms";
export const toPaySt = async(req,res)=>{
  try{
    const response = await axios.post('https://api.zarinpal.com/pg/v4/payment/request.json', {
        merchant_id: '78d95f82-bbca-4a67-a11a-4e3ec2bfca63',
        callback_url: 'http://87.248.152.131/checkout',
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
        merchant_id: '78d95f82-bbca-4a67-a11a-4e3ec2bfca63',
        amount: findPay.ClientAmount,
        authority:req.body.authority
      }
      );
      console.log(response.data)
      if(response.data.data.code === 100 || response.data.data.code === 101){
        

        try{
        const patternCode = "xxgdc4qh2euhqbl";
        const omid =await farazSendPattern( patternCode, "+983000505", findPay.ClientPhone, {link:"https://gmhotel.ir/c/"+findPay.ReserveId, reserve:findPay.ReserveId });
       
      }catch(error){console.log(error) 
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
        await farazSendPattern( patternCodeToOperator, "+983000505", "09120086619", { reserve: findPay.ReserveId});
        }
        else{
          res.status(404).json({ error: 'An error occurred while making the request.' });
        }
      }else{
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
        
      
      
      res.json({status : "ok", ref_id : response.data.data.ref_id})
      
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