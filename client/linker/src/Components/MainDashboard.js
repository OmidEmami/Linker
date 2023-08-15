import React,{useState} from "react";
import styles from "./Dashboard.module.css"
import ListOfPayments from "./ListOfPayments";
import ListOfReserves from "./ListOfReserves";
import Dashboard from "./Dashboard";

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
        <div style={{display:"flex",justifyContent: "center",direction:"rtl"}}>
        <div style={{backgroundColor:"wheat", width:"20%"}}>
            <ul className={styles.list}>
                <li value={1} onClick={(e)=>showItem(e.target.value)}>ارسال لینک</li>
                <li value={2} onClick={(e)=>showItem(e.target.value)}>لینک های ارسالی</li>
                <li value={3} onClick={(e)=>showItem(e.target.value)}>پرداخت ها</li>
                
            </ul>

        </div>
        {item === 1 ?
         <div style={{backgroundColor:"#F9F9F9", width:"80%", direction:"ltr"}}><Dashboard /></div>
          : null}
        {item === 2 ?
         <div style={{backgroundColor:"#F9F9F9", width:"80%", direction:"ltr"}}><ListOfReserves /></div>
          : null}
        {item === 3 ?
         <div style={{backgroundColor:"#F9F9F9", width:"80%", direction:"ltr"}}><ListOfPayments /></div>
          : null}
          {item === false && <div style={{backgroundColor:"orange", width:"80%", direction:"rtl"}}>
            <h3>لطفا از منو سمت راست آیتم مورد نظر را انتخاب کنید</h3></div>}
        </div>
        </>
    )
 }
 export default MainDashboard;