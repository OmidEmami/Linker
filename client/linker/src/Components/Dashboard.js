import React,{useState} from 'react'
import DatePicker, { DateObject,getAllDatesInRange }from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import moment from 'jalali-moment';
import axios, { all } from 'axios';
import { notify } from "./toast";
export default function Dashboard() {
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('')
  const date = new DateObject({ calendar: persian, locale: persian_fa })
  const [values, setValues] = useState([])
  const digits=["0","1","2","3","4","5","6","7","8","9"]
  const [allDates, setAllDates] = useState([])
  const [inputFields, setInputFields] = useState([{ value: '',price:'',roomname:'' }]);

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
          values[index].roomname = 'دابل - تخت کویین';
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
    e.preventDefault();
    const checkIndateServer = moment.from(allDates[0].format(), 'fa', 'DD/MM/YYYY').format('YYYY-MM-DD')
    const checkOutDateServer = moment.from(allDates[allDates.length - 1].format(), 'fa', 'DD/MM/YYYY').format('YYYY-MM-DD')
    const accoCount = allDates.length - 1
    console.log(allDates.length - 1)
    try{
      const response = await axios.post("http://localhost:3001/sendGuestLink",{
        Name : guestName,
        Phone: guestPhone,
        CheckIn : checkIndateServer,
        CheckOut : checkOutDateServer,
        Room : inputFields,
        AccoCount : accoCount
      })
      console.log(response)
      notify( "لینک ارسال شد", "success")
    }
    catch(error){
      notify( "خطا", "error")
    }
        
  }
  return (
    <div style={{display:"flex", flexDirection:"column", direction:"rtl"}}>
      <form onSubmit={(e)=>generateLink(e)} >
        <label>نام مهمان
          <input required type='text' value={guestName} onChange={(e)=>setGuestName(e.target.value)} />
        </label>
        <label>شماره تماس
          <input required type='text' value={guestPhone} onChange={(e)=>setGuestPhone(e.target.value)}  />
        </label>
        <label>تاریخ ورود و خروج
        <DatePicker 
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
        </label>
        {inputFields.map((inputField, index) => (
        <div key={index}>
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
          <input required type='number' value={inputField.price} onChange={(e) => handlePriceChange(index, e)} />
          <label>اتاق {index + 1}</label>
          
          <button onClick={() => handleRemoveInput(index)}>حذف</button>
        </div>
      ))}

      <button onClick={handleAddInput}>اضافه کردن اتاق</button>
      <button type='submit'>ارسال لینک</button>
      </form>
    </div>
  )
}
