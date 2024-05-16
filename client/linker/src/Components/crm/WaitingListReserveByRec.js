import React,{useEffect,useState,useContext} from 'react'
import { useSelector } from "react-redux";
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import LoadingComp from '../LoadingComp.js';
import styles from '../crm/ReceptionSpecialComponents/ReceptionLeadEntry.module.css';
import { notify } from "../toast.js";
import Modal from 'react-modal';
import DatePicker, {DateObject}from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import moment from 'jalali-moment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import jwt_decode from "jwt-decode";
import { Button } from '@mui/material';
import { useHistory } from "react-router-dom";
const WaitingListReserveByRec = () =>{
  const history = useHistory();
  const [initialRegData, setInitialRegData] = useState();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [guestCallId, setGuestCallId] = useState('');
   const [otherAccoTypes, setOtherAccoTypes]= useState('');
   const [AccoRequestType, setAccoRequestType] = useState('');
   const [customerSource, setCustomerSource] = useState('');
   const [ActionEghamat, setActionEghamat] = useState('');
   const [ActionEghamatZarfiat, setActionEghamatZarfiat] = useState('');
   const [guestRequestType, setGuestRequestType] = useState('');
   const [guestName, setGuestName] = useState('');
   const [guestPhone, setGuestPhone] = useState('');
   const [values, setValues] = useState('');
   const [otherguestRequestType, setotherguestRequestType] = useState('');
   const[token,setToken] = useState('')
  const [regUser,setRegUser] = useState('')
  const [expire, setExpire] = useState('');
 
  const regData = async(e) =>{
    e.preventDefault();
    try{
      setIsLoading(true)
      const response = await axios.post("https://gmhotel.ir/api/regData",{
          callId : guestCallId,
          guestName : guestName,
          requestType : guestRequestType,
          phone : guestPhone,
          firstcalldate : initialRegData,
          customerSource : customerSource,
          RegUser:regUser,
          RequestDateAcco : values !== "" && values.format('YYYY/MM/DD'),
          Section : "2",
          AccoRequestType : AccoRequestType,
          ActionEghamat:ActionEghamat,
          ActionEghamatZarfiat:ActionEghamatZarfiat,
          OtherAccoTypes: otherAccoTypes,          
          OtherguestRequestType :otherguestRequestType

        })
        saveNewData()
        setIsLoading(false)
        notify('موفق','success')
        closeManuallyModal();
        closeModalRegData();
    }catch(error){
      notify('خطا','errir')
      setIsLoading(false)
    }
  }
  const closeManuallyModal = async()=>{
    setIsModalOpen(false);
    setInitialRegData('')
    setGuestCallId('')
    setOtherAccoTypes('')
    setAccoRequestType('')
    setCustomerSource('')
    setActionEghamat('')
    setActionEghamatZarfiat('')
    setGuestRequestType('')
    setGuestName('')
    setGuestPhone('')
    setValues('')
    setotherguestRequestType('')
  }
  const closeModalRegData = async()=>{
    setIsModalOpen(false);
    setInitialRegData('')
    setGuestCallId('')
    setOtherAccoTypes('')
    setAccoRequestType('')
    setCustomerSource('')
    setActionEghamat('')
    setActionEghamatZarfiat('')
    setGuestRequestType('')
    setGuestName('')
    setGuestPhone('')
    setValues('')
    setotherguestRequestType('')
  }
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
  const [newNameLead,setNewNameLead]=useState('');
  const [newPhoneLead, setNewPhoneLead] = useState('');
  const [leadSource,setLeadSource] = useState('');
  const [userName, setUserName] = useState('omid')
  const [showSaveButton, setShowSaveButton] = useState(true)
  const digits=["0","1","2","3","4","5","6","7","8","9"];
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
  const date = new DateObject({ calendar: persian, locale: persian_fa });
  const columns = [
    { id: 'id', label: 'ردیف' },
    { id: 'FullName', label: 'نام مهمان',editable: true  },
    { id: 'Phone', label: 'شماره تماس',editable: true },
    { id: 'Date', label: 'تاریخ تماس' },
    { id: 'RequestType', label:'نوع درخواست',editable: true},
    { id : 'Description' , label:'توضیحات',editable: true},
    { id: 'Status', label:'وضعیت پیگیری',editable: true},
    {id : 'User', label:'کاربر'}
  // Add more columns as needed
];
const statusTypes = [
  {name : 'Pending', value:"Pending"},
  {name : 'Follow up again', value:"Follow up again"},
  {name : 'Looked in', value:"Looked in"},
]



const rowsPerPageOptions = [5, 10, 25];
    const [showNewLeadModal, setShowNewLeadModal] = useState(false)
    const [showData, setShowData] = useState(false)
    const [isloading, setIsLoading] = useState(false);
    const [rawData, setRawData] = useState([])
   
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState('');
    const [order, setOrder] = useState('asc');
    const handleSort = (columnId) => {
      const isAsc = orderBy === columnId && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(columnId);
      const sortedData = [...rawData].sort((a, b) => {
        if (isAsc) {
          return a[columnId] > b[columnId] ? 1 : -1;
        } else {
          return b[columnId] > a[columnId] ? 1 : -1;
        }
      });
      setRawData(sortedData);
    };
    const saveNewData = async()=>{
      
      
     
      try{
        setIsLoading(true)
        const response = await axios.post("https://gmhotel.ir/api/receptionModifyLead",{
          data : rawData 
      })
     
      
     setIsLoading(false)
     
      notify( "اطلاعات با موفقیت ثبت شد", "success")
     
      }catch(error){
        setIsLoading(false)
        notify( "خطا", "error")
      }
    }
    const refreshToken = async () => {
      try {
        setIsLoading(true)
          const response = await axios.get('https://gmhotel.ir/api/token');
          
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);

          setRegUser(decoded.name)
          setExpire(decoded.exp);
          setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
          if (error.response) {
              history.push("/");
          }
      }
    }
    
    const axiosJWT = axios.create();
    
    axiosJWT.interceptors.request.use(async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        
          const response = await axios.get('https://gmhotel.ir/api/token');
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setExpire(decoded.exp);
      }
      return config;
    }, (error) => {
      
      Promise.reject(error);
      return 
    });
    useEffect(() => {
      refreshToken();
        
                
              
              }, []);
    useEffect(()=>{
const fetchData =async()=>{
    try{    
        setIsLoading(true)
        const response = await axios.get("https://gmhotel.ir/api/getFreshLeadsReception")
        
          
          setRawData(response.data)
          setIsLoading(false)
          
          setShowData(true)
    }catch(error){
        setIsLoading(false)
        notify("خطا",'error')
    }
}
fetchData();
    },[showNewLeadModal])
    const handleChangePage = (_, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
    const handleFieldChange = (row,column, newValue) => {
    
     
      
        
        const foundItem = rawData.find(item => item.id === row.id);
        
        setFinalFormData({...finalFormData,"RequestKey": foundItem.UniqueId,"Phone":foundItem.Phone,"FullName":foundItem.FullName})
      
      const updatedData = rawData.map((item) =>
      
        item.id === row.id ? { ...item, [column]: newValue } : item

      );
      if(newValue === 'Looked in'){
        openRegDataModal(row)
      }
      setRawData(updatedData);
    };


const openRegDataModal = (row)=>{
  setGuestName(row.FullName || '');
  setGuestPhone(row.Phone || '');
  setGuestCallId(row.UniqueId || '');
  setInitialRegData(row.Date || '');
  setIsModalOpen(true)

}
   
  return (
    <>
   {isloading && <LoadingComp />}
     {showData === true ? <>
       
       
       <div className={styles.headerTextHolder}>
         <h2>اضافه کردن سرنخ جدید</h2>
         <p style={{color:"red"}}>بعد از ایجاد تغییرات حتما ذخیره کنید</p>
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
     {rawData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
             <TableRow className={
               row.Status === "Pending" && styles.pendingView
               || row.Status === "Looked in" && styles.activeView
               || row.Status === "Follow up again" && styles.cancelView
               } key={row.id}>
               {columns.map((column) => (
  <TableCell key={column.id}>
    {column.editable || column.id === 'FullName'
    || column.id === 'Phone' ? (
      column.id !== "Status" ? (
        <textarea
          value={row[column.id]}
          onChange={(e) => handleFieldChange(row, column.id, e.target.value)}
          style={{ width: `${row.width}px`, height: `${row.height}px` }}
        />
      ) : (
       
        <select 
          value={row[column.id]}
          onChange={(e) => handleFieldChange(row, column.id, e.target.value)}
        >
          {statusTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      )
    ) : (
      row[column.id]
    )}
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
         count={rawData.length}
         rowsPerPage={rowsPerPage}
         page={page}
         onPageChange={handleChangePage}
         onRowsPerPageChange={handleChangeRowsPerPage}
         labelRowsPerPage="نمایش در هر صفحه"
       />
     </TableContainer></>:<div>
      
      {/* <LoadingComp /> */}
      </div>}
     <div style={{display:"flex",justifyContent: "center",
     alignItems: "center"}}>
     {showSaveButton && <button onClick={saveNewData} className={styles.buttonClass}>ذخیره</button>}
     </div>
     <Modal
     isOpen={isModalOpen}
     
     onRequestClose={closeManuallyModal}
     style={customStyles}
     contentLabel="Example Modal"
   >
     <div style={{display:"flex", flexDirection:"column",justifyContent: "center",alignItems: "center", direction:"rtl",padding:"5vw"}}>
       
       <h1>ثبت و ویرایش اطلاعات مشتری</h1>
       <p>call id : {guestCallId}</p>
       <form className={styles.regDataForm} onSubmit={(e)=>regData(e)}>
       <div style={{display:"flex", flexDirection:"column",justifyContent: "center",alignItems: "center", rowGap:"2vw"}}>
       <div style={{display:"flex", flexDirection:"row",justifyContent: "center",alignItems: "center", columnGap:"5px"}}>
         {isModalOpen.data !== '' &&  <>
         
         <label>نام مهمان
         <input placeholder="نام مهمان" value={guestName} onChange={(e)=>setGuestName(e.target.value)} /></label></>}
         {isModalOpen.data !== '' && <>
         <label>شماره تماس
         <input type="text" placeholder="شماره تماس" value={guestPhone} onChange={(e)=>setGuestPhone(e.target.value)} />
        </label>
         </> }
          </div>
          <div style={{display:"flex", flexDirection:"row",justifyContent: "center",alignItems: "center", columnGap:"5px"}}>
          <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
         <label>نوع درخواست</label>
         <select
     id="selectBox1"
     value={guestRequestType}
     onChange={(e)=>setGuestRequestType(e.target.value)}>
       <option value="default">انتخاب کنید</option>
     <option value="رستوران">رستوران</option>
     <option value="اقامت">اقامت</option>
     <option value="حمام سنتی">حمام سنتی</option>
     <option value="سایر">سایر</option>
   </select>
   </div>
   {guestRequestType === "اقامت" &&
   <>
   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
   <label>تاریخ ورود</label>
    <DatePicker
        required 
        digits={digits}
        value={values}
        onChange={value=>{setValues(value)}} 
         calendar={persian}
         locale={persian_fa}
         format="DD/MM/YYYY"
         placeholder="تاریخ ورود"
         inputMode="single"
          single
         
       ></DatePicker>
       </div>
       </>
   }
   {guestRequestType === "اقامت" &&
   <>
   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
   <label>موضوع اقامت</label>
   <select
     id="selectBoxEghamat"
     value={AccoRequestType}
     onChange={(e)=>setAccoRequestType(e.target.value)}
     
     >
      <option value="null">انتخاب کنید</option>
     <option value="بررسی قیمت">بررسی قیمت</option>
     <option value="بررسی ظرفیت">بررسی ظرفیت</option>
     <option value="سایر">سایر</option>
     <option value="پیگیری رزرو">پیگیری رزرو</option>
     <option value="کنسل">کنسل</option>
   </select></div></>}
   {AccoRequestType === "بررسی قیمت" &&  guestRequestType === "اقامت" &&
   <>
   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
   <label>نوع لیست قیمت</label>
   <select
   id="selectBoxActionEghamat"
   value={ActionEghamat}
   onChange={(e)=>setActionEghamat(e.target.value)}>
    <option value="null">انتخاب کنید</option>
    <option value="priceListIrani">ارسال کاتالوگ قیمت دار ایرانی</option>
    <option value="priceListKhareji">ارسال کاتالوگ قیمت دار خارجی</option>
    <option value="priceListOral">قیمت ها شفاهی گفته شد</option>
   </select>
   </div>
   </>}
   {AccoRequestType === "بررسی ظرفیت" && guestRequestType === "اقامت" &&
   <>
   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
    <label>نتیجه</label>
   <select
   id="ActionEghamatZarfiat"
   value={ActionEghamatZarfiat}
   onChange={(e)=>setActionEghamatZarfiat(e.target.value)}>
    <option value="null">انتخاب کنید</option>
    <option value="عدم موجودی ظرفیت">عدم موجودی ظرفیت</option>
    <option value="ظرفیت موجود">ظرفیت موجود</option>
    <option value="رزرو انجام شد">رزرو انجام شد</option>
    <option value="رزرو انجام نشد">رزرو انجام نشد</option>
   </select>
   </div>
   </>}
   {AccoRequestType === "سایر" || AccoRequestType === "پیگیری رزرو" || AccoRequestType === "کنسل"  ?
   <>
   {guestRequestType === "اقامت" && 
   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
   <label>توضیحات</label>
   <textarea id="otherAccoTypes" name="otherAccoTypes" value={otherAccoTypes} onChange={(e)=>setOtherAccoTypes(e.target.value)} rows="4" cols="50" />
   </div>}
   
   </>
   :
   null
   }
   {guestRequestType === "حمام سنتی" && <></>}
   {guestRequestType === "رستوران" && <></>}
   {guestRequestType === "سایر" && 
   <>
   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
   <label>توضیحات</label>
   <textarea placeholder="توضیحات" id="otherguestRequestType" name="otherguestRequestType" value={otherguestRequestType} onChange={(e)=>setotherguestRequestType(e.target.value)} rows="4" cols="50" />
   
   </div>
   </>}

   <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", columnGap:"1rem"}}>
   <label>نحوه آشنایی</label>
   <select
     id="selectBox3"
     value={customerSource}
     onChange={(e)=>setCustomerSource(e.target.value)}>
       {customerSource === '' && <option value="">نحوه آشنایی</option>}
       {customerSource !== '' && <option value={customerSource}>{customerSource}</option>}
     <option value="اینستاگرام">اینستاگرام</option>
     <option value="اینترنت">اینترنت</option>
     <option value="آژانس">مهمان قبلی</option>
     <option value="سایر">سایر</option>
   </select>
   </div>
   </div>
   </div>
   
         {isModalOpen.type === "haveBackGround" &&
         <div className={styles.gridContainer}>
         {isModalOpen.data.serverRes.map((value, index) => (
           <div key={index} className={styles.dataContainer}>
             <h3>تاریخ تماس :  {value.LastCall}</h3>
             <h3>نوع درخواست : {value.RequestType}</h3>
             <h3>نتیجه :{value.Result}-{value.OtherguestRequestType}-{value.OtherAccoTypes}-{value.ActionEghamatZarfiat}-{value.ActionEghamat}-{value.AccoRequestType}</h3>
             <h3>اپراتور : {value.RegUser}</h3>
             <h3>بخش : {value.Section}</h3>
             <div className={styles.divider}></div>
           </div>
         ))}
       </div>
         }
        
         <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",columnGap:"2vw"}}>
         <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
           
         </div>
         
         
        
         </div>
         
         <div style={{margin:"1vw",display:"flex", flexDirection:"row",justifyContent: "center", alignItems: "center", columnGap:"1vw"}}>
         <Button type="submit"  sx={{fontFamily:"shabnam"}} variant="outlined">ثبت</Button>
         <Button  sx={{fontFamily:"shabnam"}} onClick={closeModalRegData} variant="outlined">بستن</Button>
         </div>
         
       </form>
       
       
     </div>
     
   </Modal>
   </>
  )
}

export default WaitingListReserveByRec
