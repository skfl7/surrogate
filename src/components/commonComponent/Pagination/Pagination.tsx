import { ChangeEvent, ChangeEventHandler, MouseEventHandler } from 'react';

// MUI components
import {
  Button,
  Grid,
  Pagination,
  TableCell,
  TablePagination,
  TableRow,
} from '@mui/material';
import LeftArrow from '@mui/icons-material/KeyboardDoubleArrowLeft';
import LastArrow from '@mui/icons-material/KeyboardDoubleArrowRight';
import './Pagination.scss';

// Styles
import { useStyles } from '../../../style/MuiStyles/muiStyles';

function PaginationComp(props: {
  lastButtonDisabled: boolean | undefined; //Remove this
  onFirstClick?: MouseEventHandler<HTMLButtonElement> | any;
  onLastClick?: MouseEventHandler<HTMLButtonElement> | any;
  onPageChange?: any; // Remove this
  handleChangeRowsPerPage?:
    | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | any;
  handleChangePage?: any;
  page: number;
  rowsPerPage: number;
  rows?: any[] | any; // Remove this
  totalRecordCount?: number;
  totalPages?: number;
  firstButtonDisabled?: any;
}) {
  const {
    totalPages,
    totalRecordCount,
    rowsPerPage,
    page,
    firstButtonDisabled,
  } = props;

  return (
    <Grid
      container
      sx={{ justifyContent: 'space-between' }}
      className="table_pagination"
    >
      <Grid className="paginationListing">
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[
              5,
              10,
              25,
              50,
              100,
              { label: 'All', value: -1 },
            ]}
            colSpan={3}
            count={totalRecordCount || props.rows?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={'Listing per Page'}
            SelectProps={{
              inputProps: {
                'aria-label': 'listing per page',
              },
              native: true,
            }}
            sx={{
              height: '70px',
              borderBottom: 'none',
              ...useStyles.pagination,
            }}
            labelDisplayedRows={({ from, to, count }) =>
              `Showing ${from}-${to} of ${count}`
            }
            onPageChange={props.handleChangePage}
            onRowsPerPageChange={props.handleChangeRowsPerPage}
            ActionsComponent={ActionComponentDisabled}
          />
        </TableRow>
      </Grid>
      <Grid className="paginationArrow">
        <TableCell
          sx={{
            borderBottom: 'none',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Button
            disabled={
              firstButtonDisabled ? firstButtonDisabled : props.page + 1 === 1
            }
            startIcon={<LeftArrow />}
            sx={{
              fontSize: '14px',
              marginBottom: '20px',
              marginRight: '20px',
              textTransform: 'capitalize',
              minWidth: { sm: 'unset', md: '64px' },
              padding: { sm: '0', md: '6px 8px' },
            }}
            onClick={props.onFirstClick}
          >
            First
          </Button>
          <Pagination
            sx={{
              ...useStyles.numberPag,
            }}
            boundaryCount={1} // need to check
            // boundaryCount={3}
            count={
              totalPages || Math.ceil(props.rows?.length / props.rowsPerPage)
            }
            variant="outlined"
            shape="rounded"
            onChange={(event, page) => props.onPageChange(event, page - 1)}
            siblingCount={0}
            page={page + 1}
          />
          <Button
            disabled={
              props.lastButtonDisabled
              // ||
              // props.rows?.length <= props.rowsPerPage
            }
            endIcon={<LastArrow />}
            sx={{
              fontSize: '14px',
              marginBottom: '20px',
              marginLeft: '20px',
              textTransform: 'capitalize',
              minWidth: { sm: 'unset', md: '64px' },
              padding: { sm: '0', md: '6px 8px' },
            }}
            onClick={props.onLastClick}
          >
            Last
          </Button>
        </TableCell>
      </Grid>
    </Grid>
  );
}

const ActionComponentDisabled = () => <span />;

export default PaginationComp;
