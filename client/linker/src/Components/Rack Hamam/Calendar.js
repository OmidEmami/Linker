import React, { useState,useEffect, useCallback, memo  } from 'react';
import moment from 'jalali-moment';
import './Calendar.css'; // Import a CSS file for styling
import DatePicker, { DateObject}from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import LoadingComp from '../LoadingComp';
import axios from "axios";
import Modal from 'react-modal';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useSelector } from "react-redux";
import { notify } from "../../Components/toast";
import { debounce } from 'lodash';


import ReserveModal from './ReserveModal';
const CalendarDay = memo(({ day, hours, data, showReserveDetails }) => {
  return (
      <tr>
          <td>{moment(day, 'YYYY-MM-DD').locale('fa').format('jDD ddd')}</td>
          {hours.map((hour) => (
              <td key={`${day.format('YYYY-MM-DD')}-${hour}`} className="calendar-cell">
                  {data !== '' && data.map((showData, index) => (
                      <div key={index}>
                          {showData.Date === moment(day, 'YYYY/MM/DD').locale('fa').format('YYYY-MM-DD') && (
                              showData.Hours.map((houry, hourIndex) => (
                                  houry.toString() === hour && (
                                      <div key={hourIndex} onClick={() => showReserveDetails(showData)}
                                          style={showData.CurrentStatus === "Fixed" ? { backgroundColor: "lightblue", padding: "1rem", cursor: "pointer" } : { backgroundColor: "red", padding: "1rem", cursor: "pointer" }}>
                                          {showData.FullName}
                                      </div>
                                  )
                              ))
                          )}
                      </div>
                  ))}
              </td>
          ))}
      </tr>
  );
});
const Calendar = () => {

  const realToken = useSelector((state) => state.tokenReducer.token);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width:"80%",
      height:"70%"
    },
    overlay: {
      zIndex: 900
    }
  };
  const [currentDate, setCurrentDate] = useState(moment()); 
  const [showPopUp, setShowPopUp] = useState(false)
  const [values, setValues] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState('');
  const [reserveDetails, setReserveDetails] = useState('');
  const [hamamStartHour, setHamamStartHour] = useState();
  const [hamamEndHour, setHamamEndHour] = useState();
  const digits=["0","1","2","3","4","5","6","7","8","9"]
  let isMouseDown = false;
  let initialCell = null;
  let lastCell = null;
  const date = new DateObject({ calendar: persian, locale: persian_fa });
  const daysInMonth = () => {
    return currentDate.clone().endOf('jMonth').jDate();
  };
  const handleSaveModalData = (formData) => {
    // Logic to update global state with formData
    // For example, setReserveDetails(formData);
    // Plus, any additional logic you need after saving modal data
  };
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      
        const response = await axios.post("https://gmhotel.ir/api/getFixedReserves", {
            date: currentDate.locale('fa').format('YYYY-MM')
        }, {
            headers: {
                Authorization: `Bearer ${realToken.realToken}`
            }
        });
        
        // Data processing remains the same...
        const updatedData = response.data.map(item => {
          const hoursString = item.Hours;
          
            try{
              const parsedHoursArray = JSON.parse(hoursString);
              return {...item, Hours:parsedHoursArray} ;
              
            }catch(error){
              console.error("Error parsing 'Hours' string:", error);
             
              return { ...item, Hours: [] };
            }
            
          
          
        })
        setData(updatedData);
        setIsLoading(false);
    } catch (error) {
        setIsLoading(false);
        notify("خطا", error);
    }
}, [currentDate, realToken,showPopUp]); // Removed showPopUp from dependencies

