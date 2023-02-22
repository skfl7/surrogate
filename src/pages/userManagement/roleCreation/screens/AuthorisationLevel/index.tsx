/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  MenuItem,
  Typography,
  Box,
  Stack,
  Button,
  IconButton,
  Divider,
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Menu,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  authorisationRows,
  authorisationDataInterface,
} from './authorisation.const';
import '../../style.scss';
import { ScreenHeader } from '../../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import PaginationComp from '../../../../../components/commonComponent/Pagination/Pagination';
import GreenDot from '../../../../../assets/icons/greendot.svg';
import FailureDot from '../../../../../assets/icons/failuredot.svg';
import ChooseCategoryToViewData from '../../../../../components/commonComponent/ChooseCategoryToViewData';
import { getAuthorizationList } from '../../../../../services/roleCreationServices';
import edit_icon from '../../../../../assets/images/edit_active_icon.svg';
import ascending_icon from '../../../../../assets/icons/ascending.svg';
import descending_icon from '../../../../../assets/icons/descending.svg';
import localforage from 'localforage';
import { formatDateTime } from '../../../../../utils/DateTimeFormatter';
import ErrorMessage from '../../../../../components/commonComponent/ErrorMessage';
import { getPermission } from '../../../../../utils/ActionAllowed/UserActionAllowed';

