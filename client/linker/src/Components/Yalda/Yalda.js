import React,{useState,useEffect} from 'react'
import DatePicker, { DateObject,getAllDatesInRange }from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import moment from 'jalali-moment';
import axios from 'axios';
import { notify } from "../toast";
import styles from "./Yalda.module.css";
import Logo from "../../assests/logo.png";
import Tizer from "../../assests/yalda.mp4";
import LoadingComp from '../../Components/LoadingComp';
import Anar from "../../assests/anarYalda.png";
import YaldaPoster from "../../assests/yaldaPoster.jpg"
function Yalda() {
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
        <div style={{display:"flex", flexDirection:"column",justifyContent: "center" , alignItems: "center"}}>
        <h3>ویژه برنامه شب یلدا در عمارت قصرمنشی</h3>
        <img src={Anar} alt='انار' width="15%" />
        </div>
        <video controls src={Tizer} poster="../../assests/yaldaPoster.jpg" />
      </div>
      <div className={styles.FormContainer}>
        <p>باهم و در کنار هم بلندترین شب سال را جشن می گیریم.</p>
        <p>قدمهایتان بر چشم ...</p>
        <p>هزینه ورودی و پذیرایی برای هر نفر 690 هزار تومان می باشد</p>
        <img src={YaldaPoster} alt='poster yalda' width="80%" />
      </div>
    </div>
  )
}

export default Yalda
