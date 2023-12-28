import React,{useState,useEffect} from 'react'
import axios from "axios";
import { notify } from './toast';
import LoadingComp from './LoadingComp';
// import jwt_decode from "jwt-decode";
// import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const ManualCancel =()=> {
    const [reserveId, setReserveId] = useState('');
    const [loading, setIsLoading] = useState(false);
    // const [token, setToken] = useState('');
    // const [expire, setExpire] = useState('');
    // const [userName, setUserName] = useState('')
    // const history = useHistory();
    const realToken = useSelector((state) => state.tokenReducer.token);
    // useEffect(() => {
    //   refreshToken();
      
       
    // }, []);
//     const refreshToken = async () => {
//       try {
//           const response = await axios.get('https://gmhotel.ir/api/token');
          
//           setToken(response.data.accessToken);
//           const decoded = jwt_decode(response.data.accessToken);
//           setUserName(decoded.name)
//           setExpire(decoded.exp);
//       } catch (error) {
        
//           if (error.response) {
//               history.push("/");
//           }
//       }
//   }

//   const axiosJWT = axios.create();

//   axiosJWT.interceptors.request.use(async (config) => {
//       const currentDate = new Date();
//       if (expire * 1000 < currentDate.getTime()) {
//           const response = await axios.get('https://gmhotel.ir/api/token');
//           config.headers.Authorization = `Bearer ${response.data.accessToken}`;
//           setToken(response.data.accessToken);
//           const decoded = jwt_decode(response.data.accessToken);
//           setUserName(decoded.name)
//           setExpire(decoded.exp);
//       }
//       return config;
//   }, (error) => {
//       return Promise.reject(error);
//   });
    const cancelReserve = async(e)=>{
        e.preventDefault();
        setIsLoading(true)
        try{
            const response = await axios.post("https://gmhotel.ir/api/manualcancel",{
                reserveId : reserveId,
                User : realToken.userName
            },{
                headers:{
                    Authorization: `Bearer ${realToken.realToken}`
                  }
            }
            
            )
            
            if(response.data === 1){
                notify( "موفق", "success")
            }else{
                notify("ناموفق", "error")
            }
            setIsLoading(false)
        }catch(error){
            setIsLoading(false)
            notify("ناموفق", "error")
        }
    }
  return (
    <div>
        {loading && <LoadingComp />}
        <form style={{display:"flex", flexDirection:"column", columnGap:"8px", padding:"10px", margin:"10px",rowGap:"10px", direction:"rtl"}} onSubmit={(e)=>cancelReserve(e)}>
            <label>شماره رزرو سیستمی(4 رقمی)</label>
            <input placeholder='شماره رزرو سیستمی (4 رقمی)' type='text' value={reserveId} onChange={(e)=>setReserveId(e.target.value)} />
            <button type='submit'>
                کنسل کردن رزرو
            </button>
        </form>
    </div>
  )
}
export default ManualCancel;