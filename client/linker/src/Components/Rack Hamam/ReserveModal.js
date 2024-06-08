

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
    const [packagesWithMassors, setPackagesWithMassors] = useState([]);
    const realToken = useSelector((state) => state.tokenReducer.token);
    const [massorNamesSelected, setMassorNamesSelected] = useState([]);
    const digits=["0","1","2","3","4","5","6","7","8","9"]
    const [showPopUp, setShowPopUp] = useState(false)
    const [hamamStartHour, setHamamStartHour] = useState();
    const [hamamEndHour, setHamamEndHour] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showPackageSelector, setShowPackageSelector] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState({});
    const addNewPackage = (e) => {
      e.preventDefault();
      const newPackage = {
        packageDetails: packageList.length > 0 ? packageList[0] : {}, 
        massors: []
      };
      setPackagesWithMassors([...packagesWithMassors, newPackage]);
    };
    const addMassorToPackage = (e, packageIndex) => {
      e.preventDefault();
      const newPackagesWithMassors = [...packagesWithMassors];
      const newMassor = {
        name: massorNames.length > 0 ? massorNames[0].FullName : '',
        numeralValue: 0 // Default numeral value
      };
      newPackagesWithMassors[packageIndex].massors.push(newMassor);
      setPackagesWithMassors(newPackagesWithMassors);
    };
    const removeMassorFromPackage = (e,packageIndex, massorIndex) => {
      e.preventDefault();
      const newPackagesWithMassors = [...packagesWithMassors];
      newPackagesWithMassors[packageIndex].massors.splice(massorIndex, 1);
      setPackagesWithMassors(newPackagesWithMassors);
    };
            
    const handlePackageChange = (e, packageIndex) => {
      const newPackageDetails = packageList.find(pkg => pkg.PackageName === e.target.value);
      const updatedPackages = packagesWithMassors.map((pkg, idx) => {
        if (idx === packageIndex) {
          return { ...pkg, packageDetails: newPackageDetails || {} };
        }
        return pkg;
      });
      setPackagesWithMassors(updatedPackages);
    };
    
  

const removePackage = (e,packageIndex) => {
  e.preventDefault();
  const newPackagesWithMassors = packagesWithMassors.filter((_, index) => index !== packageIndex);
  setPackagesWithMassors(newPackagesWithMassors);
};


const handleMassorChange = (e, packageIndex, massorIndex, key) => {
  const updatedPackages = packagesWithMassors.map((pkg, idx) => {
    if (idx === packageIndex) {
      const updatedMassors = pkg.massors.map((massor, mIdx) => {
        if (mIdx === massorIndex) {
          return { ...massor, [key]: e.target.value };
        }
        return massor;
      });
      return { ...pkg, massors: updatedMassors };
    }
    return pkg;
  });
  setPackagesWithMassors(updatedPackages);
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
        setSelectedPackage(packageList[0].PackageName); 
    }
}, [packageList]); 
useEffect(() => {
  fetchDataRaw();
}, [reserveDetails]);
const fetchDataRaw = async()=>{
  if(reserveDetails !== ''){
    setLocalReserveDetails(reserveDetails);
    setSelectedPackage(reserveDetails.SelectedPackage);
    if(reserveDetails.SelectedMassorNames !== '' && reserveDetails.SelectedMassorNames !== {} && reserveDetails.SelectedMassorNames !== null){
    const parsedArray = await JSON.parse(reserveDetails.SelectedMassorNames);
    setMassorNamesSelected(parsedArray)
  }
    }
}
useEffect(() => {
  
  if (reserveDetails  && reserveDetails.SelectedPackage) {
   

      const initialPackages = JSON.parse(reserveDetails.SelectedPackage)

      setPackagesWithMassors(initialPackages);
      
  }
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
        const packageNames = packagesWithMassors.map(pkg => pkg.packageDetails.PackageName);

   
        const massorDetails = packagesWithMassors.flatMap(pkg => 
          pkg.massors.map(massor => `${massor.name} - ${massor.numeralValue}`)
          );

        const response = await axios.post("http://localhost:3001/api/modifyFixedReserves",{

          UniqueId:localReserveDetails.UniqueId,
          FullName:localReserveDetails.FullName,
          Phone:localReserveDetails.Phone,
          Date:localReserveDetails.Date,
          SelectedPackage: JSON.stringify(packagesWithMassors),
          SelectedMassors : JSON.stringify(packagesWithMassors),
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
      const packageNames = packagesWithMassors.map(pkg => pkg.packageDetails.PackageName);

   
      const massorDetails = packagesWithMassors.flatMap(pkg => 
        pkg.massors.map(massor => `${massor.name} - ${massor.numeralValue}`)
        );
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
        Desc:localReserveDetails.Desc,
        SelectedPackage: JSON.stringify(packagesWithMassors),
        SelectedMassors : JSON.stringify(packagesWithMassors),
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
           
 
            {
  packagesWithMassors.map((packageWithMassors, packageIndex) => (
    <React.Fragment key={packageIndex}>
      <div style={{display:"flex", flexDirection:"row" , columnGap:"10px", alignItems:"center",justifyContent:"center"
      }}>
      <select
        value={packageWithMassors.packageDetails.PackageName}
        onChange={(e) => handlePackageChange(e, packageIndex)}
      >
        {packageList.map((pkg) => (
          <option key={pkg.id} value={pkg.PackageName}>{pkg.PackageName}</option>
        ))}
      </select>
      {packageWithMassors.massors.map((massor, massorIndex) => (
  <div style={{display:"flex", flexDirection:"column", rowGap:"5px", alignItems:"center", justifyContent:"center"}} key={massorIndex}>
    <select
      value={massor.name}
      onChange={(e) => handleMassorChange(e, packageIndex, massorIndex, 'name')}
    >
      {massorNames.map((m) => (
        <option key={m.id} value={m.FullName}>{m.FullName}</option>
      ))}
    </select>
    <div style={{display:"flex",columnGap:"3px", flexDirection:"row",alignItems:"center", justifyContent:"center", border:"1px solid #FF6800", borderRadius:"10px", padding:"5px"}}>
    <label><b>زمان</b></label>
    <input
      type="text"
      placeholder='مدت زمان ارائه خدمات'
      value={massor.numeralValue}
      onChange={(e) => handleMassorChange(e, packageIndex, massorIndex, 'numeralValue')}
      style={{ marginLeft: '10px' }}
    />
    </div>
    <button onClick={(e) => removeMassorFromPackage(e, packageIndex, massorIndex)}>حذف خدمات دهنده</button>
  </div>
))}

      <button onClick={(e) => addMassorToPackage(e, packageIndex)}>اضافه کردن خدمات دهنده</button>
      <button 
        style={{ backgroundColor: "#FF6347", padding: "0.5rem", borderRadius: "15px", cursor: "pointer", margin: "10px" }}
        onClick={(e) => removePackage(e, packageIndex)}
      >
        حذف پکیج
      </button>
      <hr />
      </div>
    </React.Fragment>
  ))
}
<button onClick={(e) => addNewPackage(e)}>اضافه کردن پکیج</button>

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
