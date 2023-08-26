import React,{useState} from "react";
import styles from "./Dashboard.module.css"
import stylesNd from "./MainDashboard.module.css"
import Dashboard from "./Dashboard";
import PaymentTable from "./PaymentTable";
import ReservesTable from "./ReservesTable";
import ManualCancel from "./ManualCancel";
 const MainDashboard = () =>{
    const [item, setItem] = useState(false);
    const showItem = (e) => {
        setItem(e)
    }
    return(
        <>
        <div style={{
                    backgroundColor:"blue"
        }}>header</div>
        <div className={stylesNd.ViewContainer}>
        <div  className={stylesNd.RightContainer}>
            <ul className={styles.list}>
                <li value={1} onClick={(e)=>showItem(e.target.value)}>ارسال لینک اقامت</li>
                <li value={2} onClick={(e)=>showItem(e.target.value)}>پرداخت ها </li>
                <li value={3} onClick={(e)=>showItem(e.target.value)}>لینک های ارسالی</li>
                <li value={4} onClick={(e)=>showItem(e.target.value)}>کنسل کردن دستی رزرو</li>
                
                
                
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
          {item === false && <div className={stylesNd.MainContent}>
            <h3>لطفا از منو سمت راست آیتم مورد نظر را انتخاب کنید</h3></div>}
        </div>
        </>
    )
 }
 export default MainDashboard;