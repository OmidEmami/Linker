import React, { useState,useEffect, useCallback, memo  } from 'react';
import moment from 'jalali-moment';
import './Calendar.css';
import DatePicker, { DateObject}from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import LoadingComp from '../LoadingComp';
import axios from "axios";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useSelector } from "react-redux";
import { notify } from "../../Components/toast";
import ReserveModal from './ReserveModal';
import MassorModal from './MassorModal';
import PackageModal from './PackageModal';

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
  const [currentDate, setCurrentDate] = useState(moment()); 
  const [showPopUp, setShowPopUp] = useState(false)
  const [values, setValues] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState('');
  const [reserveDetails, setReserveDetails] = useState('');
  const digits=["0","1","2","3","4","5","6","7","8","9"]
  const date = new DateObject({ calendar: persian, locale: persian_fa });
  const [showMassorModal,setShowMassorModal] = useState(false)
  const [showPackageModal,setShowPackageModal] = useState(false);
  const [packageList , setPackageList] = useState([]);
  const [massorNames, setMassorNames] = useState([])
  const daysInMonth = () => {
    return currentDate.clone().endOf('jMonth').jDate();
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
        const response = await axios.post("http://localhost:3001/api/getFixedReserves", {
            date: currentDate.locale('fa').format('YYYY-MM')
        }, {
            headers: {
                Authorization: `Bearer ${realToken.realToken}`
            }
        });
        setPackageList(response.data.packagesList)
        console.log(response.data.massorNames)
        setMassorNames(response.data.massorNames)
        const updatedData = response.data.result.map(item => {
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
}, [currentDate, realToken, showPopUp]);

useEffect(() => {
    fetchData();
}, [currentDate]);

  
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
    setIsLoading(true)
    const nextDate = currentDate.clone().add(1, 'jMonth').startOf('jMonth');
    setCurrentDate(nextDate);
    setIsLoading(false)
  };

  const previousMonth = () => {
    setIsLoading(true)
    const prevDate = currentDate.clone().subtract(1, 'jMonth').startOf('jMonth');
    setCurrentDate(prevDate);
    setIsLoading(false)
  };
  
  const monthName = currentDate.locale('fa').format('jMMMM');
  const year = currentDate.format('jYYYY');

  const handleDateChange = () => {
    
    setIsLoading(true)
    const chosenDate = moment.from(moment.from(values.format(), 'fa', 'DD/MM/YYYY').format('YYYY-MM-DD'), 'en', 'YYYY-MM-DD').locale('fa');
    if (chosenDate.isValid()) {
      setCurrentDate(chosenDate);
    }
    setIsLoading(false)
 
  };
  const showReserveDetails = async(showData)=>{
   
    setReserveDetails(showData)
    setShowPopUp(true)
    
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
        link.setAttribute('download', 'hamam-details.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsLoading(false);
    } catch (error) {
        setIsLoading(false);
        notify("Error uploading data to Google Sheets", 'error');
        console.log(error);
    }
};


  return (
    <>
    
    {isLoading && <LoadingComp />}
    {showPopUp && <ReserveModal
        isOpen={showPopUp}
        onClose={() => setShowPopUp(false)}
        reserveDetails={reserveDetails}
        packageList = {packageList}
        massorNames = {massorNames}
      />}
      {showMassorModal && <MassorModal
      isOpen = {showMassorModal}
      onClose = {()=>setShowMassorModal(false)}
      />}
      {showPackageModal &&  <PackageModal
      isOpen = {showPackageModal}
      onClose = {()=>setShowPackageModal(false)}
      />}
     
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
      {realToken.user === "admin" && <button onClick={downloadHamamDetails} style={{padding:"1rem", margin:"1rem"}}>دانلود اکسل رزرو ها</button>}
      <button onClick={()=>setShowMassorModal(true)} style={{padding:"1rem", margin:"1rem"}}>تعریف خدمات دهنده</button>
      <button onClick={()=>setShowPackageModal(true)} style={{padding:"1rem", margin:"1rem"}}> تعریف پکیج</button>
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