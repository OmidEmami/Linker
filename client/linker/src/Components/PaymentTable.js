import React,{useEffect,useState} from 'react';
import PaymentTableComponent from './PaymentTableComponent';
import axios from "axios"
// import jwt_decode from "jwt-decode";
// import { useHistory } from "react-router-dom";
import LoadingComp from './LoadingComp';
import { notify } from './toast';
import { useSelector } from "react-redux";
const PaymentTable = () => {
  
const realToken = useSelector((state) => state.tokenReducer.token);
    const [isLoading, setIsLoading] = useState(false)
    const [data,setData] = useState([]);
    // const history = useHistory();
    // const [token,setToken] = useState('')
    // const [expire, setExpire] = useState('')

              // const refreshToken = async () => {
              //   try {
                  
              //       const response = await axios.get('https://gmhotel.ir/api/token');
                    
              //       setToken(response.data.accessToken);
              //       const decoded = jwt_decode(response.data.accessToken);
              //       setExpire(decoded.exp);
                    
              //   } catch (error) {
                  
              //       if (error.response) {
              //           history.push("/");
              //       }
              //   }
              // }
              
              // const axiosJWT = axios.create();
              
              // axiosJWT.interceptors.request.use(async (config) => {
              //   const currentDate = new Date();
              //   if (expire * 1000 < currentDate.getTime()) {
                  
              //       const response = await axios.get('https://gmhotel.ir/api/token');
              //       config.headers.Authorization = `Bearer ${response.data.accessToken}`;
              //       setToken(response.data.accessToken);
              //       const decoded = jwt_decode(response.data.accessToken);
              //       setExpire(decoded.exp);
              //   }
              //   return config;
              // }, (error) => {
                
              //   Promise.reject(error);
              //   return 
              // });
      useEffect(() => {
      // refreshToken();
        const fetchData=async()=>{
          setIsLoading(true)
            try{
                const response = await axios.get("https://gmhotel.ir/api/getpayments",{
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