import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
export default function GuestView() {
    const { param } = useParams();
    const [payData, setPayData] = useState([])
    const [totalPrice ,setTotalPrice] = useState(0);
    useEffect(() => {
        const getDatetopay = async()=>{
          const response = await axios.post("http://localhost:3001/topay", {
            ReserveId : param
          })
          console.log(response)
          if(response.data.length < 1){

          }else if(response.data.length > 0){
            setPayData(response.data)
            for(let i = 0 ; i < response.data.length ; i++){
                setTotalPrice((prevSum) => prevSum + (parseInt(response.data[i].Price) * parseInt(response.data[i].AccoCount)) )
            }
          }
          
        }
        getDatetopay();
        
  
        
      
      }, []);
      const toPay = async()=>{
        const response = await axios.post('http://localhost:3001/toPaySt', {

                      amount: totalPrice,
                      description: 'Transaction description.',
                      metadata: { mobile: payData[0].Phone, email: "omidem1781@gmail.com" },
                      ClientName : payData[0].FullName,
                      ReserveDetails : payData,
                    });
                    if(response.data.data.code === 100){
                
                        
                            window.location.href="https://www.zarinpal.com/pg/StartPay/"+response.data.data.authority
                          
                        
                    }
      }
  return (
    <div>
      <table style={{direction:"rtl", borderCollapse: 'collapse',
    border: '1px solid #ddd',}}>
        <tr>
          <th style={{backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'left',
    border: '1px solid #ddd'}}>نام اتاق</th>
          <th  style={{backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'left',
    border: '1px solid #ddd'}}>قیمت نهایی</th>
          <th style={{backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'left',
    border: '1px solid #ddd'}}>مدت اقامت</th>
          <th style={{backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'left',
    border: '1px solid #ddd'}}>نام مهمان اصلی</th>
          <th style={{backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'left',
    border: '1px solid #ddd'}}>تاریخ ورود</th>
          <th style={{backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'left',
    border: '1px solid #ddd'}}>تاریخ خروج</th>
          
        </tr>
        {payData.length > 0  && payData.map((val, key) => {
          return (
            
            <tr key={key}>
                
              <td style={{ padding: '8px',
    border: '1px solid #ddd'}}>{val.RoomName}</td>
              <td style={{ padding: '8px',
    border: '1px solid #ddd'}}>{val.Price}</td>
              <td style={{ padding: '8px',
    border: '1px solid #ddd'}}>{val.AccoCount}</td>
              <td style={{ padding: '8px',
    border: '1px solid #ddd'}}>{val.FullName}</td>
              <td style={{ padding: '8px',
    border: '1px solid #ddd'}}>{val.CheckIn}</td>
              <td style={{ padding: '8px',
    border: '1px solid #ddd'}}>{val.CheckOut}</td>
              
              
              
            </tr>
          )
        })}
        <h4>جمع کل : {totalPrice}</h4>
      </table>
      <button onClick={toPay}>موارد فوق تایید است</button>
    </div>
  )
}
