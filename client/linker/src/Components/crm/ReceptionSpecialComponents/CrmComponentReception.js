import React, { useState,useEffect, useContext } from "react";
import axios from "axios";
import DatePicker, { DateObject,getAllDatesInRange }from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import moment from 'jalali-moment';
import styles from "../CrmComponent.module.css";
import { FcCallback } from "react-icons/fc";
import { notify } from "../../../Components/toast.js"
import Modal from 'react-modal';
import Button from '@mui/material/Button';

import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingComp from "../../../Components/LoadingComp.js";
import LeadContext from "../../../context/LeadContext";
const CrmComponentReception =()=>{
  const { setPhoneNumberSocket } = useContext(LeadContext);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '90%', // Adjust the width as needed
      overflow: 'auto',
      height:"90%", // This will make the content scrollable,
      borderRadius: "15px",
    },
  };
  
  const realToken = useSelector((state) => state.tokenReducer.token);
  const [values, setValues] = useState('');
  const digits=["0","1","2","3","4","5","6","7","8","9"];
    const m = moment();
    const [loading, setLoading] = useState(false)
    const [guestName,setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [guestLastCall, setGuestLastCall] = useState('');
    const [guestCallId, setGuestCallId] = useState('');
    const [guestFirstCall, setGuestFirstCall] = useState('');
    const [guestRequestType, setGuestRequestType] = useState('');
    const [guestBackGround, setGuestBackGround] = useState('');
    const [guestResult, setGuestResult] = useState('')
    const [messageReceived, setMessageReceived] = useState([]);
    const [customerSource, setCustomerSource] = useState('')
    const [isLoading, setIsLoading] = useState('')
    const [data, setData] = useState('');
    const [otherguestRequestType, setotherguestRequestType] = useState('')
    const [isModalOpen, setIsModalOpen] = useState({type : '', status : false ,
     callid : '', phone :'' , lastcall:'', fullname:'',
     firstcall:'',requesttype:'',background:'', result:''})
     const history = useHistory();
    const [token,setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [regUser, setRegUser] = useState('');
    const [hotelSection, setHotelSection] = useState('');
    const [AccoRequestType, setAccoRequestType] = useState('');
    const [ActionEghamat,setActionEghamat] = useState('')
    const [ActionEghamatZarfiat,setActionEghamatZarfiat] = useState('')
    const [otherAccoTypes,setOtherAccoTypes] = useState('');
    const { phoneNumberSocket } = useContext(LeadContext);

              const refreshToken = async () => {
                try {
                  
                    const response = await axios.get('https://gmhotel.ir/api/token');
                    
                    setToken(response.data.accessToken);
                    const decoded = jwt_decode(response.data.accessToken);

                    setRegUser(decoded.name)
                    setExpire(decoded.exp);
                    
                } catch (error) {
                  
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
                  const fetchData=async()=>{
                    setIsLoading(true)
                      try{
                          const response = await axios.get("https://gmhotel.ir/api/getpayments",{
                            headers:{
                              Authorization: `Bearer ${realToken.realToken}`
                            }
                          })
                          setData(response.data)
                          setIsLoading(false)
                      }catch(error){
                        notify('خطا در اتصال به شبکه', 'error')
                        setIsLoading(false)
                      }
                      
                      }
                      if(realToken.realToken !== ''){
                        fetchData();
                      }
                          
                        
                        }, [realToken.realToken]);
                        useEffect(() => {
                          let ws;
                        
                          const connect = () => {
                            ws = new WebSocket('ws://localhost:3001');
                        
                            ws.onopen = () => {
                              console.log('WebSocket connection established');
                            };
                        
                            ws.onmessage = (event) => {
                              const data = JSON.parse(event.data);
                        
                              if (data.type === 'ping') {
                                ws.send(JSON.stringify({ type: 'pong' }));
                              } else {
                                setMessageReceived((prevArray) => [...prevArray, data]);
                                setPhoneNumberSocket(data)
                                notify("تماس جدید دریافت شد", "success");
                              }
                            };
                        
                            ws.onerror = (error) => {
                              console.log('WebSocket Error: ', error);
                            };
                        
                            ws.onclose = (e) => {
                              console.log('WebSocket connection closed', e.reason);
                              // Attempt to reconnect with a delay
                              setTimeout(() => {
                                connect(); // Reconnect
                              }, 5000); // Reconnect after 5 seconds
                            };
                          };
                        
                          connect(); // Initial connection attempt
                        
                          return () => {
                            ws.close(); // Clean up WebSocket connection when the component unmounts
                          };
                        }, [setPhoneNumberSocket]);
                        
   
  
                        const regData = async (e) => {
                            e.preventDefault();
                            try {
                              var CallId;
                          
                              // Safely accessing nested properties using optional chaining
                              if (phoneNumberSocket?.serverRes?.length > 0) {
                                CallId = phoneNumberSocket.serverRes[0].CallId;
                              } else {
                                CallId = phoneNumberSocket?.serverRes?.CallId;
                              }
                          
                              if (!CallId) {
                                notify("No call ID found, cannot register data.", "error");
                                return; // Stop the function if no CallId is found
                              }
                          
                              setIsLoading(true);
                              const response = await axios.post("https://gmhotel.ir/api/regDataReception", {
                                callId: CallId,
                                guestName: guestName,
                                phone: guestPhone,
                                lastcalldate: m.locale('fa').format('YYYY/MM/DD HH:mm:ss'),
                                User: regUser
                              });
                          
                              if (response.status === 200) {
                                notify("اطلاعات ثبت شد.", "success");
                                setIsLoading(false);
                                closeModalRegData();
                                setMessageReceived(prevMessages => 
                                  prevMessages.filter(msg => {
                                    if (Array.isArray(msg.serverRes)) {
                                      return !msg.serverRes.some(res => res.Phone === guestPhone);
                                    } else {
                                      return msg.serverRes.Phone !== guestPhone;
                                    }
                                  })
                                );
                              } else {
                                console.log(response)
                                notify("خطا", "error");
                                setIsLoading(false);
                              }
                            } catch (error) {
                              setIsLoading(false);
                              notify('خطا در ثبت اطلاعات', 'error');
                              console.error(error);
                            }
                          }
                          
  const openModalRegData = async(data,index)=>{
    
    
    if (data.type === "haveBackGround"){
     
      
      if(typeof(data.serverRes) === "object" && !data.serverRes.length >0){
        setIsModalOpen({type :"haveBackGround",
      status : true, data : data, phone : data.serverRes.Phone})
      setGuestName(data.serverRes.FullName)
      setGuestPhone(data.serverRes.Phone)
      setGuestLastCall(data.serverRes.LastCall)
      setGuestCallId(data.serverRes.CallId)
      setGuestFirstCall(data.serverRes.FirstCall)
      setGuestRequestType(data.serverRes.RequestType)
      setGuestBackGround(data.serverRes.BackGround)
      setGuestResult(data.serverRes.Result)
      setCustomerSource(data.serverRes.customerSource)
      setHotelSection(data.section)
      
      }else{
        setIsModalOpen({type :"haveBackGround",
      status : true, data : data, phone : data.serverRes[0].Phone})
        setGuestName(data.serverRes[0].FullName)
        setGuestPhone(data.serverRes[0].Phone)
        setGuestRequestType(data.serverRes[data.serverRes.length - 1].RequestType)
        setGuestResult(data.serverRes[data.serverRes.length - 1].Result)
        setGuestCallId(data.serverRes[0].CallId)
        setCustomerSource(data.serverRes[0].customerSource)
        setHotelSection(data.section)
      }
    }else{
      
      setIsModalOpen({type :"firstCall",
      status : true, data : data, phone : data.serverRes.Phone
      })
      setGuestPhone(data.serverRes.Phone)
      setGuestCallId(data.serverRes.CallId)
      setHotelSection(data.section)
    }
  
  }
  const closeModalRegData =()=>{
    setIsModalOpen({type : "", status : false ,
        callid : '', phone :'' , lastcall:'', fullname:'',
        firstcall:'',requesttype:'',background:"", result:''})
        setGuestName('')
        setGuestPhone('')
        setGuestLastCall('')
        setGuestCallId('')
        setGuestFirstCall('')
        setGuestRequestType('')
        setGuestBackGround('')
        setGuestResult('')
        setCustomerSource('')
        setHotelSection('')
  }
  const closeRegData = (info,index) =>{
    const targetValue = info.serverRes.CallId;
    
    for(let i = 0 ; i < messageReceived.length ; i++){
     
      if(messageReceived[i].serverRes.CallId === targetValue){
     var tempmessage = [...messageReceived]
        tempmessage.splice(i , 1)
        setMessageReceived(tempmessage)
        notify("تماس بسته شد", "error")
      }
    }

  }
  const closeManuallyModal = () =>{
   setIsModalOpen({type : "", status : false ,
     callid : '', phone :'' , lastcall:'', fullname:'',
     firstcall:'',requesttype:'',background:"", result:''})
    setGuestName('')
    setGuestPhone('')
  }
    return(
        <div className={styles.MainContainerCrmMenu}>
          
          {isLoading && <LoadingComp />}
   
          <div className={styles.leftSideContainer}>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:'center', direction:"rtl"}}>
      <div className={styles.greenSpot}></div><h1 style={{direction:"rtl", display:"flex", flexDirection:"row"
      ,justifyContent:"center",alignItems:"center",margin:"2vw", fontSize:"2vw"}}>در انتظار دریافت تماس جدید</h1>
            </div>
            <div className={styles.wrapContainer}>
            
      {messageReceived.length > 0 && messageReceived.map((info,index)=>(
        
       <div className={styles.divMainContainer}>
        
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center",margin:"10px"}}>
            <FcCallback size={45} />
            <div>ترتیب : {index + 1}</div>
            </div>
            
            {typeof(info.serverRes) === "object" && !info.serverRes.length >0 ? <div className={styles.CallerContainer}>شماره تماس : {info.serverRes.Phone}</div> :
            <div className={styles.CallerContainer}>شماره تماس : {info.serverRes[0].Phone}</div>}
       
       {typeof(info.serverRes) === "object" && !info.serverRes.length >0 ? 
       <div className={styles.CallerContainer}>Call Id : {info.serverRes.CallId}</div>:
       <div className={styles.CallerContainer}>Call Id : {info.serverRes[0].CallId}</div>}
       <div className={styles.CallerContainer}>تاریخ و زمان تماس : {info.Time}</div>
       <div className={styles.CallerContainer}>  بخش : {info.section}</div>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center",margin:"10px"}}>
        <Button sx={{fontFamily:"shabnam"}} onClick={()=>openModalRegData(info,index)} variant="outlined">ثبت اطلاعات</Button>

        <Button sx={{fontFamily:"shabnam"}} onClick={()=>closeRegData(info,index)} variant="outlined">عدم پاسخ</Button>

            
            </div>
       </div>
      ))}
    </div>
     
     <Modal
     isOpen={isModalOpen.status}
     
     onRequestClose={closeManuallyModal}
     style={customStyles}
     contentLabel="Example Modal"
   >
     <div style={{display:"flex", flexDirection:"column",justifyContent: "center",alignItems: "center", direction:"rtl",padding:"5vw"}}>
       
       <h1>ثبت و ویرایش اطلاعات مشتری</h1>
       <p>call id : {guestCallId}</p>
       <form className={styles.regDataForm} onSubmit={(e)=>regData(e)}>
       
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
         
         <div style={{margin:"1vw",display:"flex", flexDirection:"row",justifyContent: "center", alignItems: "center", columnGap:"1vw"}}>
         <Button type="submit"  sx={{fontFamily:"shabnam"}} variant="outlined">ثبت</Button>
         <Button  sx={{fontFamily:"shabnam"}} onClick={closeModalRegData} variant="outlined">بستن</Button>
         </div>
         
       </form>
       
       
     </div>
     
   </Modal>
   </div>
   
   </div>
    )
   
}
export default CrmComponentReception;