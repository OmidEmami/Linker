import React from 'react';

import logo from "./ghasr.png"

import moment from 'jalali-moment';
import styles from "./MyDocument.module.css"


const MyDocument = ({ data, price }) => {
  
  moment.locale('fa');

    return (      
<div  className={styles.mainContainer}>
  <img src={logo} alt='logo' style={{width:"10%"}} />
<h3 style={{fontSize:"15" , margin:"10px" }}>ووچر رزرو هتل قصرمنشی</h3>
            <div style={{display:"flex", flexDirection:"row", alignContent:"space-between"}}>
            <p style={{fontSize:"15" , margin:"10px" }}>نام مهمان : {data[0].FullName} </p>
             <p style={{fontSize:"15" , margin:"10px" }}> شماره تماس : {data[0].Phone}</p>
</div>
<table className={styles.tableStyles}>
      <thead>
        <tr>
          <th className={styles.thStyles}>ردیف</th>
          <th className={styles.thStyles}>نام اتاق</th>
          <th className={styles.thStyles}>قیمت هر شب به ریال</th>
          <th className={styles.thStyles}>تاریخ ورود و خروج</th>
          <th className={styles.thStyles}>مدت اقامت</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 && data.map((info,index)=> (
          <tr key={info.id}>
            <td className={styles.tdStyles}>{index + 1}</td>
            <td className={styles.tdStyles}>{info.RoomName}</td>
            <td className={styles.tdStyles}>{info.Price}</td>
            <td className={styles.tdStyles}>{moment.from(info.CheckIn, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD')} - {moment.from(info.CheckOut, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD')}</td>
            <td className={styles.tdStyles}>  شب  {info.AccoCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <p>کل مبلغ پرداخت شده : {price} ریال</p>
    <div style={{width:"80%", direction:"rtl"}}>
      <h4> شرایط انصراف: </h4>
    <p style={{direction:"rtl", textAlign: "justify"}}>
   
تا 8 روز قبل از تاریخ ورود بدون جریمه , از 7 تا 3 روز قبل از ورود جریمه معادل 50 درصد هزینه کل اقامت و در نهایت در صورت تمایل برای کنسلی
اتاق تا 48 ساعت قبل از ورود جریمه معادل 100 درصد از هزینه کل دریافتی می باشد.
    </p>
    <h4>شرایط پذیرش در بوتیک هتل قصر منشی:</h4>
    <p>1 - پذیرش مهمانان گرامی پیرو ضوابط و قوانین جمهوری اسلمی ایران می باشد, از این رو داشتن تمامی مدارک و اسناد مرتبط و مورد نیاز , طبق
قوانین الزامی می باشد, لذا همراه نداشتن موارد ذکر شده موجب عدم پذیرش و سوخت تمامی مبلغ پرداختی می شود.</p>
<p>2 - پذیرش مهمانان از ساعت 14 صورت می پذیرد و ساعت در نظر گرفته شده برای تخلیه اتاق 12 ظهر می باشد.</p>
<p>3 - به جهت حفظ آرامش مهمانان در مکان های سنتی برای هیچ یک از اتاق ها تلویزیون قرار داده نشده است.</p>
<p>4 - کشیدن سیگار در تمامی اتاق ها و سالن ها ممنوع می باشد و در صورت تخلف ملزم به پرداخت جریمه خواهد بود.</p>
<p>5 - میهمانان در کلیه قسمت های هتل اعم از اتاق ها, رستوران و فضای باز قادر به استفاده از اینترنت رایگان پر سرعت می باشند.</p>
<p>6 - جهت فراهم نمودن امکانات حمل و نقل , تا 48 ساعت قبل از ورود به مسئول واحد پذیرش اطلع دهید تا اقدامات لزم انجام گیرد.</p>
<p>7 - خدمات قابل ارائه به مهمانان در هتل شامل اقامت و صبحانه می باشد در صورت تمایل جهت استفاده از خدمات همایونی مسئول رزرواسیون را
مطلع کنید.</p>
<p>8 - مسئولیت تمامی موارد مربوط به صحت و سقم روادید, پاسپورت و سایر اسناد مرتبط و همچنین امنیت مسافران خارج از فضای هتل بر عهده آژانس
مرتبط می باشد.</p>
<p>9 - به جهت اینکه استفاده از خدمات حمام سنتی ایرانی مجموعه به صورت رزرو اختصاصی است و زمان های محدود برای پذیرش دارد توصیه می شود
در صورت تمایل جهت کسب اطلعات بیشتر قبل از ورود از طریق شماره 09012224097 با ما در ارتباط باشید تا اقدامات لزم انجام گیرد.
</p>
<p>10 - روز قبل از ورود به هتل از بخش پذیرش با شماره تماس ارائه شده از مهمان تماس گرفته می شود. در صورت تمایل برای دریافت خدمات خاص
مورد نظر خود لطفا به ایشان اطلع دهید.
</p>
    </div>
</div>
    )
  };
  
export default MyDocument