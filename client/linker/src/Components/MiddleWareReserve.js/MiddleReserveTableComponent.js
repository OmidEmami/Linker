import React,{useState} from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { parseISO, isDate, isValid } from 'date-fns';
import moment from 'jalali-moment'
import Modal from 'react-modal';
import axios from 'axios';
import { notify } from '../toast';
import { useSelector } from "react-redux";
import LoadingComp from '../LoadingComp';


const MiddleReserveTableComponent = ({ data }) => {
  const [showPopUp, setShowPopUp] = useState(false)
  const realToken = useSelector((state) => state.tokenReducer.token);
  const [isLoading, setIsLoading] = useState(false)
  const [popupData, setPopUpData] = useState('');
  const [receitInfo, setReceitInfo] = useState('');
  const [showBankReserve, setShowBankReserve] = useState(false);
  const [paidAmount, setPaidAmount] = useState('');
  const [transactionCode, setTransactionCode] = useState('')
    moment.locale('fa');
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
    const columns = React.useMemo(
        () => [
          {
            Header: 'نام مهمان',
            accessor: 'FullName',
          },
          {
            Header: 'شماره تماس',
            accessor: 'Phone',
          },
          {
            Header: 'تاریخ ورود',
            accessor: 'CheckIn',
            Cell: ({ cell }) => {
              const dateValue = parseISO(cell.value);
              if (isValid(dateValue)) {
                return moment.from(dateValue, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD') // Customize the format as needed
              }
              return '';
            },
          },
          {
            Header: 'تاریخ خروج',
            accessor: 'CheckOut',
            Cell: ({ cell }) => {
              const dateValue = parseISO(cell.value);
              if (isValid(dateValue)) {
                return moment.from(dateValue, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD') // Customize the format as needed
              }
              return '';
            },
          },
          {
            Header: 'نوع اتاق',
            accessor: 'RoomName',
          },
          {
            Header:'قیمت هر شب',
            accessor :'Price'
        },
        {
            Header:'مدت اقامت',
            accessor :'AccoCount'
        },
        {
          Header:'تاریخ درخواست',
          accessor :'RequestDate'
      },
        {
            Header:'شماره تاریانا',
            accessor :'Tariana'
        },
          {
            Header: 'وضعیت',
            accessor: 'Status',
            sortType: (rowA, rowB, columnId) => {
              const dateA = parseISO(rowA.original.payDate);
              const dateB = parseISO(rowB.original.payDate);
      
              if (!isValid(dateA) || !isDate(dateB)) {
                return 0;
              }
      
              return dateA.getTime() - dateB.getTime();
            },
          },
          {
            Header: 'آیدی رزرو',
            accessor: 'ReserveId',
          },
         
        ],
        []
      );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    page,
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5, sortBy: [{ id: 'RequestDate', desc: true }] }, // Set initial page index and page size
    },
    useSortBy,
    usePagination
  );
