import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { parseISO, isDate, isValid } from 'date-fns';
import moment from 'jalali-moment'
const ReservesTableComponent = ({ data }) => {
    moment.locale('fa');

    const columns = React.useMemo(
        () => [
          {
            Header: 'Full Name',
            accessor: 'FullName',
          },
          {
            Header: 'Phone',
            accessor: 'Phone',
          },
          {
            Header: 'Check in date',
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
            Header: 'check out date',
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
            Header: 'Room Type',
            accessor: 'RoomName',
          },
          {
            Header:'Price',
            accessor :'Price'
        },
        {
            Header:'Nights',
            accessor :'AccoCount'
        },
        {
            Header:'Tariana',
            accessor :'Tariana'
        },
          {
            Header: 'Status',
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
            Header: 'Reserve id',
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
      initialState: { pageIndex: 0, pageSize: 5 }, // Set initial page index and page size
    },
    useSortBy,
    usePagination
  );

  return (
    <div style={{ textAlign: 'center' }}>
      <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
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
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id} style={{ border: '1px solid black', padding: '2px' }}>
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

export default ReservesTableComponent;



