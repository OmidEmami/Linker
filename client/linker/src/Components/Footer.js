import React from 'react'
import linker from "../assests/Linker.png"
import styles from "./Footer.module.css"
function Footer() {
    const year = new Date().getFullYear();
  return (
    <div className={styles.mainContainer}>
      {/* {`Powered by ${<img src={linker} alt='logo for linkerfaster' />} Copyright © Upbeat Code ${year}`} */}
      
      Powered by   &nbsp;&nbsp;&nbsp; <img width="3%" src={linker} alt='logo for linkerfaster' /> &nbsp;&nbsp;&nbsp;  Copyright © LinkerFaster - GhasrMonshiHotel - Iran {year} - v 1.0.0
    </div>
  )
}

export default Footer
