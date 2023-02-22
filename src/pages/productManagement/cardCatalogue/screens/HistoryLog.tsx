import { Box, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
// import './historyLogStyle.scss';
import ascending_icon from '../../../../assets/icons/ascending.svg';
import descending_icon from '../../../../assets/icons/descending.svg';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { checkTagStatus } from '../../../../utils/tagBasedIndicator/tagStatus';
import { useNavigate } from 'react-router-dom';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import ListTable from '../../../../components/commonComponent/commonListTable/commonListTable';
import HistoryLogCustomModal from '../../../../components/commonComponent/customModal/HistoryLogCustomModal';
import localforage from 'localforage';
import {
  historyLog,
  historyLogDetailsListItem,
} from '../../../../services/programmeManagementServices';
import { styled } from '@mui/material/styles';
import { MenuProps } from '@mui/material/Menu';
import { ConCatArrNames } from '../../../../utils/JoinNames';
import { formatDateTime } from '../../../../utils/DateTimeFormatter';
import ErrorMessage from '../../../../components/commonComponent/ErrorMessage';

export const data = [
  {
    id: 1,
    cardName: 'ETERNA',
    initiatedBy: 'Ashwin',
    dateTime: '20 June 2022, 11:00',
    reviewer: 'Venkatesan',
    status: 'Approved',
  },
  {
    id: 2,
    cardName: 'EXCLUSIVE ICAI ',
    initiatedBy: 'Ashwin',
    dateTime: '20 June 2022, 11:00',
    reviewer: 'Venkatesan',
    status: 'Rejected',
  },
  {
    id: 3,
    cardName: 'EXCLUSIVE ICAI',
    initiatedBy: 'Ashwin',
    dateTime: '20 June 2022, 11:00',
    reviewer: 'Venkatesan',
    status: 'Approved',
  },
];

export const HistoryLog = () => {
  const navigate = useNavigate();
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [userID, setUserId] = useState<string>();
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageNumber: 0,
  });
  const [totalCount, setTotalCount] = useState({
    totaLNoOfRecords: 0,
    totalNoOfPages: 0,
  });
  const [pageSizeNo, setPageSizeNo] = useState(10);
  const [totalElement, setTotalElement] = useState<any>(0);

  const [historyLogItems, setHistoryLogItems] = useState<any>([]);
  const [historyLogRowDetail, setHistoryLogRowDetail] = useState([]);
  const [historyLogdetails, setHistoryLogdetails] = useState<any>([]);
  const [selectedRowData, setSelectedRowData] = useState<any>();
  const open = Boolean(anchorElement);
  const menuOpen = Boolean(anchorElement);
  //Sorting
  const [value, setValue] = React.useState<any>('history');
  const [secondValue, setSecondValue] = React.useState<any>('onBoardDateTime');
  const [threeValue, setThreeValue] = React.useState<any>(null);
  const [fourthValue, setFourthValue] = React.useState<any>(null);
  const [ascending, setAscending] = useState<boolean>(false);
  const [decendingSortingData, setDecendingSortingData] = useState<any>([]);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (decendingSortingData.length > 0) {
      filterData();
    }
  }, [ascending, value, secondValue, threeValue, decendingSortingData]);

  useEffect(() => {
    userID && getHistoryLogListItem();
  }, [userID, pagination]);

  useEffect(() => {
    getLocalStorageID();
  }, []);

  useEffect(() => {
    if (userID) {
      historyLogDetails();
    }
  }, [pageSizeNo]);

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

  const handleClose = () => {
    setAnchorElement(null);
  };
  const handleClick = (
    event: React.MouseEvent<HTMLTableCellElement>,
    row: any,
    index: number
  ) => {
    let value = {
      row: row,
      index: index,
    };
    setSelectedRowData({ ...value });
    setAnchorElement(event.currentTarget);
  };

  const ViewCardClose = () => {
    navigate('/productManagement/cardCatalogue/singleupload', {
      state: {
        type: 'view',
        cardId: selectedRowData?.row?.id,
      },
    });
  };
  const closeModal = () => {
    setShowHistoryModal(false);
    setPageSizeNo(10);
  };
  const historyViewMoreAction = (index: any) => {
    let newArrr = historyLogdetails.filter((_: any, indexNum: any) => {
      return index === indexNum;
    });
    navigate('/productManagement/cardCatalogue/cardCataloguehistoryLog', {
      state: { newArrr: newArrr },
    });
  };
  const tableHeader = [
    {
      header: 'Version Number',
    },
    {
      header: 'Card Name',
    },
    {
      header: 'Checker Status',
    },
    {
      header: '',
    },
  ];

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

  const viewMoreHistory = () => {
    setPageSizeNo(pageSizeNo + 10);
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

  const getHistoryLogListItem = () => {
    let payload = {
      userId: userID,
      authorizationModule: 'CARD_CATALOGUE',
      page: pagination.pageNumber,
      size: pagination.pageSize,
    } as any;
    historyLog(payload)
      .then((response: any) => {
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
      .catch((err: any) => {
        setHistoryLogItems([]);
        setDecendingSortingData([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const historyLogDetails = () => {
    setHistoryLogRowDetail(selectedRowData?.row);
    let payload = {
      id: selectedRowData?.row?.id,
      userId: userID,
      page: 0,
      authorizationModule: 'CARD_CATALOGUE',
      size: pageSizeNo,
    };

    historyLogDetailsListItem(payload)
      .then((response: any) => {
        if (response.data.result) {
          setHistoryLogdetails(response.data.result.content || []);
          setTotalElement(response.data.result.totalElements);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err: any) => {
        setHistoryLogdetails([]);
        handleError(err?.response?.data ?? '');
      });
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
      title: 'Card Name',
      dataIndex: 'cardName',
      key: 'cardName',
      width: '210px',
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
            onClick={() => handleSortByName('history', 'card', 'cardName', '')}
          >
            <>{text}</>
            {threeValue === 'cardName' && (
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
        return <Stack>{row?.history?.card?.cardName ?? ''}</Stack>;
      },
    },
    {
      title: 'Initiated By',
      dataIndex: 'initiatedBy',
      key: 'initiatedBy',
      width: '220px',
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
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      width: '205px',
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
      title: 'Reviewer',
      dataIndex: 'reviewer',
      key: 'reviewer',
      width: '21s0px',
      render: (name: any, row: any, index: number) => {
        return (
          <>
            {row?.approverList?.length > 0 ? (
              <Stack className="info-value">
                {ConCatArrNames(row?.reviewerList) || '-'}
              </Stack>
            ) : (
              <Stack>{'-'}</Stack>
            )}
          </> // todo
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
              // className="boxShadow"
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
                  setShowHistoryModal(true);
                  handleClose();
                }}
                className="menu"
              >
                History Log
              </MenuItem>
              <MenuItem onClick={ViewCardClose} className="menu">
                View Card
              </MenuItem>
            </StyledMenu>
          </>
        );
      },
    },
  ];

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

  return (
    <Stack sx={{ backgroundColor: 'white' }}>
      <Stack className="orgStructureHistoryLogContainer">
        <Stack className="orgStructureHistoryLogHeader">
          <ScreenHeader
            title="View cards and key details"
            showBackButton={false}
          />
        </Stack>
        <Stack
          className="orgStructureHistoryLogTable"
          sx={{ margin: '20px 0' }}
        >
          <ListTable
            column={column}
            data={historyLogItems}
            pagination={{
              ...pagination,
              ...totalCount,
              onPageChange: onPageChange,
              onPageSizeChange: onPageSizeChange,
            }}
            tableHeight="350px"
          />
        </Stack>
      </Stack>
      {showHistoryModal && (
        <HistoryLogCustomModal
          title={'Card for Card Surrogate - History Log'}
          closeBtn={'Close'}
          tableHeader={tableHeader}
          handleCloseSuccess={closeModal}
          openSuccess={showHistoryModal}
          viewMoreDetails={'view more details'}
          historyViewMoreFun={historyViewMoreAction}
          historyLogdetails={historyLogdetails}
          historyLogRowDetail={historyLogRowDetail}
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
