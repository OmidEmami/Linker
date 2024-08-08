import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingComp from "../LoadingComp";
import { notify } from "../toast";
import moment from 'jalali-moment';
import styles from "./MiddleReserveConfView.module.css";
import Logo from "../../assests/logoblue.png";
import stylesNd from './FileUpload.module.css';

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
  const [paymentData, setPaymentData] = useState('');
  const [initialPopup, setInitialPopup] = useState(false);
  const { param } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [rerender, setRerender] = useState(false); // State variable to trigger rerender

  moment.locale('fa');

  useEffect(() => {
    const reserveDetails = async () => {
      setIsLoading(true);
      try {
        const paymentResponse = await axios.post("https://gmhotel.ir/api/getMiddleReservePaymentData", {
          reserveId: param
        });

        setPaymentData(paymentResponse.data);

        if (paymentResponse.data === "No files found for the specified ReserveId") {
          setPaidAmount('0');
        } else {
          let PaidAmountMoney = 0;
          for (let i = 0; i < paymentResponse.data.length; i++) {
            const paidReceit = parseInt(paymentResponse.data[i].paidAmount);
            PaidAmountMoney += paidReceit;
          }
          setPaidAmount(PaidAmountMoney);
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

        setTotalPrice(calculatedTotalPrice);
      } catch (error) {
        notify("Error fetching data");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    reserveDetails();
  }, [param, rerender]); // Add `rerender` to dependency array

  if (isLoading) {
    return <LoadingComp />;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      notify("فایل معتبر نیست!" ,'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('reserveId', data.responseReservesMiddleware[0].ReserveId);

    try {
      setIsLoading(true);
      await axios.post('https://gmhotel.ir/api/uploadfilemiddlereserve', formData);
      notify('رسید با موفقیت بارگذاری شد', 'success');
      setIsLoading(false);
      setRerender(!rerender); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
            extension = '';
        }
        filename += extension;
      }

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
  };

  return (
    <div style={{marginBottom:"5rem", marginTop:"2rem"}}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <img src={Logo} width="5%" alt='لوگو' />
          <span style={{ color: "#1B5695", fontSize: "15px" }}>مدیریت رزرو و پرداخت قصرمنشی</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "10px", justifyContent: "center", alignItems: "center" }}>
          <span>کاربر گرامی، در این بخش می توانید اطلاعات رزرو را مشاهده کنید، جهت ویرایش اطلاعات رزرو لطفا با رزرواسیون تماس بگیرید</span>
          <span style={{ color: "red", marginTop:"2rem" }}>لطفا فیش واریزی را در قسمت مشخص شده بارگذاری نمایید</span>
        </div>
      </div>
      <div className={styles.tableContainer}>
        {data && data.responseReservesMiddleware && data.responseReservesMiddleware.length > 0 ? (
          <div style={{ marginBottom: '20px' }}>
            <div className={styles.responsiveTable}>
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
                    <td style={cellStyle} data-label="نام رزرو کننده">{data.responseReservesMiddleware[0].FullName}</td>
                    <td style={cellStyle} data-label="تاریخ ثبت">{data.responseReservesMiddleware[0].RequestDate}</td>
                    <td style={cellStyle} data-label="شماره تماس">{data.responseReservesMiddleware[0].Phone}</td>
                    <td style={cellStyle} data-label="تاریخ ورود">{moment.from(data.responseReservesMiddleware[0].CheckIn, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}</td>
                    <td style={cellStyle} data-label="تاریخ خروج">{moment.from(data.responseReservesMiddleware[0].CheckOut, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.tableContainer}>

            <div className={styles.responsiveTable}>
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
                    <td style={cellStyle} data-label="شماره رزرو">{data.responseReservesMiddleware[0].ReserveId}</td>
                    <td style={cellStyle} data-label="وضعیت">{data.responseReservesMiddleware[0].Status === "pending" ? "در انتظار پرداخت" : "پرداخت شده"}</td>
                    <td style={cellStyle} data-label="اپراتور">{data.responseReservesMiddleware[0].LoggedUser}</td>
                    <td style={cellStyle} data-label="درصد پرداخت">{data.responseReservesMiddleware[0].Percent}</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>
          </div>
        ) : (
          <p>No data available</p>
        )}
        <span style={{ fontWeight: "bold" }}>مشخصات اتاق ها</span>
        
        {data && data.responseReservesMiddleware && data.responseReservesMiddleware.length > 0 ? (
          <div>
            <div className={`${styles.responsiveTable} ${styles.roomTable}`}>
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
                    <tr style={{margin:"10px"}} key={item.id}>
                      <td style={cellStyle} data-label="نوع اتاق">{item.RoomName}</td>
                      <td style={cellStyle} data-label="قیمت">{item.Price}</td>
                      <td style={cellStyle} data-label="تعداد شب">{item.AccoCount}</td>
                      <td style={cellStyle} data-label="قیمت سرویس اضافه">{item.ExtraService}</td>
                      <td style={cellStyle} data-label="درصد تخفیف">{item.OffRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" , border:"2px solid blue", padding:"2rem", borderRadius:"10px"}}>
              <span style={{fontWeight:"bold"}}>جمع کل : {totalPrice} ریال</span>
              
                <span style={{fontWeight:"bold"}}>مبلغ پرداخت شده : {paidAmount} ریال</span>
                <span style={{fontWeight:"bold"}}>مانده بدهی : {totalPrice - paidAmount} ریال</span>
              </div>
              <span style={{fontWeight:"bold", fontSize:"26px", marginTop:"2rem"}}>اطلاعات حساب</span>
              <div className={styles.responsiveTable}>
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
                            <td style={cellStyle} data-label="شماره کارت">{accountDetails.card}</td>
                            <td style={cellStyle} data-label="شماره حساب">{accountDetails.account}</td>
                            <td style={cellStyle} data-label="شماره شبا">{accountDetails.sheba}</td>
                            <td style={cellStyle} data-label="نام صاحب حساب">{accountDetails.owner}</td>
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
              </div>
            </div>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{marginTop:"3rem", marginBottom:"3rem",fontWeight:"bold"}}>بارگذاری رسید های پرداخت</span>
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
            <button style={{ margin: "1rem" }} onClick={handleFileUpload}>بارگذاری</button>
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", direction:"rtl" }}>
        {paymentData && paymentData.length > 0 ? (
          <div className="responsive-table">
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
                {paymentData !== "No files found for the specified ReserveId" && paymentData.map((item, index) => (
                  <tr style={{margin:"10px"}} key={item.id}>
                    <td style={cellStyle} data-label="ردیف">{index + 1}</td>
                    <td onClick={() => downloadReceit(item.id)} style={{ ...cellStyle, cursor: "pointer" }} data-label="رسید پرداخت">دانلود</td>
                    <td style={cellStyle} data-label="شماره رزرو">{item.reserveId}</td>
                    <td style={cellStyle} data-label="وضعیت">{item.isConfirmed === "false" ? <span>در صف بررسی</span> : <span>تایید شده</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
      <div style={{direction:'rtl', textAlign:"justify", margin:"2vw 5vw 2vw 5vw"}}>
       <h3> شرایط انصراف:</h3>
تا 8 روز قبل از تاریخ ورود بدون جریمه , از 7 تا 3 روز قبل از ورود جریمه معادل 50 درصد هزینه کل اقامت و در نهایت در صورت تمایل برای کنسلی اتاق تا 48 ساعت قبل از ورود جریمه معادل 100 درصد از هزینه کل دریافتی می باشد.

<h3>شرایط پذیرش در بوتیک هتل قصر منشی:</h3>
<p style={{lineHeight:"2rem"}}>
1 - پذیرش مهمانان گرامی پیرو ضوابط و قوانین جمهوری اسلامی ایران می باشد, از این رو داشتن تمامی مدارک و اسناد مرتبط و مورد نیاز , طبق قوانین الزامی می باشد, لذا همراه نداشتن موارد ذکر شده موجب عدم پذیرش و سوخت تمامی مبلغ پرداختی می شود.

2 - پذیرش مهمانان از ساعت 14 صورت می پذیرد و ساعت در نظر گرفته شده برای تخلیه اتاق 12 ظهر می باشد.<br></br>

3 - به جهت حفظ آرامش مهمانان در مکان های سنتی برای هیچ یک از اتاق ها تلویزیون قرار داده نشده است.<br></br>

4 - کشیدن سیگار در تمامی اتاق ها و سالن ها ممنوع می باشد و در صورت تخلف ملزم به پرداخت جریمه خواهد بود.<br></br>

5 - میهمانان در کلیه قسمت های هتل اعم از اتاق ها, رستوران و فضای باز قادر به استفاده از اینترنت رایگان پر سرعت می باشند.<br></br>

6 - جهت فراهم نمودن امکانات حمل و نقل , تا 48 ساعت قبل از ورود به مسئول واحد پذیرش اطلع دهید تا اقدامات لزم انجام گیرد.<br></br>

7 - خدمات قابل ارائه به مهمانان در هتل شامل اقامت و صبحانه می باشد در صورت تمایل جهت استفاده از خدمات همایونی مسئول رزرواسیون را مطلع کنید.<br></br>

8 - مسئولیت تمامی موارد مربوط به صحت و سقم روادید, پاسپورت و سایر اسناد مرتبط و همچنین امنیت مسافران خارج از فضای هتل بر عهده آژانس مرتبط می باشد.<br></br>

9 - به جهت اینکه استفاده از خدمات حمام سنتی ایرانی مجموعه به صورت رزرو اختصاصی است و زمان های محدود برای پذیرش دارد توصیه می شود در صورت تمایل جهت کسب اطلاعات بیشتر قبل از ورود از طریق شماره 09012224097 با ما در ارتباط باشید تا اقدامات لازم انجام گیرد.<br></br>

10 - روز قبل از ورود به هتل از بخش پذیرش با شماره تماس ارائه شده از مهمان تماس گرفته می شود. در صورت تمایل برای دریافت خدمات خاص مورد نظر خود لطفا به ایشان اطلع دهید.<br></br>
</p>
      </div>
    </div>
  );
}

const tableStyle = {
  borderCollapse: 'collapse',
  margin: '10px auto', // Updated to center tables
  fontSize: '1em',
  fontFamily: 'Arial, sans-serif',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
};

const cellStyle = {
  border: '1px solid #dddddd',
  textAlign: 'left',
  padding: '8px',
  backgroundColor: '#f2f2f2',
};
