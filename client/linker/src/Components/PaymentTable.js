import React,{useEffect,useState} from 'react';
import PaymentTableComponent from './PaymentTableComponent';
import axios from "axios"
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import LoadingComp from './LoadingComp';
import { notify } from './toast';
const PaymentTable = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [data,setData] = useState([]);
    const history = useHistory();
    const [token,setToken] = useState('')
    const [expire, setExpire] = useState('')

              const refreshToken = async () => {
                try {
                  setIsLoading(true)
                    const response = await axios.get('http://localhost:3001/api/token');
                    
                    setToken(response.data.accessToken);
                    const decoded = jwt_decode(response.data.accessToken);
                    setExpire(decoded.exp);
                    setIsLoading(false)
                } catch (error) {
                  setIsLoading(false)
                    if (error.response) {
                        history.push("/");
                    }
                }
              }
              
              const axiosJWT = axios.create();
              
              axiosJWT.interceptors.request.use(async (config) => {
                const currentDate = new Date();
                if (expire * 1000 < currentDate.getTime()) {
                  setIsLoading(true)
                    const response = await axios.get('http://localhost:3001/api/token');
                    config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                    setToken(response.data.accessToken);
                    const decoded = jwt_decode(response.data.accessToken);
                    setExpire(decoded.exp);
                }
                return config;
              }, (error) => {
                setIsLoading(false)
                Promise.reject(error);
                return 
              });
      useEffect(() => {
      refreshToken()
        const fetchData=async()=>{
            try{
                const response = await axios.get("http://localhost:3001/api/getpayments",{
                  headers:{
                    Authorization: `Bearer ${token}`
                  }
                })
                setData(response.data)
            }catch(error){
              notify('خطا در اتصال به شبکه', 'error')
            }
            
            }
            if(token !== ''){
              fetchData();
            }
                
              
              }, [token]);
  return (
    <div>
      {isLoading && <LoadingComp />}
     <h3 style={{direction:"rtl"}}>تمامی پرداخت های انجام شده</h3>
      {data.length > 0 ? <PaymentTableComponent data={data} /> : <p>Loading...</p>}
    </div>
  );
};

export default PaymentTable;