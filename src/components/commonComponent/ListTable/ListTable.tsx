import React, { useEffect, useMemo, useState } from 'react';
import './table.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
  Button,
  Grid,
  Typography,
  Link,
  TextField,
  IconButton,
  Box,
  Paper,
} from '@mui/material';
import GreenDot from '../../../assets/icons/greendot.svg';
import DroppedDot from '../../../assets/icons/droppeddot.svg';
import FailureDot from '../../../assets/icons/failuredot.svg';
import ProgressDot from '../../../assets/icons/progressdot.svg';
import { ReactComponent as EditIcon } from '../../../assets/icons/editColumn.svg';
import {
  product_label,
  rowsDataInterface,
  statusRowHeadingInterface,
} from '../../../pages/sales/dashboard/dashboard.const';
import PaginationComp from '../Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { tabBar, tableHeader } from '../../../utils/Constants';
import { Stack } from '@mui/system';
import { SearchOutlined } from '@mui/icons-material';
import CheckBoxModal from '../customModal/PopoverModal';
import UnfoldMoreIcon from '../../../assets/icons/sortArrow.svg';
import GroupButton from '../GroupButton/GroupButton';
import { colors } from '../../../style/Color';
function TableComp(props: {
  rows: rowsDataInterface[];
  statusRowsHeading: statusRowHeadingInterface[];
  flag?: string;
  listRowHeading: statusRowHeadingInterface[];
  viewPath: string;
  toggleOptions?: any;
  toggleOptionHandleChange?: any;
}) {
  const [graphView, setGraphView] = useState<number>(1);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilterteredData] = useState(props.rows);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [filteredHeader, setFilterteredHeader] = useState<
    statusRowHeadingInterface[]
  >(props?.listRowHeading);
  const [visibleHeader, setVisibleHeader] = useState(product_label);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseModal = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const onPageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
    setCurrentPage(page);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setCurrentPage(1);
  };
  const handleClose = (categories: any) => {
    setFilterteredData(props.rows);
    console.log('categories 2', categories);
    handleCloseSuccess(categories);
  };
  const handleCloseSuccess = (categories: any) => {
    setAnchorEl(null);
    const collections = {};
    setVisibleHeader(categories);
    let newArr = props.rows;
    let updatedHeader = categories?.map(
      (item: { label: string; defaultChecked: boolean }) => {
        if (item.defaultChecked === true) {
          props.listRowHeading?.map((item2) => {
            if (item.label === item2.header1) {
              Object.assign(collections, { header1: item.label });
            }
            if (item.label === item2.header2) {
              Object.assign(collections, { header2: item.label });
            }
            if (item.label === item2.header3) {
              Object.assign(collections, { header3: item.label });
            }
            if (item.label === item2.header4) {
              Object.assign(collections, { header4: item.label });
            }
            if (item.label === item2.header5) {
              Object.assign(collections, { header5: item.label });
            }
            if (item.label === item2.header6) {
              Object.assign(collections, { header6: item.label });
            }
            if (item.label === item2.header7) {
              Object.assign(collections, { header7: item.label });
            }
            if (item.label === item2.header8) {
              Object.assign(collections, { header8: item.label });
            }
            if (item.label === item2.header9) {
              Object.assign(collections, { header9: item.label });
            }
            if (item.label === item2.header10) {
              Object.assign(collections, { header10: item.label });
            }
          });
          const array = [collections];
          console.log(array, 'array2 checking');
          setFilterteredHeader(array);
          return item; //gets everything that was already in item, and updates "done"
        }
        return item; // else return unmodified item
      }
    );
    updatedListData(categories, newArr);
  };
  const updatedListData = (categories: any, newArr: rowsDataInterface[]) => {
    let updatedList = categories?.map(
      (item: { label: string; defaultChecked: boolean }) => {
        if (item.defaultChecked === false) {
          if (item.label === tableHeader.HEADING1) {
            newArr = newArr.map(({ id, ...rest }) => {
              return rest;
            });
          }
          if (item.label === tableHeader.HEADING2) {
            newArr = newArr.map(({ applicationNum, ...rest }) => {
              return rest;
            });
          }
          if (item.label === tableHeader.HEADING3) {
            newArr = newArr.map(({ customerName, ...rest }) => {
              return rest;
            });
          }
          if (item.label === tableHeader.HEADING4) {
            newArr = newArr.map(({ mobileNum, ...rest }) => {
              return rest;
            });
          }
          if (item.label === tableHeader.HEADING5) {
            newArr = newArr.map(({ lead, ...rest }) => {
              return rest;
            });
          }
          if (item.label === tableHeader.HEADING6) {
            newArr = newArr.map(({ surrogateName, ...rest }) => {
              return rest;
            });
          }
          if (item.label === tableHeader.HEADING7) {
            newArr = newArr.map(({ dateTime, ...rest }) => {
              return rest;
            });
          }
          if (item.label === tableHeader.HEADING8) {
            newArr = newArr.map(({ Policy, ...rest }) => {
              return rest;
            });
          }
          if (item.label === tableHeader.HEADING9) {
            newArr = newArr.map(({ channelName, ...rest }) => {
              return rest;
            });
          }
          if (item.label === tableHeader.HEADING10) {
            newArr = newArr.map(({ processedBy, ...rest }) => {
              return rest;
            });
          }
          setFilterteredData(newArr);
          return item; //gets everything that was already in item, and updates "done"
        }
        setFilterteredData(newArr);
        return item; // else return unmodified item
      }
    );
  };
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, rowsPerPage, graphView, filteredData]);
  const navigate = useNavigate();
  const viewAction = (param: any) => {
    if (props.flag === 'programmeManagement') {
      navigate(`${props.viewPath}${param.id}`, {
        state: { ...param },
      });
    } else {
      navigate(`${props.viewPath}`);
    }
  };
  const [ascending, setAscending] = useState<boolean>(true);
  const [sortingData, setSortingData] = useState(props.rows);
  const filterData = () => {
    const sort = currentTableData.sort((a: any, b: any) => {
      if (ascending) {
        return a.id < b.id ? -1 : 1;
      }
      return a.id > b.id ? -1 : 1;
    });
    console.log('sortinf', [...sort]);
    setSortingData([...sort]);
  };
  useEffect(() => {
    filterData();
  }, [ascending]);
  const handleSortByName = () => {
    setAscending(!ascending);
    console.log('click');
  };
  return (
    <div
      className="table-div"
      style={
        props.flag == 'dashboard'
          ? { paddingTop: '20px', margin: '0 20px' }
          : { padding: '0px' }
      }
    >
      {!props.flag && (
        <Stack
          sx={{
            borderBottom: '2px solid #F0F2F5',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          <Typography variant="subtitle1" sx={{ letterSpacing: 0.5 }}>
            {tabBar.PROGRAMME_MANAGEMENT}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              letterSpacing: 0.2,
              color: '#A3A3A5',
              paddingBottom: '20px',
            }}
          >
            {tabBar.TEMPORARILY_PAUSE}
          </Typography>
        </Stack>
      )}
      <div style={{ display: 'flex', width: '100%' }}>
        {props.flag === 'sales-report' && (
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
        )}
        <div className="third-header">
          <GroupButton
            data={props.toggleOptions}
            onChange={(arg1: any) => props.toggleOptionHandleChange(arg1)}
          />
          {(props.flag === 'dashboard' || props.flag === 'sales-report') && (
            <div className="reset-data">
              <Button
                startIcon={<EditIcon />}
                aria-describedby={id}
                sx={{
                  fontSize: '14px',
                  marginLeft: '56px',
                  color: '#0662B7',
                  fontWeight: '600',
                  textTransform: 'none',
                }}
                onClick={handleClick}
              >
                Edit Columns
              </Button>
            </div>
          )}
          {/* {props.flag === 'dashboard' && (
            <div className="reset-data">
              <Button
                endIcon={<RightArrow />}
                sx={{
                  fontSize: '1vw',
                  marginRight: '30px',
                  color: '#0662B7',
                  fontWeight: '600',
                  textTransform: 'none',
                }}
              >
                Detailed Reports
              </Button>
            </div>
          )} */}
        </div>
      </div>
      <Box>
        <Grid container spacing={0}>
          <Grid item sm={props.flag ? 7 : 8}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                margin: '0',
                width: '100%',
                overFlow: 'auto',
                marginBottom: '20px',
                // height: props.tableHeight,
              }}
            >
              <Table
                style={{
                  width: '100%',
                  borderBottom: 'none',
                  overflow: 'auto',
                  tableLayout: 'fixed',
                }}
                aria-label="customized table"
                className="common-table-container"
              >
                <TableHead
                  sx={{
                    backgroundColor: colors.tableHeaderLightBlue,
                    padding: '10px',
                  }}
                >
                  {filteredHeader?.map((row: any, index: number) => (
                    <TableRow sx={{ padding: '10px' }} key={index}>
                      {row?.header1 && (
                        <TableCell
                          component="th"
                          align="left"
                          scope="row"
                          sx={{
                            fontWeight: 'bold',
                            borderBottom: 'none',
                            backgroundColor: '#EFF7FE',
                            minWidth: '150px',
                            fontSize: '14px',
                            padding: '8px',
                          }}
                        >
                          {row?.header1}
                        </TableCell>
                      )}
                      {row?.header2 && (
                        <TableCell
                          component="th"
                          align="left"
                          scope="row"
                          sx={{
                            fontWeight: 'bold',
                            borderBottom: 'none',
                            backgroundColor: '#EFF7FE',
                            minWidth: '150px',
                            fontSize: '14px',
                            padding: '8px',
                          }}
                        >
                          {row?.header2}
                          {row?.sortColumn && (
                            <span className="table-sorting-cta">
                              <IconButton onClick={() => handleSortByName()}>
                                <img src={UnfoldMoreIcon} alt="Sort Icon" />
                              </IconButton>
                            </span>
                          )}
                        </TableCell>
                      )}
                      {row?.header3 && (
                        <TableCell
                          component="th"
                          align="left"
                          scope="row"
                          sx={{
                            fontWeight: 'bold',
                            borderBottom: 'none',
                            backgroundColor: '#EFF7FE',
                            minWidth: '150px',
                            fontSize: '14px',
                            padding: '8px',
                          }}
                        >
                          {row?.header3}
                        </TableCell>
                      )}
                      {row?.header4 && (
                        <TableCell
                          component="th"
                          align="left"
                          scope="row"
                          sx={{
                            fontWeight: 'bold',
                            borderBottom: 'none',
                            backgroundColor: '#EFF7FE',
                            minWidth: '150px',
                            fontSize: '14px',
                            padding: '8px',
                          }}
                        >
                          {row?.header4}
                        </TableCell>
                      )}
                      {row?.header5 && (
                        <TableCell
                          component="th"
                          align="left"
                          scope="row"
                          sx={{
                            fontWeight: 'bold',
                            borderBottom: 'none',
                            backgroundColor: '#EFF7FE',
                            minWidth: '150px',
                            fontSize: '14px',
                            padding: '8px',
                          }}
                        >
                          {row?.header5}
                        </TableCell>
                      )}
                      {row?.header6 && (
                        <TableCell
                          component="th"
                          align="left"
                          scope="row"
                          sx={{
                            fontWeight: 'bold',
                            borderBottom: 'none',
                            backgroundColor: '#EFF7FE',
                            minWidth: '150px',
                            fontSize: '14px',
                            padding: '8px',
                          }}
                        >
                          {row?.header6}
                        </TableCell>
                      )}
                      {row?.header7 && (
                        <TableCell
                          component="th"
                          align="left"
                          scope="row"
                          sx={{
                            fontWeight: 'bold',
                            borderBottom: 'none',
                            backgroundColor: '#EFF7FE',
                            minWidth: '150px',
                            fontSize: '14px',
                            padding: '8px',
                          }}
                        >
                          {row?.header7}
                        </TableCell>
                      )}
                      {row?.header8 && (
                        <TableCell
                          component="th"
                          align="left"
                          scope="row"
                          sx={{
                            fontWeight: 'bold',
                            borderBottom: 'none',
                            backgroundColor: '#EFF7FE',
                            minWidth: '150px',
                            fontSize: '14px',
                            padding: '8px',
                          }}
                        >
                          {row?.header8}
                        </TableCell>
                      )}
                      {row?.header9 && (
                        <TableCell
                          component="th"
                          align="left"
                          scope="row"
                          sx={{
                            fontWeight: 'bold',
                            borderBottom: 'none',
                            backgroundColor: '#EFF7FE',
                            minWidth: '150px',
                            fontSize: '14px',
                            padding: '8px',
                          }}
                        >
                          {row?.header9}
                        </TableCell>
                      )}
                      {row?.header10 && (
                        <TableCell
                          component="th"
                          align="left"
                          scope="row"
                          sx={{
                            fontWeight: 'bold',
                            borderBottom: 'none',
                            backgroundColor: '#EFF7FE',
                            minWidth: '150px',
                            fontSize: '14px',
                            padding: '8px',
                          }}
                        >
                          {row?.header10}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {currentTableData?.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      {row.id && (
                        <TableCell
                          align="left"
                          sx={{ borderBottom: 'none', height: '68px' }}
                        >
                          {row.id}
                        </TableCell>
                      )}
                      {props.flag && row.applicationNum && (
                        <TableCell
                          align="left"
                          sx={{ borderBottom: 'none', height: '68px' }}
                        >
                          {'#'}
                          {row.applicationNum}
                        </TableCell>
                      )}
                      {props.flag && row.customerName && (
                        <TableCell
                          align="left"
                          sx={{ borderBottom: 'none', height: '68px' }}
                        >
                          {row.customerName}
                        </TableCell>
                      )}
                      {props.flag && row.mobileNum && (
                        <TableCell
                          align="left"
                          sx={{ borderBottom: 'none', height: '68px' }}
                        >
                          {row.mobileNum}
                        </TableCell>
                      )}
                      {props.flag && row.lead && (
                        <TableCell
                          align="left"
                          sx={{ borderBottom: 'none', height: '68px' }}
                        >
                          {row.lead}
                        </TableCell>
                      )}
                      {props.flag && row.surrogateName && (
                        <TableCell
                          align="left"
                          sx={{ borderBottom: 'none', height: '68px' }}
                        >
                          {row.surrogateName}
                        </TableCell>
                      )}
                      {props.flag && row.dateTime && (
                        <TableCell
                          align="left"
                          sx={{ borderBottom: 'none', height: '68px' }}
                        >
                          {row.dateTime}
                        </TableCell>
                      )}
                      {props.flag && row.Policy && (
                        <TableCell
                          align="left"
                          sx={{ borderBottom: 'none', height: '68px' }}
                        >
                          {row.Policy}
                        </TableCell>
                      )}
                      {props.flag && row.channelName && (
                        <TableCell
                          align="left"
                          sx={{ borderBottom: 'none', height: '68px' }}
                        >
                          {row.channelName}
                        </TableCell>
                      )}
                      {props.flag && row.processedBy && (
                        <TableCell
                          align="left"
                          sx={{ borderBottom: 'none', height: '68px' }}
                        >
                          {row.processedBy}
                        </TableCell>
                      )}
                      {!props.flag && (
                        <TableCell align="left" sx={{ borderBottom: 'none' }}>
                          {row.surrogateName}
                        </TableCell>
                      )}
                      {!props.flag && (
                        <TableCell align="left" sx={{ borderBottom: 'none' }}>
                          {row.version}
                        </TableCell>
                      )}
                      {!props.flag && (
                        <TableCell
                          align="left"
                          sx={{
                            borderBottom: 'none',
                            color: `${
                              row.currentStatus == 'Active'
                                ? '#32A64D'
                                : '#F37B21'
                            }`,
                          }}
                        >
                          {row.currentStatus}
                        </TableCell>
                      )}
                      {!props.flag && (
                        <TableCell align="left" sx={{ borderBottom: 'none' }}>
                          {row.initiatedBy}
                        </TableCell>
                      )}
                      {!props.flag && (
                        <TableCell align="left" sx={{ borderBottom: 'none' }}>
                          {row.request}
                        </TableCell>
                      )}
                      {!props.flag && (
                        <TableCell align="left" sx={{ borderBottom: 'none' }}>
                          {row.dateAndTime}
                        </TableCell>
                      )}
                      {!props.flag && (
                        <TableCell align="left" sx={{ borderBottom: 'none' }}>
                          {row.Policy}
                        </TableCell>
                      )}
                      {!props.flag && (
                        <TableCell align="left" sx={{ borderBottom: 'none' }}>
                          {row.channelName}
                        </TableCell>
                      )}
                      {!props.flag && (
                        <TableCell align="left" sx={{ borderBottom: 'none' }}>
                          {row.processedBy}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item sm={props.flag ? 5 : 4}>
            <div style={{ boxShadow: '-10px 0 8px 0 #EDEDED' }}>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  margin: '0',
                  width: '100%',
                  overFlow: 'auto',
                  marginBottom: '20px',
                  // height: props.tableHeight,
                }}
              >
                <Table
                  style={{
                    width: '100%',
                    borderBottom: 'none',
                    overflow: 'auto',
                    tableLayout: 'fixed',
                  }}
                  aria-label="customized table"
                  className="common-table-container"
                >
                  <TableHead
                    sx={{
                      backgroundColor: colors.tableHeaderLightBlue,
                      padding: '10px',
                    }}
                  >
                    {props?.statusRowsHeading?.map(
                      (row: any, index: number) => (
                        <TableRow sx={{ padding: '10px' }} key={index}>
                          {row.header1 && (
                            <TableCell
                              component="th"
                              align="left"
                              scope="row"
                              sx={{
                                fontWeight: 'bold',
                                borderBottom: 'none',
                                backgroundColor: '#EFF7FE',
                                minWidth: '150px',
                                fontSize: '14px',
                                padding: '8px',
                              }}
                            >
                              {row?.header1}
                            </TableCell>
                          )}
                          {row.header2 && (
                            <TableCell
                              component="th"
                              align="left"
                              scope="row"
                              sx={{
                                fontWeight: 'bold',
                                borderBottom: 'none',
                                backgroundColor: '#EFF7FE',
                                minWidth: '150px',
                                fontSize: '14px',
                                padding: '8px',
                              }}
                            >
                              {row?.header2}
                            </TableCell>
                          )}
                          {row.header3 && (
                            <TableCell
                              component="th"
                              align="left"
                              scope="row"
                              sx={{
                                fontWeight: 'bold',
                                borderBottom: 'none',
                                backgroundColor: '#EFF7FE',
                                minWidth: '150px',
                                fontSize: '14px',
                                padding: '8px',
                              }}
                            >
                              {row?.header3}
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    )}
                  </TableHead>
                  <TableBody>
                    {currentTableData?.map((row: any, index: any) => (
                      <TableRow key={row.id} sx={{ borderBottom: 'none' }}>
                        {props.flag && (
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ borderBottom: 'none' }}
                          >
                            {row?.kycStatus?.includes('Success') &&
                              kycStatus(row?.kycStatus, GreenDot, '#6AB06E')}
                            {row?.kycStatus?.includes('Progress') &&
                              kycStatus(row.kycStatus, ProgressDot, '#F37B21')}
                            {row?.kycStatus?.includes('Failure') &&
                              kycStatus(row?.kycStatus, FailureDot, '#E63946')}
                            {row?.kycStatus.includes('Dropped') &&
                              kycStatus(row?.kycStatus, DroppedDot, '#992D26')}
                          </TableCell>
                        )}
                        <TableCell align="left" sx={{ borderBottom: 'none' }}>
                          {row?.status?.includes('Approved') &&
                            kycStatus(row?.status, GreenDot, '#6AB06E')}
                          {row?.status?.includes('In-Progress') &&
                            kycStatus(row?.status, ProgressDot, '#F37B21')}
                          {row?.status?.includes('Rejected') &&
                            kycStatus(row?.status, FailureDot, '#E63946')}
                          {row?.status?.includes('Dropped') &&
                            kycStatus(row?.status, DroppedDot, '#992D26')}
                          {row?.status?.includes('Pending') &&
                            kycStatus(row?.status, ProgressDot, '#E4AC04')}
                          {row?.status?.includes('Sent To Approver') &&
                            kycStatus(row?.status, GreenDot, '#6AB06E')}
                        </TableCell>
                        <TableCell align="left" sx={{ borderBottom: 'none' }}>
                          <Link
                            sx={{
                              cursor: 'pointer',
                              color: '#0662B7',
                              textDecoration: 'none',
                            }}
                            onClick={() => viewAction(row)}
                          >
                            View
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
          <PaginationComp
            rows={filteredData}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            onPageChange={onPageChange}
            onLastClick={() => {
              setPage(Math.ceil(filteredData.length / rowsPerPage));
              setCurrentPage(Math.ceil(filteredData.length / rowsPerPage));
            }}
            onFirstClick={() => {
              setPage(1);
              setCurrentPage(1);
            }}
            lastButtonDisabled={
              page == Math.ceil(filteredData.length / rowsPerPage)
            }
          />
        </Grid>
      </Box>
      {
        <CheckBoxModal
          openSuccess={open}
          handleCloseSuccess={handleClose}
          title={'Surrogate Selection'}
          close={'Reset'}
          submit={'Select'}
          anchorEl={anchorEl}
          product_label={product_label}
          id={id}
          showSearch={true}
          columnNumber={7}
          handleCloseModal={handleCloseModal}
        />
      }
    </div>
  );
}
function kycStatus(
  status: string,
  imageDot: string | undefined,
  _textColor: string
) {
  return (
    <div className="status-box">
      <div className="dotIcon">
        <img src={imageDot} alt={'status-icon'} />
      </div>
      <div>
        <Typography
          sx={{ fontWeight: 'bold', color: _textColor, fontSize: '14px' }}
        >
          {status}
        </Typography>
        <Typography
          sx={{ fontWeight: 'bold', color: 'grey', fontSize: '10px' }}
        >
          22/02/022 - 7.30 PM
        </Typography>
      </div>
    </div>
  );
}
export default TableComp;
