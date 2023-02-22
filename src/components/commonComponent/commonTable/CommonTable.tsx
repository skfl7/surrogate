import { useState } from 'react';

// MUI components
import {
  Box,
  Grid,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

// common components
import PaginationComp from '../Pagination/Pagination';

// Assets
import UnfoldMoreIcon from '../../../assets/icons/sortArrow.svg';

// Styles
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.white ,
    color: theme.palette.common.black,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Type definitions
type columnType = {
  title: string;
  dataIndex: string;
  key: string;
  onClick?: any;
  sortColumn?: boolean;
  render?: Function;
  isError?: boolean;
};

const CommonTable = (props: {
  column: Array<columnType>;
  data: any;
  errorType?: string;
  pagination?: {
    totaLNoOfRecords: number;
    totalNoOfPages: number;
    pageSize: number;
    pageNumber: number;
    onPageChange: Function;
    onPageSizeChange: Function;
  };
  errorKey?: any;
}) => {
  const { pagination, data } = props;
  const [rowsPerPage, setRowsPerPage] = useState(pagination?.pageSize || 10);
  const [currentPage, setCurrentPage] = useState(pagination?.pageNumber || 0);

  // Pagination methods
  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setCurrentPage(newPage);
    pagination?.onPageChange && pagination?.onPageChange(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
    pagination?.onPageSizeChange &&
      pagination?.onPageSizeChange(parseInt(event.target.value, 10));
  };

  const onPageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    pagination?.onPageChange && pagination?.onPageChange(page);
  };

  const noDataStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  };

  const renderColoumn = (
    dataItem: any,
    columnItem: columnType,
    index: number
  ) => {
    if (columnItem?.render) {
      return columnItem?.render(
        dataItem[columnItem.dataIndex],
        dataItem,
        index
      );
    } else if (dataItem[columnItem.dataIndex])
      return dataItem[columnItem.dataIndex];
    return '--';
  };

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{ margin: '2% 0' }}
        className="common-table-container-new"
      >
        <Table
          style={{ width: props.column.length > 6 ? '120%' : '100%' }}
          aria-label="customized table"
        >
          <TableHead sx={{ backgroundColor: '#EEF7FF' }}>
            <TableRow>
              {props.column.map((item: columnType) => {
                return (
                  <StyledTableCell key={item.title}>
                    {item?.isError === true ? '' : item.title}
                    {item.sortColumn && (
                      <IconButton>
                        <img src={UnfoldMoreIcon} alt="Sort Icon" />
                      </IconButton>
                    )}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 &&
              data?.map((dataItem: any, index: number) => {
                return (
                  <TableRow
                    sx={{
                      backgroundColor:
                        props.errorKey && dataItem[props.errorKey] === 'FAILURE'
                          ? '#ffe5e3'
                          : 'white',
                    }}
                    key={dataItem.id}
                  >
                    {props.column.map((columnItem: columnType) => {
                      return (
                        <StyledTableCell
                          onClick={() =>
                            columnItem.onClick
                              ? columnItem.onClick(dataItem.copyLink)
                              : null
                          }
                          key={columnItem.key}
                        >
                          {renderColoumn(dataItem, columnItem, index)}
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={10}>
                  <Box sx={noDataStyle}>{'No data found'}</Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid>
        <PaginationComp
          rows={props.data} //Unnecessary prop, remove while integrating other non-common table paginations
          totalRecordCount={pagination?.totaLNoOfRecords || 0}
          totalPages={pagination?.totalNoOfPages || 0}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          handleChangePage={handlePageChange}
          handleChangeRowsPerPage={handleRowsPerPageChange}
          onPageChange={onPageChange} //This is same as handlePageChange. Remove while integrating other non-common table paginations
          onLastClick={(event: any) => {
            // setCurrentPage(Math.ceil(props.data.length / rowsPerPage));
            handlePageChange(
              event,
              pagination?.totalNoOfPages ? pagination?.totalNoOfPages - 1 : 0
            );
          }}
          onFirstClick={(event: any) => {
            handlePageChange(event, 0);
          }}
          lastButtonDisabled={
            pagination
              ? currentPage === pagination?.totalNoOfPages - 1
              : currentPage === Math.ceil(props.data?.length / rowsPerPage) //This condition needs to be removed
          }
        />
      </Grid>
    </Box>
  );
};

export default CommonTable;
