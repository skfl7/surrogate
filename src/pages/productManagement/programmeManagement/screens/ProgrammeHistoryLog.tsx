import { IconButton, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ascending_icon from '../../../../assets/icons/ascending.svg';
import descending_icon from '../../../../assets/icons/descending.svg';
import { checkTagStatus } from '../../../../utils/tagBasedIndicator/tagStatus';
import { Link, useNavigate } from 'react-router-dom';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import ListTable from '../../../../components/commonComponent/commonListTable/commonListTable';
import HistoryLogCustomModal from '../../../../components/commonComponent/customModal/HistoryLogCustomModal';
import {
  historyLog,
  historyLogDetailsListItem,
} from '../../../../services/programmeManagementServices';
import localforage from 'localforage';
import { ConCatArrNames } from '../../../../utils/JoinNames';
import ErrorMessage from '../../../../components/commonComponent/ErrorMessage';
import { formatDateTime } from '../../../../utils/DateTimeFormatter';
import { getPermission } from '../../../../utils/ActionAllowed/UserActionAllowed';

export const ProgrammeHistoryLog = () => {
  const navigate = useNavigate();
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historyLogItems, setHistoryLogItems] = useState<any>([]);
  const [userID, setUserId] = useState<string>();
  const [historyLogdetails, setHistoryLogdetails] = useState<any>([]);
  const [historyLogRowDetail, setHistoryLogRowDetail] = useState([]);
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
  const [selectedRowData, setSelectedRowData] = useState<any>();

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
  const [actionAllowedItem, setActionAllowedItem] = useState([]);

  useEffect(() => {
    if (decendingSortingData.length > 0) {
      filterData();
    }
  }, [ascending, value, secondValue, threeValue, decendingSortingData]);

  useEffect(() => {
    getLocalStorageID();
  }, []);

  useEffect(() => {
    userID && getHistoryLogListItem();
  }, [userID, pagination]);

  useEffect(() => {
    if (userID) {
      selectedRowData?.row?.id && historyLogDetails();
    }
  }, [pageSizeNo, selectedRowData]);

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
      });
    } else
      setPagination({
        ...pagination,
        pageSize: size,
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
      setActionAllowedItem(value?.actionsAllowed);
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
      authorizationModule: 'PROGRAM_MANAGEMENT',
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
        handleError(err?.response?.data ?? '');
        setHistoryLogItems([]);
        setDecendingSortingData([]);
      });
  };

  const historyLogDetails = () => {
    let payload = {
      id: selectedRowData?.row?.id,
      userId: userID,
      page: 0,
      authorizationModule: 'PROGRAM_MANAGEMENT',
      size: pageSizeNo,
    };

    setHistoryLogRowDetail(selectedRowData?.row);
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
        handleError(err?.response?.data ?? '');
        setHistoryLogdetails([]);
      });
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
    setShowHistoryModal(true);
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

  const closeModal = () => {
    setShowHistoryModal(false);
    setPageSizeNo(10);
  };

  const historyViewMoreAction = (index: any) => {
    let newArrr = historyLogdetails.filter((_: any, indexNum: any) => {
      return index === indexNum;
    });
    navigate('/productManagement/programmeManagement/ProgrammeHistoryDetails', {
      state: { newArrr: newArrr, historyLogRowDetail: historyLogRowDetail },
    });
  };

  const tableHeader = [
    {
      header: 'Version Number',
    },
    {
      header: 'Surrogate Name',
    },
    {
      header: 'Checker Status',
    },
    {
      header: '',
    },
  ];

  const column = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '70px',
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ textAlign: 'center' }}>
            {' '}
            {pagination.pageNumber * pagination.pageSize + (index + 1)}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return <Stack sx={{ textAlign: 'center' }}>{text}</Stack>;
      },
    },
    {
      title: 'Surrogate',
      dataIndex: 'orgName',
      key: 'orgName',
      width: '100px',
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
              handleSortByName('history', 'program', 'programType', '')
            }
          >
            <>{text}</>
            {threeValue === 'programType' && (
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
        return <Stack>{row?.history?.program?.programType ?? ''}</Stack>;
      },
    },
    {
      title: 'Request',
      dataIndex: 'request',
      key: 'request',
      width: '160px',
      render: (name: any, row: any, index: number) => {
        return <Stack>{row?.history?.program?.programStatus ?? ''}</Stack>;
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
              handleSortByName('history', 'program', 'programStatus', '')
            }
          >
            <>{text}</>
            {threeValue === 'programStatus' && (
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
      title: 'Request Initiated',
      dataIndex: 'reviewer',
      key: 'reviewer',
      width: '130px',
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
      dataIndex: 'lastModifiedDateTime',
      key: 'lastModifiedDateTime',
      width: '180px',
      render: (name: any, row: any, index: number) => {
        return (
          <Stack>
            {formatDateTime(row?.history?.lastModifiedDateTime ?? '')}
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
      title: 'Reviewer',
      dataIndex: 'requestInitiated',
      key: 'requestInitiated',
      width: '130px',
      render: (name: any, row: any, index: number) => {
        return (
          <>
            {row?.history?.reviewerList?.length > 0 ? (
              <Stack>{ConCatArrNames(row?.reviewerList) || '-'}</Stack>
            ) : (
              <Stack>{'-'}</Stack>
            )}
          </>
        );
      },
    },
    {
      title: 'Approver',
      dataIndex: 'approverList',
      key: 'approverList',
      width: '160px',
      render: (name: any, row: any, index: number) => {
        return (
          <>
            {row?.history?.approverList?.length > 0 ? (
              <Stack>{ConCatArrNames(row?.approverList) || '-'}</Stack>
            ) : (
              <Stack>{'-'}</Stack>
            )}
          </>
        );
      },
    },

    {
      title: 'Request Status',
      dataIndex: 'authorizationStatus',
      key: 'authorizationStatus',
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
      title: 'Action',
      dataIndex: 'status',
      key: 'status',
      width: '80px',
      render: (text: string, row: any, index: number) => {
        return (
          <Stack onClick={(e: any) => handleClick(e, row, index)}>
            <Link
              to={''}
              style={{ color: ' #0662B7', fontWeight: '500', fontSize: '14px' }}
            >
              View
            </Link>
          </Stack>
        );
      },
    },
  ];

  return (
    <Stack sx={{ backgroundColor: 'white' }}>
      <Stack className="orgStructureHistoryLogContainer">
        <Stack className="orgStructureHistoryLogHeader">
          <ScreenHeader
            title="Various Programs and history"
            info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo dolor."
            showBackButton={false}
          />
        </Stack>
        {getPermission(
          actionAllowedItem,
          'PRODUCT_MANAGEMENT',
          'PROGRAM_MANAGEMENT',
          'VIEW_PROGRAM_MANAGEMENT'
        ) && (
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
            />
          </Stack>
        )}
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
