import React,{useState} from 'react'
import axios from "axios";
import { notify } from './toast';
import LoadingComp from './LoadingComp';
const ManualCancel =()=> {
const [reserveId, setReserveId] = useState('');
const [loading, setIsLoading] = useState(false)
    const cancelReserve = async(e)=>{
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:3001/api/manualcancel",{
                reserveId : reserveId
            })
            
            if(response.data[0] === "1"){
                notify( "موفق", "success")
            }else{
                notify("ناموفق", "error")
            }
        }catch(error){
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