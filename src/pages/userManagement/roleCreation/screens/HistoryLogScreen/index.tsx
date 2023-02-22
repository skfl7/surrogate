import React, { useEffect, useState } from 'react';
import { MenuItem, Box, Stack, IconButton, Divider, Menu } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  historyLogAuthenticationInterface,
  historyLogRoleCreationInterface,
  ruleCreationLogData,
} from './historyLog.const';
import './style.scss';
import GroupButton from '../../../../../components/commonComponent/GroupButton/GroupButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ascending_icon from '../../../../../assets/icons/ascending.svg';
import descending_icon from '../../../../../assets/icons/descending.svg';

import { checkTagStatus } from '../../../../../utils/tagBasedIndicator/tagStatus';
import ListTable from '../../../../../components/commonComponent/commonListTable/commonListTable';
import HistoryLogCustomModal from '../../../../../components/commonComponent/customModal/HistoryLogCustomModal';
import { MenuProps } from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import localforage from 'localforage';
import {
  historyLog,
  historyLogDetailsListItem,
} from '../../../../../services/programmeManagementServices';
import { formatDateTime } from '../../../../../utils/DateTimeFormatter';
import { ConCatArrNames } from '../../../../../utils/JoinNames';
import { getRoleCreationDetails } from '../../../../../services/roleCreationServices';
import ErrorMessage from '../../../../../components/commonComponent/ErrorMessage';

export const GroupButtonDataRoleCreation = [
  {
    title: 'ROLE_CREATION',
  },
  {
    title: 'AUTHORIZATION_LEVEL', //todo need to check
  },
];

export const GroupButtonDataUserCreation = [
  {
    title: 'USER_CREATION',
  },
];

const tableHeader = [
  {
    header: 'Version Number',
  },
  {
    header: 'Role Name',
  },
  {
    header: 'Checker Status',
  },
  {
    header: '',
  },
];

