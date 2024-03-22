import React,{useState, useEffect} from 'react';
import styles from "./CrmHeader.module.css";
import Logo from "../../assests/logoblue.png"
function CrmHeader() {

  return (
    <div className={styles.mainHeader}>
      <div className={styles.logoContainer}><img width="70vw" alt='logoblue' src={Logo} /></div>
      <div className={styles.menuCrmContainer}>
      <h3>لیست انتظار تماس</h3>
      <h3>ارسال لینک اقامت</h3>
      <h3>ارسال کاتالوگ</h3>
      </div>
    </div>
  )
}

export default CrmHeader
