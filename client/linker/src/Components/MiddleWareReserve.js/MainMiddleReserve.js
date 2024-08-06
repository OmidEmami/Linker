import React,{useState,useEffect} from 'react'
import DatePicker, { DateObject,getAllDatesInRange }from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import moment from 'jalali-moment';
import axios from 'axios';
import { notify } from "../toast";
// import { useHistory} from "react-router-dom";
import LoadingComp from "../LoadingComp"
// import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
import Modal from 'react-modal'
export default function MainMiddleReserve() {
    const reserveOrigin = 
    [
        {name : "غیر مستقیم بدون لینک", value:"noDirect"},
        {name : "مستقیم بدون لینک", value:"direct"}
    ]
const [selectedAccountBank, setSelectedAccountBank] = useState('')
    const accounts = {
      saman : {card : '6219861066950030', account : '08032039555831', sheba : 'IR070560080302003955583001', owner: 'مصطفی ترک زهرانی'},
      mellat : {card : '6104338699497257',account : '', sheba : 'IR890120000000009081911002', owner: 'سمانه آسمان رفعت'},
      melli : {card: '6037997575661690',account : '', sheba : 'IR950170000000354577746007',owner:'مصطفی ترک زهرانی'}
    }
    const [selectedReserveOrigin, setSelectedReserveOrigin] = useState()
  const realToken = useSelector((state) => state.tokenReducer.token);
  const [showPopUp, setShowPopUp] = useState(false)
  const [payPercent, setPayPercent] = useState('')
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const date = new DateObject({ calendar: persian, locale: persian_fa });
  const [values, setValues] = useState([]);
  const digits=["0","1","2","3","4","5","6","7","8","9"];
  const [allDates, setAllDates] = useState([]);
  const [inputFields, setInputFields] = useState([{ value: '',price:'',roomname:'',extraService:"0", offRate:'0'}]);
  const [middleAgencyName, setMiddleAgencyName] = useState('')
  const [isLoading, setIsLoading] = useState(false);
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
  const middleAgencyData = ['snapp', 'lamaso', 'eghamat24', 'flightio', 'flyToDay', 'jabama']
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
  const handleOffRateChange = (index, event) => {
    const values = [...inputFields];
    values[index].offRate = event.target.value;
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
    
    
    if(payPercent === ''){
      percentNew = "100"
    }else{
      percentNew = payPercent
    }
    
    

    const checkIndateServer = moment.from(allDates[0].format(), 'fa', 'DD/MM/YYYY').format('YYYY-MM-DD')
    const checkOutDateServer = moment.from(allDates[allDates.length - 1].format(), 'fa', 'DD/MM/YYYY').format('YYYY-MM-DD')
   
    const accoCount = allDates.length - 1
    setIsLoading(true)
    try{
      const response = await axios.post("https://gmhotel.ir/api/sendGuestLinkMiddleWare",{
        Name : guestName,
        Phone: guestPhone,
        CheckIn : checkIndateServer,
        CheckOut : checkOutDateServer,
        Room : inputFields,
        AccoCount : accoCount,
        User : realToken.userName,
        Percent : percentNew,
        ReserveOrigin : selectedReserveOrigin,
        HesabAccount : selectedAccountBank,
        MiddleAgencyName : middleAgencyName
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
    const handleAccountChange = (e) => {
      const selectedKey = e.target.value;
      const selectedAccount = accounts[selectedKey];
      setSelectedAccountBank(selectedAccount);
    };
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
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{(room.price) - ((room.price * room.offRate)/100)}</td>
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
      <h3>ساخت رزرو واسطه</h3>
      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", padding:"10px"}}>

      <label>مبدا رزرو</label>
          <select required  value={selectedReserveOrigin} onChange={(e) => setSelectedReserveOrigin(e.target.value)}>
                                        <option  enabled>مبدا رزرو</option>
                                        {reserveOrigin.map((index,value)=>(
                                            <option key={value} value={index.value}>{index.name}</option>
                                        ))}
                                    </select>
                                    {selectedReserveOrigin === 'noDirect' && (
                                      <>
                                      <label>
                                        انتخاب نام واسط
                                      </label>
                                      <select required value={middleAgencyName} onChange={(e)=>setMiddleAgencyName(e.target.value)}>
                                      <option value="" disabled>
                                            انتخاب کنید
                                          </option> 
                                          {middleAgencyData.map(item=>(
                                            <option value={item}>{item}</option>
                                          ))}
                                      </select>
                                      </>
                                    )}
                                    {selectedReserveOrigin === 'direct' && (
        <>
          <label>انتخاب شماره حساب</label>
          <select required value={selectedAccountBank ? selectedAccountBank.card : ''} onChange={handleAccountChange}>
            <option value="" disabled>
              انتخاب کنید
            </option>
            {Object.keys(accounts).map((key) => {
              const account = accounts[key];
              return (
                <option key={key} value={key}>
                  {`${account.card} - ${account.owner}`}
                </option>
              );
            })}
          </select>
        </>
      )}
                                    </div>
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
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", padding:"10px",columnGap:"10px", alignItems:"end"}} key={index}>
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
          <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <label>قیمت هر شب به ریال</label>
          <input placeholder='قیمت هر شب به ریال' required type='number' value={inputField.price} onChange={(e) => handlePriceChange(index, e)} />
          </div>
          <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <label>درصد تخفیف</label>
          <input placeholder='درصد تخفیف' required type='text' value={inputField.offRate} onChange={(e) => handleOffRateChange(index, e)} />

          </div>
          {inputField.roomname === "صفویه" &&            
          <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <label>قیمت سرویس اضافه</label>
          <input type='number'  value={inputField.extraService}
           onChange={(e)=> handleExtraServiceChange(index, e)} placeholder='قیمت سرویس اضافه' />
           </div>
           }
          {inputField.roomname === "قاجار" &&  <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <label>قیمت سرویس اضافه</label>
          <input type='number'  value={inputField.extraService}
           onChange={(e)=> handleExtraServiceChange(index, e)} placeholder='قیمت سرویس اضافه' />
           </div>}
          {inputField.roomname === "قیصریه" &&  <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <label>قیمت سرویس اضافه</label>
          <input type='number'  value={inputField.extraService}
           onChange={(e)=> handleExtraServiceChange(index, e)} placeholder='قیمت سرویس اضافه' />
           </div>}
          {inputField.roomname === "زندیه" &&  <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <label>قیمت سرویس اضافه</label>
          <input type='number'  value={inputField.extraService}
           onChange={(e)=> handleExtraServiceChange(index, e)} placeholder='قیمت سرویس اضافه' />
           </div>}

          <label>اتاق {index + 1}</label>
          
          
          
          <button onClick={() => handleRemoveInput(index)}>حذف</button>
        </div>
      ))}
       <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between" , padding:"10px"}}>
        
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
