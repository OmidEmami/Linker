import React, { useEffect, useState } from "react";
import { useLocation,useHistory } from 'react-router-dom';
import queryString from 'query-string';
import axios from "axios"
import LoadingComp from "./LoadingComp";
import { notify } from "./toast";
import logo from "../assests/logo.png"
import done from "../assests/done.gif"
const CheckOut = () =>{
    const location = useLocation();
    const history = useHistory();
    const queryParams = queryString.parse(location.search);
    const [showSuccess ,setShowSuccess] = useState(false);
    const [reserveId, setReserveId] = useState();
    const [paymentId , setPaymentId] = useState();
    const [randomreservenumber ,setrandomreservenumber ] = useState();
    const [isLoading , setIsLoading] = useState(false);
    const [paymentData, setPaymentData] = useState([])
    // Access individual query parameters
    const authority = queryParams.Authority;
    const status = queryParams.Status;
    useEffect(() => {
     
        const fetchData=async()=>{
    
    try{
      setIsLoading(true)
        const getPaymentData = await axios.post("http://gmhotel.ir/api/payfinal",{
            authority : authority,

        })
        
        setPaymentData(getPaymentData.data)
        setIsLoading(false)
        notify( "پرداخت موفق", "success")
        
        
        }catch(error){
          
       setIsLoading(false)
       notify( "خطا", "error")
    }
    }
        fetchData();
      
      }, []);
      const getConfirm = () =>{
        history.push("/pdf/"+paymentData.reserveid)
      }
    return(
        <>
        <div style={{display:"flex",flexDirection:"column",justifyContent: "center",
    alignItems: "center"}}>
      <div style={{display:"flex",flexDirection:"column",justifyContent: "center",
    alignItems: "center", backgroundColor:"#f0f2f0", width:"100%"}}>
      <img style={{padding:"5px"}} width="10%" src={logo} alt="logo" />
      </div>
        {isLoading && <LoadingComp />}
        {paymentData.status === "ok"
            ? <>
            <div>پرداخت موفق</div>
            <h3>منتظر دیدار شما هستیم</h3>
            <div style={{display:"flex", flexDirection:"row", justifyContent: "center",
    alignItems: "center", direction:"rtl", columnGap:"3rem"}}>
      <img src={done} alt="گیف" /> </div>
            <div>پرداخت موفق</div>
            <div>
              
        شماره پیگیری : {paymentData.ref_id}
         
         </div>
            </>:<div>در انتظار دریافت پاسخ</div>}
            
           
            
        
            {paymentData.status === "ok" ? <><div style={{padding:"50px"}}><button style={{backgroundColor:"#D1AF6E", border:"none", borderRadius:"2px",padding:"5px"}} onClick={getConfirm}>دریافت تاییدیه رزرو</button></div>
            </>:<div>در حال بارگذاری</div>}

        
        </div>
        </>
    )
}
export default CheckOut;


