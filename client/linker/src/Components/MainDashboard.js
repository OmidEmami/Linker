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
 const MainDashboard = () =>{
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [token, setToken] = useState('');
    const [accessType, setAccessType] = useState('')
    const [expire, setExpire] = useState('');

    const history = useHistory();
 
    useEffect(() => {
        refreshToken();
        
    }, []);
 
    const refreshToken = async () => {
        try {
            const response = await axios.get('https://gmhotel.ir/api/token');
            console.log(response)
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setEmail(decoded.email);
            setPhone(decoded.phone)
            setExpire(decoded.exp);
            setAccessType(decoded.accessType)
        } catch (error) {
            console.log(error)
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
            setName(decoded.name);
            setPhone(decoded.phone)
            setEmail(decoded.email);
            setExpire(decoded.exp);
            setAccessType(decoded.accessType)
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
    const [item, setItem] = useState(false);
    const showItem = (e) => {
        setItem(e)
    }
    return(
        <>
        <div style={{
                    backgroundColor:"#D2AF6F",
                    display : "flex",
                    flexDirection:"row",
                    justifyContent: "center",
                    alignItems: "center"    

        }}>
            <img style={{margin:"3px"}} width="8%" src={Logo} alt="logo ghasr" />
           
            </div>
        <div className={stylesNd.ViewContainer}>
        <div  className={stylesNd.RightContainer}>
            <ul className={styles.list}>
                <li value={1} onClick={(e)=>showItem(e.target.value)}>ارسال لینک اقامت</li>
                <li value={2} onClick={(e)=>showItem(e.target.value)}>پرداخت ها </li>
                <li value={3} onClick={(e)=>showItem(e.target.value)}>لینک های ارسالی</li>
                <li value={4} onClick={(e)=>showItem(e.target.value)}>کنسل کردن دستی رزرو</li>
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
          {item === 6 ?
         <div className={stylesNd.MainContent}><LogOutSystem /></div>
          : null}
          {item === false && <div className={stylesNd.MainContent}>
            <h3>لطفا از منو سمت راست آیتم مورد نظر را انتخاب کنید</h3></div>}
        </div>
        </>
    )
 }
 export default MainDashboard;