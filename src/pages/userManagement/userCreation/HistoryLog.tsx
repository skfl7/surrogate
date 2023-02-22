import { Box, Divider, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import '../orgStructure/screens/historyLog/historyLogStyle.scss';
import ascending_icon from '../../../assets/icons/ascending.svg';
import descending_icon from '../../../assets/icons/descending.svg';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { MenuProps } from '@mui/material/Menu';
import {
  historyLogDetailsListItem,
  historyLog,
} from '../../../services/programmeManagementServices';
import localforage from 'localforage';
import { checkTagStatus } from '../../../utils/tagBasedIndicator/tagStatus';
import { ScreenHeader } from '../../../components/commonComponent/ScreenHeader/ScreenHeader';
import ListTable from '../../../components/commonComponent/commonListTable/commonListTable';
import HistoryLogCustomModal from '../../../components/commonComponent/customModal/HistoryLogCustomModal';
import { ConCatArrNames } from '../../../utils/JoinNames';
import ErrorMessage from '../../../components/commonComponent/ErrorMessage';
import { formatDateTime } from '../../../utils/DateTimeFormatter';
const StyledMenu = styled((props: MenuProps) => (
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

export const USerCreationHistoryLog = (props: any) => {
  const navigate = useNavigate();
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [status, setStatus] = useState(0);
  const [selectedRowData, setSelectedRowData] = useState<any>();
  const open = Boolean(anchorElement);

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
  const [pageSizeNo, setPageSizeNo] = useState(10);
  const [totalElement, setTotalElement] = useState<any>(0);

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

  useEffect(() => {
    if (userID) {
      historyLogDetails();
    }
  }, [pageSizeNo]);

  useEffect(() => {
    if (decendingSortingData.length > 0) {
      filterData();
    }
  }, [ascending, value, secondValue, threeValue, decendingSortingData]);

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
      threeValue !== threeState ||
      fourthValue !== fourthState
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

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLTableCellElement>,
    row: any,
    index: number
  ) => {
    setAnchorElement(event.currentTarget);
    setStatus(index);

    let value = {
      row: row,
      index: index,
    };
    setSelectedRowData({ ...value });
  };
  const closeModal = () => {
    setShowHistoryModal(false);
    setPageSizeNo(10);
  };

  const viewMoreHistory = () => {
    setPageSizeNo(pageSizeNo + 10);
  };

  const column = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '70px',
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ textAlign: 'center' }}>
            {pagination.pageNumber * pagination.pageSize + (index + 1)}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return <Stack sx={{ textAlign: 'center' }}>{text}</Stack>;
      },
    },
    {
      title: 'User.Name',
      dataIndex: 'User.Name',
      key: 'User.Name',
      width: '200px',
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
                'user',
                'personalDetails',
                'employeeName'
              )
            }
          >
            <>{text}</>
            {fourthValue === 'employeeName' && secondValue === 'user' && (
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
      render: (name: any, row: any, index: number) => {
        return (
          <Stack>
            {row?.history?.user?.personalDetails?.employeeName ?? ''}
          </Stack>
        );
      },
    },
    {
      title: 'Version #',
      dataIndex: 'version',
      key: 'version',
      width: '200px',
      render: (name: any, row: any, index: number) => {
        return (
          <Stack
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'pre-line',
            }}
          >
            {row?.history?.versionName ?? '-'}
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
            onClick={() => handleSortByName('history', 'versionName', '', '')}
          >
            <>{text}</>
            {secondValue === 'versionName' && (
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
      title: 'Actions Request',
      dataIndex: 'actionRequest',
      key: 'actionRequest',
      width: '130px',
      render: (name: any, row: any, index: number) => {
        return <Stack>{row?.history?.user?.userStatus ?? '-'}</Stack>;
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
              handleSortByName('history', 'user', 'userStatus', '')
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
      title: 'Requested By',
      dataIndex: 'requestedBy',
      key: 'requestedBy',
      width: '180px',
      render: (name: any, row: any, index: number) => {
        return (
          <Stack>
            {row?.history?.actionPerson?.personalDetails?.employeeName ?? ''}
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
            {fourthValue === 'employeeName' &&
              secondValue === 'actionPerson' && (
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
      title: 'Date & Time',
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
      title: 'Approved By',
      dataIndex: 'approvedBy',
      key: 'approvedBy',
      width: '180px',
      render: (name: any, row: any, index: number) => {
        console.log('row', row.history);
        return (
          <>
            {row?.history?.approverList?.length > 0 ? (
              <Stack className="info-value">
                {ConCatArrNames(row?.history?.approverList) || '-'}
              </Stack>
            ) : (
              <Stack>{'-'}</Stack>
            )}
          </>
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
            onClick={() => handleSortByName('history', 'approverList', '', '')}
          >
            <>{text}</>
            {secondValue === 'approverList' && (
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
      dataIndex: 'status',
      key: 'status',
      width: '130px',
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
      key: 'more',
      width: '70px',
      render: (text: string, row: any, index: number) => {
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
              open={open}
              MenuListProps={{
                'aria-labelledby': 'more-button',
              }}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  historyLogDetails();
                  handleClose();
                  setShowHistoryModal(true);
                }}
                style={{ padding: '10px 20px', textAlign: 'left' }}
              >
                History Log
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate('/userManagement/userCreation/viewUser', {
                    state: { userId: selectedRowData?.row?.id },
                  });
                  handleClose();
                }}
                style={{ padding: '10px 20px', textAlign: 'left' }}
              >
                {' '}
                View User.
              </MenuItem>{' '}
            </StyledMenu>{' '}
          </>
        );
      },
    },
  ];

  const tableHeader = [
    {
      header: 'Version Number',
    },
    {
      header: 'User. Name',
    },
    {
      header: 'Checker Status',
    },
    {
      header: '',
    },
  ];

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
      authorizationModule: 'USER_CREATION',
      page: 0,
      size: pageSizeNo,
    };

    setHistoryLogRowDetail(selectedRowData?.row);
    historyLogDetailsListItem(payload)
      .then((response: any) => {
        if (response.data.result) {
          setHistoryLogdetails(response.data.result.content || []);
          setTotalElement(response.data.result.totalElements);
        } else {
          setHistoryLogdetails([]);
          handleError(response?.data ?? '');
        }
      })
      .catch((err: any) => {
        handleError(err?.response?.data ?? '');
        setHistoryLogdetails([]);
      });
    handleClose();
    setShowHistoryModal(true);
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
  useEffect(() => {
    userID && getHistoryLogListItem();
  }, [userID, pagination]);
  useEffect(() => {
    getLocalStorageID();
  }, []);
  const getLocalStorageID = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      const id = value.id;
      setUserId(id);
    } catch (err) {
      console.log(err);
    }
  };
  const getHistoryLogListItem = () => {
    let payload = {
      userId: userID,
      authorizationModule: 'USER_CREATION',
      page: pagination.pageNumber,
      size: pagination.pageSize,
    } as any;
    historyLog(payload)
      .then((response) => {
        const result = response?.data?.result;
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
  const historyViewMoreAction = (index: any) => {
    let newArrr = historyLogdetails.filter((_: any, indexNum: any) => {
      return index === indexNum;
    });
    navigate('/userManagement/userCreation/historyLogDetail', {
      state: { newArrr: newArrr },
    });
  };
  return (
    <Stack sx={{ backgroundColor: 'white' }}>
      <Stack className="orgStructureHistoryLogContainer">
        <Stack className="orgStructureHistoryLogHeader">
          <ScreenHeader
            title="History Log"
            info="Manage all organisations in the system from here."
            showBackButton={false}
          />
        </Stack>
        <Box>
          <Divider sx={{ paddingY: 2 }} />
        </Box>
        <Stack className="orgStructureHistoryLogTable">
          <ListTable
            column={column}
            data={historyLogItems}
            pagination={{
              ...pagination,
              ...totalCount,
              onPageChange: onPageChange,
              onPageSizeChange: onPageSizeChange,
            }}
          />
        </Stack>
      </Stack>
      {showHistoryModal && (
        <HistoryLogCustomModal
          title={'Organisation Details - History Log'}
          closeBtn={'Close'}
          viewMoreDetails={'view more details'}
          tableHeader={tableHeader}
          openSuccess={showHistoryModal}
          historyLogdetails={historyLogdetails}
          historyLogRowDetail={historyLogRowDetail}
          handleCloseSuccess={closeModal}
          historyViewMoreFun={historyViewMoreAction}
          flag={'UserCreation'}
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
