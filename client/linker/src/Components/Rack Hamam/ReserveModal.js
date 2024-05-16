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
const ReserveModal = ({ isOpen, onClose, reserveDetails, onSave,packageList,massorNames }) => {

    const realToken = useSelector((state) => state.tokenReducer.token);
    const [massorNamesSelected, setMassorNamesSelected] = useState([]);
    const digits=["0","1","2","3","4","5","6","7","8","9"]
    const [showPopUp, setShowPopUp] = useState(false)
    const [hamamStartHour, setHamamStartHour] = useState();
    const [hamamEndHour, setHamamEndHour] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showPackageSelector, setShowPackageSelector] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState({});
    const handlePackageChange = (e) => {
      setSelectedPackage(e.target.value);
  };
  
    const handleAddMassor = () => {
      const defaultValue = packageList.length > 0 ? packageList[0].FullName : '';
      setMassorNamesSelected([...massorNamesSelected, defaultValue]); 
  };
  
  const handleRemoveMassor = (index) => {
    setMassorNamesSelected(prevMassors => prevMassors.filter((_, i) => i !== index));
};
  const togglePackageSelector = () => {
    setShowPackageSelector(!showPackageSelector);
    const defaultValue = packageList.length > 0 ? packageList[0].PackageName : '';
    console.log(defaultValue);
    console.log(packageList)
      setSelectedPackage(defaultValue); 
};
const handleMassorChange = (index, event) => {
  const value = event.target.value || (massorNames.length > 0 ? massorNames[0].FullName : ''); 
  const newMassors = [...massorNamesSelected];
  newMassors[index] = value;
  setMassorNamesSelected(newMassors);
};

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
    if (packageList.length > 0) {
        setSelectedPackage(packageList[0].PackageName); // Set default to the first package's name
    }
}, [packageList]); // Dependency array to ensure this runs only when packageList changes
useEffect(() => {
  fetchDataRaw();
}, [reserveDetails]);
const fetchDataRaw = async()=>{
  if(reserveDetails !== ''){
    setLocalReserveDetails(reserveDetails);
    setSelectedPackage(reserveDetails.SelectedPackage);
   console.log(reserveDetails.SelectedMassorNames)
    if(reserveDetails.SelectedMassorNames !== '' && reserveDetails.SelectedMassorNames !== {} && reserveDetails.SelectedMassorNames !== null){
      console.log("test")
    const parsedArray = await JSON.parse(reserveDetails.SelectedMassorNames);
    setMassorNamesSelected(parsedArray)
  }
    }
}
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
        const response = await axios.post("https://gmhotel.ir/api/modifyFixedReserves",{
          UniqueId:localReserveDetails.UniqueId,
          FullName:localReserveDetails.FullName,
          Phone:localReserveDetails.Phone,
          Date:localReserveDetails.Date,
          SelectedPackage: selectedPackage,
          SelectedMassors : JSON.stringify(massorNamesSelected),
          Hours:JSON.stringify(selectedHours),
          CustomerType:localReserveDetails.CustomerType,
          ServiceType:localReserveDetails.ServiceType,
          SelectedService:localReserveDetails.SelectedService,
          AccoStatus:localReserveDetails.AccoStatus,
          CateringDetails:localReserveDetails.CateringDetails,
          
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
          setSelectedPackage({})
          setMassorNamesSelected([])
          setShowPackageSelector(false)
          setShowPopUp(false)
          setShowPackageSelector(false)
      }catch(error){
          setIsLoading(false)
          notify("خطا",error)
          console.log(error)
      }
      
      
  }else{
    const selectedHours = localReserveDetails.Hours;
    try{
      setIsLoading(true)
      const response = await axios.post("https://gmhotel.ir/api/modifyFixedReserves",{
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
        Desc:localReserveDetails.Desc,
        SelectedPackage: selectedPackage,
        SelectedMassors : JSON.stringify(massorNamesSelected),
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
        setSelectedPackage({})
        setMassorNamesSelected([])
        setShowPackageSelector(false)
        setShowPopUp(false)
        setShowPackageSelector(false)
    }catch(error){
        setIsLoading(false)
        notify("خطا",error)
    }
  }
    // onSave(localReserveDetails);
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
        const removeResponse = await axios.post("https://gmhotel.ir/api/removeHamamReserve",{
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
  const onCloseHandler = () => {
    setShowPopUp(false);  
    setLocalReserveDetails({});
    setHamamStartHour('');
    setHamamEndHour('');
    setLocalReserveDetails('')
    setSelectedPackage('')
    setMassorNamesSelected([])
    setShowPackageSelector(false)
    onClose();  
  };
  return (
    <>
    {isLoading && <LoadingComp />}
   <Modal
   isOpen={isOpen} onRequestClose={onCloseHandler}
        //onAfterOpen={afterOpenModal}
        
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{margin:"10px"}}>
          <form className='formdetails' onSubmit={handleSubmit}>
            <div style={{display:"flex", flexDirection:"row", columnGap:"5rem", justifyContent:"center", alignItems:"center"}}>
            <label>ثبت کننده : {localReserveDetails.User}</label>
            <label>کد درخواست : {localReserveDetails.UniqueId}</label>
            </div>
            <div className='formdetails-first-one'>
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
                 <textarea style={{margin:"10px"}} name='SatisfactionText' placeholder='توضیحات رضایت' value={localReserveDetails.SatisfactionText} onChange={handleChange} />
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
           
            
            
            <label>توضیحات</label>
              <textarea name='Desc' value={localReserveDetails.Desc} onChange={handleChange} />
            
            </div>
           
            <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", columnGap:"5px"}}>
              
    {massorNamesSelected !== {} && massorNamesSelected !== '' && massorNamesSelected !== null  ? massorNamesSelected.map((selectedMassor, index) => (
       <>   
       <div style={{display:"flex", flexDirection:"column",alignItems:"center", justifyContent:"center", rowGap:"5px" }}>
            <select 
                value={selectedMassor}
                onChange={(e) => handleMassorChange(index, e)}
                style={{ marginRight: '10px' }}>
                {massorNames.map(massor => (
                
                    <option key={massor.id} value={massor.FullName}>{massor.FullName}</option>
                ))}
            </select>
            <div  onClick={() => handleRemoveMassor(index)} style={{backgroundColor:"#FF2A00" , padding:"0.5rem" , borderRadius:"15px", cursor:"pointer"}}>
                حذف خدمات دهنده
            </div>
            </div>
       </>
    )):massorNames.map((selectedMassor, index) => (
      <>   
      <div style={{display:"flex", flexDirection:"column",alignItems:"center", justifyContent:"center", rowGap:"5px" }}>
           <select 
               value={selectedMassor.FullName}
               onChange={(e) => handleMassorChange(index, e)}
               style={{ marginRight: '10px' }}>
               {massorNames.map(massor => (
               
                   <option key={massor.id} value={massor.FullName}>{massor.FullName}</option>
               ))}
           </select>
           <div  onClick={() => handleRemoveMassor(index)} style={{backgroundColor:"#FF2A00" , padding:"0.5rem" , borderRadius:"15px", cursor:"pointer"}}>
               حذف خدمات دهنده
           </div>
           </div>
      </>
   ))}
    <div style={{backgroundColor:"#00FFFF" , padding:"0.5rem" , borderRadius:"15px", cursor:"pointer"}} onClick={handleAddMassor}>اضافه کردن خدمات دهنده</div>
    <div style={{backgroundColor:"#00FFFF" , padding:"0.5rem" , borderRadius:"15px", cursor:"pointer" }} onClick={togglePackageSelector}>
    {showPackageSelector ? "حذف پکیج" : "انتخاب پکبج"}
</div >
{showPackageSelector || selectedPackage ? (
    <select 
        name='SelectedPackage' 
        onChange={handlePackageChange} 
        value={selectedPackage}
    >
        {packageList.map(pkg => (
            <option key={pkg.id} value={pkg.PackageName}>{pkg.PackageName}</option>
        ))}
    </select>
          ):null}
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
