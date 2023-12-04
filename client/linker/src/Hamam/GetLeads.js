import React,{useState,useEffect} from 'react'
import DatePicker, { DateObject,getAllDatesInRange }from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import moment from 'jalali-moment';
import axios from 'axios';
import { notify } from "../Components/toast";
import styles from "./GetLeads.module.css";
import Logo from "../assests/logoBrown.png";
import Tizer from "../assests/tizer.mp4";
import LoadingComp from '../Components/LoadingComp';

function GetLeads() {
    const date = new DateObject({ calendar: persian, locale: persian_fa });
  const [values, setValues] = useState([]);
  const digits=["0","1","2","3","4","5","6","7","8","9"];
  const [isLoading, setIsLoading] = useState(false);
  const [timeValue, setTimeValue] = useState();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hamamType, setHamamType] = useState('');
  const generateNewLeads = async (e) =>{
    e.preventDefault();
    setIsLoading(true)
    var dates = [];
    for(let i = 0 ; i < values.length ; i++){
      dates = [...dates, moment.from(values[i].format(), 'fa', 'DD/MM/YYYY').format('jYYYY-jMM-jDD')]
    }
    try{
      const response = await axios.post("https://gmhotel.ir/api/createNewLead",{
            FullName : fullName,
            Phone: phoneNumber,
            HamamType:hamamType,
            PreferedDate:dates.toString()
            
      })
      if(response.data.msg === 'newLeadGenerated'){
        setIsLoading(false)
        notify( "اطلاعات شما با موفقیت ثبت شد", "success")
      }else{

        setIsLoading(false)
        notify( "خطا", "error")
      }
    }catch(error){
      setIsLoading(false)
      notify( "خطا", "error")
    }
  }
  return (
    <div className={styles.mainContainer}>
      {isLoading && <LoadingComp />}
      <div className={styles.HeaderCustomer}>
        <img className={styles.LogoContainer} alt='logo' src={Logo} />
      </div>
      <div className={styles.TizerContainer}>
        <h3>گرمابه سنتی در اصفهان</h3>
        <video controls src={Tizer} />
      </div>
      <div className={styles.FormContainer}>
        <p>مهمان عزیز با تکمیل فرم کوتاه زیر همکاران ما در قصرمنشی در اسرع وقت جهت راهنمایی شما برای استفاده از حمام سنتی قصرمنشی تماس می گیریند</p>
        <form onSubmit={(e)=>generateNewLeads(e)}>
        <label>نام و نام خانوادگی</label>
            <input value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder='نام مهمان' type='text' />
        <label>شماره تماس</label>
        <input value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} placeholder='شماره تماس' type='text' />
        <label>انتخاب نوع سرویس حمام</label>
        <select value={hamamType} onChange={(e)=>setHamamType(e.target.value)} required>
                                        <option  enabled >انتخاب نوع سرویس حمام</option>
                                        <option value="قرق مردانه">قرق مردانه</option>
                                        <option value="قرق زنانه">قرق زنانه</option>
                                        <option value="حمام عشاق">حمام عشاق</option>
                                        <option value="ماساژ">ماساژ</option>
                       </select>
                      <label>تاریخ پیشنهادی دریافت خدمات را وارد کنید</label>
                      <span style={{fontSize:"12px",color:"white",padding:"3px"}}>می توانید چند تاریخ انتخاب کنید</span>
                       <DatePicker  
           digits={digits}
            value={values}
            onChange={value=>{setValues(value)
            }}
                style={{fontFamily:"Shabnam"}}
             calendar={persian}
             locale={persian_fa}
             calendarPosition="bottom-right"
             format="DD/MM/YYYY"
             placeholder='تاریخ پیشنهادی دریافت خدمات'
           ></DatePicker>
        <button type='submit'>ارسال درخواست</button>
        </form>
      </div>
    </div>
  )
}

export default GetLeads
