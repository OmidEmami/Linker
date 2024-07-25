import React,{useEffect,useState} from 'react';
import PaymentTableComponent from './PaymentTableComponent';
import axios from "axios"

import LoadingComp from './LoadingComp';
import { notify } from './toast';
import { useSelector } from "react-redux";
const PaymentTable = () => {
  
const realToken = useSelector((state) => state.tokenReducer.token);
    const [isLoading, setIsLoading] = useState(false)
    const [data,setData] = useState([]);
  
      useEffect(() => {
        const fetchData=async()=>{
          setIsLoading(true)
            try{
                const response = await axios.get("http://localhost:3001/api/getpayments",{
                  headers:{
                    Authorization: `Bearer ${realToken.realToken}`
                  }
                })
                setData(response.data)
                setIsLoading(false)
            }catch(error){
              notify('خطا در اتصال به شبکه', 'error')
              setIsLoading(false)
            }
            
            }
            if(realToken.realToken !== ''){
              fetchData();
            }
                
              
              }, [realToken.realToken]);
  return (
    <div>
      {isLoading && <LoadingComp />}
     <h3 style={{direction:"rtl"}}>تمامی پرداخت های انجام شده</h3>
      {data.length > 0 ? <PaymentTableComponent data={data} /> : <p>Loading...</p>}
    </div>
  );
};

export default PaymentTable;