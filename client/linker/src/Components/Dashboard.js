import React,{useState,useEffect} from 'react'
import DatePicker, { DateObject,getAllDatesInRange }from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import moment from 'jalali-moment';
import axios from 'axios';
import { notify } from "./toast";
// import { useHistory} from "react-router-dom";
import LoadingComp from "./LoadingComp"
// import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
import Modal from 'react-modal'
export default function Dashboard() {
  const realToken = useSelector((state) => state.tokenReducer.token);
  const [showPopUp, setShowPopUp] = useState(false)
  const [payPercent, setPayPercent] = useState('')
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const date = new DateObject({ calendar: persian, locale: persian_fa });
  const [values, setValues] = useState([]);
  const digits=["0","1","2","3","4","5","6","7","8","9"];
  const [allDates, setAllDates] = useState([]);
  const [inputFields, setInputFields] = useState([{ value: '',price:'',roomname:'',extraService:"0"}]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [timeValue, setTimeValue] = useState('');
  const [showSendButton, setShowSendButton] = useState(false)
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width:"60%"
    },
  }; 
  moment.locale('en');
  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    values[index].value = event.target.value;
    switch (event.target.value) {
      case '2':
        values[index].roomname = 'یک تخته';
        break;
      case '5':
        values[index].roomname = 'دوتخته';
        break;
      case '24':
        values[index].roomname = 'دابل - تخت کویین';
        break;
        case '7':
          values[index].roomname = 'سه تخته';
        break;
        case '18':
          values[index].roomname = 'صفویه';
        break;
        case '21':
          values[index].roomname = 'آینه';
        break;
        case '19':
          values[index].roomname = 'قاجار';
        break;
        case '25':
          values[index].roomname = 'قیصریه';
        break;
        case '22':
          values[index].roomname = 'زندیه';
        break;
        case '20026':
          values[index].roomname = 'افشاریه';
        break;
        case '20':
          values[index].roomname = 'دلنشین';
        break;
        case '10026':
          values[index].roomname = 'کانکت';
        break;
      default:
        console.log('Unknown selection');
    }
    setInputFields(values);
    
  };
  const handlePriceChange = (index, event) => {
    const values = [...inputFields];
    values[index].price = event.target.value;
    setInputFields(values);
    
  };
 

  const handleAddInput = () => {
    const values = [...inputFields];
    values.push({ value: '',price:'',roomname:'' });
    setInputFields(values);
  };

  const handleRemoveInput = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };
  const generateLink = async(e)=>{
    setShowSendButton(true)
    e.preventDefault();

    
    setShowPopUp(true)
 
        
  }
  const sendfinalzedLink = async()=>{
    setShowSendButton(true)
    setShowPopUp(false)
    var percentNew;
    var timeValueAsli;
    
    if(payPercent === ''){
      percentNew = "100"
    }else{
      percentNew = payPercent
    }
    if(timeValue === ''){
      timeValueAsli = "1"
    }else{
      timeValueAsli = timeValue
    }
    

    const checkIndateServer = moment.from(allDates[0].format(), 'fa', 'DD/MM/YYYY').format('YYYY-MM-DD')
    const checkOutDateServer = moment.from(allDates[allDates.length - 1].format(), 'fa', 'DD/MM/YYYY').format('YYYY-MM-DD')
   
    const accoCount = allDates.length - 1
    setIsLoading(true)
    try{
      const response = await axios.post("http://localhost:3001/api/sendGuestLink",{
        Name : guestName,
        Phone: guestPhone,
        CheckIn : checkIndateServer,
        CheckOut : checkOutDateServer,
        Room : inputFields,
        AccoCount : accoCount,
        TimeValue : timeValueAsli,
        User : realToken.userName,
        Percent : percentNew
      },{
          headers:{
          Authorization: `Bearer ${realToken.realToken}`
        }
      })
    
      if(response.data.length !== 0){
        setIsLoading(false)
        notify( "لینک ارسال شد", "success")
        setShowSendButton(false)
      
    }else{
        setIsLoading(false)
        notify( "خطا", "error")
        setShowSendButton(false)
      
    }
    setShowSendButton(false)
    }
    
    catch(error){
      setIsLoading(false)
      notify( "خطا", "error")
      setShowSendButton(false)
    }
  }
  
    const handleExtraServiceChange = (index,e) => {
      const values = [...inputFields];
      values[index].extraService = e.target.value;
      setInputFields(values);
    }
  return (
    <>
    {isLoading && <LoadingComp />}
    <Modal
  isOpen={showPopUp}
  onRequestClose={() => {setShowPopUp(false)
    setShowSendButton(false)
  }}
  style={customStyles}
  contentLabel="Example Modal"
>
  {showPopUp &&
    <>
      <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '10px' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>جزئیات رزرو</h2>
        <div style={{
  marginBottom: '20px',
  border: '1px solid #ccc',
  padding: '10px',
  borderRadius: '5px',
  backgroundColor: 'rgba(255, 162, 0, 0.3)', // Adjust alpha to 0.95 for less transparency
  direction: "rtl"
}}>
          <p style={{ borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '8px' }}> <b>نام مهمان : </b>{guestName}</p>
          <p style={{ borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '8px' }}><b>شماره تماس : </b>{guestPhone}</p>
          <p style={{ borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '8px' }}><b>تاریخ ورود: </b>{allDates.length > 0 ? allDates[0].format(): ''}</p>
          <p style={{ borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '8px' }}><b>تاریخ خروج: </b>{allDates.length > 1 ? allDates[allDates.length - 1].format() : ''}</p>
          <p style={{ paddingBottom: '8px' }}><b>تعداد شب : </b>{allDates.length > 1 ? allDates.length - 1 : 0}</p>
        </div>
        <h3 style={{ textAlign: 'center', color: '#444' }}>جزئیات اتاق</h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          direction:"rtl"
        }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>نام اتاق</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>قیمت / هرشب</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>قیمت سرویس اضافه</th>
            </tr>
          </thead>
          <tbody>
            {inputFields.map((room, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 ? '#f9f9f9' : '#fff' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{room.roomname}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{room.price}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{room.extraService}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={sendfinalzedLink} style={{
        marginTop: '20px',
        backgroundColor: '#FF6800',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>تایید و ارسال لینک</button>
      <button onClick={() => {setShowPopUp(false)
        setShowSendButton(false)
      }} style={{
        marginTop: '20px',
        backgroundColor: '#FF6800',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginLeft:"20px"
      }}>ویرایش</button>
    </>}
</Modal>


    <div style={{display:"flex", flexDirection:"column", direction:"rtl", alignItems:"center", padding:"10px"}}>
      <form onSubmit={(e)=>generateLink(e)} >
      <h3>ارسال لینک اقامت</h3>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", padding:"10px"}}>
          
        <label>نام مهمان</label>
          <input placeholder='نام مهمان' required type='text' value={guestName} onChange={(e)=>setGuestName(e.target.value)} />
        </div>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", padding:"10px"}}>
        <label>شماره تماس</label>
          <input placeholder='شماره تماس' required type='text' value={guestPhone} onChange={(e)=>setGuestPhone(e.target.value)}  />
        </div>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", padding:"10px"}}>
        <label>تاریخ ورود و خروج</label>
        <DatePicker
        required 
           digits={digits}
            value={values}
            onChange={value=>{setValues(value) 
                setAllDates(getAllDatesInRange(value))
            }}
                
             calendar={persian}
             locale={persian_fa}
             calendarPosition="bottom-right"
             range
             dateSeparator=" تا " 
             rangeHover
             format="DD/MM/YYYY"
             placeholder='تاریخ ورود و خروج'
             plugins={[
                <DatePanel eachDaysInRange position="left" />
              ]}
           ></DatePicker>
        </div>
        {inputFields.map((inputField, index) => (
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", padding:"10px",columnGap:"10px"}} key={index}>
          <select required  value={inputField.value} onChange={(e) => handleInputChange(index, e)}>
                                        <option  enabled >نوع اتاق</option>
                                        <option value="2">یک تخته</option>
                                        <option value="5">دوتخته</option>
                                        <option value="24">دو تخته کویین</option>
                                        <option value="7">سه تخته </option>
                                        <option value="18">صفوی</option>
                                        <option value="21">آینه</option>
                                        <option value="19">قاجار</option>
                                        <option value="25">قیصریه</option>
                                        <option value="22">زندیه</option>
                                        <option value="20026">افشاریه</option>
                                        <option value="20">دلنشین</option>
                                        <option value="10026">کانکت</option>
                                    </select>
          
          <input placeholder='قیمت هر شب به ریال' required type='number' value={inputField.price} onChange={(e) => handlePriceChange(index, e)} />
          {inputField.roomname === "صفویه" &&  <input type='number'  value={inputField.extraService}
           onChange={(e)=> handleExtraServiceChange(index, e)} placeholder='قیمت سرویس اضافه' />}
          {inputField.roomname === "قاجار" &&  <input type='number' value={inputField.extraService}
           onChange={(e)=> handleExtraServiceChange(index, e)} placeholder='قیمت سرویس اضافه' />}
          {inputField.roomname === "قیصریه" &&  <input type='number' value={inputField.extraService}
           onChange={(e)=> handleExtraServiceChange(index, e)} placeholder='قیمت سرویس اضافه' />}
          {inputField.roomname === "زندیه" &&  <input type='number' value={inputField.extraService} 
          onChange={(e)=> handleExtraServiceChange(index, e)} placeholder='قیمت سرویس اضافه' />}

          <label>اتاق {index + 1}</label>
          
          
          
          <button onClick={() => handleRemoveInput(index)}>حذف</button>
        </div>
      ))}
       <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between" , padding:"10px"}}>
        <label>اعتبار رزرو</label>
       
          <select required  value={timeValue} onChange={(e) => setTimeValue(e.target.value)}>
                                        <option  enabled >اعتبار رزرو</option>
                                        <option value="1">1 ساعت</option>
                                        <option value="2">12 ساعت</option>
                                        <option value="3">24 ساعت</option>
                       </select>
                       <input placeholder='درصد پرداخت' type='number' value={payPercent} onChange={(e)=> setPayPercent(e.target.value)}  />
       </div>
      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between" , padding:"10px"}}>
      <button onClick={handleAddInput}>اضافه کردن اتاق</button>
      <button disabled={showSendButton} type='submit'>ارسال لینک</button></div>
      </form>
    </div>
    </>
  )
}
