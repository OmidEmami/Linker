import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import './ReportComponent.css'; // Make sure to create this CSS file in the same folder as your component
import moment from 'jalali-moment';
import DatePicker, { DateObject,getAllDatesInRange }from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import { notify } from '../toast';
function ReportComponent() {
  const [values, setValues] = useState('');
  const digits=["0","1","2","3","4","5","6","7","8","9"];
  const [data, setData] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [detailsRecCalls , setDetailsRecCalls] = useState([]);
  const [detailsResCalls, setDetailsResCalls] = useState([]);
  const [detailsAllCalls, setDetailsAllCalls] = useState([]);
  const [detailsRecCallsTime , setDetailsRecCallsTime] = useState([]);
  const [detailsResCallsTime, setDetailsResCallsTime] = useState([]);
  const [detailsAllCallsTime, setDetailsAllCallsTime] = useState([]);
  const [allAccoCalls, setAllAccoCalls] = useState([]);
  const [allCapCalls, setAllCapCalls] = useState([]);
  const [allAcceptedCapCalls, setAllAcceptedCapCalls] = useState([]);
  const [allAccoPriceCalls, setAllAccoPriceCalls] = useState([])
  const [allfixedReservedCalls, setAllFixedReservedCalls] = useState([]);
  const [valuesNd, setValuesNd] = useState('')
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;
  const m = moment();

  useEffect(() => {
    axios.get('https://gmhotel.ir/api/getCallsReport')
      .then(response => {
        setData(response.data);
        setIsLoading(false);
        
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
      axios.get('https://gmhotel.ir/api/getAllCallsReport')
      .then(response => {
        setDataAll(response.data);
        setIsLoading(false);
       
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const pagesCount = Math.ceil(sortedData.length / rowsPerPage);
  const dataSlice = sortedData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  // Function to generate pagination buttons
  const getPaginationGroup = () => {
    let start = Math.max(currentPage - 2, 0);
    let end = Math.min(start + 5, pagesCount);
    start = Math.max(0, end - 5);
    return Array.from({ length: (end - start) }, (_, i) => start + i);
  };
  const checkTodayCallDetails = async () => {
    // Reset the state arrays to empty at the beginning of the function
    setDetailsAllCalls([]);
    setDetailsResCalls([]);
    setDetailsRecCalls([]);
  
    // Use setTimeout to ensure that the state is reset before new data is added
    setTimeout(() => {
      for (let i = 0; i < dataAll.length; i++) {
        if (dataAll[i].Time && dataAll[i].Time.split(' ')[0] === m.format('jYYYY/jMM/jDD')) {
          setDetailsAllCalls(prevData => [...prevData, dataAll[i]]);
        }
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].LastCall && data[i].Section === "2" && data[i].LastCall.split(' ')[0] === m.format('jYYYY/jMM/jDD')) {
          setDetailsResCalls(prevData => [...prevData, data[i]]);
        }
        if (data[i].LastCall && data[i].Section === "1" && data[i].LastCall.split(' ')[0] === m.format('jYYYY/jMM/jDD')) {
          setDetailsRecCalls(prevData => [...prevData, data[i]]);
        }
      }
    }, 0);
  };
  const checkSpecificDateReport = async()=>{
    
    setDetailsAllCallsTime([]);
    setDetailsResCallsTime([]);
    setDetailsRecCallsTime([]);
  
    // Use setTimeout to ensure that the state is reset before new data is added
    setTimeout(() => {
      for (let i = 0; i < dataAll.length; i++) {
        if (dataAll[i].Time && values !== '' && dataAll[i].Time.split(' ')[0] === values.format('YYYY/MM/DD')) {
          setDetailsAllCallsTime(prevData => [...prevData, dataAll[i]]);
        }
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].LastCall && values !== '' && data[i].Section === "2" && data[i].LastCall.split(' ')[0] === values.format('YYYY/MM/DD')) {
          setDetailsResCallsTime(prevData => [...prevData, data[i]]);
        }
        if (data[i].LastCall && values !== '' && data[i].Section === "1" && data[i].LastCall.split(' ')[0] === values.format('YYYY/MM/DD')) {
          setDetailsRecCallsTime(prevData => [...prevData, data[i]]);
        }
      }
    }, 0);
  }
  const checkPriceAndCapCalls = () =>{
    setAllAccoCalls([])
    setAllCapCalls([])
    setAllAcceptedCapCalls([])
    setAllAccoPriceCalls([])
    setAllFixedReservedCalls([])
    
    setTimeout(() => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].LastCall && valuesNd !== '' && data[i].LastCall.split(' ')[0] === valuesNd.format('YYYY/MM/DD')) {
          if(data[i].RequestType === "اقامت"){
            console.log("test")
            setAllAccoCalls(prevData => [...prevData, data[i]])
          }
        }
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].LastCall && valuesNd !== '' && data[i].LastCall.split(' ')[0] === valuesNd.format('YYYY/MM/DD')) {
          if(data[i].AccoRequestType && data[i].AccoRequestType === "بررسی ظرفیت"){
            setAllCapCalls(prevData => [...prevData, data[i]])
          }
        }
      }
      for (let i = 0 ; i < data.length ; i++){
        if (data[i].LastCall && valuesNd !== '' && data[i].LastCall.split(' ')[0] === valuesNd.format('YYYY/MM/DD')) {
          if(data[i].ActionEghamatZarfiat && data[i].ActionEghamatZarfiat === "ظرفیت موجود"){
            setAllAcceptedCapCalls(prevData => [...prevData, data[i]])
          }
        }
      }
      for(let i = 0 ; i < data.length ; i++){
        if(data[i].LastCall && values !== '' && data[i].LastCall.split(' ')[0] === valuesNd.format('YYYY/MM/DD')){
          if(data[i].AccoRequestType && data[i].AccoRequestType === "بررسی قیمت"){
            setAllAccoPriceCalls(prevData => [...prevData, data[i]])
          }
        }
      }
      for(let i = 0 ; i < data.length ; i++){
        if(data[i].LastCall && valuesNd !== '' && data[i].LastCall.split(' ')[0] === valuesNd.format('YYYY/MM/DD')){
          if(data[i].ActionEghamatZarfiat && data[i].ActionEghamatZarfiat === "رزرو انجام شد" ){
            setAllFixedReservedCalls(prevData => [...prevData, data[i]])
          }
          
        }
      }


    }, 0);
  }
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
    const importReservesToSheets = async() => {
      try {
        setIsLoading(true);
        const response = await axios.get("https://gmhotel.ir/api/getreservesdetails");
        notify("Data successfully uploaded to Google Sheets", 'success');
        setIsLoading(false);
    } catch (error) {
        setIsLoading(false);
        notify("Error uploading data to Google Sheets", 'error');
        console.log(error);
    }
    }
  return (
    <div style={{display:"flex", flexDirection:"column"}}>
      <div style={{backgroundColor:"#D2AF6F", height:"80px", marginBottom:"1rem", display:"flex", flexDirection:"row", direction:"rtl", alignItems:"center", justifyContent:"center"}}>
        <div style={{direction:"rtl", border:"1px solid black", borderRadius:"15px", padding:"15px", backgroundColor:"#0080FF",cursor:"pointer", color:"white"}} onClick={importReservesToSheets}>دریافت خروجی در Google Sheets</div>
      </div>
      <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"flex-start", columnGap:"10px"}}>
      <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", border:"1px black solid", borderRadius:"25px",padding:"25px"}}>
      <Button onClick={checkPriceAndCapCalls} style={{backgroundColor:"blue",color:"white"}}>محاسبه آمار سرنخ های امروز</Button>
      <DatePicker
        required 
        digits={digits}
        value={valuesNd}
        onChange={value=>{setValuesNd(value)}} 
         calendar={persian}
         locale={persian_fa}
         format="DD/MM/YYYY"
         placeholder="انتخاب تاریخ"
         inputMode="single"
          single
         
       ></DatePicker>
      {<p> تماس های مرتبط با اقامت : {allAccoCalls.length}</p>}
      {<p> سرنخ های ایجاد شده برای ظرفیت دهی : {allCapCalls.length}</p>}
      {<p> سرنخ هایی که ظرفیت موجود بود : {allAcceptedCapCalls.length}</p>}
      {<p>سرنخ هایی که برای قیمت ایجاد شده : {allAccoPriceCalls.length}</p>}
      {<p>سرنخ هایی که منجر به رزرو شده است : {allfixedReservedCalls.length}</p>}
      </div>
      <div style={{display:"flex", flexDirection:"column", justifyContent:"center",rowGap:"10px", alignItems:"center", border:"1px black solid", borderRadius:"25px",padding:"25px"}}>
      <Button onClick={checkSpecificDateReport} style={{backgroundColor:"blue",color:"white"}}>محاسبه تعداد تماس های تاریخ انتخابی</Button>
      <DatePicker
        required 
        digits={digits}
        value={values}
        onChange={value=>{setValues(value)}} 
         calendar={persian}
         locale={persian_fa}
         format="DD/MM/YYYY"
         placeholder="انتخاب تاریخ"
         inputMode="single"
          single
         
       ></DatePicker>
      {<p>تعداد کل تماس ها : {detailsAllCallsTime.length}</p>}
      {<p>تعداد سرنخ ثبت شده از مبدا پذیرش : {detailsRecCallsTime.length}</p>}
      {<p>تعداد سرنخ ثبت شده از مبدا رزرواسیون : {detailsResCallsTime.length}</p>}
      </div>
      </div>
      <div>
      <h1>Report Data</h1>
      <table className="styled-table">
        <thead>
          <tr>
            {["Phone", "Name", "RequestType", "Result", "LastCall", "Section", "CustomerSource", "RegUser"].map((header, index) => (
              <th key={header} onClick={() => requestSort(header)} className={`header-col-${index % 2}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSlice.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td>{item.Phone}</td>
              <td>{item.FullName}</td>
              <td>{item.RequestType}</td>
              <td>{item.Result}</td>
              <td>{item.LastCall}</td>
              <td>{item.Section}</td>
              <td>{item.CustomerSource}</td>
              <td>{item.RegUser}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Button onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>First</Button>
        <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} disabled={currentPage === 0}>Prev</Button>
        {getPaginationGroup().map((page, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(page)}
            style={{ fontWeight: currentPage === page ? 'bold' : 'normal' }}
          >
            {page + 1}
          </button>
        ))}
        <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagesCount - 1))} disabled={currentPage === pagesCount - 1}>Next</Button>
        <Button onClick={() => setCurrentPage(pagesCount - 1)} disabled={currentPage === pagesCount - 1}>Last</Button>
      </div>
    </div>
      </div>
    
  );
}

export default ReportComponent;
