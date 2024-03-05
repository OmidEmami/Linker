import React,{useState} from 'react'
import axios from "axios"
import LoadingComp from "../LoadingComp.js"
import { notify } from "../toast";
import DatePicker, { DateObject}from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import moment from 'jalali-moment';
import styles from "./MeCaLinker.module.css"
import Logo from "../../assests/logo.png"
const ForAmir = ()=> {
    const [restaurantPhone, setRestaurantPhone] = useState('');
    const [hamamPhone, setHamamPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [roomPhone, setRoomPhone] = useState('');
    //const [checkinDate, setCheckInDate] = useState('');
    const [guestName, setGuestName] = useState('');
    const date = new DateObject({ calendar: persian, locale: persian_fa });
    const [values, setValues] = useState([]);
    const digits=["0","1","2","3","4","5","6","7","8","9"];
    const sendHamamSms = async(e)=>{
        e.preventDefault();
        try{
            setLoading(true)
            const response = await axios.post('http://gmhotel.ir/api/sendhamam',
            {
                Phone : hamamPhone
            }
            )
            if(response.data === "ok"){
            setLoading(false)
            notify( "لینک ارسال شد", "success")
            setHamamPhone('')
            }else{
            setLoading(false)
            notify( "خطا", "error")
            }
        }catch(error){
            setLoading(false)
            notify( "خطا", "error")
        }
    }
    const sendRestaurantSms = async(e)=>{
        e.preventDefault();
        try{
            setLoading(true)
            const response = await axios.post('http://gmhotel.ir/api/sendrestaurantmenu',
            {
                Phone : restaurantPhone
            }
            )
            if(response.data === "ok"){
                setLoading(false)
                notify( "لینک ارسال شد", "success")
                setRestaurantPhone('')
                }else{
                setLoading(false)
                notify( "خطا", "error")
                }
        }catch(error){
            setLoading(false)
            notify( "خطا", "error")
        }
    }
    
    const sendRoomCatalog = async(e)=>{
        setLoading(true)
        e.preventDefault();
        const entrydate = values[0].format();
        try{
            const response = await axios.post('http://gmhotel.ir/api/sendroomcatalog',{
                date : entrydate,
                name : guestName,
                phone : roomPhone 
            })
            if(response.data === "ok"){
            setLoading(false)
            notify( "لینک ارسال شد", "success")
            setRoomPhone('')
            setGuestName('')
            setValues('')
            
        }
            else{
                setLoading(false)
                notify( "خطا", "error")
            }
        }catch(error){
            setLoading(false)
            notify( "خطا", "error")
        }
        
    }
  return (
    <>
    
        {loading && <LoadingComp />}
        <div className={styles.mainDiv}>
    <div className={styles.formContainer}>
        <h2>ارسال منو رستوران</h2>
        <form onSubmit={(e)=>sendRestaurantSms(e)}>
        <label>شماره تماس</label>
        <input placeholder='شماره تماس مهمان' required type='number' value={restaurantPhone} onChange={(e)=>setRestaurantPhone(e.target.value)}></input>
        <button type='submit'>ارسال</button>
        </form>
    </div>
    
    </div>
    
    </>
  )
}
export default ForAmir