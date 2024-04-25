import React,{useState, useEffect} from 'react';
import styles from "./CrmHeader.module.css";
import Logo from "../../assests/logoblue.png"
import Modal from 'react-modal';
import Button from '@mui/material/Button';
import axios from "axios";
import DatePicker, { DateObject,getAllDatesInRange }from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import moment from 'jalali-moment';
import stylesNd from "./CrmComponent.module.css";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import LoadingComp from '../LoadingComp';
import { notify } from '../toast';
function CrmHeader() {
  const [isLoading, setIsLoading] = useState(false)
  const m = moment();
  const history = useHistory();
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestRequestType, setGuestRequestType] = useState('');
  const digits=["0","1","2","3","4","5","6","7","8","9"];
  const [values, setValues] = useState('');
  const [AccoRequestType, setAccoRequestType] = useState('')
  const [ActionEghamat, setActionEghamat] = useState('');
  const [ActionEghamatZarfiat, setActionEghamatZarfiat] = useState('');
  const [otherAccoTypes, setOtherAccoTypes] = useState('')
  const [otherguestRequestType, setotherguestRequestType] = useState('');
  const [customerSource, setCustomerSource] = useState('');
  const [token, setToken] = useState('');
  const [regUser, setRegUser] = useState('');
  const [expire, setExpire] = useState('')
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '90%', // Adjust the width as needed
      overflow: 'auto',
      height:"90%", // This will make the content scrollable,
      borderRadius: "15px",
    },
  };
  const refreshToken = async () => {
    try {
      
        const response = await axios.get('https://gmhotel.ir/api/token');
        
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);

        setRegUser(decoded.name)
        setExpire(decoded.exp);
        
    } catch (error) {
      
        if (error.response) {
            history.push("/");
        }
    }
  }
  
  const axiosJWT = axios.create();
  
  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      
        const response = await axios.get('https://gmhotel.ir/api/token');
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
    
    Promise.reject(error);
    return 
  });
  useEffect(() => {
    refreshToken();
            }, []);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const startPopUpCrm = () =>{
    setIsModalOpen(true)
    console.log('test')
  }
  const regData = async(e) =>{
    e.preventDefault();
    const callid = Math.floor(Math.random() * 90000) + 10000;
    try{
      setIsLoading(true)
      const response = await axios.post('https://gmhotel.ir/api/setmanualcalllead',{
            Phone : guestPhone,
            LastCall : m.locale('fa').format('YYYY/MM/DD HH:mm:ss'),
            FullName : guestName,
            CallId : callid,
            RequestType : guestRequestType,
            customerSource: customerSource,
            RegUser :regUser ,
            Section : "2",
            RequestDateAcco  :  values !== "" && values.format('YYYY/MM/DD'),
            AccoRequestType : AccoRequestType,
            ActionEghamat : ActionEghamat,
            ActionEghamatZarfiat : ActionEghamatZarfiat,
            OtherAccoTypes : otherAccoTypes,
            OtherguestRequestType : otherguestRequestType
      })
setIsLoading(false)
notify("موفق",'success')
setIsModalOpen(false)
    }catch(error){
setIsLoading(false)
notify('خطا','error')
    }
  }
  const closeModalRegData = () =>{
    setIsModalOpen(false)
  }
  return (
    <>
    {isLoading && <LoadingComp/>}
    <Modal
     isOpen={isModalOpen}
     
     onRequestClose={()=>setIsModalOpen(false)}
     style={customStyles}
     contentLabel="Example Modal"
   >
     <div style={{display:"flex", flexDirection:"column",justifyContent: "center",alignItems: "center", direction:"rtl",padding:"5vw"}}>
       
       <h1>ثبت اطلاعات مشتری</h1>
       
       <form className={stylesNd.regDataForm} onSubmit={(e)=>regData(e)}>
       <div style={{display:"flex", flexDirection:"column",justifyContent: "center",alignItems: "center", rowGap:"2vw"}}>
       <div style={{display:"flex", flexDirection:"row",justifyContent: "center",alignItems: "center", columnGap:"5px"}}>
        
         
         <label>نام مهمان
         <input placeholder="نام مهمان" value={guestName} onChange={(e)=>setGuestName(e.target.value)} /></label>
         
         <label>شماره تماس
         <input type="text" placeholder="شماره تماس" value={guestPhone} onChange={(e)=>setGuestPhone(e.target.value)} />
        </label>
        
          </div>
          <div style={{display:"flex", flexDirection:"row",justifyContent: "center",alignItems: "center", columnGap:"5px"}}>
          <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
         <label>نوع درخواست</label>
         <select
     id="selectBox1"
     value={guestRequestType}
     onChange={(e)=>setGuestRequestType(e.target.value)}>
       <option value="default">انتخاب کنید</option>
     <option value="رستوران">رستوران</option>
     <option value="اقامت">اقامت</option>
     <option value="حمام سنتی">حمام سنتی</option>
     <option value="سایر">سایر</option>
   </select>
   </div>
   {guestRequestType === "اقامت" &&
   <>
   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
   <label>تاریخ ورود</label>
    <DatePicker
        required 
        digits={digits}
        value={values}
        onChange={value=>{setValues(value)}} 
         calendar={persian}
         locale={persian_fa}
         format="DD/MM/YYYY"
         placeholder="تاریخ ورود"
         inputMode="single"
          single
         
       ></DatePicker>
       </div>
       </>
   }
   {guestRequestType === "اقامت" &&
   <>
   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
   <label>موضوع اقامت</label>
   <select
     id="selectBoxEghamat"
     value={AccoRequestType}
     onChange={(e)=>setAccoRequestType(e.target.value)}
     
     >
      <option value="null">انتخاب کنید</option>
     <option value="بررسی قیمت">بررسی قیمت</option>
     <option value="بررسی ظرفیت">بررسی ظرفیت</option>
     <option value="سایر">سایر</option>
     <option value="پیگیری رزرو">پیگیری رزرو</option>
     <option value="کنسل">کنسل</option>
   </select></div></>}
   {AccoRequestType === "بررسی قیمت" &&  guestRequestType === "اقامت" &&
   <>
   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
   <label>نوع لیست قیمت</label>
   <select
   id="selectBoxActionEghamat"
   value={ActionEghamat}
   onChange={(e)=>setActionEghamat(e.target.value)}>
    <option value="null">انتخاب کنید</option>
    <option value="priceListIrani">ارسال کاتالوگ قیمت دار ایرانی</option>
    <option value="priceListKhareji">ارسال کاتالوگ قیمت دار خارجی</option>
    <option value="priceListOral">قیمت ها شفاهی گفته شد</option>
   </select>
   </div>
   </>}
   {AccoRequestType === "بررسی ظرفیت" && guestRequestType === "اقامت" &&
   <>
   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
    <label>نتیجه</label>
   <select
   id="ActionEghamatZarfiat"
   value={ActionEghamatZarfiat}
   onChange={(e)=>setActionEghamatZarfiat(e.target.value)}>
    <option value="null">انتخاب کنید</option>
    <option value="عدم موجودی ظرفیت">عدم موجودی ظرفیت</option>
    <option value="ظرفیت موجود">ظرفیت موجود</option>
    <option value="رزرو انجام شد">رزرو انجام شد</option>
    <option value="رزرو انجام نشد">رزرو انجام نشد</option>
   </select>
   </div>
   </>}
   {AccoRequestType === "سایر" || AccoRequestType === "پیگیری رزرو" || AccoRequestType === "کنسل"  ?
   <>
   {guestRequestType === "اقامت" && 
   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
   <label>توضیحات</label>
   <textarea id="otherAccoTypes" name="otherAccoTypes" value={otherAccoTypes} onChange={(e)=>setOtherAccoTypes(e.target.value)} rows="4" cols="50" />
   </div>}
   
   </>
   :
   null
   }
   {guestRequestType === "حمام سنتی" && <></>}
   {guestRequestType === "رستوران" && <></>}
   {guestRequestType === "سایر" && 
   <>
   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
   <label>توضیحات</label>
   <textarea placeholder="توضیحات" id="otherguestRequestType" name="otherguestRequestType" value={otherguestRequestType} onChange={(e)=>setotherguestRequestType(e.target.value)} rows="4" cols="50" />
   
   </div>
   </>}

   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
   <label>نحوه آشنایی</label>
   <select
     id="selectBox3"
     value={customerSource}
     onChange={(e)=>setCustomerSource(e.target.value)}>
       {customerSource === '' && <option value="">نحوه آشنایی</option>}
       {customerSource !== '' && <option value={customerSource}>{customerSource}</option>}
     <option value="اینستاگرام">اینستاگرام</option>
     <option value="اینترنت">اینترنت</option>
     <option value="آژانس">مهمان قبلی</option>
     <option value="سایر">سایر</option>
   </select>
   </div>
   </div>
   </div>
   
         
        
         <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",columnGap:"2vw"}}>
         <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
           
         </div>
         
         
        
         </div>
         
         <div style={{margin:"1vw",display:"flex", flexDirection:"row",justifyContent: "center", alignItems: "center", columnGap:"1vw"}}>
         <Button type="submit"  sx={{fontFamily:"shabnam"}} variant="outlined">ثبت</Button>
         <Button  sx={{fontFamily:"shabnam"}} onClick={closeModalRegData} variant="outlined">بستن</Button>
         </div>
         
       </form>
       
       
     </div>
     
   </Modal>
    <div className={styles.mainHeader}>

      <div className={styles.logoContainer}><img width="70vw" alt='logoblue' src={Logo} /></div>
      <div className={styles.menuCrmContainer}>
      <h3 onClick={startPopUpCrm}>ثبت دستی سرنخ</h3>
      <h3 onClick={() => window.open("/waitinglist", "_blank", "noopener,noreferrer")}>لیست انتظار تماس</h3>
      <h3>ارسال لینک اقامت</h3>
      <h3>ارسال کاتالوگ</h3>
      </div>
    </div>
    </>
  )
}

export default CrmHeader
