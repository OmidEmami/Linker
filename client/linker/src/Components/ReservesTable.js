import React,{useEffect,useState} from 'react';
import ReservesTableComponent from './ReservesTableComponent';
import axios from "axios"
import LoadingComp from './LoadingComp';
import { notify } from './toast';
import { useSelector } from "react-redux";



const ReservesTable = () => {
  const realToken = useSelector((state) => state.tokenReducer.token);
    const [data,setData] = useState([]);
    
    const [isLoading, setIsLoading] = useState(false)
      useEffect(() => {
       
        const fetchData=async()=>{
            try{
              setIsLoading(true)
                const response = await axios.get("https://gmhotel.ir/api/getReserves",{
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
    <div >
      {isLoading && <LoadingComp />}
    <h3 style={{direction:"rtl"}}>لینک های ارسال شده</h3>
      {data.length > 0 ? <ReservesTableComponent data={data} /> : <p>Loading...</p>}
    </div>
  );
};

export default ReservesTable;