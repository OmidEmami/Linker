import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingComp from "./LoadingComp";
import { notify } from "./toast";
import Modal from 'react-modal';
import moment from 'jalali-moment'
export default function GuestView() {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width:"80%"
    },
  };      
    const [initialPopup, setInitialPopup] = useState(false)
    const { param } = useParams();
    const [payData, setPayData] = useState([])
    const [totalPrice ,setTotalPrice] = useState(0);
    const [isLoading , setIsLoading] = useState(false);
    
    moment.locale('fa');
    useEffect(() => {
      

        const getDatetopay = async()=>{
          setIsLoading(true)
          try{
          const response = await axios.post("https://gmhotel.ir/api/topay", {
            ReserveId : param
          })
         
          if(response.data.length < 1){
            
            setIsLoading(false)
            notify( "خطا", "error")
          }else if(response.data.length > 0){
            setPayData(response.data)
            for(let i = 0 ; i < response.data.length ; i++){
                setTotalPrice((prevSum) => prevSum + (parseInt(response.data[i].Price) * parseInt(response.data[i].AccoCount)) )
            }
            setIsLoading(false)
          }
        }catch(error){
          setIsLoading(false)
          notify( "خطا", "error")
        }
        }
        getDatetopay();
        
  
        
      
      }, []);
      const toPay = async()=>{
        try{
          setIsLoading(true)
        const response = await axios.post('https://gmhotel.ir/api/topayfirst', {

                      amount: totalPrice,
                      description: 'Transaction description.',
                      metadata: { mobile: payData[0].Phone, email: "omidem1781@gmail.com" },
                      ClientName : payData[0].FullName,
                      ReserveDetails : payData,
                    });
                    
                    if(response.data.data.code === 100){
                
                      setIsLoading(true)
                            window.location.href="https://www.zarinpal.com/pg/StartPay/"+response.data.data.authority
                          
                        
                    }else{
                      setIsLoading(false)
                      notify( "خطا", "error")
                    }
                  }catch(error){
                    setIsLoading(false)
                    notify( "خطا", "error")
                  }
      }
    // comentomid
      const showRules = () =>{
        setInitialPopup(true)
      }
  return (
    <>
    <Modal
        isOpen={initialPopup}
        //onAfterOpen={afterOpenModal}
        onRequestClose={()=>setInitialPopup(false)}
        style={customStyles}
        contentLabel="Example Modal"
        
      >
        <div style={{direction:"rtl"}}>
        <h4>لطفا شرایط رزرو و اقامت در هتل قصرمنشی را مطالعه  کنید، بعد از موافقت با قوانین به درگاه پرداخت منتقل می شوید</h4>
        <ul>
          <li>شرایط کنسلی رزرو در هتل قصرمنشی : 
          تا 8 روز قبل از تاریخ ورود بدون جریمه , از 7 تا 3 روز قبل از ورود جریمه معادل 50 درصد هزینه کل اقامت و در نهایت در صورت تمایل برای کنسلی
اتاق تا 48 ساعت قبل از ورود جریمه معادل 100 درصد از هزینه کل دریافتی می باشد.
          </li>
          <li>سیگار کشیدن در اتاق ها ممنوع است</li>
          <li>ورود حیوان خانگی به هتل قصرمنشی ممنوع است</li>
          <li>حفظ و رعایت شئونات اسلامی مطابق با قوانین جمهوری اسلامی الزامی است.</li>
         <li>پذیرش زوجین فقط با مدرک معتبر محرمیت امکان پذیر است</li>
        </ul>
        <button onClick={toPay}>موافقت با قوانین وانتقال به درگاه پرداخت</button>
      </div>
      </Modal>
    <div style={{display:"flex",flexDirection:"column"}}>
      {isLoading && <LoadingComp />}
      
      <table style={{direction:"rtl", borderCollapse: 'collapse',
    border: '1px solid #ddd',margin:"1rem"}}>
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
              
              
              
            </tr>
          )
        })}
        {payData.length !== 0 && <div style={{margin:"1rem"}}>
        <h4>نام مهمان اصلی : {payData[0].FullName}</h4>
        <h4>تاریخ ورود : {moment.from(payData[0].CheckIn, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}</h4>
        <h4>تاریخ خروج : {moment.from(payData[0].CheckOut, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}</h4>
        </div>}
        
        <h4 style={{margin:"1rem"}}>جمع کل : {totalPrice}</h4>
      </table>
      <button onClick={showRules}>مطالعه شرایط و پرداخت</button>
    </div></>
  )
}
