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
const MeCaLinker = ()=> {
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
            const response = await axios.post('http://localhost:3001/api/sendhamam',
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
            const response = await axios.post('http://localhost:3001/api/sendrestaurantmenu',
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
            const response = await axios.post('http://localhost:3001/api/sendroomcatalog',{
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
    <div className={styles.header}><img src={Logo} alt='قصرمنشی'/></div>
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
    <div className={styles.formContainer}>
        <h2>ارسال کاتالوگ حمام</h2>
        <form onSubmit={(e)=>sendHamamSms(e)}>
        <label>شماره تماس</label>
        <input placeholder='شماره تماس مهمان' required type='number' value={hamamPhone} onChange={(e)=>setHamamPhone(e.target.value)}></input>
        <button type='submit'>ارسال</button>
        </form>
    </div>
    </div>
    <div className={styles.mainDiv}>
    <div className={styles.formContainer}>
        <h2>ارسال کاتالوگ اتاق ها</h2>
        <form onSubmit={(e)=>sendRoomCatalog(e)}>
            <label>نام مهمان</label>
            <input required type='text' placeholder='نام مهمان' value={guestName} onChange={(e)=>setGuestName(e.target.value)}></input>
            <label>شماره تماس</label>
            <input required type='number' placeholder='شماره تماس' value={roomPhone} onChange={(e)=>setRoomPhone(e.target.value)}></input>
            <label>تاریخ ورود</label>
        <DatePicker  required
           digits={digits}
            value={values}
            onChange={value=>{setValues(value)}}  
             calendar={persian}
             locale={persian_fa}
             calendarPosition="bottom-right"
             format="DD/MM/YYYY"
             placeholder='تاریخ ورود '
           
           ></DatePicker>
           
            <button type='submit'>ارسال</button>
        </form>
    </div>
    </div>
    </>
  )
}
export default MeCaLinker