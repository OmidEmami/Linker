import React,{useState,useEffect} from 'react'
import axios from "axios";
import { notify } from './toast';
import LoadingComp from './LoadingComp';

import { useSelector } from "react-redux";

const ManualCancel =()=> {
    const [reserveId, setReserveId] = useState('');
    const [loading, setIsLoading] = useState(false);
    
    const realToken = useSelector((state) => state.tokenReducer.token);

    const cancelReserve = async(e)=>{
        e.preventDefault();
        setIsLoading(true)
        try{
            const response = await axios.post("http://localhost:3001/api/manualcancel",{
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