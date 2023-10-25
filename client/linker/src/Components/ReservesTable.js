import React,{useEffect,useState} from 'react';
import ReservesTableComponent from './ReservesTableComponent';
import axios from "axios"
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";

 



const ReservesTable = () => {
  const history = useHistory();
    const [data,setData] = useState([]);
    const [token,setToken] = useState('')
    const [expire, setExpire] = useState('')
      useEffect(() => {
        refreshToken();
        const fetchData=async()=>{
            try{
                const response = await axios.get("http://localhost:3001/api/getReserves",{
                  headers:{
                    Authorization: `Bearer ${token}`
                  }
                })
                setData(response.data)
            }catch(error){
    
            }
            
            }
            if(token !== ''){
            fetchData();
            }
              }, [token]);
              const refreshToken = async () => {
                try {
                    const response = await axios.get('http://localhost:3001/api/token');
                    console.log(response)
                    setToken(response.data.accessToken);
                    const decoded = jwt_decode(response.data.accessToken);
                   
                } catch (error) {
                    console.log(error)
                    if (error.response) {
                        history.push("/");
                    }
                }
              }
              
              const axiosJWT = axios.create();
              
              axiosJWT.interceptors.request.use(async (config) => {
                const currentDate = new Date();
                if (expire * 1000 < currentDate.getTime()) {
                    const response = await axios.get('http://localhost:3001/api/token');
                    config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                    setToken(response.data.accessToken);
                    const decoded = jwt_decode(response.data.accessToken);
                  
                }
                return config;
              }, (error) => {
                return Promise.reject(error);
              });
  return (
    <div >
    <h3 style={{direction:"rtl"}}>لینک های ارسال شده</h3>
      {data.length > 0 ? <ReservesTableComponent data={data} /> : <p>Loading...</p>}
    </div>
  );
};

export default ReservesTable;