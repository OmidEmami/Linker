import React,{useState} from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { parseISO, isDate, isValid } from 'date-fns';
import moment from 'jalali-moment'
import Modal from 'react-modal';
const MiddleReserveTableComponent = ({ data }) => {
  const [showPopUp, setShowPopUp] = useState(false)
  const [popupData, setPopUpData] = useState('')
    moment.locale('fa');
    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width:"60%"
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
  return (
    <div style={{ textAlign: 'center' }}>
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
          <th style={{ border: '1px solid black', padding: '8px' }}>ثبت کننده</th>
        </tr>
      </thead>
      <tbody>
        
          <tr key={popupData.id} style={{ borderBottom: '1px solid black' }}>
            <td style={{ border: '1px solid black', padding: '8px' }}>{popupData.Percent}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{popupData.ExtraService === null ? <p>ندارد</p> : popupData.ExtraService}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{popupData.LoggedUser}</td>
          </tr>
        
      </tbody>
    </table>
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

export default MiddleReserveTableComponent;