useEffect(() => {
    fetchData();
}, [fetchData]);
const debouncedSetReserveDetails = useCallback(debounce((name, value) => {
 
  setReserveDetails(prevFormData => ({
      ...prevFormData,
      [name]: value
  }));
}, 1), []);
  // const handleMouseDown = (day, hour) => {
  //   isMouseDown = true;
  //   initialCell = { day, hour };
   
 
  // };

  // const handleMouseEnter = (day, hour) => {
    
  //   if (!isMouseDown) return;
  //   // Calculate selected cells and update UI accordingly
   
    
  // };

  // const handleMouseUp = (day,hour) => {
    
  //   if (!isMouseDown) return;
  //   // Handle the mouse-up event to finalize selection
  //   isMouseDown = false;
  //   // initialCell = null;
  //   lastCell = {day,hour}
    
    
  // };
  const getDaysArray = () => {
    const daysCount = daysInMonth();
    const daysArray = [];
    const startOfMonth = currentDate.clone().startOf('jMonth');
    
    for (let i = 0; i < daysCount; i++) {
      daysArray.push(startOfMonth.clone().add(i, 'days'));
    }
    
    return daysArray;
  };

  const days = getDaysArray();
  const hours = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
  
  const nextMonth = () => {
    const nextDate = currentDate.clone().add(1, 'jMonth').startOf('jMonth');
    setCurrentDate(nextDate);
  };

  const previousMonth = () => {
    const prevDate = currentDate.clone().subtract(1, 'jMonth').startOf('jMonth');
    setCurrentDate(prevDate);
  };
  
  const monthName = currentDate.locale('fa').format('jMMMM');
  const year = currentDate.format('jYYYY');

  const handleDateChange = () => {
    
    
    const chosenDate = moment.from(moment.from(values.format(), 'fa', 'DD/MM/YYYY').format('YYYY-MM-DD'), 'en', 'YYYY-MM-DD').locale('fa');
    if (chosenDate.isValid()) {
      setCurrentDate(chosenDate);

    
    }
 
  };
  const showReserveDetails = async(showData)=>{
    // setHamamStartHour(showData.Hours[0])
    // setHamamEndHour(showData.Hours[showData.Hours.length - 1])
    setReserveDetails(showData)
    setShowPopUp(true)
    
  }
  const modifyFixedReserves = async(e) =>{
    e.preventDefault();
    if (hamamStartHour && hamamEndHour) {
      const firstHour = hamamStartHour.hour();
      const secondHour = hamamEndHour.hour();

      const start = firstHour < secondHour ? firstHour : secondHour;
      const end = firstHour > secondHour ? firstHour : secondHour;

      const selectedHours = Array.from({ length: end - start + 1 }, (_, index) => start + index)
        .map(hour => hour < 10 ? `0${hour}` : `${hour}`);
      try{
        setIsLoading(true)
        const response = await axios.post("https://gmhotel.ir/api/modifyFixedReserves",{
          UniqueId:reserveDetails.UniqueId,
          FullName:reserveDetails.FullName,
          Phone:reserveDetails.Phone,
          Date:reserveDetails.Date,
          Hours:JSON.stringify(selectedHours),
          CustomerType:reserveDetails.CustomerType,
          ServiceType:reserveDetails.ServiceType,
          SelectedService:reserveDetails.SelectedService,
          AccoStatus:reserveDetails.AccoStatus,
          CateringDetails:reserveDetails.CateringDetails,
          MassorNames:reserveDetails.MassorNames,
          Desc:reserveDetails.Desc,
          CurrentStatus:reserveDetails.CurrentStatus,
          SatisfactionText:reserveDetails.SatisfactionText,
          Satisfaction:reserveDetails.Satisfaction
          },{
            headers:{
              Authorization: `Bearer ${realToken.realToken}`
            }
          })
          setIsLoading(false)
          notify( "اطلاعات شما با موفقیت ثبت شد", "success")
          setShowPopUp(false)
      }catch(error){
          setIsLoading(false)
          notify("خطا",error)
      }
      
      
  }else{
    const selectedHours = reserveDetails.Hours;
    try{
      setIsLoading(true)
      const response = await axios.post("https://gmhotel.ir/api/modifyFixedReserves",{
        UniqueId:reserveDetails.UniqueId,
        FullName:reserveDetails.FullName,
        Phone:reserveDetails.Phone,
        Date:reserveDetails.Date,
        Hours:JSON.stringify(selectedHours),
        CustomerType:reserveDetails.CustomerType,
        ServiceType:reserveDetails.ServiceType,
        SelectedService:reserveDetails.SelectedService,
        AccoStatus:reserveDetails.AccoStatus,
        CateringDetails:reserveDetails.CateringDetails,
        MassorNames:reserveDetails.MassorNames,
        Desc:reserveDetails.Desc,
        FinalPrice:reserveDetails.FinalPrice,
        CurrentStatus:reserveDetails.CurrentStatus,
        SatisfactionText:reserveDetails.SatisfactionText,
        Satisfaction:reserveDetails.Satisfaction
        },{
          headers:{
            Authorization: `Bearer ${realToken.realToken}`
          }
        })
        setIsLoading(false)
        notify( "اطلاعات شما با موفقیت ثبت شد", "success")
        setShowPopUp(false)
    }catch(error){
        setIsLoading(false)
        notify("خطا",error)
    }
  }
  


}
const handleFinalReserveDetailsForm = (e) => {
  const { name, value } = e.target;
  debouncedSetReserveDetails(name, value);
};
  const removeSpecificReserve = async(e)=>{
    e.preventDefault();
    
  
    try{
      submit()
      function submit() {
        confirmAlert({
          title: 'تایید حذف کلی رزرو',
          message: 'آیا مطمئن هستید؟',
          buttons: [
            {
              label: 'بله',
              onClick: () => removeReserve()
            },
            {
              label: 'خیر',
              onClick: () => null
            }
          ]
        });
      }
      const removeReserve = async() =>{
        setIsLoading(true)
        const removeResponse = await axios.post("https://gmhotel.ir/api/removeHamamReserve",{
          UniqueId:reserveDetails.UniqueId,
          FullName:reserveDetails.FullName,
          Phone:reserveDetails.Phone,
          Date:reserveDetails.Date,
          
        },{
          headers:{
            Authorization: `Bearer ${realToken.realToken}`
          }
        })
        setIsLoading(false)
        setShowPopUp(false)
      }
      
    }catch(error){
      setIsLoading(false)
      notify("خطا",'error')
    }
  }
  const downloadHamamDetails = async () => {
    try {
        setIsLoading(true);
        const response = await axios.get("https://gmhotel.ir/api/downloadhamamdetails", {
            responseType: 'blob', 
            headers: {
                Authorization: `Bearer ${realToken.realToken}`
            }
        });

     
        const blob = response.data; 
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'data.xlsx'); // Set the file name
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsLoading(false);
    } catch (error) {
        setIsLoading(false);
        notify("خطا", 'error');
        console.log(error);
    }
};

  return (
    <>
    
    {isLoading && <LoadingComp />}
    {/* <Modal
        isOpen={showPopUp}
        //onAfterOpen={afterOpenModal}
        onRequestClose={()=>setShowPopUp(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{margin:"10px"}}>
          <form className='formdetails' onSubmit={modifyFixedReserves}>
            <label>ثبت کننده : {reserveDetails.User}</label>
            <div className='formdetails-first-one'>

            <label>کد درخواست : {reserveDetails.UniqueId}</label>
            <label>نام مهمان  
              <ReserveDetailsInput name='FullName' type='text' value={reserveDetails.FullName} onChange={handleFinalReserveDetailsForm} />
            </label>
            <label>شماره تماس
              <ReserveDetailsInput name='Phone' type='number' value={reserveDetails.Phone} onChange={handleFinalReserveDetailsForm} />
            </label>
            <label>تعیین وضعیت
              <select name='CurrentStatus' onChange={handleFinalReserveDetailsForm} value={reserveDetails.CurrentStatus}>
                  {['Fixed','CheckedOut'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select></label>
                {reserveDetails.CurrentStatus === "CheckedOut" && 
                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                <label>
                  <select name='Satisfaction' onChange={handleFinalReserveDetailsForm} value={reserveDetails.Satisfaction}>
                  {['راضی','ناراضی'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
               
                </label>
                 <ReserveDetailsInput style={{margin:"10px"}} name='SatisfactionText' placeholder='توضیحات رضایت' value={reserveDetails.SatisfactionText} onChange={handleFinalReserveDetailsForm} />
                 </div>
                }
            
            </div>
            <div className='formdetails-first-one'>
              <label>قیمت نهایی
                <ReserveDetailsInput name='FinalPrice' type='number' value={reserveDetails.FinalPrice} onChange={handleFinalReserveDetailsForm} />
              </label>
            <label>تاریخ دریافت خدمات : 
              {reserveDetails.Date}
        
           
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;    تغییر تاریخ     &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
           <DatePicker  
          name="CertainDate"
           digits={digits}
            // value={reserveDetails.Date}
            onChange={(value)=>setReserveDetails({...reserveDetails, Date : value.format('YYYY-MM-DD')})}
                style={{fontFamily:"Shabnam"}}
             calendar={persian}
             locale={persian_fa}
             calendarPosition="bottom-right"
             format="DD/MM/YYYY"
             placeholder='تغییر تاریخ'
           ></DatePicker>
           
            </label>
            
            </div>
            <div className='formdetails-first-one'>
            <b><label><h3>ساعت های ارائه خدمات {reserveDetails.Hours !== undefined && reserveDetails.Hours[0]} تا {reserveDetails.Hours !== undefined && reserveDetails.Hours[reserveDetails.Hours.length - 1]}</h3></label></b>
            <label>تغییر ساعت شروع</label>
           <LocalizationProvider dateAdapter={AdapterDayjs}>
           <TimePicker  onChange={(value)=>setHamamStartHour(value)} views={['hours']} />
           </LocalizationProvider>
           <label>تغییر ساعت پایان</label>
           <LocalizationProvider dateAdapter={AdapterDayjs}>
           <TimePicker  onChange={(value)=>setHamamEndHour(value)} views={['hours']} />
           </LocalizationProvider>
           </div>
           <div className='formdetails-first-one'>
            <label>نوع مشتری
              <select name='CustomerType' onChange={handleFinalReserveDetailsForm} value={reserveDetails.CustomerType}>
                  {['گروه مردانه', 'گروه زنانه', 'زوج'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
            </label>
            <label>نوع خدمات
            <select name='ServiceType' onChange={handleFinalReserveDetailsForm} value={reserveDetails.ServiceType}>
                  {['حمام', 'ماساژ', 'قرق با خدمات','قرق بدون خدمات'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
            </label>
            <label>روش ارائه
            <select name='SelectedService' onChange={handleFinalReserveDetailsForm} value={reserveDetails.SelectedService}>
                  {['معمولی', 'قرق', 'VIP'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
            </label>
            <label>وضعیت اقامت
            <select name='AccoStatus' onChange={handleFinalReserveDetailsForm} value={reserveDetails.AccoStatus}>
                  {['مقیم هتل', 'غیر مقیم'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
            </label>
            </div>
            <div className='formdetails-first-one'>
            <label>نوع پذیرایی </label>
              <ReserveDetailsInput name='CateringDetails' value={reserveDetails.CateringDetails} onChange={handleFinalReserveDetailsForm}/>
           
            <label>نام خدمات دهنده</label>
              <ReserveDetailsInput type='text' name='MassorNames' value={reserveDetails.MassorNames} onChange={handleFinalReserveDetailsForm} />
            
            <label>توضیحات</label>
              <ReserveDetailsInput name='Desc' value={reserveDetails.Desc} onChange={handleFinalReserveDetailsForm} />
            
            </div>
            <div className='Button-container'>
            <button type='submit'>ذخیره</button>
            <button onClick={removeSpecificReserve}>حذف رزرو</button>
            </div>
            
          </form>
      </div>
      </Modal> */}
      <ReserveModal
        isOpen={showPopUp}
        onClose={() => setShowPopUp(false)}
        reserveDetails={reserveDetails}
        onSave={handleSaveModalData}
      />
    <div className="calendar-container">
      <div className="calendar-nav">
        <button onClick={previousMonth}>ماه قبلی</button>
        <h2>{`${monthName} ${year}`}</h2>
        <button onClick={nextMonth}>ماه بعدی</button>
        <div className="start-day-input">
        <label htmlFor="start-day">Choose Date:</label>
 
        <DatePicker 
           digits={digits}
            value={values}
           
            onChange={value=>{setValues(value) 
            }}
                
             calendar={persian}
             locale={persian_fa}
             calendarPosition="bottom-right"
             
             
            
             format="DD/MM/YYYY"
             placeholder='تاریخ ورود و خروج'
             
           ></DatePicker>
           <button onClick={handleDateChange}>برو به تاریخ</button>
      </div>
      </div>
      <div className="calendar-scroll-container">
        {realToken.user === "admin" && <button onClick={downloadHamamDetails} style={{padding:"1rem", margin:"1rem"}}>دانلود اکسل رزرو ها</button> }
        
      <table className="calendar-table">
        <thead>
          <tr>
            <th></th>
            {hours.map((hour, index) => (
              <th key={index}>{hour}</th>
            ))}
          </tr>
        </thead>
        <tbody>
                            {days.map((day, index) => (
                                <CalendarDay key={index} day={day} hours={hours} data={data} showReserveDetails={showReserveDetails} />
                            ))}
                        </tbody>
      </table>
      </div>
    </div>
    </>
  );
};

export default Calendar;