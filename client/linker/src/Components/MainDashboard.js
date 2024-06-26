import jwt_decode from "jwt-decode";
import axios from 'axios';
import React, { useState, useEffect,useContext } from 'react'
import { useHistory } from 'react-router-dom';
import styles from "./Dashboard.module.css"
import stylesNd from "./MainDashboard.module.css"
import Dashboard from "./Dashboard";
import PaymentTable from "./PaymentTable";
import ReservesTable from "./ReservesTable";
import ManualCancel from "./ManualCancel";
import ManageUsers from "./ManageUsers";
import Logo from "../assests/logoblue.png";
import LogOutSystem from "./Login&Signup/LogOutSystem";
import LoadingComp from "./LoadingComp";
import MeCaLinker from "./Send Menu & Catalog links/MeCaLinker";
import MeCaLinkerDashboard from "./Send Menu & Catalog links/MeCaLinkerDashboard";
import { useDispatch } from "react-redux";
import { addToken } from './action';
import Calendar from "./Rack Hamam/Calendar";
import { RiLogoutBoxLine } from "react-icons/ri";

 const MainDashboard = () =>{
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [token, setToken] = useState('');
    const [accessType, setAccessType] = useState('')
    const [expire, setExpire] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory();
 
    useEffect(() => {
        refreshToken();
        
    }, []);
 
    const refreshToken = async () => {
        
        try {
            setIsLoading(true)
            const response = await axios.get('http://localhost:3001/api/token');
           
            setToken(response.data.accessToken);
            
           
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setEmail(decoded.email);
            setPhone(decoded.phone)
            setExpire(decoded.exp);
            setAccessType(decoded.accessType)
            
            const token = {userName : decoded.name, realToken:response.data.accessToken, user : decoded.accessType}
            dispatch(addToken(token));
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
            setIsLoading(true)
            const response = await axios.get('http://localhost:3001/api/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setPhone(decoded.phone)
            setEmail(decoded.email);
            setExpire(decoded.exp);
            setAccessType(decoded.accessType)
            setIsLoading(false)
        }
        return config;
    }, (error) => {
        setIsLoading(false)
        Promise.reject(error); 
        return
    });
    const [item, setItem] = useState(null);
    const showItem = (e) => {
        if(Number(e) === 8){
            showHamamManagement();
        }else{
            setItem(Number(e));
        }
        
    }
    const showHamamManagement = () =>{
        
            window.open('/followup', '_blank');
    
    }
    const showCRMPhone = () =>{
        console.log(accessType)
        if(accessType === "editor" || accessType === "admin" || accessType === "reservation"){
        window.open("/crmphone", '_blank')
        }else if(accessType === "reception"){
        window.open("/receptionlead", '_blank')
        }
    }
    return(
        <>
        {isLoading && <LoadingComp />}
        <div style={{
                    backgroundColor:"#D2AF6F",
                    display : "flex",
                    flexDirection:"row",
                    justifyContent: "space-between",
                    alignItems: "center"    

        }}>
            <img style={{margin:"3px"}} width="5%" src={Logo} alt="logo ghasr" />
            <ul style={{display: "flex", flexDirection: "row", listStyle: "none", direction: "rtl"}}>
    <li>
        <div className={styles.customDropdown}>
    <select onChange={(e) => showItem(e.target.value)} defaultValue="">
    <option value="" disabled hidden>اقامت</option> 
    <option value="1">ارسال لینک اقامت</option>
    <option value="2">پرداخت ها</option>
    <option value="3">لینک های ارسالی</option>
    <option value="4">کنسل کردن دستی رزرو</option>
</select>
</div>
    </li>
    <li>
        <div className={styles.customDropdown}>
    <select onChange={(e) => showItem(e.target.value)} defaultValue="">
    <option value="" disabled hidden>حمام</option> 
    <option value="8">بررسی درخواست های حمام</option>
    <option value="9">تقویم رزروهای حمام</option>
</select>
</div>
    </li>
<li style={{
    backgroundColor: "#fff",
    padding: "0.3rem 0.9rem",
    borderRadius: "15px",
    border: "2px solid rgb(255, 136, 0)",
    display: "flex",          
    alignItems: "center",      
    justifyContent: "center",   
    textAlign: "center", 
    cursor: "pointer"
}} value={19} onClick={showCRMPhone}>
    CRM
</li>    
    <li style={{backgroundColor:"#fff", padding:"0.3rem 0.9rem", borderRadius:"15px",border:"2px solid rgb(255, 136, 0)"}} value={7} onClick={(e) => showItem(e.target.value)}>ارسال کاتالوگ</li>
    {accessType === "admin" && <li style={{backgroundColor:"#fff", padding:"0.3rem 0.9rem", borderRadius:"15px",border:"2px solid rgb(255, 136, 0)"}} value={5} onClick={(e) => showItem(e.target.value)}>مدیریت کاربران</li>}
    <li style={{backgroundColor:"#fff", padding:"0.3rem 0.9rem", borderRadius:"15px",border:"2px solid rgb(255, 136, 0)"}} value={6} onClick={(e) => showItem(e.target.value)}>خروج از سیستم</li>
</ul>
<RiLogoutBoxLine />
            </div>
            
            <div style={{marginRight:"50px"}}><h3 style={{direction:"rtl"}}>کاربر: {name}</h3></div>
                                                                                                                                                  
        <div className={stylesNd.ViewContainer}>
        <div  className={stylesNd.RightContainer}>
            <ul className={styles.list}>
                <li value={1} onClick={(e)=>showItem(e.target.value)}>ارسال لینک اقامت</li>
                <li value={2} onClick={(e)=>showItem(e.target.value)}>پرداخت ها </li>
                <li value={3} onClick={(e)=>showItem(e.target.value)}>لینک های ارسالی</li>
                <li value={19} onClick={showCRMPhone}>CRM(beta)</li>
                <li value={4} onClick={(e)=>showItem(e.target.value)}>کنسل کردن دستی رزرو</li>
                <li value={7} onClick={(e)=>showItem(e.target.value)}>ارسال کاتالوگ ، منو و حمام</li>
                <li value={8} onClick={showHamamManagement}>بررسی درخواست های حمام</li>
                <li value={9} onClick={(e)=>showItem(e.target.value)}>تقویم رزرو های حمام</li>
                {accessType === "admin" &&<li value={5} onClick={(e)=>showItem(e.target.value)}>مدیریت کاربران</li>}
                <li value={6} onClick={(e)=>showItem(e.target.value)}>خروج از سیستم</li>
                
            </ul>

        </div>
        {item === 1 ?
         <div className={stylesNd.MainContent}><Dashboard /></div>
          : null}
        {item === 2 ?
         <div className={stylesNd.MainContent}><PaymentTable /></div>
          : null}
        {item === 3 ?
         <div className={stylesNd.MainContent}><ReservesTable /></div>
          : null}
          {item === 4 ?
         <div className={stylesNd.MainContent}><ManualCancel /></div>
          : null}
          {item === 5 ?
         <div className={stylesNd.MainContent}><ManageUsers /></div>
          : null}
          {item === 7 ?
         <div className={stylesNd.MainContent}><MeCaLinkerDashboard /></div>
          : null}
          {item === 6 ?
         <div className={stylesNd.MainContent}><LogOutSystem /></div>
          : null}
          {item === 9 ?
          <div className={stylesNd.MainContent}><Calendar /></div>
          : null}
          {item === null && <div className={stylesNd.MainContent}>
            <h3 style={{direction:"rtl"}}>لطفا از منو سمت راست آیتم مورد نظر را انتخاب کنید</h3></div>}
        </div>
        </>
    )
 }
 export default MainDashboard;