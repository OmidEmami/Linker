import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
export default function GuestView() {
    const { param } = useParams();
    const [payData, setPayData] = useState()
    useEffect(() => {
        const getDatetopay = async()=>{
          const response = await axios.post("http://localhost:3001/topay", {
            ReserveId : param
          })
          console.log(response)
          if(response.data.length < 1){

          }else if(response.data.length > 1){
            setPayData(response.data)
          }
          
        }
        getDatetopay();
        
  
        
      
      }, []);
  return (
    <div>
      <table style={{direction:"rtl"}}>
        <tr>
          <th>نام اتاق</th>
          <th>قیمت نهایی</th>
          <th>تعداد بزرگسال</th>
          <th>نام مهمان اصلی</th>
          <th>تاریخ ورود</th>
          <th>تاریخ خروج</th>
          
        </tr>
        {payData.map((val, key) => {
          return (
            
            <tr key={key}>
                
              <td>{cart[key].RoomName}</td>
              <td>{cart[key].Price}</td>
              <td>{cart[key].adultCount}</td>
              <td>{cart[key].nameGuest}</td>
              <td>{cart[key].checkindate}</td>
              <td>{cart[key].checkoutdate}</td>
              
              
            </tr>
          )
        })}
        <h4>جمع کل : {totalPrice}</h4>
      </table>
    </div>
  )
}
