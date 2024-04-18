// ReserveModal.js

import React, { useState,useEffect } from 'react';
import Modal from 'react-modal';
import ReserveDetailsInput from './ReserveDetailsInput';
import moment from 'jalali-moment';
import './Calendar.css'; // Import a CSS file for styling
import DatePicker, { DateObject}from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { confirmAlert } from 'react-confirm-alert';
import axios from "axios";
import { useSelector } from "react-redux";
import { notify } from "../../Components/toast";
import './Calendar.css';
import LoadingComp from '../LoadingComp';
const ReserveModal = ({ isOpen, onClose, reserveDetails, onSave }) => {
    const realToken = useSelector((state) => state.tokenReducer.token);
    const digits=["0","1","2","3","4","5","6","7","8","9"]
    const [showPopUp, setShowPopUp] = useState(false)
    const [hamamStartHour, setHamamStartHour] = useState();
    const [hamamEndHour, setHamamEndHour] = useState();
    const [isLoading, setIsLoading] = useState(false);
  const [localReserveDetails, setLocalReserveDetails] = useState(reserveDetails);
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
  useEffect(() => {
    setLocalReserveDetails(reserveDetails);
  }, [reserveDetails]);
  const handleChange = (e) => {
    
    const { name, value } = e.target;
    setLocalReserveDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
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
        const response = await axios.post("http://localhost:3001/api/modifyFixedReserves",{
          UniqueId:localReserveDetails.UniqueId,
          FullName:localReserveDetails.FullName,
          Phone:localReserveDetails.Phone,
          Date:localReserveDetails.Date,
          Hours:JSON.stringify(selectedHours),
          CustomerType:localReserveDetails.CustomerType,
          ServiceType:localReserveDetails.ServiceType,
          SelectedService:localReserveDetails.SelectedService,
          AccoStatus:localReserveDetails.AccoStatus,
          CateringDetails:localReserveDetails.CateringDetails,
          MassorNames:localReserveDetails.MassorNames,
          Desc:localReserveDetails.Desc,
          CurrentStatus:localReserveDetails.CurrentStatus,
          SatisfactionText:localReserveDetails.SatisfactionText,
          Satisfaction:localReserveDetails.Satisfaction
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
    const selectedHours = localReserveDetails.Hours;
    try{
      setIsLoading(true)
      const response = await axios.post("http://localhost:3001/api/modifyFixedReserves",{
        UniqueId:localReserveDetails.UniqueId,
        FullName:localReserveDetails.FullName,
        Phone:localReserveDetails.Phone,
        Date:localReserveDetails.Date,
        Hours:JSON.stringify(selectedHours),
        CustomerType:localReserveDetails.CustomerType,
        ServiceType:localReserveDetails.ServiceType,
        SelectedService:localReserveDetails.SelectedService,
        AccoStatus:localReserveDetails.AccoStatus,
        CateringDetails:localReserveDetails.CateringDetails,
        MassorNames:localReserveDetails.MassorNames,
        Desc:localReserveDetails.Desc,
        FinalPrice:localReserveDetails.FinalPrice,
        CurrentStatus:localReserveDetails.CurrentStatus,
        SatisfactionText:localReserveDetails.SatisfactionText,
        Satisfaction:localReserveDetails.Satisfaction
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
    onSave(localReserveDetails);
    onClose();
  };

  // Rest of the modal content using localReserveDetails and handleChange
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
        const removeResponse = await axios.post("http://localhost:3001/api/removeHamamReserve",{
          UniqueId:localReserveDetails.UniqueId,
          FullName:localReserveDetails.FullName,
          Phone:localReserveDetails.Phone,
          Date:localReserveDetails.Date,
          
        },{
          headers:{
            Authorization: `Bearer ${realToken.realToken}`
          }
        })
        setIsLoading(false)
        setShowPopUp(false)
        onClose();
      }
      
    }catch(error){
      setIsLoading(false)
      notify("خطا",'error')
    }
  }
  return (
    <>
    {isLoading && <LoadingComp />}
   <Modal
   isOpen={isOpen} onRequestClose={onClose}
        //onAfterOpen={afterOpenModal}
        
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{margin:"10px"}}>
          <form className='formdetails' onSubmit={handleSubmit}>
            <label>ثبت کننده : {localReserveDetails.User}</label>
            <div className='formdetails-first-one'>

            <label>کد درخواست : {localReserveDetails.UniqueId}</label>
            <label>نام مهمان  
              <ReserveDetailsInput name='FullName' type='text' value={localReserveDetails.FullName} onChange={handleChange} />
            </label>
            <label>شماره تماس
              <ReserveDetailsInput name='Phone' type='number' value={localReserveDetails.Phone} onChange={handleChange} />
            </label>
            <label>تعیین وضعیت
              <select name='CurrentStatus' onChange={handleChange} value={localReserveDetails.CurrentStatus}>
                  {['Fixed','CheckedOut'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select></label>
                {localReserveDetails.CurrentStatus === "CheckedOut" && 
                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                <label>
                  <select name='Satisfaction' onChange={handleChange} value={localReserveDetails.Satisfaction}>
                  {['راضی','ناراضی'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
               
                </label>
                 <ReserveDetailsInput style={{margin:"10px"}} name='SatisfactionText' placeholder='توضیحات رضایت' value={localReserveDetails.SatisfactionText} onChange={handleChange} />
                 </div>
                }
            
            </div>
            <div className='formdetails-first-one'>
              <label>قیمت نهایی
                <ReserveDetailsInput name='FinalPrice' type='number' value={localReserveDetails.FinalPrice} onChange={handleChange} />
              </label>
            <label>تاریخ دریافت خدمات : 
              {localReserveDetails.Date}
        
           
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;    تغییر تاریخ     &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
           <DatePicker  
          name="CertainDate"
           digits={digits}
            // value={reserveDetails.Date}
            onChange={(value)=>setLocalReserveDetails({...localReserveDetails, Date : value.format('YYYY-MM-DD')})}
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
            <b><label><h3>ساعت های ارائه خدمات {localReserveDetails.Hours !== undefined && localReserveDetails.Hours[0]} تا {localReserveDetails.Hours !== undefined && localReserveDetails.Hours[localReserveDetails.Hours.length - 1]}</h3></label></b>
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
              <select name='CustomerType' onChange={handleChange} value={localReserveDetails.CustomerType}>
                  {['گروه مردانه', 'گروه زنانه', 'زوج'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
            </label>
            <label>نوع خدمات
            <select name='ServiceType' onChange={handleChange} value={localReserveDetails.ServiceType}>
                  {['حمام', 'ماساژ', 'قرق با خدمات','قرق بدون خدمات'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
            </label>
            <label>روش ارائه
            <select name='SelectedService' onChange={handleChange} value={localReserveDetails.SelectedService}>
                  {['معمولی', 'قرق', 'VIP'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
            </label>
            <label>وضعیت اقامت
            <select name='AccoStatus' onChange={handleChange} value={localReserveDetails.AccoStatus}>
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
              <ReserveDetailsInput name='CateringDetails' value={localReserveDetails.CateringDetails} onChange={handleChange}/>
           
            <label>نام خدمات دهنده</label>
              <ReserveDetailsInput type='text' name='MassorNames' value={localReserveDetails.MassorNames} onChange={handleChange} />
            
            <label>توضیحات</label>
              <ReserveDetailsInput name='Desc' value={localReserveDetails.Desc} onChange={handleChange} />
            
            </div>
            <div className='Button-container'>
            <button type='submit'>ذخیره</button>
            <button onClick={removeSpecificReserve}>حذف رزرو</button>
            </div>
            
          </form>
      </div>
      </Modal> 
      </>
  );
};

export default ReserveModal;
