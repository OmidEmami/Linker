import React, { useEffect, useState } from "react";
import { useLocation,useHistory } from 'react-router-dom';
import queryString from 'query-string';
import axios from "axios"
import { useSelector } from 'react-redux';

const CheckOut = () =>{
    const location = useLocation();
    const history = useHistory();
    const queryParams = queryString.parse(location.search);
    const [showSuccess ,setShowSuccess] = useState(false);
    const [reserveId, setReserveId] = useState();
    const [paymentId , setPaymentId] = useState();
    const [randomreservenumber ,setrandomreservenumber ] = useState();
    // Access individual query parameters
    const authority = queryParams.Authority;
    const status = queryParams.Status;
    useEffect(() => {
      
const fetchData=async()=>{
    
    try{
      
        const getPaymentData = await axios.post("http://localhost:3001/toPaynd",{
            authority : authority,

        })
        console.log(getPaymentData)
        
           
        
        
        }catch(error){
        console.log(error)
    }
    }
        fetchData();
      
      }, []);
      const generatePdf = async() =>{
        const getDataReserves = await axios.post("http://localhost:3001/getReserveInfoToGeneratePdf",{
            authority : authority
        })
        const temp = JSON.parse(getDataReserves.data[0].ReserveObj);
        console.log(temp)
        history.push("./pdf/"+ randomreservenumber)
      }
    return(
        <>
        {showSuccess ?
         <div>
            <br></br><p>پرداخت با موفقیت انجام شد</p>
            <p>شماره پیگیری پرداخت :{paymentId} </p>
            <p>شماره رزرو  هتل : {reserveId.map((value,index)=>(
                <p key={index}>شماره رزرو اتاق : {value}</p>
            ))}</p>
            <button onClick={generatePdf}>دریافت تاییدیه</button>
        </div> : <p>در حال ثبت رزرو</p>}
        
        </>
    )
}
export default CheckOut;