import React, { useEffect, useState } from "react";
import { useLocation,useHistory } from 'react-router-dom';
import queryString from 'query-string';
import axios from "axios"
import LoadingComp from "./LoadingComp";
import { notify } from "./toast";
import CheckOutMain from "./CheckOutMain";

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
      console.log(authority)
        const fetchData=async()=>{
    
    try{
      setIsLoading(true)
        const getPaymentData = await axios.post("http://87.248.152.131/api/payfinal",{
            authority : authority,

        })
        console.log(getPaymentData)
        setPaymentData(getPaymentData.data)
        setIsLoading(false)
        notify( "پرداخت موفق", "success")
        
        
        }catch(error){
            console.log(error)
       setIsLoading(false)
       notify( "خطا", "error")
    }
    }
        fetchData();
      
      }, []);
      const generatePdf = async() =>{
        const getDataReserves = await axios.post("http://87.248.152.131/api/getReserveInfoToGeneratePdf",{
            authority : authority
        })
        const temp = JSON.parse(getDataReserves.data[0].ReserveObj);
        console.log(temp)
        history.push("./pdf/"+ randomreservenumber)
      }
    return(
        <>
        {isLoading && <LoadingComp />}
        {paymentData.status === "ok"
            ? <><div>پرداخت موفق</div>
        شماره پیگیری : {paymentData.ref_id}
            </>:<div></div>
        }
        {/* <CheckOutMain data={queryParams} /> */}
        </>
    )
}
export default CheckOut;