export const HistoryLog = (props: any) => {
  const navigate = useNavigate();
  const [historyLogData, setHistoryLogData] =
    useState<historyLogRoleCreationInterface[]>(ruleCreationLogData);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const menuOpen = Boolean(anchorElement);
  const [selectedRowData, setSelectedRowData] = useState<any>();

  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageNumber: 0,
  });
  const [totalCount, setTotalCount] = useState({
    totaLNoOfRecords: 0,
    totalNoOfPages: 0,
  });

  const [userID, setUserId] = useState<string>();
  const [historyLogItems, setHistoryLogItems] = useState<any>([]);
  const [historyLogRowDetail, setHistoryLogRowDetail] = useState([]);
  const [historyLogdetails, setHistoryLogdetails] = useState<any>([]);
  const [groupBtnOnChange, setGroupBtnOnchange] =
    useState<any>('ROLE_CREATION');

  //Sorting
  const [value, setValue] = React.useState<any>('history');
  const [secondValue, setSecondValue] = React.useState<any>(
    'lastModifiedDateTime'
  );
  const [threeValue, setThreeValue] = React.useState<any>(null);
  const [fourthValue, setFourthValue] = React.useState<any>(null);
  const [ascending, setAscending] = useState<boolean>(false);
  const [decendingSortingData, setDecendingSortingData] = useState<any>([]);
  const [apiError, setApiError] = useState('');
  const [pageSizeNo, setPageSizeNo] = useState(10);
  const [totalElement, setTotalElement] = useState<any>(0);

  useEffect(() => {
    userID && getHistoryLogListItem();
  }, [userID, pagination, groupBtnOnChange]);

  useEffect(() => {
    getLocalStorageID();
  }, []);

  useEffect(() => {
    if (decendingSortingData.length > 0) {
      filterData();
    }
  }, [ascending, value, secondValue, threeValue, decendingSortingData]);

  useEffect(() => {
    if (userID) {
      historyLogDetails();
    }
  }, [pageSizeNo]);

  const viewMoreHistory = () => {
    setPageSizeNo(pageSizeNo + 10);
  };

  const handleSortByName = (
    name: string,
    secondItem: string,
    threeItem: string,
    fourthItem: string
  ) => {
    const secondState = secondItem === '' ? null : secondItem;
    const threeState = threeItem === '' ? null : threeItem;
    const fourthState = fourthItem === '' ? null : fourthItem;

    if (
      value !== name ||
      secondValue !== secondState ||
      fourthValue !== fourthState ||
      threeValue !== threeState
    ) {
      setAscending(true);
    } else {
      setAscending(!ascending);
    }

    setValue(name);
    setSecondValue(secondState);
    setThreeValue(threeState);
    setFourthValue(fourthState);
  };
  const filterData = () => {
    const sort = decendingSortingData.sort((a: any, b: any) => {
      if (ascending) {
        if (fourthValue) {
          const first =
            a?.[value]?.[secondValue]?.[threeValue]?.[fourthValue] ?? '';
          const second =
            b?.[value]?.[secondValue]?.[threeValue]?.[fourthValue] ?? '';
          return first < second ? -1 : 1;
        }
        if (threeValue) {
          const first = a?.[value]?.[secondValue]?.[threeValue] ?? '';
          const second = b?.[value]?.[secondValue]?.[threeValue] ?? '';
          return first < second ? -1 : 1;
        }
        if (secondValue) {
          return a[value][secondValue] < b[value][secondValue] ? -1 : 1;
        }
        return a[value] < b[value] ? -1 : 1;
      }
      if (fourthValue) {
        const first =
          a?.[value]?.[secondValue]?.[threeValue]?.[fourthValue] ?? '';
        const second =
          b?.[value]?.[secondValue]?.[threeValue]?.[fourthValue] ?? '';
        return first > second ? -1 : 1;
      }
      if (threeValue) {
        const first = a?.[value]?.[secondValue]?.[threeValue] ?? '';
        const second = b?.[value]?.[secondValue]?.[threeValue] ?? '';
        return first > second ? -1 : 1;
      }
      if (secondValue) {
        return a[value][secondValue] > b[value][secondValue] ? -1 : 1;
      }
      return a[value] > b[value] ? -1 : 1;
    });
    setHistoryLogItems([...sort]);
  };
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
  const historyLogDetails = () => {
    let payload = {
      id: selectedRowData?.row?.id,
      userId: userID,
      authorizationModule: groupBtnOnChange,
      page: 0,
      size: pageSizeNo,
    };
    setHistoryLogRowDetail(selectedRowData?.row);
    historyLogDetailsListItem(payload)
      .then((response: any) => {
        const result = response?.data?.result;
        if (result) {
          setHistoryLogdetails(response?.data?.result?.content || []);
          setTotalElement(response.data.result.totalElements);
        } else {
          handleError(response?.data ?? '');
        }
      })

      .catch((err: any) => {
        setHistoryLogdetails([]);
        handleError(err?.response?.data ?? '');
      });
    handleClose();
    setShowHistoryModal(true);
  };

  const getHistoryLogListItem = () => {
    let payload = {
      userId: userID,
      authorizationModule: groupBtnOnChange,
      page: pagination.pageNumber,
      size: pagination.pageSize,
    } as any;
    historyLog(payload)
      .then((response) => {
        const result = response.data.result;
        if (result) {
          setTotalCount({
            totaLNoOfRecords: result?.totalElements,
            totalNoOfPages: result?.totalPages,
          });
          // setHistoryLogItems(response.data.result.content || []);
          setDecendingSortingData([...(response?.data?.result?.content ?? [])]);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        setHistoryLogItems([]);
        setDecendingSortingData([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const groupBtnonChange = (value: any) => {
    setGroupBtnOnchange(value.title);
    let values = {
      pageSize: 5,
      pageNumber: 0,
    };
    setPagination({
      ...values,
    });
  };

  const onPageChange = (pageNo: number) => {
    setPagination({
      ...pagination,
      pageNumber: pageNo,
    });
  };

  const onPageSizeChange = (size: number) => {
    if (size === -1) {
      setPagination({
        ...pagination,
        pageSize: totalCount.totaLNoOfRecords,
        pageNumber: 0,
      });
    } else
      setPagination({
        ...pagination,
        pageSize: size,
        pageNumber: 0,
      });
  };

  const getLocalStorageID = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      const id = value.id;
      setUserId(id);
    } catch (err) {
      console.log(err);
    }
  };

  const historyViewMoreFun = (index: any) => {
    let newArrr = historyLogdetails.filter((_: any, indexNum: any) => {
      return index === indexNum;
    });
    if (props.comingfrom == 'roleCreation') {
      navigate('/userManagement/roleCreation/historyLogDetail', {
        state: { newArrr: newArrr },
      });
    } else {
      navigate('/userManagement/userCreation/historyLogDetail', {
        state: { newArrr: newArrr },
      });
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLTableCellElement>,
    row: any,
    index: any
  ) => {
    setAnchorElement(event.currentTarget);
    let value = {
      row: row,
      index: index,
    };

    setSelectedRowData({ ...value });
  };

  const handleClose = () => {
    setAnchorElement(null);
  };
  const closeModal = () => {
    setShowHistoryModal(false);
    setPageSizeNo(10);
  };

  const authorization = (index: any) => {
    console.log('index', index);
    let newArrr = historyLogItems.filter((_: any, indexNum: any) => {
      return index === indexNum;
    });

    console.log('newArr', newArrr);
    navigate('/userManagement/roleCreation/authorizationHistoryLog', {
      state: { newArrr: newArrr },
    });
  };

  const ViewMorFun = async () => {
    if (groupBtnOnChange == 'ROLE_CREATION') {
      const payload = {
        roleId: selectedRowData?.row?.id,
      } as any;
      const result = await getDetailofItem(payload);
      handleClose();
      navigate('/userManagement/roleCreation/createRole', {
        state: {
          data: result?.result,
          roleName: 'Head',
          isView: true,
        },
      });
    } else {
      handleClose();
      navigate('/userManagement/roleCreation/authorisationDetails', {
        state: {
          id: selectedRowData?.row?.history?.authorizationLevel?.id,
          status: selectedRowData?.row?.history?.actionPerson?.userStatus,
          screen: 'view',
          history: true,
          user_id: userID,
        },
      });
    }
  };

  const getDetailofItem = async (payload: any) => {
    let res = {} as any;
    await getRoleCreationDetails(payload)
      .then((response) => {
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
        console.log(err.response.data);
      });
    return res;
  };

  const StyledMenu: any = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(() => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      minWidth: '257px',
      border: '1px solid #f5f2f2',
      boxShadow:
        'rgba(2, 2, 2, 0.04) 0px 0px 1px 0px, rgba(0, 0, 0, 0.1) 0px 1px 1px 0px',
      '& .MuiMenu-list': {
        padding: '2px',
      },
      '& .MuiMenuItem-root': {
        padding: '13px 22px',
        fontSize: '14px',
        fontWeight: '400',
        fontFamily: 'Ilisarniq',
      },
    },
  }));

  const column = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '100px',
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ textAlign: 'left' }}>
            {' '}
            {pagination.pageNumber * pagination.pageSize + (index + 1)}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return <Stack sx={{ textAlign: 'left' }}>{text}</Stack>;
      },
    },

    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (name: any, row: any, index: number) => {
        return <Stack>{row?.history?.role?.name ?? '-'}</Stack>;
      },
      width: '235px',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('history', 'role', 'name', '')}
          >
            <>{text}</>
            {threeValue === 'name' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '200px',
      render: (name: any, row: any, index: number) => {
        return (
          <Stack>
            {row?.history?.onBoardDateTime !== null
              ? formatDateTime(row?.history?.onBoardDateTime)
              : '-'}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleSortByName('history', 'onBoardDateTime', '', '')
            }
          >
            <>{text}</>
            {secondValue === 'onBoardDateTime' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModifiedDateTime',
      key: 'lastModifiedDateTime',
      width: '200px',
      render: (name: any, row: any, index: number) => {
        return (
          <Stack>
            {row?.history?.lastModifiedDateTime !== null
              ? formatDateTime(row?.history?.lastModifiedDateTime)
              : '-'}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleSortByName('history', 'lastModifiedDateTime', '', '')
            }
          >
            <>{text}</>
            {secondValue === 'lastModifiedDateTime' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },

    {
      title: 'Request Initiater',
      dataIndex: 'requestInitiater',
      key: 'requestInitiater',
      width: '200px',
      render: (name: any, row: any, index: number) => {
        return (
          <Stack>
            {row?.history?.actionPerson?.personalDetails?.employeeName ?? '-'}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleSortByName(
                'history',
                'actionPerson',
                'personalDetails',
                'employeeName'
              )
            }
          >
            <>{text}</>
            {fourthValue === 'employeeName' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },

    {
      title: 'Reviewer',
      dataIndex: 'reviewer',
      key: 'reviewer',
      width: '200px',
      render: (name: any, row: any, index: number) => {
        return (
          <>
            {row?.history?.reviewerList?.length > 0 ? (
              <Stack>{ConCatArrNames(row?.history?.reviewerList) || '-'}</Stack>
            ) : (
              <Stack>{'-'}</Stack>
            )}
          </>
        );
      },
    },

    {
      title: 'Approver',
      dataIndex: 'approver',
      key: 'approver',
      width: '200px',
      render: (name: any, row: any, index: number) => {
        return (
          <>
            {row?.history?.approverList?.length > 0 ? (
              <Stack>{ConCatArrNames(row?.history?.approverList) || '-'}</Stack>
            ) : (
              <Stack>{'-'}</Stack>
            )}
          </>
        );
      },
    },
    {
      title: 'Request Status',
      dataIndex: 'requestStatus',
      key: 'requestStatus',
      width: '150px',
      render: (name: any, row: any, index: number) => {
        return (
          <Stack
            sx={{
              color: row?.history?.authorizationStatus
                ? checkTagStatus(row?.history?.authorizationStatus).color
                : '',
            }}
          >
            {row?.history?.authorizationStatus ?? ''}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleSortByName('history', 'authorizationStatus', '', '')
            }
          >
            <>{text}</>
            {secondValue === 'authorizationStatus' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },

    {
      title: 'More',
      dataIndex: 'id',
      key: 'id',
      width: '70px',
      render: (name: any, row: any, index: number) => {
        return (
          <>
            <Box
              id="more-button"
              onClick={(e: any) => handleClick(e, row, index)}
              aria-controls={open ? 'more-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{ padding: '5px', borderBottom: 'none' }}
            >
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <StyledMenu
              id="more-menu"
              anchorEl={anchorElement}
              open={menuOpen}
              MenuListProps={{
                'aria-labelledby': 'more-button',
              }}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  historyLogDetails();
                }}
              >
                History Log
              </MenuItem>
              <MenuItem onClick={() => ViewMorFun()}>
                {groupBtnOnChange == 'ROLE_CREATION'
                  ? 'View Role'
                  : 'View Authorization Level'}
              </MenuItem>
            </StyledMenu>
          </>
        );
      },
    },
  ];

  const Authcolumn = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '100px',
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ textAlign: 'left' }}>
            {' '}
            {pagination.pageNumber * pagination.pageSize + (index + 1)}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return <Stack sx={{ textAlign: 'left' }}>{text}</Stack>;
      },
    },

    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '200px',
      render: (name: any, row: any, index: number) => {
        return (
          <Stack>
            {' '}
            {row?.history?.onBoardDateTime !== null
              ? formatDateTime(row?.history?.onBoardDateTime)
              : '-'}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleSortByName('history', 'onBoardDateTime', '', '')
            }
          >
            <>{text}</>
            {secondValue === 'onBoardDateTime' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModifiedDateTime',
      key: 'lastModifiedDateTime',
      width: '200px',
      render: (name: any, row: any, index: number) => {
        return (
          <Stack>
            {row?.history?.lastModifiedDateTime !== null
              ? formatDateTime(row?.history?.lastModifiedDateTime)
              : '-'}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleSortByName('history', 'lastModifiedDateTime', '', '')
            }
          >
            <>{text}</>
            {secondValue === 'lastModifiedDateTime' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Initiater',
      dataIndex: 'initiater',
      key: 'initiater',
      width: '200px',
      render: (name: any, row: any, index: number) => {
        return (
          <Stack>
            {row?.history?.actionPerson?.personalDetails?.employeeName ?? '-'}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleSortByName('history', 'actionPerson', 'userStatus', '')
            }
          >
            <>{text}</>
            {threeValue === 'userStatus' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Reviewer',
      dataIndex: 'reviewer',
      key: 'reviewer',
      width: '200px',
      render: (name: any, row: any, index: number) => {
        return (
          <>
            {row?.history?.reviewerList?.length > 0 ? (
              <Stack>{ConCatArrNames(row?.history?.reviewerList) || '-'}</Stack>
            ) : (
              <Stack>{'-'}</Stack>
            )}
          </>
        );
      },
    },
    {
      title: 'Approver',
      dataIndex: 'approver',
      key: 'approver',
      width: '200px',
      render: (name: any, row: any, index: number) => {
        return (
          <>
            {row?.history?.approverList?.length > 0 ? (
              <Stack>{ConCatArrNames(row?.history?.approverList) || '-'}</Stack>
            ) : (
              <Stack>{'-'}</Stack>
            )}
          </>
        );
      },
    },
    {
      title: 'Current Status',
      dataIndex: 'currentStatus',
      key: 'currentStatus',
      width: '150px',
      render: (name: any, row: any, index: number) => {
        return <Stack>{row?.history?.actionPerson?.userStatus ?? '-'}</Stack>;
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleSortByName('history', 'authorizationStatus', '', '')
            }
          >
            <>{text}</>
            {secondValue === 'authorizationStatus' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Request Status',
      dataIndex: 'requestStatus',
      key: 'requestStatus',
      width: '150px',
      render: (name: any, row: any, index: number) => {
        return (
          <Stack
            sx={{
              color: row?.history?.authorizationStatus
                ? checkTagStatus(row?.history?.authorizationStatus).color
                : '',
            }}
          >
            {row?.history?.authorizationStatus ?? ''}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleSortByName('history', 'authorizationStatus', '', '')
            }
          >
            <>{text}</>
            {secondValue === 'authorizationStatus' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'More',
      dataIndex: 'id',
      key: 'id',
      width: '70px',
      render: (name: any, row: any, index: number) => {
        return (
          <>
            <Box
              id="more-button"
              onClick={(e: any) => handleClick(e, row, index)}
              aria-controls={open ? 'more-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{ padding: '5px', borderBottom: 'none' }}
            >
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            </Box>
            {/* <Stack onClick={(e: any) => handleClick(e, row, index)}>
              <MoreVertIcon />
            </Stack> */}
            <StyledMenu
              id="more-menu"
              anchorEl={anchorElement}
              open={menuOpen}
              MenuListProps={{
                'aria-labelledby': 'more-button',
              }}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  authorization(selectedRowData.index);
                }}
              >
                View History Log
              </MenuItem>
              <MenuItem onClick={() => ViewMorFun()}>
                View Authorization Level
              </MenuItem>
            </StyledMenu>
          </>
        );
      },
    },
  ];

  return (
    <Stack>
      <Stack>
        {/* tableNavBar */}
        {historyLogData?.length > 0 ? (
          <Stack className="history-log-container">
            <Stack className="table-search-filters">
              {/* <Box className="search-container-history">
                <Box className="search-box">
                  <SearchIcon className="search-icon" />
                  <InputBase
                    placeholder="Search by name,and emp ID"
                    fullWidth={true}
                  />
                </Box>
              </Box> */}
              <Box className="groupButtonContainer">
                <GroupButton
                  data={GroupButtonDataRoleCreation}
                  onChange={groupBtnonChange}
                />
              </Box>
            </Stack>
            <Divider />
            <Stack className="table-start">
              <ListTable
                column={
                  groupBtnOnChange === 'ROLE_CREATION' ? column : Authcolumn
                }
                data={historyLogItems}
                pagination={{
                  ...pagination,
                  ...totalCount,
                  onPageChange: onPageChange,
                  onPageSizeChange: onPageSizeChange,
                }}
                tabStatus={groupBtnOnChange}
              />
            </Stack>
          </Stack>
        ) : (
          <Stack> </Stack>
        )}
      </Stack>
      {showHistoryModal && (
        <HistoryLogCustomModal
          title={'Role- Creation - History Log'}
          closeBtn={'Close'}
          viewMoreDetails={'View More Details'}
          tableHeader={tableHeader}
          historyLogdetails={historyLogdetails}
          historyLogRowDetail={historyLogRowDetail}
          openSuccess={showHistoryModal}
          historyViewMoreFun={historyViewMoreFun}
          handleCloseSuccess={closeModal}
          viewMoreHistory={viewMoreHistory}
          totalElement={totalElement}
          pageSizeNo={pageSizeNo}
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
    </Stack>
  );
};
