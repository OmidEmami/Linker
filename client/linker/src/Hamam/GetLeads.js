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
  const hamamTypes = [
    {name : 'menHamam', value:"حمام مردانه"},
    {name : 'womenHamam', value:"حمام زنانه"},
    {name : 'massage', value:"ماساژ"},
    {name : 'traditionalHamam', value:"دلاکی سنتی"}
]
const [hamamType,setHamamType] = useState('') 
    const date = new DateObject({ calendar: persian, locale: persian_fa });
  const [values, setValues] = useState([]);
  const digits=["0","1","2","3","4","5","6","7","8","9"];
  const [isLoading, setIsLoading] = useState(false);
  const [timeValue, setTimeValue] = useState();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
 
  
  const generateNewLeads = async (e) =>{
    e.preventDefault();
    setIsLoading(true)
    var dates = [];
    for(let i = 0 ; i < values.length ; i++){
      dates = [...dates, moment.from(values[i].format(), 'fa', 'DD/MM/YYYY').format('jYYYY-jMM-jDD')]
    }
    
    try{
      const response = await axios.post("http://localhost:3001/api/createNewLead",{
            FullName : fullName,
            Phone: phoneNumber,
            HamamType:hamamType.join(','),
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
  const changeHamamTypes = (e) =>{
    if(e.target.checked){
    setHamamType([...hamamType , e.target.value])
    }else{
      const updatedItems = hamamType.filter(item => item !== e.target.value);
      setHamamType(updatedItems)
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
            <input required value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder='نام مهمان' type='text' />
        <label>شماره تماس</label>
        <input required type="number" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} placeholder='شماره تماس'  />
        
        {/* <select multiple size={3} value={hamamType} onChange={(e)=>setHamamType(e.target.value)} required>
                                        <option  enabled >انتخاب نوع سرویس حمام</option>
                                        <option value="قرق مردانه">قرق مردانه</option>
                                        <option value="قرق زنانه">قرق زنانه</option>
                                        <option value="حمام عشاق">حمام عشاق</option>
                                        <option value="ماساژ">ماساژ</option>
                       </select> */}
                        
                       <label>انتخاب نوع سرویس حمام</label>
      
                                  {hamamTypes.map((info,index)=>(
                                    <>
                                    <label for={info.name}>{info.value}</label>
                                    <input type='checkbox' name={info.name} value={info.value} onChange={(e)=>changeHamamTypes(e)}/>
                                    </>
                                  ))}
                                  {/* <input type="checkbox" id="hamam1" name="menhamam" value="Bike" />
                                  <label for="vehicle1"> I have a bike</label>
                                  <input type="checkbox" id="hamam2" name="womenhamam" value="Car" />
                                  <label for="vehicle2"> I have a car</label>
                                  <input type="checkbox" id="hamam3" name="massage" value="Boat" />
                                  <label for="vehicle3"> I have a boat</label>
                                  <input type="checkbox" id="hamam3" name="massage" value="Boat" />
                                  <label for="vehicle3"> I have a boat</label> */}
                      <label>تاریخ پیشنهادی دریافت خدمات را وارد کنید</label>
                      <span style={{fontSize:"12px",color:"white",padding:"3px"}}>می توانید چند تاریخ انتخاب کنید</span>
                       <DatePicker 
                       required 
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
