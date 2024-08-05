import ReservesMiddleWare from "../Models/ReservesMiddleWare.js";
import FileHolder from "../Models/FileHolder.js";
import PaymentConf from "../Models/PaymentConf.js";
import axios from "axios"
export const ConfMiddleReserve = async(req,res) =>{
    const reserveId = req.body.reserveId;
    
    try{
        const responseReservesMiddleware = await ReservesMiddleWare.findAll({
            where:{
                ReserveId : reserveId
            }
        })
        const responsePaymentConf = await PaymentConf.findAll({
            where:{
                ReserveId : reserveId
            }
        })
        res.json({responseReservesMiddleware,responsePaymentConf})
    }catch(error){
        
    }
}
export const GetMiddleReservePaymentData = async (req,res) =>{
    try {
        const reserveId = req.body.reserveId
        const fileHolders = await FileHolder.find({ ReserveId: reserveId });
        if (fileHolders.length === 0) {
            return res.send('No files found for the specified ReserveId');
          }
      
          const fileMetadata = fileHolders.map(fileHolder => ({
            id: fileHolder._id,
            reserveId: fileHolder.ReserveId,
            isConfirmed: fileHolder.isConfirmed,
            file:fileHolder.file,
            paidAmount : fileHolder.paidAmount,
            transactionCode : fileHolder.transactionCode
          }));
      
          res.json(fileMetadata);
        } catch (error) {
          console.error('Error fetching file metadata:', error);
          res.status(500).send('Internal server error');
        }
}
export const Downloadreceit = async (req, res) => {
    try {
        const fileId = req.body.id;
        const fileHolder = await FileHolder.findById(fileId);
    
        if (!fileHolder) {
            return res.status(404).send('File not found');
        }

        let fileName = fileHolder.fileName || 'download';
        let fileExtension = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : null;

        let mimeType = 'application/octet-stream'; 
        switch (fileExtension) {
            case 'pdf':
                mimeType = 'application/pdf';
                break;
            case 'jpg':
            case 'jpeg':
                mimeType = 'image/jpeg';
                break;
            case 'png':
                mimeType = 'image/png';
                break;
            default:
                mimeType = fileHolder.mimeType || 'application/octet-stream';
                fileName += fileExtension ? '' : (mimeType.split('/')[1]); 
        }

        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', mimeType);
    
        res.send(fileHolder.file);
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).send('Internal server error');
    }
}

export const GetMiddleReserves = async (req,res) =>{
    try{
        const responseReceitsData = await ReservesMiddleWare.findAll({})
        res.json(responseReceitsData)
    }catch(error){
        res.status(404).send(error)
    }
}
export const confirmreceitreserve = async (req,res) => {
    const reserveId = req.body.reserveId;
    const id = req.body.id
const updateData = {
  isConfirmed: 'true',
  paidAmount: req.body.paidAmount,
  transactionCode : req.body.transactionCode
};
    try{
        const updatedRecord = await FileHolder.findOneAndUpdate(
            { ReserveId: reserveId,
                _id : id
             },
            updateData,
            { new: true } // This option returns the modified document rather than the original
          );
      
          if (!updatedRecord) {
            console.log('Record not found');
            res.status(500).send('Internal server error');
          }
      
          console.log('Record updated successfully:', updatedRecord);

          const findReserveTar = await ReservesMiddleWare.findOne({
            where:{
                ReserveId : reserveId
            }
          })
          const response = await axios.post('http://37.255.231.141:84/HotelReservationWebService.asmx', 
            `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                <postingPaymnets xmlns="http://tempuri.org/">
                <bookingNumber>${findReserveTar.Tariana}</bookingNumber>
                <postingCode>012012012</postingCode>
                <price>${req.body.paidAmount}</price>
              </postingPaymnets>
                </soap:Body>
            </soap:Envelope>`, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'http://tempuri.org/postingPaymnets'
            }
          })
          res.json(updatedRecord);
        
          
        
    }catch(error){
        console.error('Error updating record:', error);
        res.status(500).send('Internal server error');
    }
}