const setDataForPopUp = (row) =>{
  setPopUpData(row.original)
  setShowPopUp(true)
}
const getReceits = async(id) =>{
  try{
    setIsLoading(true)
    const paymentResponse = await axios.post("http://localhost:3001/api/getMiddleReservePaymentData",{
      reserveId : id
    })
   setReceitInfo(paymentResponse.data)
   setIsLoading(false)

  }catch(error){
    setIsLoading(false)

  }
    }
    const downloadReceit = async (id) => {
      setIsLoading(true)

      try {
          const response = await axios.post("http://localhost:3001/api/downloadreceit", {
              
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
          setIsLoading(false)

      } catch (error) {
        setIsLoading(false)

          console.error("Failed to download receipt:", error);
          notify("Error downloading the receipt.");
      }
  }
  const confirmAcc = async(reserveId, id)=>{
    setPaidAmount('');
    setTransactionCode('')
      setShowBankReserve({status : true , id : id})
  }
  const confirmReserve = async(reserveId, id)=>{
    setPaidAmount('');
    setTransactionCode('')
      setShowBankReserve({status : true , id : id})
  }
  const confirmReceitReserve = async(reserveId, id)=>{
      try{
        setIsLoading(true)
        const response = await axios.post('http://localhost:3001/api/confirmreceitreserve',{
          reserveId : reserveId,
          id : id,
          transactionCode : transactionCode,
          paidAmount : paidAmount
        })
        if(response){
          notify('رسید تایید شد', 'success')
          setIsLoading(false)
        }else{
          notify('خطا','error')
          setIsLoading(false)

        }
      }catch(error){
        notify('خطا','error')
        setIsLoading(false)

      }
  }
  return (
    <div style={{ textAlign: 'center' }}>
      {isLoading && <LoadingComp />}
      <Modal
        isOpen={showPopUp}
        //onAfterOpen={afterOpenModal}
        onRequestClose={()=>setShowPopUp(false)}
        style={customStyles}
        contentLabel="Example Modal"
        
      >
        <div style={{direction:"rtl",display:"flex",flexDirection:"column",justifyContent: "center",
          alignItems: "center"}}>
           <h3> اطلاعات بیشتر</h3>
        <table style={{ borderCollapse: 'collapse', width: '50%' }}>
          
      <thead>
        <tr style={{ borderBottom: '1px solid black' }}>
          <th style={{ border: '1px solid black', padding: '8px' }}>درصد پرداخت</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>قیمت سرویس اضافه</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>نوع رزرو</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>درصد تخفیف</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>ثبت کننده</th>
        </tr>
      </thead>
      <tbody>
        
          <tr key={popupData.id} style={{ borderBottom: '1px solid black' }}>
            <td style={{ border: '1px solid black', padding: '8px' }}>{popupData.Percent}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{popupData.ExtraService === null ? <p>ندارد</p> : popupData.ExtraService}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{popupData.ReserveOrigin}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{popupData.OffRate}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{popupData.LoggedUser}</td>
          </tr>
        
      </tbody>
    </table>
    <div>
      <span>مشاهده رسید های بارگذاری شده</span>
      <button onClick={()=>getReceits(popupData.ReserveId)}>مشاهده رسید ها</button>
      {receitInfo !== '' && receitInfo.length > 0 ? <div>
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
  
        <div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>ردیف</th>
                <th style={cellStyle}>رسید پرداخت</th>
                <th style={cellStyle}>شماره رزرو</th>
                <th style={cellStyle}>وضعیت</th>
                <th style={cellStyle}>نمایش</th>
                {showBankReserve &&
                <>
                <th style={cellStyle}>شماره پیگیری</th>
                <th style={cellStyle}>مبلغ</th>
                <th style={cellStyle}>تایید</th>
                </> 
                }
              </tr>
            </thead>
            <tbody>
              
              {receitInfo !== "No files found for the specified ReserveId" && receitInfo.map((item,index) => (
                <>
                <tr key={item.id}>
                  <td style={cellStyle}>{index +1}</td>
                  <td onClick={()=>downloadReceit(item.id)}  style={{...cellStyle, cursor:"pointer"}}>دانلود</td>
                  <td style={cellStyle}>{item.reserveId}</td>
                  <td style={cellStyle}>{item.isConfirmed === "false" ? <span>در صف بررسی</span> : <span>تایید شده</span>}</td>
                  <td style={cellStyle}>{realToken.user === 'admin' || realToken.user === 'acc' ? <button style={{cursor:"pointer"}} onClick={()=>confirmReserve(item.reserveId, item.id)}>تایید رزرواسیون</button>:<button style={{cursor:"pointer"}} onClick={()=>confirmAcc(item.reserveId, item.id)}>تایید حسابداری</button> }</td>
              {showBankReserve && showBankReserve.id === item.id &&
              <>
              <td style={cellStyle}><input value={transactionCode} onChange={(e)=>setTransactionCode(e.target.value)} placeholder='شماره پیگیری' /></td>
              <td style={cellStyle}><input value={paidAmount} onChange={(e)=>setPaidAmount(e.target.value)} placeholder='مبلغ' /></td>
              <td style={cellStyle}><button onClick={()=>confirmReceitReserve(item.reserveId, item.id)}>ثبت</button></td>
              </>
              }
                </tr>
                

                </>
              ))}
            </tbody>
            
          </table>
        
          
        </div>
      
  </div>
      </div> : <div>رسیدی یافت نشد</div>}
    </div>
      </div>
   
      </Modal>
      <table {...getTableProps()} style={{ width: '99%', borderCollapse: 'collapse',marginLeft:"5px" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id} style={{ border: '1px solid black', padding: '8px' }}>
                  {column.render('Header')}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody  {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr style={{ cursor: 'pointer' }} onClick={()=>setDataForPopUp(row)} {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td  {...cell.getCellProps()} key={cell.column.id} style={{ border: '1px solid black', padding: '2px' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination */}
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {state.pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={state.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '50px' }}
          />
        </span>
        <select
          value={state.pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
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
export default MiddleReserveTableComponent;



