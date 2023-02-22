import { useState, useEffect } from 'react';

// MUI components
import { Box, Grid } from '@mui/material';
import PaginationComp from '../../../../components/commonComponent/Pagination/Pagination';

// Common components

// Types
type columnType = {
  title: string;
  dataIndex: string;
  key: string;
  onClick?: any;
  headerRender?: any;
  render?: any;
  width?: any;
};
const indexKey = 'index';

// Component begins here
const PaginationAuth = (props: {
  data?: any;
  isItemSelected?: any;
  pagination?: {
    totaLNoOfRecords: number;
    totalNoOfPages: number;
    pageSize: number;
    pageNumber: number;
    onPageChange: Function;
    onPageSizeChange: Function;
  };
  tabStatus?: any;
}) => {
  const { pagination } = props;
  const [rowsPerPage, setRowsPerPage] = useState(pagination?.pageSize || 10);
  const [currentPage, setCurrentPage] = useState(pagination?.pageNumber || 0);

  useEffect(() => {
    setRowsPerPage(pagination?.pageSize || 10);
    setCurrentPage(pagination?.pageNumber || 0);
  }, [props.tabStatus]);

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

  return (
    <Box>
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
export default PaginationAuth;
