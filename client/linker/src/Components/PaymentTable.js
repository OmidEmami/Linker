import React,{useEffect,useState} from 'react';
import PaymentTableComponent from './PaymentTableComponent';
import axios from "axios"
const PaymentTable = () => {
    const [data,setData] = useState([]);
      useEffect(() => {
      
        const fetchData=async()=>{
            try{
                const response = await axios.get("http://localhost:3001/api/getpayments")
                setData(response.data)
            }catch(error){
    
            }
            
            }
                fetchData();
              
              }, []);
  return (
    <div>
     <h3>تمامی پرداخت های انجام شده</h3>
      {data.length > 0 ? <PaymentTableComponent data={data} /> : <p>Loading...</p>}
    </div>
  );
};

export default PaymentTable;