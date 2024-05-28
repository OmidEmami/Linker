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
import Logo from '../../../assests/logoBrown.png';
import axios from 'axios';
import LoadingComp from '../../../Components/LoadingComp';
import styles from './ReceptionLeadEntry.module.css';
import { notify } from "../../../Components/toast";
import Modal from 'react-modal';
import DatePicker, {DateObject}from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import moment from 'jalali-moment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom';
import LeadContext from '../../../context/LeadContext';
import CrmComponentReception from './CrmComponentReception';
const ReceptionLeadEntry = () =>{
  const history = useHistory();
    const { phoneNumberSocket, removePhoneNumber } = useContext(LeadContext);
  
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
 
  const [token,setToken] = useState('');
  const [expire, setExpire] = useState('')
  const [regUser, setRegUser] = useState('')
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
    const realToken = useSelector((state) => state.tokenReducer.token);
    
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
    useEffect(()=>{
const fetchData =async()=>{
    try{    
      setIsLoading(true)
        const response = await axios.get("https://gmhotel.ir/api/getFreshLeadsReception")
        
          
          setRawData(response.data)
          
          
          setShowData(true)
          setIsLoading(false)
    }catch(error){
        setIsLoading(false)
        notify("خطا",'error')
    }
}
fetchData();
    },[showNewLeadModal,phoneNumberSocket])
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
     
      setRawData(updatedData);
    };

const saveNewManualLead = async (e) => {
  e.preventDefault();
  try {
    setIsLoading(true)
    
    const response = await axios.post('https://gmhotel.ir/api/receptionManualNewLead', {
      Name: newNameLead,
      Phone: newPhoneLead,
      LeadSource: leadSource,
      User: regUser,
    });

    if (response.status === 200) {
     setIsLoading(false)
      notify("اطلاعات با موفقیت ثبت شد", "success");
      setShowNewLeadModal(false)
    } else {
      setIsLoading(false)
      notify("خطا",'error')
      throw new Error('Failed to save data'); 
      
      // Handling unexpected response codes
    }
  } catch (error) {
    notify('خطا', 'error');
    console.error(error);
    setIsLoading(false)
  }
};

   
  return (
    <>
    {isloading && <LoadingComp />}
    <CrmComponentReception />
     {showData === true ? <>
       
       
       <div className={styles.headerTextHolder}>
         <h2>اضافه کردن سرنخ جدید</h2>
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
        // For Status column, use dynamic options from statusTypes
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
         isOpen={showNewLeadModal}
         //onAfterOpen={afterOpenModal}
         onRequestClose={()=>setShowNewLeadModal(false)}
         style={customStyles}
         contentLabel="Example Modal"
         
       >
         <div style={{padding:"2vw"}}>
         <h3 style={{textAlign:"center"}}>افزودن سرنخ</h3>
         <form className={styles.ManualLead} onSubmit={saveNewManualLead}>
           
           <label>نام مشتری</label>
             <input required type='text' value={newNameLead} onChange={(e)=>setNewNameLead(e.target.value)} />
          
           <label>شماره تماس </label>
          <input required type='number' value={newPhoneLead} onChange={(e)=>setNewPhoneLead(e.target.value)} />
 
          
            <label>منبع سر نخ</label>
             
             <select required onChange={(e)=>setLeadSource(e.target.value)} value={leadSource}>
                   {['منبع سر نخ را انتخاب کنید','Instagram','تماس با هتل','مهمان مقیم','پیامک بعد از رزرو قطعی','مهمان قبلی','آژانس','اینترنت','سایر'].map(option => (
                     <option key={option} value={option}>
                       {option}
                     </option>
                   ))}
                 </select>
                 
           <button className={styles.buttonClass} type='submit'>ثبت</button>
         </form>
       </div>
       </Modal>
   </>
  )
}

export default ReceptionLeadEntry