export const AuthorisationLevel = (props: any) => {
  const navigate = useNavigate();
  const tableHeaderData: authorisationDataInterface[] = [
    {
      id: 'ID',
      version: 'Version',
      initiatedBy: 'Initiated By',
      approvedBy: 'Approved By',
      date: 'Date',
      lastModified: 'Last Modified',
      currentStatus: 'Current Status',
      actions: 'Actions',
    },
  ];
  const [authorisationData, setAuthorisationData] = useState(authorisationRows);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [filteredData, setFilterteredData] = useState<
    authorisationDataInterface[]
  >([]);
  const [decendingSortingData, setDecendingSortingData] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [ascending, setAscending] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [activeId, setActiveId] = useState<string>('');
  const [value, setValue] = React.useState<any>('lastModifiedDateTime');
  const [totalCount, setTotalCount] = useState({
    totaLNoOfRecords: 0,
    totalNoOfPages: 0,
  });
  const [apiError, setApiError] = useState('');
  const [actionAllowedItem, setActionAllowedItem] = useState([]);

  useEffect(() => {
    if (decendingSortingData.length > 0) {
      filterData();
    }
  }, [ascending, decendingSortingData, value]);

  const getLocalStorageValue = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');

      setUserId(value.id);
      setActionAllowedItem(value?.actionsAllowed);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getLocalStorageValue();
  }, []);

  const handleCardMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigate('/userManagement/roleCreation/authorisationDetails', {
      state: {
        mode: 'editMode',
        screen: 'create',
        id: activeId,
        history: false,
      },
    });
  };
  const menuOpen = Boolean(anchorElement);

  const handleClose = () => {
    setAnchorElement(null);
  };
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
    setPage(0);
    setCurrentPage(1);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  function kycStatus(
    status: string,
    imageDot: string | undefined,
    _textColor: string
  ) {
    return (
      <Box
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <Box className="dotIcon">
          <img
            src={imageDot}
            alt={'status-icon'}
            style={{ marginTop: '5px' }}
          />
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 'bold',
              color: _textColor,
              fontSize: '14px',
              marginLeft: '10px',
            }}
          >
            {status}
          </Typography>
        </Box>
      </Box>
    );
  }
  const viewAction = (id: any, status: any) => {
    navigate('/userManagement/roleCreation/authorisationDetails', {
      state: { id: id, status: status, screen: 'view', history: false },
    });
  };
  const handleError = (err: any) => {
    if (err?.exception?.fieldErrors) {
      const missingFields = err?.exception.fieldErrors?.map(
        (field: string) => `${field}, `
      );
      setApiError(missingFields);
    } else if (err?.exception?.shortMessage)
      setApiError(err?.exception?.shortMessage);
    else if (err?.error) setApiError(err?.error + ' ' + err?.path);
    else setApiError('Something went wrong!');
  };
  const getAuthorizationItemDetails = () => {
    setLoading(true);
    let payload = {
      page: page,
      size: rowsPerPage === -1 ? totalCount.totaLNoOfRecords : rowsPerPage,
    };

    getAuthorizationList(payload)
      .then((response) => {
        const result = response?.data?.result;
        // setAuthorizationResponseData(response.data.result.content);
        // setFilterteredData(response.data.result.content);
        if (result && result.content && Array.isArray(result.content)) {
          // setFilterteredData(result.content);
          setDecendingSortingData([...(result?.content ?? [])]);
          setActiveId(result.content[0].id);
          setTotalCount({
            totaLNoOfRecords: result?.totalElements,
            totalNoOfPages: result?.totalPages,
          });
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        // setAuthorizationResponseData([]);
        setFilterteredData([]);
        setLoading(false);
        handleError(err?.response?.data ?? '');
      });
  };
  useEffect(() => {
    getAuthorizationItemDetails();
  }, [page, rowsPerPage]);

  const handleSortByName = (name: string) => {
    console.log('value', value);
    console.log('ascending', ascending);

    if (value === name && !ascending) {
      setAscending(true);
    } else {
      if (value !== name) {
        setAscending(true);
      } else {
        setAscending(!ascending);
      }
    }
    setValue(name);
  };

  const filterData = () => {
    const sort = decendingSortingData.sort((a: any, b: any) => {
      if (ascending) {
        return a[value] < b[value] ? -1 : 1;
      }
      return a[value] > b[value] ? -1 : 1;
    });
    setFilterteredData([...sort]);
    // setSortingData([...sort]);
  };

  return (
    <Stack>
      <Stack>
        <Box className="role-header-container">
          <ScreenHeader
            title="Authorization Level"
            info="From here, you can assign authorization to users."
            showBackButton={false}
          />
          {getPermission(
            actionAllowedItem,
            'USER_MANAGEMENT',
            'ROLE_CREATION',
            'EDIT_AUTHORIZATION_LEVELS'
          ) && (
            <Box>
              <Button
                sx={{ textTransform: 'capitalize', boxShadow: 'none' }}
                variant="contained"
                color="secondary"
                startIcon={<img src={edit_icon} alt="" style={{width:'23px',height:'23px'}} />}
                aria-haspopup="true"
                onClick={handleCardMenuClick}
                id="basic-button"
              >
                {`Edit Authorization level`}
              </Button>
            </Box>
          )}
        </Box>
        {filteredData?.length > 0 && (
          <Box>
            <Box sx={{ marginTop: 4 }}>
              <Box
                sx={{
                  paddingX: 4,
                  backgroundColor: 'white',
                  paddingTop: 2,
                }}
              >
                <Typography>
                  Various organisations along with basic details.
                </Typography>
                <Divider sx={{ paddingTop: 2 }} />
              </Box>
            </Box>
          </Box>
        )}

        {loading === true && filteredData?.length > 0 && (
          <Box sx={{ height: 400, backgroundColor: 'white', paddingX: '32px' }}>
            <TableContainer
              // component={Paper}
              className="common-table-container1"
              sx={{
                width: '100%',
                overFlowX: 'auto',
                marginBottom: '20px',
                marginTop: '24px',
              }}
            >
              <Table
                size="small"
                aria-label="Table"
                style={{
                  width: authorisationData.length > 5 ? '102%' : '100%',
                  borderBottom: 'none',
                  overflowX: 'auto',
                }}
              >
                <TableHead
                  sx={{ backgroundColor: '#EEF7FF' }}
                  className="tableHead"
                >
                  {tableHeaderData.map(
                    (items: authorisationDataInterface, index: number) => (
                      <TableRow key={index}>
                        <TableCell
                          width={'180px'}
                          height={'45px'}
                          align="left"
                          className="tableCell"
                          sx={{fontWeight:800}}
                          
                        >
                          #
                        </TableCell>
                        <TableCell
                          width={'235px'}
                          className="tableCell"
                          sx={{
                            cursor: 'pointer',
                            fontWeight:800
                          }}
                          onClick={() => handleSortByName('versionName')}
                        >
                          {items.version}
                          {value === 'versionName' && (
                            <IconButton
                              sx={{
                                height: '12px',
                                width: '12px',
                                marginLeft: '10px',
                              }}
                            >
                              {ascending === true ? (
                                <img src={ascending_icon} alt="Sort Icon" />
                              ) : (
                                <img src={descending_icon} alt="Sort Icon" />
                              )}
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell
                          width={'235px'}
                          sx={{
                            cursor: 'pointer',
                            fontWeight:800
                          }}
                          className="tableCell"
                          onClick={() => handleSortByName('initiatedBy')}
                        >
                          {items.initiatedBy}
                          {value === 'initiatedBy' && (
                            <IconButton
                              sx={{
                                height: '12px',
                                width: '12px',
                                marginLeft: '10px',
                              }}
                            >
                              {ascending === true ? (
                                <img src={ascending_icon} alt="Sort Icon" />
                              ) : (
                                <img src={descending_icon} alt="Sort Icon" />
                              )}
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell
                          width={'235px'}
                          sx={{
                            cursor: 'pointer',
                            fontWeight:800
                          }}
                          className="tableCell"
                          onClick={() => handleSortByName('approvedBy')}
                        >
                          {items.approvedBy}
                          {value === 'approvedBy' && (
                            <IconButton
                              sx={{
                                height: '12px',
                                width: '12px',
                                marginLeft: '10px',
                              }}
                            >
                              {ascending === true ? (
                                <img src={ascending_icon} alt="Sort Icon" />
                              ) : (
                                <img src={descending_icon} alt="Sort Icon" />
                              )}
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell
                          width={'235px'}
                          sx={{
                            cursor: 'pointer',
                            fontWeight:800
                          }}
                          className="tableCell"
                          onClick={() => handleSortByName('onBoardDateTime')}
                        >
                          {items.date}
                          {value === 'onBoardDateTime' && (
                            <IconButton
                              sx={{
                                height: '12px',
                                width: '12px',
                                marginLeft: '10px',
                              }}
                            >
                              {ascending === true ? (
                                <img src={ascending_icon} alt="Sort Icon" />
                              ) : (
                                <img src={descending_icon} alt="Sort Icon" />
                              )}
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell
                          width={'235px'}
                          sx={{
                            cursor: 'pointer',
                            fontWeight:800
                          }}
                          className="tableCell"
                          onClick={() =>
                            handleSortByName('lastModifiedDateTime')
                          }
                        >
                          {items.lastModified}
                          {value === 'lastModifiedDateTime' && (
                            <IconButton
                              sx={{
                                height: '12px',
                                width: '12px',
                                marginLeft: '10px',
                              }}
                            >
                              {ascending === true ? (
                                <img src={ascending_icon} alt="Sort Icon" />
                              ) : (
                                <img src={descending_icon} alt="Sort Icon" />
                              )}
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell
                          width={'150px'}
                          className="tableCell"
                          sx={{fontWeight:800}}
                          //todo
                        >
                          {items.currentStatus}
                        </TableCell>
                        {getPermission(
                          actionAllowedItem,
                          'USER_MANAGEMENT',
                          'ROLE_CREATION',
                          'VIEW_AUTHORIZATION_LEVELS'
                        ) && (
                          <TableCell
                            width={'235px'}
                            align="center"
                            className="tableCell"
                            sx={{fontWeight:800}}
                          >
                            {items.actions}
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  )}
                </TableHead>
                <TableBody>
                  {filteredData?.length > 0 &&
                    filteredData.map((row: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell
                          align="left"
                          height={'50px'}
                          width={'150px'}
                          sx={{ borderBottom: 'none' }}
                        >
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell
                          align="left"
                          width={'235px'}
                          sx={{ borderBottom: 'none' }}
                        >
                          {row?.versionName ? row?.versionName : '-'}
                        </TableCell>
                        <TableCell
                          align="left"
                          width={'235px'}
                          sx={{ borderBottom: 'none' }}
                        >
                          {row?.initiatedBy ? row?.initiatedBy : 'Vinith'}
                        </TableCell>
                        <TableCell
                          align="left"
                          width={'235px'}
                          sx={{ borderBottom: 'none' }}
                        >
                          {row?.approvedBy}
                        </TableCell>
                        <TableCell
                          align="left"
                          width={'270px'}
                          sx={{ borderBottom: 'none' }}
                        >
                          {row?.onBoardDateTime !== null
                            ? formatDateTime(row?.onBoardDateTime)
                            : '-'}
                        </TableCell>
                        <TableCell
                          align="left"
                          width={'250px'}
                          sx={{ borderBottom: 'none' }}
                        >
                          {row?.lastModifiedDateTime !== null
                            ? formatDateTime(row?.lastModifiedDateTime)
                            : '-'}
                        </TableCell>
                        {/* <TableCell align="left" width={'235px'}>
                          {row?.currentStatus}
                        </TableCell> */}
                        <TableCell
                          width={'250px'}
                          sx={{ borderBottom: 'none' }}
                        >
                          {page === 0 && index === 0
                            ? kycStatus('ACTIVE', GreenDot, '#6AB06E')
                            : kycStatus('CLOSED', FailureDot, '#E63946')}
                        </TableCell>
                        {getPermission(
                          actionAllowedItem,
                          'USER_MANAGEMENT',
                          'ROLE_CREATION',
                          'VIEW_AUTHORIZATION_LEVELS'
                        ) && (
                          <TableCell
                            align="center"
                            sx={{ borderBottom: 'none' }}
                          >
                            <Link
                              sx={{ cursor: 'pointer', color: '#0662B7' }}
                              underline="none"
                              onClick={() =>
                                viewAction(
                                  row?.id,
                                  page === 0 && index === 0
                                    ? 'ACTIVE'
                                    : 'CLOSED'
                                )
                              }
                              // onClick={getAuthorizationItemDetails}
                            >
                              View
                            </Link>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
                <Menu
                  id="more-menu"
                  anchorEl={anchorElement}
                  open={menuOpen}
                  MenuListProps={{
                    'aria-labelledby': 'more-button',
                  }}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  // transformOrigin={{
                  //   vertical: 'top',
                  //   horizontal: 'right',
                  // }}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      // navigate('/productManagement/cardCatalogue/singleupload/reviewCard');
                    }}
                    className="menu"
                  >
                    View
                  </MenuItem>
                  <MenuItem onClick={handleClose} className="menu">
                    Edit
                  </MenuItem>
                </Menu>
              </Table>
            </TableContainer>
            <PaginationComp
              rows={filteredData}
              rowsPerPage={rowsPerPage}
              totalRecordCount={totalCount?.totaLNoOfRecords || 0}
              totalPages={totalCount?.totalNoOfPages || 0}
              page={page}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              onPageChange={onPageChange}
              onLastClick={(event: any) => {
                // setPage(Math.ceil(filteredData.length / rowsPerPage));
                // setCurrentPage(Math.ceil(filteredData.length / rowsPerPage));
                handleChangePage(event, totalCount.totalNoOfPages - 1);
              }}
              onFirstClick={() => {
                setPage(0);
                setCurrentPage(0);
              }}
              lastButtonDisabled={page === totalCount.totalNoOfPages - 1}
            />
          </Box>
        )}

        {loading === false && filteredData?.length === 0 && (
          <Box sx={{ margin: '60px 0' }}>
            <ChooseCategoryToViewData />
          </Box>
        )}

        {apiError.length !== 0 && (
          <ErrorMessage
            message={apiError}
            handleClose={() => setApiError('')}
            severity="error"
            duration={3000}
          />
        )}
      </Stack>
    </Stack>
  );
};
