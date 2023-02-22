import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import './style.scss';
import { SearchOutlined } from '@mui/icons-material';
import GroupButton from '../GroupButton/GroupButton';
import { ReactComponent as EditIcon } from '../../../assets/icons/editColumn.svg';
import { colors } from '../../../style/Color';
import PaginationComp from '../Pagination/Pagination';

type props = {
  toggleOptions?: Array<any>;
  headerData: Array<any>;
};

function EmptyTableView({ toggleOptions, headerData }: props) {
  return (
    <Stack className="no-table-data-container">
      <div
        style={{
          display: 'flex',
          pointerEvents: 'none',
          backgroundColor: 'white',
          opacity: '0.6',
        }}
      >
        <TextField
          className="text-field"
          placeholder="Search by..."
          InputProps={{
            startAdornment: (
              <IconButton edge="start">
                <SearchOutlined />
              </IconButton>
            ),
          }}
        />
        <div className="third-header">
          <GroupButton data={toggleOptions} />
          <div className="reset-data">
            <Button
              startIcon={<EditIcon />}
              sx={{
                fontSize: '14px',
                marginLeft: '56px',
                color: '#0662B7',
                fontWeight: '600',
                textTransform: 'none',
              }}
            //   onClick={handleClick}
            >
              Edit Columns
            </Button>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          pointerEvents: 'none',
          backgroundColor: 'white',
          opacity: '0.6',
          marginTop: '16px',
        }}
      >
        <Grid container spacing={0}>
          <Grid item sm={12}>
            <TableContainer
              component={Paper}
              sx={{ maxWidth: '100%' }}
              className="table1"
            >
              <Table
                style={{
                  width: '100%',
                  borderBottom: 'none',
                  overflowX: 'auto',
                  
                }}
                aria-label="customized table"
              >
                <TableHead
                  sx={{
                    backgroundColor: colors.tableHeaderLightBlue,
                    padding: '10px',
                  }}
                >
                  <TableRow sx={{ padding: '10px' }}>
                    {headerData.map((item: any, index: number) => {
                      return (
                        <TableCell
                          sx={{
                            padding: '10px',
                            fontWeight: 800,
                            borderBottom: 'none',
                            height: '68px',
                          }}
                          style={{ borderBottom: 'none' }}
                          width={item.width}
                          key={index}
                        >
                          {item?.headerRender
                            ? item?.headerRender(item.title, item, index)
                            : item.title}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>
      <Box my={15}>
        <Typography sx={{ fontSize: '14px' }}>
          *Choose a preferred category to view more data/options*
        </Typography>
      </Box>
      <div style={{ height: '8px', width: '95%', backgroundColor: '#F3F3F3', margin: 'auto' }} > </div>


      <div
        style={{
          display: 'flex',
          pointerEvents: 'none',
          backgroundColor: 'white',
          opacity: '0.6',
        }}
      >
        <PaginationComp
          rows={[]}
          totalRecordCount={0}
          totalPages={0}
          rowsPerPage={10}
          page={0}
          handleChangePage={() => { }}
          handleChangeRowsPerPage={() => { }}
          onPageChange={() => { }}
          onLastClick={() => { }}
          onFirstClick={() => { }}
          lastButtonDisabled={true}
        />
      </div>
    </Stack>
  );
}

export default EmptyTableView;
