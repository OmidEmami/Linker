import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingComp from "../LoadingComp";
import { notify } from "../toast";
import Modal from 'react-modal';
import moment from 'jalali-moment';
import styles from "./MiddleReserveConfView.module.css";
import Logo from "../../assests/logoblue.png"
import stylesNd from './FileUpload.module.css'; // Make sure to create this CSS module file

export default function MiddleReserveConfView() {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: "80%"
    },
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [paymentData, setPaymentData] = useState('')
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const [initialPopup, setInitialPopup] = useState(false);
  const { param } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paidAmount , setPaidAmount] = useState(0);
  moment.locale('fa');

  useEffect(() => {
    const reserveDetails = async () => {
      setIsLoading(true);
      try {
        const paymentResponse = await axios.post("https://gmhotel.ir/api/getMiddleReservePaymentData",{
          reserveId : param
        })

          setPaymentData(paymentResponse.data)
        
        if(paymentResponse.data === "No files found for the specified ReserveId"){
          setPaidAmount('0')
        }else{

        
        let PaidAmountMoney = 0;
        for(let i = 0 ; i < paymentResponse.data.length ; i++){
          const paidReceit = parseInt(paymentResponse.data[i].paidAmount)
          PaidAmountMoney += paidReceit
        }
        setPaidAmount(PaidAmountMoney)
      }
        const response = await axios.post('https://gmhotel.ir/api/getMiddleReserveData', {
          reserveId: param
        });
        setData(response.data);
        const mainData = response.data.responseReservesMiddleware;

        
        let calculatedTotalPrice = 0;
        
        for (let i = 0; i < mainData.length; i++) {
          const price = parseInt(mainData[i].Price, 10);
  const extraService = parseInt(mainData[i].ExtraService || '0', 10);
  const accoCount = parseInt(mainData[i].AccoCount, 10);
  const offRate = parseInt(mainData[i].OffRate, 10);
        
          const totalPrice = (price + extraService) * accoCount;
          const discount = price * accoCount * (offRate / 100);
        
          calculatedTotalPrice += totalPrice - discount;
        
        }
        
        setTotalPrice(calculatedTotalPrice)

      } catch (error) {
        notify("Error fetching data");
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    };
  
    reserveDetails();
  }, [param]);

  if (isLoading) {
    return <LoadingComp />;
  }
  const handleFileUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('reserveId', data.responseReservesMiddleware[0].ReserveId)

    // Example: Log file details and simulate upload
    console.log('File details:', selectedFile);

    // Here you can send formData to your server using an API call
    axios.post('https://gmhotel.ir/api/uploadfilemiddlereserve', formData)
      .then(response => console.log(response))
      .catch(error => console.error(error));

    alert('File uploaded successfully!');
  };
  const downloadReceit = async (id) => {
    try {
        const response = await axios.post("https://gmhotel.ir/api/downloadreceit", {
            reserveId: data.responseReservesMiddleware[0].ReserveId,
            id: id
        }, {
            responseType: 'blob'
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = "download"; 
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (filenameMatch.length > 1) {
                filename = filenameMatch[1];
            }
        }

        // Handle case where no valid filename could be parsed
        if (!filename.includes('.')) {
            const contentType = response.headers['content-type'];
            let extension = '';
            switch (contentType) {
                case 'application/pdf':
                    extension = '.pdf';
                    break;
                case 'image/jpeg':
                    extension = '.jpg';
                    break;
                case 'image/png':
                    extension = '.png';
                    break;
                default:
                    extension = ''; // Leave as blank or set a default extension
            }
            filename += extension;
        }

        // Create and trigger a download link
        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', filename);
        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);
    } catch (error) {
        console.error("Failed to download receipt:", error);
        notify("Error downloading the receipt.");
    }
}



  return (
    <>
      <div className={styles.header}>
        <img src={Logo} width="5%" alt='لوگو' />
        <span style={{ color: "#1B5695", fontSize: "15px" }}>مدیریت رزرو و پرداخت قصرمنشی</span>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "10px", justifyContent: "center", alignItems: "center" }}>
          <span>کاربر گرامی، در این بخش می توانید اطلاعات رزرو را مشاهده کنید، جهت ویرایش اطلاعات رزرو لطفا با رزرواسیون تماس بگیرید</span>
          <span style={{ color: "red" }}>لطفا فیش واریزی را در قسمت مشخص شده بارگذاری نمایید</span>
        </div>
        </div>
        <div className={styles.tableContainer}>
        {data && data.responseReservesMiddleware && data.responseReservesMiddleware.length > 0 ? (
          <div style={{ marginBottom: '20px' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={cellStyle}>نام رزرو کننده</th>
                  <th style={cellStyle}>تاریخ ثبت</th>
                  <th style={cellStyle}>شماره تماس</th>
                  <th style={cellStyle}>تاریخ ورود</th>
                  <th style={cellStyle}>تاریخ خروج</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={cellStyle}>{data.responseReservesMiddleware[0].FullName}</td>
                  <td style={cellStyle}>{data.responseReservesMiddleware[0].RequestDate}</td>
                  <td style={cellStyle}>{data.responseReservesMiddleware[0].Phone}</td>
                  <td style={cellStyle}>{data.responseReservesMiddleware[0].CheckIn}</td>
                  <td style={cellStyle}>{data.responseReservesMiddleware[0].CheckOut}</td>
                </tr>
                </tbody>
                </table>
                <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={cellStyle}>شماره رزرو</th>
                  <th style={cellStyle}>وضعیت</th>
                  <th style={cellStyle}>اپراتور</th>
                  <th style={cellStyle}>درصد پرداخت</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td style={cellStyle}>{data.responseReservesMiddleware[0].ReserveId}</td>
                  <td style={cellStyle}>{data.responseReservesMiddleware[0].Status}</td>
                  <td style={cellStyle}>{data.responseReservesMiddleware[0].LoggedUser}</td>
                  <td style={cellStyle}>{data.responseReservesMiddleware[0].Percent}</td>
                </tr>
                </tbody>
            </table>
          </div>
        ) : (
          <p>No data available</p>
        )}
     <span style={{fontWeight:"bold"}}>مشخصات اتاق ها</span>
      {data && data.responseReservesMiddleware && data.responseReservesMiddleware.length > 0 ? (
        <div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>نوع اتاق</th>
                <th style={cellStyle}>قیمت</th>
                <th style={cellStyle}>تعداد شب</th>
                <th style={cellStyle}>قیمت سرویس اضافه</th>
                <th style={cellStyle}>درصد تخفیف</th>
              </tr>
            </thead>
            <tbody>
              {data.responseReservesMiddleware.map(item => (
                <>
                <tr key={item.id}>
                  <td style={cellStyle}>{item.RoomName}</td>
                  <td style={cellStyle}>{item.Price}</td>
                  <td style={cellStyle}>{item.AccoCount}</td>
                  <td style={cellStyle}>{item.ExtraService}</td>
                  <td style={cellStyle}>{item.OffRate}</td>
                </tr>
                

                </>
              ))}
            </tbody>
            
          </table>
          <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
          <span>جمع کل : {totalPrice} ریال</span>
         
          <>
            <span>مبلغ پرداخت شده : {paidAmount} ریال</span>
            <span>مانده بدهی : {totalPrice - paidAmount} ریال</span>
          </>
          
          <span>اطلاعات حساب</span>
          <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={cellStyle}>شماره کارت</th>
                  <th style={cellStyle}>شماره حساب</th>
                  <th style={cellStyle}>شماره شبا</th>
                  <th style={cellStyle}>نام صاحب حساب</th>
                </tr>
              </thead>
              <tbody>
                  {(() => {
                    const accountDetails = JSON.parse(data.responseReservesMiddleware[0].AccountDetail);
                    if (accountDetails && typeof accountDetails === 'object' && !Array.isArray(accountDetails)) {
                      return (
                        <tr>
                          <td style={cellStyle}>{accountDetails.card}</td>
                          <td style={cellStyle}>{accountDetails.account}</td>
                          <td style={cellStyle}>{accountDetails.sheba}</td>
                          <td style={cellStyle}>{accountDetails.owner}</td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr>
                          <td colSpan="4" style={cellStyle}>Invalid account details</td>
                        </tr>
                      );
                    }
                  })()}
                </tbody>
          </table>
      {console.log(JSON.parse(data.responseReservesMiddleware[0].AccountDetail))}
      </div>
        </div>
      ) : (
        <p>No data available</p>
      )}
      </div>
<div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
  <span>بارگذاری رسید های پرداخت</span>
  <div className={stylesNd.fileInputContainer}>
        <input
          type="file"
          accept=".png, .jpg, .jpeg, .pdf"
          onChange={handleFileChange}
          id="file-input"
          className={stylesNd.fileInput}
        />
        <label htmlFor="file-input" className={stylesNd.customFileInput}>
          {selectedFile ? selectedFile.name : 'انتخاب رسید پرداخت'}
        </label>
      
      
      </div>
      {selectedFile && (
        <div>
          <button style={{margin : "1rem"}} onClick={handleFileUpload}>بارگذاری</button>
        </div>
      )}
  </div>    
  <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
  {paymentData && paymentData.length > 0 ? (
        <div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>ردیف</th>
                <th style={cellStyle}>رسید پرداخت</th>
                <th style={cellStyle}>شماره رزرو</th>
                <th style={cellStyle}>وضعیت</th>
               
              </tr>
            </thead>
            <tbody>
              
              {paymentData !== "No files found for the specified ReserveId" && paymentData.map((item,index) => (
                <>
                <tr key={item.id}>
                  <td style={cellStyle}>{index +1}</td>
                  <td onClick={()=>downloadReceit(item.id)}  style={{...cellStyle, cursor:"pointer"}}>دانلود</td>
                  <td style={cellStyle}>{item.reserveId}</td>
                  <td style={cellStyle}>{item.isConfirmed === "false" ? <span>در صف بررسی</span> : <span>تایید شده</span>}</td>
                  
                </tr>
                

                </>
              ))}
            </tbody>
            
          </table>
          
          
        </div>
      ) : (
        <p>No data available</p>
      )}
  </div>

</>
  );
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  margin: '10px 0',
  fontSize: '1em',
  fontFamily: 'Arial, sans-serif',
  minWidth: '400px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
};

const cellStyle = {
  border: '1px solid #dddddd',
  textAlign: 'left',
  padding: '8px',
  backgroundColor: '#f2f2f2',
};
