import React, { useState,useEffect } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Logo from '../assests/logoBrown.png';
import axios from 'axios';
import LoadingComp from '../Components/LoadingComp';
import styles from './RequestFollowUp.module.css';
import { notify } from "../Components/toast";
import Modal from 'react-modal';
import DatePicker, {DateObject}from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import moment from 'jalali-moment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import jwt_decode from "jwt-decode";
const columns = [
    { id: 'id', label: 'ردیف' },
    { id: 'FullName', label: 'نام مهمان',editable: true  },
    { id: 'Phone', label: 'شماره تماس' },
    { id: 'HamamType', label: 'نوع حمام' },
    {id: 'PreferedDate' , label :'تاریخ های پیشنهادی'},
    {id: 'UniqueId', label : 'شماره درخواست'},
    {id:'RequestDate', label:'تاریخ ثبت',sortable:"true"},
    {id: 'FirstFollow', label:'نتیجه پیگیری اول'},
    {id :'Status', label :'وضعیت',sortable:"true"},
    {id : 'Source', label :'منبع',sortable:"true"},
    {id: 'User', label: 'کاربر',sortable:"true"}
  // Add more columns as needed
];

const rowsPerPageOptions = [5, 10, 25];

const RequestFollowUp = () => {
  const [userName, setUserName] = useState('')
  const [token, setToken] = useState('');
  
  

  
  const hamamTypes = [
    {name : 'menHamam', value:"حمام مردانه"},
    {name : 'womenHamam', value:"حمام زنانه"},
    {name : 'massage', value:"ماساژ"},
    {name : 'traditionalHamam', value:"دلاکی سنتی"},
    {name: 'normalexclusive' ,value:"قرق عادی"},
    {name : 'vipexclusive', value:"قرق VIP"}
  ]
  const [hamamType,setHamamType] = useState('') 
  const [newNameLead,setNewNameLead] = useState('');
  const [newPhoneLead, setNewPhoneLead] = useState('');
  const [leadSource, setLeadSource] = useState('')
  const [showData, setShowData] = useState(false)
  const [hamamStartHour, setHamamStartHour] = useState();
  const [hamamEndHour, setHamamEndHour] = useState();
  const [showNewLeadModal, setShowNewLeadModal] = useState(false)
  const date = new DateObject({ calendar: persian, locale: persian_fa });
  const [finalPrice, setFinalPrice] = useState("")
  const [values, setValues] = useState([]);
  const digits=["0","1","2","3","4","5","6","7","8","9"];
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width:"80%",
      height:"90%"
    }
  };
  const [finalFormData, setFinalFormData] = useState({
    RequestKey :"",
    FullName:"",
    Phone:"",
    CertainDate:"",
    CertainHour:"",
    CustomerType:"",
    ServiceType:"",
    SelectedService:"",
    AccoStatus:"",
    CateringDetails:" ",
    MassorNames:"",
    Desc:" "
  })     
  const [initialPopup, setInitialPopup] = useState(false)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false)
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
    const sortedData = [...data].sort((a, b) => {
      if (isAsc) {
        return a[columnId] > b[columnId] ? 1 : -1;
      } else {
        return b[columnId] > a[columnId] ? 1 : -1;
      }
    });
    setData(sortedData);
  };
  useEffect(() => {
    
    const fetchData=async()=>{
        setShowData(false)
        setIsLoading(true)
      
        try{
          
          const responseToken = await axios.get('http://localhost:3001/api/token');
          setToken(responseToken.data.accessToken)
          const decoded = jwt_decode(responseToken.data.accessToken);
          setUserName(decoded.name)
            const response = await axios.get("http://localhost:3001/api/getNewLeads",{
              headers:{
                Authorization: `Bearer ${responseToken.data.accessToken}`
              }
            })
            const sortedData = response.data.sort((a, b) => new Date(b.RequestDate) - new Date(a.RequestDate));
            setData(sortedData);
                setData(response.data)
                setShowData(true)
                setIsLoading(false)
        }catch(error){

        }

    }
    fetchData();
          }, []);
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFieldChange = (row,column, newValue) => {
    
    setShowSaveButton(true)
    if(newValue === "Reserve Finalized"){
      setInitialPopup(true)
      
      const foundItem = data.find(item => item.id === row.id);

      setFinalFormData({...finalFormData,"RequestKey": foundItem.UniqueId,"Phone":foundItem.Phone,"FullName":foundItem.FullName})
    }
    const updatedData = data.map((item) =>
    
      item.id === row.id ? { ...item, [column]: newValue } : item
    );
    setData(updatedData);
  };
  const saveNewData = async()=>{
    setShowSaveButton(false)
    setRegisterLoading(true)
   
    try{
      const response = await axios.post("http://localhost:3001/api/regFollowLead",{
        data : data 
    },{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    
   if(response.data === "Omid"){
    setRegisterLoading(false)
    notify( "اطلاعات با موفقیت ثبت شد", "success")
   }
    }catch(error){
      setRegisterLoading(false)
      notify( "خطا", "error")
    }
  }
  const FinalReserveDetails = async(e)=>{
    
    e.preventDefault();
    if (hamamStartHour && hamamEndHour) {
      const firstHour = hamamStartHour.hour();
      const secondHour = hamamEndHour.hour();
    
      const start = firstHour < secondHour ? firstHour : secondHour;
      const end = firstHour > secondHour ? firstHour : secondHour;
    
      // Create an array from start to end and map each number to ensure it has a leading zero if it's less than 10
      const selectedHours = Array.from({ length: end - start + 1 }, (_, index) => start + index)
        .map(hour => hour < 10 ? `0${hour}` : `${hour}`);
    
       
   try{
    
    setIsLoading(true)
    const response = await axios.post("http://localhost:3001/api/HamamReserveDetail",{
          RequestKey:finalFormData.RequestKey,
          FullName:finalFormData.FullName,
          Phone:finalFormData.Phone,
          CertainDate:finalFormData.CertainDate.format('YYYY-MM-DD'),
          CertainHour:JSON.stringify(selectedHours),
          CustomerType:finalFormData.CustomerType,
          ServiceType:finalFormData.ServiceType,
          SelectedService:finalFormData.SelectedService,
          AccoStatus:finalFormData.AccoStatus,
          CateringDetails:finalFormData.CateringDetails,
          MassorNames:finalFormData.MassorNames,
          Desc:finalFormData.Desc,
          FinalPrice:finalPrice,
          User:userName
    },{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    
    if(response.status === 200){
      setIsLoading(false)
      notify( "اطلاعات شما با موفقیت ثبت شد", "success")
      setInitialPopup(false)
     
    }
   }catch(error){
    if(error.response.data.msg === "interference"){
      notify('این رزرو تداخل دارد', "error")
      setIsLoading(false)
    }else{
    
    notify( "خطا", "error")
    setIsLoading(false)
  }
   }
  }
}
  const handleFinalReserveDetailsForm =async(e)=>{
   
    const { name, value } = e.target;

    setFinalFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  }
  const saveNewManualLead = async(e)=>{
    e.preventDefault();
    
    if(hamamType !== '' && leadSource !== ''){
    
    var dates = [];
    for(let i = 0 ; i < values.length ; i++){
      dates = [...dates, moment.from(values[i].format(), 'fa', 'DD/MM/YYYY').format('jYYYY-jMM-jDD')]
    }
    try{
      
      const response = await axios.post('http://localhost:3001/api/manualNewLead',{
        Name:newNameLead,
        Phone:newPhoneLead,
        LeadSource:leadSource,
        Dates:dates.toString(),
        HamamType:hamamType.join(','),
        User:userName
      },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      if(response.data === "ok"){
        
        // window.location.reload();
        notify("سر نخ جدید با موفقیت وارد شد","success")
        setShowNewLeadModal(false)
        // handleReloadPage();
         window.location.reload();
      }else{
        notify('خطا','error')
      }
      
    }catch(error){
      notify('خطا','error')
    }
  }else{
    notify("لطفا همه موارد را تکمیل کنید","error")
  }
  }
  const changeHamamTypes = (e) =>{
    if(e.target.checked){
    setHamamType([...hamamType , e.target.value])
    }else{
      const updatedItems = hamamType.filter(item => item !== e.target.value);
      setHamamType(updatedItems)
    }
  }
  return (
   <>
   {registerLoading && <LoadingComp/>}
   {isLoading && <LoadingComp/>}
    {showData === true ? <>
      <div className={styles.HeaderCustomer}>
        
        <img className={styles.LogoContainer} alt='logo' src={Logo} />
      </div>
      
      <div className={styles.headerTextHolder}>
        <h2>مدیریت درخواست های حمام</h2>
        <p style={{color:"red"}}>بعد از ایجاد تغییرات حتما ذخیره کنید</p>
        </div>
        <div style={{display:"flex", direction:"rtl", marginRight:"2rem"}}>
          <button onClick={()=>setShowNewLeadModal(true)} className={styles.buttonClass}>ایجاد سرنخ جدید</button>
          </div>
        
    <TableContainer className={styles.MainContainer} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} onClick={() => column.sortable && handleSort(column.id)}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <TableRow className={
              row.Status === "Pending" && styles.pendingView
              || row.Status === "Reserve Finalized" && styles.activeView
              || row.Status === "Called - Declined" && styles.cancelView
              || row.Status === "Checked Out" && styles.checkoutView
              || row.Status === "In Progress" && styles.inprogressView
              || row.Status === "Called no answer" && styles.callednoanswerView
              || row.Status === "Called - Accepted, waiting for reservation" && styles.calledacceptedView
              } key={row.id}>
              {/* 'Checked Out', 'In Progress', 'Pending','Called no answer','Called - Declined' , 'Called - Accepted, waiting for reservation', 'Reserve Finalized' */}
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {column.editable || column.id === 'FullName'
                  || column.id === 'Phone' || column.id === 'HamamType' || column.id === 'FirstFollow'
                  || column.id === 'PreferedDate'
                  ? (column.id !== "Status" ?(
                    <textarea
                    sx={{
                      '--Textarea-focusedInset': 'var(--any, )',
                      '--Textarea-focusedThickness': '0.25rem',
                      '--Textarea-focusedHighlight': 'rgba(13,110,253,.25)',
                      '&::before': {
                        transition: 'box-shadow .15s ease-in-out',
                      },
                      '&:focus-within': {
                        borderColor: '#86b7fe',
                      },
                    }}
                      value={row[column.id]}
                      onChange={(e) => handleFieldChange(row,column.id, e.target.value)}
                      style={{ width: `${row.width}px`, height: `${row.height}px` }}
                    />
                  ): <select onChange={(e) => handleFieldChange(row,column.id, e.target.value)} value={row[column.id]}><option value={row[column.id]}>{row[column.id]}</option>
                  <option value="Active">Active</option>
                  <option value="Cancel">Cancel</option>
                  </select>) : (column.id !== "Status" ?(row[column.id]):(
                  <select onChange={(e) => handleFieldChange(row, column.id, e.target.value)} value={row[column.id]}>
                  {['Checked Out', 'In Progress', 'Pending','Called no answer','Called - Declined' , 'Called - Accepted, waiting for reservation', 'Reserve Finalized'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>)
                   
                  )}
                  {/* {column.id === 'Source' && <select>
                    <option value="">omid</option>
                    </select>} */}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        className={styles.pager}
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="نمایش در هر صفحه"
      />
    </TableContainer></>:<div><LoadingComp /></div>}
    <div style={{display:"flex",justifyContent: "center",
    alignItems: "center"}}>
    {showSaveButton && <button onClick={saveNewData} className={styles.buttonClass}>ذخیره</button>}
    </div>
    <Modal
        isOpen={initialPopup}
        //onAfterOpen={afterOpenModal}
        onRequestClose={()=>setInitialPopup(false)}
        style={customStyles}
        contentLabel="Example Modal"
        
      >
        <div>
        <h3 style={{direction:"rtl"}}>لطفا جزئیات رزرو را تکمیل کنید</h3>
        <form className={styles.finalizeFormData} onSubmit={FinalReserveDetails}>
          <div className={styles.partOneFinalForm}>
          <label>نام کامل</label>
          <input required name="FullName" onChange={handleFinalReserveDetailsForm} type='text' value={finalFormData.FullName} />
          <label>شماره تماس</label>
          <input required type='number' name='Phone'  onChange={handleFinalReserveDetailsForm} value={finalFormData.Phone} />
          <label>شماره درخواست</label>
          <input required type='text' name='RequestKey' onChange={handleFinalReserveDetailsForm} value={finalFormData.RequestKey} />
          </div>
          <div className={styles.partTwoFinalForm}>
          <label>تاریخ تایید شده</label>
          <DatePicker  
          name="CertainDate"
           digits={digits}
            value={finalFormData.CertainDate}
            onChange={(value)=>setFinalFormData({...finalFormData, CertainDate : value})}
                style={{fontFamily:"Shabnam"}}
             calendar={persian}
             locale={persian_fa}
             calendarPosition="bottom-right"
             format="DD/MM/YYYY"
             placeholder='تاریخ تایید شده'
           ></DatePicker>
           
           <label>ساعت شروع</label>
           <LocalizationProvider dateAdapter={AdapterDayjs}>
           <TimePicker value={hamamStartHour} onChange={(value)=>setHamamStartHour(value)} views={['hours']} />
           </LocalizationProvider>
           <label>ساعت پایان</label>
           <LocalizationProvider dateAdapter={AdapterDayjs}>
           <TimePicker value={hamamEndHour} onChange={(value)=>setHamamEndHour(value)} views={['hours']} />
           </LocalizationProvider>
           </div>
           <div className={styles.partThreeFinalForm}>
            <label>نوع مشتری</label>
           <select required name='CustomerType' onChange={handleFinalReserveDetailsForm} value={finalFormData.CustomerType}>
           <option value="none" selected>نوع مشتری</option>
            <option>گروه مردانه</option>
            <option>گروه زنانه</option>
            <option>زوج</option>
            
           </select>
           <label>قیمت نهایی</label>
                  <input placeholder='قیمت نهایی' type='number' value={finalPrice} onChange={(e)=>setFinalPrice(e.target.value)}/>
           <label>نوع خدمات</label>
           <select required name='ServiceType' onChange={handleFinalReserveDetailsForm} value={finalFormData.ServiceType}>
            <option value="none" selected>نوع خدمات</option>
            <option>حمام</option>
            <option>ماساژ</option>
            <option>قرق با خدمات</option>
            <option>قرق بدون خدمات</option>
           </select>
           <label>روش ارائه</label>
           <select required name='SelectedService' onChange={handleFinalReserveDetailsForm} value={finalFormData.SelectedService}>
            <option value="none">روش ارائه</option>
            <option>معمولی</option>
            <option>قرق</option>
            <option>VIP</option>
           </select>
           </div>
           <div className={styles.partFourFinalForm}>
            <select required name='AccoStatus' onChange={handleFinalReserveDetailsForm} value={finalFormData.AccoStatus}>
              <option value="none">وضعیت اقامت</option>
              <option>مقیم هتل</option>
              <option>غیر مقیم</option>
            </select>
            <label>نوع پذیرایی</label>
            <textarea  name='CateringDetails' onChange={handleFinalReserveDetailsForm} type='text' value={finalFormData.CateringDetails} />
            <label>نام خدمات دهنده</label>
            <input name="MassorNames" onChange={handleFinalReserveDetailsForm} type='text' value={finalFormData.MassorNames} />
            <label>توضیحات دیگر</label>
            <textarea name='Desc' onChange={handleFinalReserveDetailsForm} type='text' value={finalFormData.Desc} />
            </div>
            <button type='submit'>ذخیره</button>   
        </form>
      </div>
      </Modal>
      <Modal
        isOpen={showNewLeadModal}
        //onAfterOpen={afterOpenModal}
        onRequestClose={()=>setShowNewLeadModal(false)}
        style={customStyles}
        contentLabel="Example Modal"
        
      >
        <div style={{padding:"2vw"}}>
        <h3 style={{textAlign:"center"}}>اضافه کردن سر نخ بصورت دستی</h3>
        <form className={styles.ManualLead} onSubmit={saveNewManualLead}>
          <div className={styles.firstRowFormManual}>
          <div>
          <label>نام مشتری</label>
            <input required type='text' value={newNameLead} onChange={(e)=>setNewNameLead(e.target.value)} />
          </div>
          <label>شماره تماس </label>
         <input required type='number' value={newPhoneLead} onChange={(e)=>setNewPhoneLead(e.target.value)} />

         <div>
          <label>تاریخ های پیشنهادی</label>
          <DatePicker 
                       required 
           digits={digits}
            value={values}
            onChange={value=>{setValues(value)
            }}
                style={{fontFamily:"Shabnam", width:"100%"}}
             calendar={persian}
             locale={persian_fa}
             calendarPosition="bottom-right"
             format="DD/MM/YYYY"
             placeholder='تاریخ پیشنهادی دریافت خدمات'
           ></DatePicker>
           </div>
           </div>
           <div style={{display:"flex", flexDirection:"row",justifyContent:'center', alignItems:'center',columnGap:"2vw" }}>
           <div style={{display:"flex", flexDirection:"column",justifyContent:'center', alignItems:'center',rowGap:"2vw" }}>
           <label>منبع سر نخ</label>
            
            <select required onChange={(e)=>setLeadSource(e.target.value)} value={leadSource}>
                  {['منبع سر نخ را انتخاب کنید','Instagram','تماس با هتل','مهمان مقیم','پیامک بعد از رزرو قطعی'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                </div>
                </div>

           <label>انتخاب نوع سرویس حمام</label>
                                  <div style={{display:"flex", justifyContent:'space-between', alignItems:'center'}}>
                                    <div style={{display:"flex",flexDirection:"column"}}>
                                  {hamamTypes.map((info,index)=>(
                                    
                                    
                                    <input  style={{margin:"1rem", width:"1rem", height:'1.4rem'}} type='checkbox' name={info.name} value={info.value} onChange={(e)=>changeHamamTypes(e)}/>
                                    
                                    
                                  ))}
                                  </div>
                                  <div style={{display:"flex",flexDirection:"column"}}>
                                  {hamamTypes.map((info,index)=>(
                                    
                                    <label style={{margin:"1rem"}}>{info.value}</label>
                                    
                                  ))}
                                  </div>
                                  
                                  
                                  </div>
          <button className={styles.buttonClass} type='submit'>ثبت</button>
        </form>
      </div>
      </Modal>
  </>
  );
};

export default RequestFollowUp;