import ReceptionLeads from "../Models/ReceptionLeads.js";
import moment from "jalali-moment";
import DetailedCalls from "../Models/DetailedCalls.js";
import IncomingCallsCrm from "../Models/IncomingCallsCrm.js";
export const receptionGetRawLeads = async(req,res)=>{
      try{
       
        const response = await ReceptionLeads.findAll({})
       
        res.json(response)
        
      }catch(error){
                
       }
}
export const receptionModifyLead = async (req, res) => {
  const data = req.body.data;
  const results = [];

  for (let i = 0; i < data.length; i++) {
      try {
          const response = await ReceptionLeads.update({
              FullName: data[i].FullName,
              Phone: data[i].Phone,
              Date: data[i].Date,
              Status: data[i].Status,
              Description: data[i].Description,
              RequestType: data[i].RequestType,
              FinalResult: data[i].FinalResult,
          }, {
              where: { UniqueId: data[i].UniqueId }
          });
          results.push(response);
      } catch (error) {
          console.log(error);
          results.push(error);
      }
  }
  res.json({ results });
};

export const receptionPutRawLeads = async(req,res)=>{
  try{
    const response = await ReceptionLeads.create({
        UniqueId:Math.floor(Math.random() * 90000) + 10000,
        FullName : req.body.Name,
        Phone : req.body.Phone,
        Date :moment().locale('fa').format('YYYY/MM/DD HH:mm:ss'),
        Status : "Pending",
        User:req.body.User,
        RequestType : "َAccoReserve"
    })
            res.json(response)
  }catch(error){
            res.json(error)
   }
}
export const getCallsReport = async(req,res)=>{
  try{
    const response = await DetailedCalls.findAll({})
    res.json(response)
  }catch(error){

  }
}

export const regDataReceptionLeadSocket = async(req,res)=>{
  try{
    const response = await ReceptionLeads.create({
      
      UniqueId : req.body.callId,
      FullName  : req.body.guestName,
      Phone : req.body.phone,
      Date : req.body.lastcalldate,
      Status :"Pending",
      RequestType : "َAccoReserve",
      User :   req.body.User,
      LastCall : moment().locale('fa').format('YYYY/MM/DD')
          
          
          
        
    })
    res.json(response)
  }catch(error){
    res.json(error)
  }
}
export const getAllCallsReport = async(req,res)=>{
  try{
    const response = await IncomingCallsCrm.findAll({})
    res.json(response)
  }catch(error){
    res.json(error)
  }

}