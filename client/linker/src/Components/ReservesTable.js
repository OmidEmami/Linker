import React,{useEffect,useState} from 'react';
import ReservesTableComponent from './ReservesTableComponent';
import axios from "axios"
const ReservesTable = () => {
    const [data,setData] = useState([]);
      useEffect(() => {
      
        const fetchData=async()=>{
            try{
                const response = await axios.get("http://localhost:3001/api/getReserves")
                setData(response.data)
            }catch(error){
    
            }
            
            }
                fetchData();
              
              }, []);
  return (
    <div>
    <h3>لینک های ارسال شده</h3>
      {data.length > 0 ? <ReservesTableComponent data={data} /> : <p>Loading...</p>}
    </div>
  );
};

export default ReservesTable;