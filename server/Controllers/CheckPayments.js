import Reserves from "../Models/Reserves.js";
import Payments from "../Models/Payments.js"
import axios from "axios";
import moment from 'jalali-moment' 
export const toPaySt = async(req,res)=>{
    const response = await axios.post('https://api.zarinpal.com/pg/v4/payment/request.json', {
        merchant_id: '78d95f82-bbca-4a67-a11a-4e3ec2bfca63',
        callback_url: 'http://localhost:3000/checkout',
        amount : req.body.amount,
        description : req.body.description,
        metadata : req.body.metadata

      });
      if(response.data.data.code === 100 && response.data.data.message === "Success" ){
        res.json(response.data)
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
      }
}