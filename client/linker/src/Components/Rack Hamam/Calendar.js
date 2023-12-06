import React, { useState } from 'react';
import moment from 'jalali-moment';
import './Calendar.css'; // Import a CSS file for styling
import DatePicker, { DateObject}from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
const Calendar = () => {
  const reservedData = [{day:'1402-09-01', hour:['00','01','02'],id:"2"},{day:'1402-09-03', hour:['22','23','00'],id:"3"}]
  const [currentDate, setCurrentDate] = useState(moment()); 
  const [startDay, setStartDay] = useState(1);
  const [values, setValues] = useState();
  const digits=["0","1","2","3","4","5","6","7","8","9"]
  let isMouseDown = false;
  let initialCell = null;
  let lastCell = null;
  const [selectedArea, setSelectedArea] = useState()
  const daysInMonth = () => {
    return currentDate.clone().endOf('jMonth').jDate();
  };


  const handleMouseDown = (day, hour) => {
    isMouseDown = true;
    initialCell = { day, hour };
    console.log(day , hour, "omid1")
    
    // Handle the initial click event
  };

  const handleMouseEnter = (day, hour) => {
    
    if (!isMouseDown) return;
    // Calculate selected cells and update UI accordingly
   
    console.log(day,hour,"omid2")
  };

  const handleMouseUp = (day,hour) => {
    
    if (!isMouseDown) return;
    // Handle the mouse-up event to finalize selection
    isMouseDown = false;
    // initialCell = null;
    lastCell = {day,hour}
    console.log(lastCell , initialCell)
    
  };
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

  return (
    <div className="calendar-container">
      <div className="calendar-nav">
        <button onClick={previousMonth}>Previous Month</button>
        <h2>{`${monthName} ${year}`}</h2>
        <button onClick={nextMonth}>Next Month</button>
      </div>
      <div className="start-day-input">
        <label htmlFor="start-day">Choose Date:</label>
        {/* <input
          type="date"
          id="start-day"
          name="start-day"
          // The following line has been modified to work with the current Jalali date
          value={moment(currentDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD')}
          onChange={handleDateChange}
        /> */}
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
            <tr key={index}>
              <td>
                
                {moment(day, 'YYYY-MM-DD').locale('fa').format('jDD ddd')}
              </td>
              {hours.map((hour) => (
                <td key={`${day.format('YYYY-MM-DD')}-${hour}`}  className="calendar-cell"
                onMouseDown={() => handleMouseDown(day, hour)}
                onMouseEnter={() => handleMouseEnter(day, hour)}
                onMouseUp={()=>handleMouseUp(day, hour)}
                >
                  
                  {reservedData.map((omid,index)=>(
                   <div> {omid.day === moment(day, 'YYYY/MM/DD').locale('fa').format('YYYY-MM-DD') && <div>{
                    omid.hour.map((houry,index)=>(
                      <div>{houry === hour && <div style={{backgroundColor:"lightblue", padding:"1rem"}}>{omid.id}</div>}</div>
                    ))
                    }</div>}</div>
                  
                ))}
                
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;