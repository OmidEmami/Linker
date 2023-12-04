import React, { useState,useEffect } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Logo from '../assests/logoBrown.png';
import axios from 'axios';
import LoadingComp from '../Components/LoadingComp';
import styles from './RequestFollowUp.module.css'
import { notify } from "../Components/toast";
const columns = [
    { id: 'id', label: 'ردیف' },
    { id: 'FullName', label: 'نام مهمان',editable: true  },
    { id: 'Phone', label: 'شماره تماس' },
    { id: 'HamamType', label: 'نوع حمام' },
    {id: 'PreferedDate' , label :'تاریخ های پیشنهادی'},
    {id: 'UniqueId', label : 'شماره درخواست'},
    {id:'RequestDate', label:'تاریخ ثبت',sortable:"true"},
    {id: 'FirstFollow', label:'نتیجه پیگیری اول'},
    {id :'SecondFollow', label :'نتیجه پیگیری دوم'},
    {id :'Status', label :'وضعیت',sortable:"true"},
    {id : 'Source', label :'منبع',sortable:"true"}
  // Add more columns as needed
];

const rowsPerPageOptions = [5, 10, 25];

const RequestFollowUp = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false)
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
    const sortedData = [...data].sort((a, b) => {
      if (isAsc) {
        return a[columnId] > b[columnId] ? 1 : -1;
      } else {
        return b[columnId] > a[columnId] ? 1 : -1;
      }
    });
    setData(sortedData);
  };
  useEffect(() => {
    
    const fetchData=async()=>{
        setIsLoading(false)
        try{
            const response = await axios.get("http://localhost:3001/api/getNewLeads")
         
                setData(response.data)
                setIsLoading(true)
        }catch(error){

        }

    }
    fetchData();
          }, []);
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFieldChange = (row,column, newValue) => {
    console.log(row.id + "" + column +"" + newValue)
    setShowSaveButton(true)
    const updatedData = data.map((item) =>
    // var calledChange = column
      item.id === row.id ? { ...item, [column]: newValue } : item
    );
    setData(updatedData);
  };
  const saveNewData = async()=>{
    setShowSaveButton(false)
    setRegisterLoading(true)
    try{
      const response = await axios.post("http://localhost:3001/api/regFollowLead",{
        data : data 
    })
   if(response.data === "Omid"){
    setRegisterLoading(false)
    notify( "اطلاعات با موفقیت ثبت شد", "success")
   }
    }catch(error){
      setRegisterLoading(false)
      notify( "خطا", "error")
    }
  }
  return (
   <>
   {registerLoading && <LoadingComp/>}
    {isLoading === true ? <>
      <div className={styles.HeaderCustomer}>
        
        <img className={styles.LogoContainer} alt='logo' src={Logo} />
      </div>
      <div className={styles.headerTextHolder}>
        <h2>مدیریت درخواست های حمام</h2>
        <p style={{color:"red"}}>بعد از ایجاد تغییرات حتما ذخیره کنید</p>
        </div>
      
    <TableContainer className={styles.MainContainer} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} onClick={() => column.sortable && handleSort(column.id)}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <TableRow className={row.Status === "Pending" && styles.pendingView || row.Status === "Active" && styles.activeView || row.Status === "Cancel" && styles.cancelView} key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {column.editable || column.id === 'FullName'
                  || column.id === 'Phone' || column.id === 'HamamType' || column.id === 'FirstFollow'
                  || column.id === 'SecondFollow'
                  || column.id === 'PreferedDate'
                  ? (column.id !== "Status" ?(
                    <textarea
                    sx={{
                      '--Textarea-focusedInset': 'var(--any, )',
                      '--Textarea-focusedThickness': '0.25rem',
                      '--Textarea-focusedHighlight': 'rgba(13,110,253,.25)',
                      '&::before': {
                        transition: 'box-shadow .15s ease-in-out',
                      },
                      '&:focus-within': {
                        borderColor: '#86b7fe',
                      },
                    }}
                      value={row[column.id]}
                      onChange={(e) => handleFieldChange(row,column.id, e.target.value)}
                      style={{ width: `${row.width}px`, height: `${row.height}px` }}
                    />
                  ): <select onChange={(e) => handleFieldChange(row,column.id, e.target.value)} value={row[column.id]}><option value={row[column.id]}>{row[column.id]}</option>
                  <option value="Active">Active</option>
                  <option value="Cancel">Cancel</option>
                  </select>) : (column.id !== "Status" ?(row[column.id]):(
                  <select onChange={(e) => handleFieldChange(row, column.id, e.target.value)} value={row[column.id]}>
                  {['Active', 'Cancel', 'Pending'].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>)
                   
                  )}
                  {/* {column.id === 'Source' && <select>
                    <option value="">omid</option>
                    </select>} */}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        className={styles.pager}
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="نمایش در هر صفحه"
      />
    </TableContainer></>:<div><LoadingComp /></div>}
    <div style={{display:"flex",justifyContent: "center",
    alignItems: "center"}}>
    {showSaveButton && <button onClick={saveNewData} className={styles.buttonClass}>ذخیره</button>}
    </div>
  </>
  );
};

export default RequestFollowUp;