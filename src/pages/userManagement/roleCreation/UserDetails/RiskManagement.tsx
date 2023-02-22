import {
  Box,
  InputBase,
  ToggleButton,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Stack,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import './userDetail.scss';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';
import {
  productSearch,
  userListByIDSegregated,
  userListSegregated,
} from '../../../../services/roleCreationServices';
import PaginationAuth from './paginationAuth';
import CustomModal from '../../../../components/commonComponent/customModal/CustomModal';
import ErrorMessage from '../../../../components/commonComponent/ErrorMessage';
import { formatDateTime } from '../../../../utils/DateTimeFormatter';

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
export const tableHeaderData = [
  {
    id: '#',
    initiater: 'Initiater',
    reviewer: 'Reviewer',
    approver: 'Approver',
  },
];
function RiskManagement() {
  const location = useLocation();
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 0,
  });
  // console.log('pagination', pagination);
  const [totalCount, setTotalCount] = useState({
    totaLNoOfRecords: 0,
    totalNoOfPages: 0,
  });
  const onPageChange = (pageNo: number) => {
    setPagination({
      ...pagination,
      pageNumber: pageNo,
    });
  };

  const onPageSizeChange = (size: number) => {
    console.log('size', size);
    console.log('totalCount', totalCount);

    if (size === -1) {
      setPagination({
        ...pagination,
        pageSize: totalCount.totaLNoOfRecords,
      });
    } else
      setPagination({
        ...pagination,
        pageSize: size,
      });
  };
  const moduleName = 'risk management';
  const pre: any = localStorage.getItem('checkTab');
  const { authData } = location.state || {};
  const buttonData =
    authData !== null && authData !== undefined
      ? authData[pre - 1]?.subModules
      : [];

  const [value, setValue] = useState<any>('');
  const [searchValue, setSearchValue] = useState('');
  const [filterTableObj, setFilterTableObj] = useState<any>({});
  const [orgStructureData, setOrgStructureData] = useState<any>([]);
  const [originalData, setOrginalData] = useState<any>([]);
  const [listModule, setListModule] = useState<any>([]);
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);
  const [listItemBasedOnID, setlistItemBasedOnID] = useState<any>([]);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const prevActiveTab = localStorage.getItem(moduleName.toLowerCase());
    if (prevActiveTab !== null) {
      updateParams(prevActiveTab);
    } else {
      updateParams('RISK_MANAGEMENT_CUSTOMER_REPORT');
    }
  }, []);

  useEffect(() => {
    if (value && value !== '') {
      getItemsBasedOnModules();
    }
  }, [value, pagination]);

  const getListOfOrganisation = async (payload: any) => {
    let res = {};
    await productSearch(payload)
      .then((response: { data: any }) => {
        res = response.data ? response.data : {};
      })
      .catch((err: { response: any; data: any }) => {
        // console.log(err);
        res = { error: err?.response?.data };
      });
    return res;
  };

  const fetchSearchBasedList = async () => {
    const payload = {
      authorizationModule: 'CREDIT_RULE',
      page: pagination.pageNumber,
      size: pagination.pageSize,
      name: searchValue,
      ...filterTableObj,
    } as any;
    // console.log('payload of search', payload);
    const res: any = await getListOfOrganisation(payload);
    // console.log('result of search', res?.result);
    console.log('result of search', res?.result);
    setTotalCount({
      totaLNoOfRecords: res?.result?.totalElements,
      totalNoOfPages: res?.result?.totalPages,
    });
    setListModule(res?.result?.content ?? '');
    setOrgStructureData(
      res?.result?.content?.personalDetails?.employeeName ?? ''
    );
    setOrginalData([
      ...(res?.result?.content?.personalDetails?.employeeName ?? []),
    ]);
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      fetchSearchBasedList();
    }, 500);

    return () => clearTimeout(getData);
  }, [searchValue]);

  const updateParams = (result: any) => {
    console.log('result', result);
    if (result !== value || result === null) {
      localStorage.setItem(moduleName.toLowerCase(), result);
      setValue(result);
    }
  };

  const handleChange = (event: React.SyntheticEvent, val: any) => {
    if (val !== null) {
      updateParams(val);
      setValue(val);
    }
  };

  const ColorButton = styled(ToggleButton)(({ theme }) => ({
    backgroundColor: ' rgb(240, 240, 240)',
    border: ' rgb(240, 240, 240) 1px ',
    color: 'black',

    '&.Mui-selected, &.Mui-selected:hover': {
      color: 'white',
      backgroundColor: '#1976d2',
    },
  }));
  const handleError = (err: any) => {
    if (err?.exception?.fieldErrors) {
      const missingFields = err?.exception.fieldErrors?.map(
        (field: string) => `${field}, `
      );
      setApiError(missingFields);
    } else if (err?.exception?.detailMessage)
      setApiError(err?.exception?.detailMessage);
    else if (err?.error) setApiError(err?.error + ' ' + err?.path);
    else setApiError('Something went wrong!');
  };

  const getItemsBasedOnModules = () => {
    let payload = {
      authorizationModule: value,
      page: pagination.pageNumber,
      size: pagination.pageSize,
    };
    userListSegregated(payload)
      .then((response) => {
        // console.log(
        //   'userListSegregated response',
        //   response.data.result.content
        // );
        const result = response.data.result;
        if (result) {
          setTotalCount({
            totaLNoOfRecords: result?.totalElements,
            totalNoOfPages: result?.totalPages,
          });
          setListModule(response.data.result.content || []);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        // console.log('userListSegregated response', err);
        setListModule([]);
        handleError(err?.response?.data ?? '');
      });
  };
  const handleModuleBasedOnId = (id: any) => {
    setShowPauseModal(true);
    getIdBasedOnModule(id);
  };
  const getIdBasedOnModule = (id: any) => {
    let payload = {
      userId: id,
    };
    userListByIDSegregated(payload)
      .then((response) => {
        if (response.data.result) {
          console.log('id response', response.data.result);
          setlistItemBasedOnID(response.data.result);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        console.log('id response', err);
        setlistItemBasedOnID([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const closeModal = () => {
    setShowPauseModal(false);
  };
  const employeeDetailsRowOne = [
    {
      Key: 'Employee Name',
      value: listItemBasedOnID?.personalDetails?.employeeName ?? '-',
    },
    {
      Key: 'Employee ID',
      value: listItemBasedOnID?.personalDetails?.employeeId ?? '-',
    },
    {
      Key: 'Date of Joining',
      value:
        formatDateTime(listItemBasedOnID?.employeeDetails?.dateOfJoining) ??
        '-',
    },
    {
      Key: 'Mobile Number',
      value: listItemBasedOnID?.personalDetails?.mobileNumber ?? '-',
    },
    {
      Key: 'Email ID',
      value: listItemBasedOnID?.personalDetails?.email ?? '-',
    },
  ];

  const employeeDetailsRowTwo = [
    {
      Key: 'Designation',
      value: listItemBasedOnID?.employeeDetails?.designation ?? '-',
    },
    {
      Key: 'Reporting Head',
      value:
        listItemBasedOnID?.reportingTo?.personalDetails?.employeeName ?? '-',
    },
    {
      Key: 'Role Access Type',
      value: listItemBasedOnID?.roleAccessType ?? '-',
    },
    {
      Key: 'Employee Status',
      value: listItemBasedOnID?.userStatus ?? '-',
    },
  ];

  const employeeDetailsRowThree = [
    {
      Key: 'State',
      value: listItemBasedOnID?.state?.[0]?.stateName ?? '-',
    },
    {
      Key: 'Zone',
      value: listItemBasedOnID?.zone?.[0]?.zoneName ?? '-',
    },
    {
      Key: 'District',
      value: listItemBasedOnID?.city?.[0]?.cityName ?? '-',
    },
    {
      Key: 'Branch',
      value: listItemBasedOnID?.branch?.[0]?.branchName ?? '-',
    },
  ];

  return (
    <Box className="user-details-container ">
      <Box>
        <Box>
          <Box>
            <Box
              sx={{
                paddingX: 4,
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingY: 1,
              }}
            ></Box>
          </Box>

          <Box className="search-container">
            <Box className="search-box">
              <SearchIcon className="search-icon" />
              <InputBase
                placeholder="Search by name,and emp ID"
                fullWidth={true}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box sx={{ padding: '0 30px' }}>
          <TableContainer
            component={Paper}
            sx={{ margin: '2% 0', boxShadow: 'none' }}
            className="common-table-container-auth"
          >
            <Table style={{ width: '100%' }} aria-label="customized table">
              <TableHead
                sx={{ padding: '0px !important', backgroundColor: '#eaf5ff' }}
              >
                {tableHeaderData.map((items: any, index: any) => {
                  return (
                    <TableRow key={index}>
                      <StyledTableCell>{items.id}</StyledTableCell>
                      <StyledTableCell>{items.initiater}</StyledTableCell>
                      <StyledTableCell>{items.reviewer}</StyledTableCell>
                      <StyledTableCell>{items.approver}</StyledTableCell>
                    </TableRow>
                  );
                })}
              </TableHead>
              <TableBody>
                {listModule.map((item: any, index: number) => {
                  return (
                    <TableRow className="user_detail_tableData">
                      {' '}
                      <StyledTableCell
                        sx={{
                          backgroundColor: 'white',
                        }}
                      >
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          backgroundColor: 'white',
                        }}
                      >
                        <TableRow className="user_detail_tableData">
                          <Link
                            className="user-details-link"
                            sx={{ height: '20px' }}
                            style={{
                              textDecoration: item?.personalDetails
                                ?.employeeName
                                ? 'underline'
                                : 'none',
                              textDecorationColor: item.userName && '#0662B7',
                            }}
                            onClick={() => handleModuleBasedOnId(item.id)}
                          >
                            {item?.personalDetails?.employeeName ?? '-'}
                          </Link>
                        </TableRow>
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          backgroundColor: 'white',
                        }}
                      >
                        {item?.requestResponsiblePerson?.length > 0 &&
                        item?.requestResponsiblePerson[0]?.subModules?.length >
                          0
                          ? item?.requestResponsiblePerson[0]?.subModules?.map(
                              (item: any, index: number) => {
                                return (
                                  item.roleAccessType === 'REVIEWER' && (
                                    <TableRow
                                      sx={{ height: '20px' }}
                                      key={index}
                                    >
                                      <Link
                                        className="user-details-link"
                                        style={{
                                          textDecoration:
                                            item.roleAccessType ===
                                              'REVIEWER' && item.userName
                                              ? 'underline'
                                              : 'none',
                                          textDecorationColor:
                                            item.userName && '#0662B7',
                                        }}
                                        onClick={() =>
                                          handleModuleBasedOnId(item.userId)
                                        }
                                      >
                                        {item.roleAccessType === 'REVIEWER'
                                          ? item.userName
                                          : '-'}
                                      </Link>
                                    </TableRow>
                                  )
                                );
                              }
                            )
                          : '-'}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          backgroundColor: 'white',
                        }}
                      >
                        {item?.requestResponsiblePerson?.length > 0 &&
                        item?.requestResponsiblePerson[0]?.subModules?.length >
                          0
                          ? item?.requestResponsiblePerson[0]?.subModules?.map(
                              (item: any, index: number) => {
                                return (
                                  item.roleAccessType === 'APPROVER' && (
                                    <TableRow
                                      sx={{ height: '20px' }}
                                      key={index}
                                    >
                                      <Link
                                        className="user-details-link"
                                        style={{
                                          textDecoration:
                                            item.roleAccessType ===
                                              'APPROVER' && item.userName
                                              ? 'underline'
                                              : 'none',
                                          textDecorationColor:
                                            item.userName && '#0662B7',
                                        }}
                                        onClick={() =>
                                          handleModuleBasedOnId(item.userId)
                                        }
                                      >
                                        {item.roleAccessType === 'APPROVER'
                                          ? item.userName
                                          : '-'}
                                      </Link>
                                    </TableRow>
                                  )
                                );
                              }
                            )
                          : '-'}
                      </StyledTableCell>{' '}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Stack sx={{ margin: '20px 25px' }}>
        <PaginationAuth
          data={listModule}
          pagination={{
            ...pagination,
            ...totalCount,
            onPageChange: onPageChange,
            onPageSizeChange: onPageSizeChange,
          }}
        />
      </Stack>
      {showPauseModal && (
        <CustomModal
          openSuccess={showPauseModal}
          handleCloseSuccess={closeModal}
          employeeDetailsRowOne={employeeDetailsRowOne}
          employeeDetailsRowTwo={employeeDetailsRowTwo}
          employeeDetailsRowThree={employeeDetailsRowThree}
          title={'Employee Details'}
          duplicateRoleCloseBtn={' Close'}
        />
      )}
      {apiError.length !== 0 && (
        <ErrorMessage
          message={apiError}
          handleClose={() => setApiError('')}
          severity="error"
          duration={3000}
        />
      )}
    </Box>
  );
}

export default RiskManagement;
