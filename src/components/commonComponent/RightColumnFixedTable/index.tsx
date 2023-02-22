import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Typography,
  TextField,
  IconButton,
  Button,
  ToggleButton,
  styled,
} from '@mui/material';

import { useMemo, useState, useEffect } from 'react';
import { colors } from '../../../style/Color';
import PaginationComp from '../Pagination/Pagination';
import './style.scss';
import GreenDot from '../../../assets/icons/greendot.svg';
import DroppedDot from '../../../assets/icons/droppeddot.svg';
import FailureDot from '../../../assets/icons/failuredot.svg';
import ProgressDot from '../../../assets/icons/progressdot.svg';
import retargetingIcon from '../../../assets/icons/retargeting_icon.svg';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SearchOutlined } from '@mui/icons-material';
import { ReactComponent as EditIcon } from '../../../assets/icons/editColumn.svg';
import CheckBoxModal from '../customModal/PopoverModal';
import GroupButton from '../GroupButton/GroupButton';
import UnfoldMoreIcon from '../../../assets/icons/sortArrow.svg';

import CustomIconButton from '../CustomIconButton';

type columnType = {
  title: string;
  dataIndex: string;
  key: string;
  onClick: any;
  headerRender?: any;
  sortIcon?: any;
  render?: any;
  width?: any;
};
// type columnArr = columnType[];
type dataProps = {
  listColumn: any;
  isItemSelected?: any;
  selectedKey?: string;
  statusColumn: any;
  toggleOptions?: any;
};

const indexKey = 'index';
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

const RightColumnFixedTable = (props: any) => {
  const {
    listColumn,
    statusColumn,
    toggleOptions,
    isItemSelected = null,
    selectedKey = indexKey,
  }: dataProps = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilterteredData] = useState<any>(props.data);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filteredHeader, setFilterteredHeader] = useState(listColumn);
  const [visibleHeader, setVisibleHeader] = useState([]);
  const [alignment, setAlignment] = useState('All');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    if (props.data) {
      setFilterteredData(props.data);
    }
  }, [props.data]);

  useEffect(() => {
    if (listColumn) {
      setFilterteredHeader(listColumn);
    }
  }, [listColumn]);

  // {
  //   id: 1,
  //   label: lmsTableHeader.HEADING1,
  //   defaultChecked: true,
  // },

  const filterColumn = () => {
    const res = listColumn.map((item: columnType, index: number) => {
      if (item.title !== '') {
        return {
          id: index + 1,
          label: item.title,
          defaultChecked: true,
        };
      }
      return null;
    });
    const result = res.filter((item: any) => {
      if (item?.label) {
        return item;
      }
    });
    setVisibleHeader(result);
  };

  useEffect(() => {
    const res = filterColumn();
    return () => res;
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setCurrentPage(1);
  };
  const onPageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
    setCurrentPage(page);
  };
  const handleClose = (categories: any) => {
    handleCloseSuccess(categories);
  };
  useEffect(() => {
    if (alignment === 'Approved') {
      let res = props.data.filter((item: any) => item.status === 'Approved');
      setFilterteredData(res);
    } else if (alignment === 'In-Progress') {
      let res1 = props.data.filter(
        (item: any) => item.status === 'In-Progress'
      );
      setFilterteredData(res1);
    } else if (alignment === 'Rejected') {
      let res2 = props.data.filter((item: any) => item.status === 'Rejected');
      setFilterteredData(res2);
    } else if (alignment === 'Dropped') {
      let res3 = props.data.filter((item: any) => item.status === 'Dropped');
      setFilterteredData(res3);
    } else if (alignment === 'Refer') {
      let res3 = props.data.filter((item: any) => item.status === 'Refer');
      setFilterteredData(res3);
    } else {
      setFilterteredData(props.data);
    }
  }, [alignment]);

  const handleChange = (value: any) => {
    setAlignment(value.title);
  };

  const updatedListData = (categories: any, newArr: any) => {
    // let updatedList = categories?.map(
    //   (item: { label: string; defaultChecked: boolean }) => {
    //     if (item.defaultChecked === false) {
    //       const result = listColumn?.map((item2: columnType) => {
    //         if (item.label === item2.title) {
    //           return item2;
    //           // newArr = newArr.map(({item2.dataIndex , ...rest }: any) => {
    //           //   return rest;
    //           // });
    //         }
    //       });
    //       return result;
    //       //gets everything that was already in item, and updates "done"
    //     }
    //     // else return unmodified item
    //   }
    // );
  };
  const ColorButton = styled(ToggleButton)(({ theme }) => ({
    backgroundColor: ' rgb(240, 240, 240)',
    border: ' rgb(240, 240, 240) 1px ',
    color: 'black',
    textTransform: 'capitalize',
    '&.Mui-selected, &.Mui-selected:hover': {
      color: 'white',
      backgroundColor: '#1976d2',
    },
  }));

  const handleCloseSuccess = (categories: any) => {
    setAnchorEl(null);
    const collections = {};
    setVisibleHeader(categories);
    let newArr = props.data;

    const fullHeader = listColumn;

    const checkedArray = categories.filter(
      (value: any) => value.defaultChecked === true
    );

    let arr: any = [];

    const newList = checkedArray.map((item: any) => {
      listColumn.map((item2: any) => {
        if (item.label === item2.title) {
          arr.push(item2);
        }
      });
    });

    setFilterteredHeader(arr);

    updatedListData(categories, newArr);
  };
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return filteredData?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, rowsPerPage, filteredData]);
  const renderColoumn = (
    dataItem: any,
    columnItem: columnType,
    index: number
  ) => {
    if (dataItem[columnItem.dataIndex]) {
      if (columnItem?.render) {
        return columnItem?.render(
          dataItem[columnItem.dataIndex],
          dataItem,
          index
        );
      }
      return dataItem[columnItem.dataIndex];
    }
    return '--';
  };

  const selectedRow = (data: any, index: number) => {
    const defaultStyle = { background: colors.white };
    const selected = { background: colors.tableGrey };
    if (isItemSelected) {
      if (selectedKey === indexKey) {
        if (isItemSelected.includes(index)) {
          return selected;
        }
        return defaultStyle;
      }
      if (isItemSelected.includes(data[selectedKey])) {
        return selected;
      }
      return defaultStyle;
    }
    return defaultStyle;
  };
  const [btnActive, setBtnActive] = useState(true);

  // const currentTableData = useMemo(() => {
  //   const firstPageIndex = (currentPage - 1) * rowsPerPage;
  //   const lastPageIndex = firstPageIndex + rowsPerPage;
  //   return filteredData.slice(firstPageIndex, lastPageIndex);
  // }, [currentPage, rowsPerPage, filteredData]);

  const [ascending, setAscending] = useState<boolean>(false);
  const [initedAscending, setInitedAscending] = useState<boolean>(true);
  const [sortingData, setSortingData] = useState(props.data);
  const [sortDataIndex, setSortDataIndex] = useState('');
  const filterData = (id: any, name: string, date: string) => {
    // const res:any;
    const sort = currentTableData.sort((a: any, b: any) => {
      if (ascending) {
        if (id) {
          return a[id] < b[id] ? -1 : 1;
        }
        if (name) {
          return a[name] < b[name] ? -1 : 1;
        }
      } else {
        if (id) {
          return a[id] > b[id] ? -1 : 1;
        }
        if (name) {
          return a[name] > b[name] ? -1 : 1;
        }
      }

      // return ascending ? (a[id] < b[id] ? -1 : 1) :initedAscending  ?(a[name] < b[name] ? -1 : 1) :(a[id] > b[id] ? -1 : 1 ) : (a[name] > b[name] ? -1 : 1);

      // return ascending ? (a[id] < b[id] ? -1 : 1) : (a[id] > b[id] ? -1 : 1 )? initedAscending  ?(a[name] < b[name] ? -1 : 1) :(a[name] > b[name] ? -1 : 1);
    });

    setSortingData([...sort]);
  };

  useEffect(() => {
    filterData('id', 'rulename', 'startsAt');
  }, [ascending]);

  const handleSortByName = (title: string) => {
    setAscending(!ascending);

    setSortDataIndex(title);
  };

  const handleCloseModal = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ backgroundColor: 'white' }} className="lms-table-right">
      <Stack
        sx={
          props.flag == 'retargeting' || props.flag == 'retargeting-history'
            ? { margin: '0 32px', padding: '25px 0px' }
            : { padding: '25px 0px' }
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingBottom: '25px',
            justifyContent: 'space-between',
          }}
        >
          {props.flag === 'retargeting' && (
            <div>
              <Button
                variant="contained"
                color="secondary"
                disabled={btnActive}
                sx={{
                  padding: '3px 10px',
                  fontSize: '12.8px',
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  textTransform: 'capitalize',
                  letterSpacing: '0.0025em',
                  marginRight: '30px',
                }}
              >
                <IconButton sx={{ padding: '0', marginRight: '8px' }}>
                  <img
                    src={retargetingIcon}
                    alt="retargetingIcon"
                    style={{
                      filter:
                        btnActive === true
                          ? 'invert(100%) sepia(13%) saturate(7%) hue-rotate(300deg) brightness(89%) contrast(99%)'
                          : 'invert(100%) sepia(0%) saturate(0%) hue-rotate(108deg) brightness(102%) contrast(102%)',
                      opacity: btnActive === true ? '0.3' : '1',
                    }}
                  />
                </IconButton>
                Retarget
              </Button>
            </div>
          )}

          {props.flag === 'lms-rule' && (
            <Box style={{ display: 'flex' }}>
              {props.customIconBtns?.map((eachBtn: any, index: number) => {
                return (
                  <CustomIconButton
                    data={eachBtn}
                    onClick={() => props.onClickButton(eachBtn)}
                    key={index}
                  />
                );
              })}
            </Box>
          )}

          {(props.flag === 'sales-report' ||
            props.flag === 'retargeting' ||
            props.flag === 'lms-rule' ||
            props.flag === 'retargeting-history' ||
            props.flag === 'lmsdashboard' ||
            props.flag === 'riskMngmt') && (
            <TextField
              className="text-field"
              placeholder="Search by..."
              InputProps={
                props.flag === 'retargeting-history' ||
                props.flag === 'retargeting'
                  ? {
                      endAdornment: (
                        <IconButton edge="start">
                          <SearchOutlined />
                        </IconButton>
                      ),
                    }
                  : {
                      startAdornment: (
                        <IconButton edge="start">
                          <SearchOutlined />
                        </IconButton>
                      ),
                    }
              }
            />
          )}

          <div className="third-Header">
            <GroupButton
              data={toggleOptions}
              onChange={(arg1: any) => handleChange(arg1)}
            />

            {(props.flag === 'dashboard' ||
              props.flag === 'sales-report' ||
              // props.flag === 'retargeting' ||
              props.flag === 'lmsdashboard') && (
              <>
                <div className="reset-data">
                  <Button
                    startIcon={<EditIcon />}
                    aria-describedby={id}
                    sx={{
                      fontSize: '14px',
                      marginLeft: '56px',
                      color: '#0662B7',
                      fontWeight: '500',
                      textTransform: 'none',
                      overflowY: 'hidden',
                    }}
                    onClick={handleClick}
                  >
                    Edit Columns
                  </Button>
                </div>
                {/* <div>
                  <Button
                    endIcon={<ChevronRightIcon />}
                    aria-describedby={id}
                    sx={{
                      fontSize: '0.875rem',
                      marginLeft: '56px',
                      color: '#0662B7',
                      fontWeight: '600',
                      textTransform: 'none',
                    }}
                    // onClick={handleClick}
                  >
                    Detailed Reports
                  </Button>
                </div> */}
              </>
            )}

            {props.flag === 'riskMngmt' && (
              <>
                <div className="reset-data">
                  <Button
                    endIcon={<ChevronRightIcon />}
                    aria-describedby={id}
                    sx={{
                      fontSize: '14px',
                      marginLeft: '56px',
                      color: '#0662B7',
                      fontWeight: '600',
                      textTransform: 'none',
                    }}
                    // onClick={handleClick}
                  >
                    Detailed Reports
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        <Box>
          <Grid container spacing={0}>
            <Grid item sm={9}>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  margin: '0',
                  width: '100%',
                  overFlow: 'auto',
                  marginBottom: '20px',
                  height: props.tableHeight,
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
                    <TableRow sx={{ padding: '10px' }}>
                      {filteredHeader.map((item: any, index: number) => {
                        return (
                          <TableCell
                            sx={{
                              padding: '10px',
                              fontSize: '14px',
                              fontWeight: 700,
                              borderBottom: 'none',
                              height: '35px',
                              display: 'flex',
                              alignContent: 'center',
                              justifySelf: 'center',
                            }}
                            style={{ borderBottom: 'none' }}
                            width={item.width}
                            key={item.key}
                          >
                            {item?.headerRender
                              ? item?.headerRender(item.title, item, index)
                              : item.title}
                            {item.sortColumn && (
                              <IconButton
                                onClick={() => handleSortByName(item.dataIndex)}
                              >
                                <img
                                  src={UnfoldMoreIcon}
                                  alt="Sort Icon"
                                  // onClick={() => handleSortByName(item.dataIndex)}
                                />
                              </IconButton>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentTableData?.map((dataItem: any, index: number) => {
                      return (
                        <TableRow
                          sx={{ padding: '10px', height: '45px' }}
                          style={selectedRow(dataItem, index)}
                          key={dataItem.id}
                        >
                          {filteredHeader.map((columnItem: any) => {
                            return (
                              <TableCell
                                sx={{
                                  padding: '10px',
                                  fontSize: '14px',
                                  fontWeight: 700,
                                  borderBottom: 'none',
                                  height: '35px',
                                  display: 'flex',
                                  alignContent: 'center',
                                  justifySelf: 'center',
                                }}
                                style={{ borderBottom: 'none' }}
                                onClick={() =>
                                  columnItem.onClick
                                    ? columnItem.onClick()
                                    : null
                                }
                                key={columnItem.key}
                              >
                                {renderColoumn(dataItem, columnItem, index)}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item sm={3}>
              <div
                style={{
                  boxShadow:
                    props?.flag === 'riskMngmt'
                      ? 'none'
                      : '-10px 0 8px 0 #EDEDED',
                }}
              >
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    margin: '0',
                    width: '100%',
                    overFlow: 'auto',
                    marginBottom: '20px',
                    height: props.tableHeight,
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
                      <TableRow sx={{ padding: '10px' }}>
                        {statusColumn.map((item: columnType, index: number) => {
                          return (
                            <TableCell
                              sx={{
                                padding: '10px',
                                fontWeight: 700,
                                borderBottom: 'none',
                                height: '35px',
                              }}
                              style={{ borderBottom: 'none' }}
                              width={item.width}
                              key={item.key}
                            >
                              {item?.headerRender
                                ? item?.headerRender(item.title, item, index)
                                : item.title}
                              {item.sortIcon && (
                                <IconButton onClick={() => filterData}>
                                  <img src={UnfoldMoreIcon} alt="Sort Icon" />
                                </IconButton>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentTableData?.map((dataItem: any, index: number) => {
                        return (
                          <TableRow
                            sx={{ padding: '10px', height: '45px' }}
                            style={selectedRow(dataItem, index)}
                            key={dataItem.id}
                          >
                            {statusColumn.map((columnItem: columnType) => {
                              return (
                                <TableCell
                                  sx={{
                                    padding: '10px',
                                    borderBottom: 'none',
                                    height: '35px',
                                  }}
                                  style={{ borderBottom: 'none' }}
                                  onClick={() =>
                                    columnItem.onClick
                                      ? columnItem.onClick()
                                      : null
                                  }
                                  key={columnItem.key}
                                >
                                  {columnItem.dataIndex === 'status' ? (
                                    <Box>
                                      {dataItem?.status?.includes('Approved') &&
                                        kycStatus(
                                          dataItem?.status,
                                          GreenDot,
                                          '#6AB06E'
                                        )}
                                      {dataItem?.status?.includes(
                                        'In-Progress'
                                      ) &&
                                        kycStatus(
                                          dataItem?.status,
                                          ProgressDot,
                                          '#F37B21'
                                        )}
                                      {dataItem?.status?.includes('Rejected') &&
                                        kycStatus(
                                          dataItem?.status,
                                          FailureDot,
                                          '#E63946'
                                        )}
                                      {dataItem?.status?.includes('Dropped') &&
                                        kycStatus(
                                          dataItem?.status,
                                          DroppedDot,
                                          '#992D26'
                                        )}
                                      {dataItem?.status?.includes('Pending') &&
                                        kycStatus(
                                          dataItem?.status,
                                          ProgressDot,
                                          '#E4AC04'
                                        )}
                                      {dataItem?.status?.includes('Refer') &&
                                        kycStatus(
                                          dataItem?.status,
                                          ProgressDot,
                                          '#F37B21'
                                        )}

                                      {dataItem?.status?.includes(
                                        'Sent To Approver'
                                      ) &&
                                        kycStatus(
                                          dataItem?.status,
                                          GreenDot,
                                          '#6AB06E'
                                        )}
                                    </Box>
                                  ) : (
                                    renderColoumn(dataItem, columnItem, index)
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>
        </Box>
        <Grid>
          <PaginationComp
            rows={filteredData}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            onPageChange={onPageChange}
            onLastClick={() => {
              setPage(Math.ceil(filteredData?.length / rowsPerPage));
              setCurrentPage(Math.ceil(filteredData?.length / rowsPerPage));
            }}
            onFirstClick={() => {
              setPage(1);
              setCurrentPage(1);
            }}
            lastButtonDisabled={
              page === Math.ceil(filteredData?.length / rowsPerPage)
            }
          />
        </Grid>
      </Stack>
      {visibleHeader.length !== 0 && (
        <CheckBoxModal
          openSuccess={open}
          handleCloseSuccess={handleClose}
          title={'Surrogate Selection'}
          close={'Reset'}
          submit={'Select'}
          anchorEl={anchorEl}
          product_label={visibleHeader}
          id={id}
          showSearch={true}
          columnNumber={2}
          handleCloseModal={handleCloseModal}
        />
      )}
    </Box>
  );
};
export default RightColumnFixedTable;
