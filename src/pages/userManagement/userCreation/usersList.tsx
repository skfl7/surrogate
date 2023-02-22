/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Grid,
  TextField,
  Typography,
  InputBase,
  Checkbox,
  IconButton,
  Autocomplete,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ScreenHeader } from '../../../components/commonComponent/ScreenHeader/ScreenHeader';
import SearchIcon from '@mui/icons-material/Search';
import ActionModal from '../../../components/commonComponent/customModal/CustomModal';
// import SuccessModal from '../../../components/commonComponent/customModal/CustomModal';
import HeaderWithInfo from '../../../components/commonComponent/HeaderWithInfo';
import BtnContained from '../../../components/commonComponent/CustomText/Button/Contained';
import BtnOutlined from '../../../components/commonComponent/CustomText/Button/Outlined';
import CustomIconButton from '../../../components/commonComponent/CustomIconButton';
import ListTable from '../../../components/commonComponent/commonListTable/commonListTable';
import GroupButton from '../../../components/commonComponent/GroupButton/GroupButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ascending_icon from '../../../assets/icons/ascending.svg';
import descending_icon from '../../../assets/icons/descending.svg';
import InActiveIcon from '../../../assets/images/userIcon.svg';
import ActiveIcon from '../../../assets/images/enabledDeactiveUser.svg';
import DeactiveIcon from '../../../assets/images/enableDeactive.svg';
import DeactiveUser from '../../../assets/images/InactiveDeactivate.svg';
import { checkTagStatus } from '../../../utils/tagBasedIndicator/tagStatus';
import Popover from '../../../components/commonComponent/Popover';
import './style.scss';
import {
  getBranchList,
  getDistrictList,
  getReportingHeadList,
  getStateList,
  getUserCreationDetails,
  getUserCreationList,
  getZoneList,
  updateStatusOfUserCreation,
} from '../../../services/userCreationServices';
import { json, useLoaderData } from 'react-router-dom';
import { getCamelCaseFeatureName } from '../../../utils/getCamelcaseFeatureName';
import {
  branchTypes,
  districtTypes,
  stateTypes,
  zoneTypes,
} from '../../productManagement/cardCatalogue/card.const';
import Multiselector from '../../../components/commonComponent/MultiSelectNew';
import localforage from 'localforage';
import ErrorMessage from '../../../components/commonComponent/ErrorMessage';
import EmptyTablePlaceholder from '../../../components/commonComponent/EmptyTablePlaceholder';
import { formatDateTime } from '../../../utils/DateTimeFormatter';
import { getPermission } from '../../../utils/ActionAllowed/UserActionAllowed';

// Component Loader

export async function userCreationLoader() {
  // get state filter dropdown
  const temp = stateTypes.map(async (type: any) => {
    if (type.displayOrder === 1) {
      const payload = {
        name: '',
      };
      const result = (await getStateData(payload)) as any;
      return {
        name: type.name,
        options: result.options ? result.options : result.error,
        payloadKey: getCamelCaseFeatureName(type.name.toLowerCase()),
        selectedValues: ['All'],
        label: type.label,
        displayOrder: type.displayOrder,
      };
    }
  });

  const cardListFilters = await Promise.all(temp);

  return json(
    {
      cardListFilters,
    },
    { status: 200 }
  );
}

// API methods

const getStateData = async (payload: any) => {
  let res = {};
  await getStateList(payload)
    .then((response) => {
      const result = response.data?.result;
      const stateData = result?.map((item: any) => ({
        value: item.stateName,
        title: item.stateName,
        id: item.id,
      }));
      res = {
        options: [
          { value: 'All', title: 'All', id: 0, children: [...stateData] },
        ],
      };
    })
    .catch((err) => {
      res = { error: err?.response?.data };
    });
  return res;
};

const getReportingHeadData = async (payload: any) => {
  let res = {};
  await getReportingHeadList(payload)
    .then((response) => {
      res = response.data ? response.data : {};
    })
    .catch((err) => {
      res = { error: err?.response?.data };
    });
  return res;
};

function UserCreationTab() {
  const loaderData = useLoaderData() as any;
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>({});
  const [isActionModalOpen, setActionModalOpen] = useState(false);
  const [isDeactivatenModalOpen, setDeactivateModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isDeactivateSuccessModalOpen, setDeactivateSuccessModalOpen] =
    useState(false);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [ascending, setAscending] = useState<boolean>(false);
  const [sortingData, setSortingData] = useState<any>([]);
  const [decendingSortingData, setDecendingSortingData] = useState<any>([]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [isAddUserPopoverOpen, setIsAddUserPopoverOpen] =
    React.useState<HTMLButtonElement | null>(null);
  const [viewId, setViewId] = React.useState('');
  const [recordStatus, setRecordStatus] = React.useState('ACTIVE');
  const [reportingHeadData, setReportingHeadData] = useState<any>([]);
  const [stateFilters, setStateFilters] = useState(loaderData.cardListFilters);
  const [zoneFilters, setZoneFilters] = useState<any>();
  const [districtFilters, setDistrictFilters] = useState<any>();
  const [branchFilters, setBranchFilters] = useState<any>();
  const [reportingHeadValue, setReportingHeadValue] = useState<any>('');
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 0,
  });
  const [totalCount, setTotalCount] = useState({
    totaLNoOfRecords: 0,
    totalNoOfPages: 0,
  });

  const [userStatusValue, setUserStatusValue] = useState<any>('');
  const [activateCheckbox, setActivateCheckbox] = useState<any>([]);
  const [deactivateCheckbox, setDeactivateCheckbox] = useState<any>([]);
  const [dropdownReset, setDropDownReset] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [apiError, setApiError] = useState('');
  const [stateData, setStateData] = useState<any>('-');

  const [branchData, setBranchData] = useState<any>('-');
  const [organizationID, setorganizationId] = useState();
  const [userID, setUserId] = useState<string>();
  const [modalDesc, setModalDesc] = useState('');
  const [actionAllowedItem, setActionAllowedItem] = useState([]);
  const column1: any = [
    {
      title: '#',
      width: '70px',
      render: (text: string) => {
        return <Stack>{text}</Stack>;
      },
    },
    {
      title: 'Employee ID',
    },
    {
      title: 'Name',
    },
    { title: 'Mobile Number' },
    { title: 'Email ID' },
    { title: 'State' },
    { title: 'Reporting Head' },
    { title: 'User Role' },
    { title: 'Branch' },
    { title: 'Designation' },
  ];

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const openAddUserPopover = Boolean(isAddUserPopoverOpen);
  const addNewUserid = openAddUserPopover ? 'simple-popover' : undefined;
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const getData = setTimeout(() => {
      fetchUserCreationList();
    }, 500);

    return () => clearTimeout(getData);
  }, [searchValue]);

  // sorting
  const [value, setValue] = React.useState<any>('lastModifiedDateTime');
  const [secondValue, setSecondValue] = React.useState<any>(null);
  const [threeValue, setThreeValue] = React.useState<any>(null);

  const getListOfCards = async (payload: any) => {
    let res = {};
    await getUserCreationList(payload)
      .then((response) => {
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        res = { error: err?.response?.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const getZoneData = async (payload: any) => {
    let res = {};
    await getZoneList(payload)
      .then((response) => {
        const result = response.data?.result;
        if (result) {
          const zoneData = result?.map((item: any) => ({
            value: item.zoneName,
            title: item.zoneName,
            id: item.zoneId,
          }));
          res = {
            options: [
              { value: 'All', title: 'All', id: 0, children: [...zoneData] },
            ],
          };
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        res = { error: err?.response?.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const getDistrictData = async (payload: any) => {
    let res = {};
    await getDistrictList(payload)
      .then((response) => {
        const result = response.data?.result;
        if (result) {
          const districtData = result?.map((item: any) => ({
            value: item.cityName,
            title: item.cityName,
            id: item.id,
          }));
          res = {
            options: [
              {
                value: 'All',
                title: 'All',
                id: 0,
                children: [...districtData],
              },
            ],
          };
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        console.log(err);
        res = { error: err?.response?.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const getBranchData = async (payload: any) => {
    let res = {};
    await getBranchList(payload)
      .then((response) => {
        const result = response.data?.result;
        if (result) {
          const districtData = result?.map((item: any) => ({
            value: item.branchName,
            title: item.branchName,
            id: item.branchId,
          }));
          res = {
            options: [
              {
                value: 'All',
                title: 'All',
                id: 0,
                children: [...districtData],
              },
            ],
          };
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        console.log(err);
        res = { error: err?.response?.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const zoneLoader = async () => {
    // get zone filter dropdown
    const temp = zoneTypes.map(async (type: any) => {
      const payload = {
        zoneName: '',
        organizationId: organizationID, //'63a9d377b7df547d20a0b6ed',
      };
      const result = (await getZoneData(payload)) as any;
      return {
        name: type.name,
        options: result.options ? result.options : result.error,
        payloadKey: getCamelCaseFeatureName(type.name.toLowerCase()),
        selectedValues: ['All'],
        label: type.label,
        displayOrder: type.displayOrder,
      };
    });
    return Promise.all(temp);
  };

  const districtLoader = async () => {
    // get district filter dropdown
    let resData = [] as any;
    await stateFilters?.forEach((filter: any) => {
      if (!filter.selectedValues.includes('All')) {
        filter.selectedValues.map((item: any) => {
          filter.options[0].children.map((item2: any) => {
            if (item === item2.value) {
              resData.push(item2.id);
            }
          });
        });
      }
    });
    const temp = districtTypes.map(async (type: any) => {
      const payload = {
        name: '',
        stateId: resData,
      };
      const result = (await getDistrictData(payload)) as any;
      return {
        name: type.name,
        options: result.options ? result.options : result.error,
        payloadKey: getCamelCaseFeatureName(type.name.toLowerCase()),
        selectedValues: ['All'],
        label: type.label,
        displayOrder: type.displayOrder,
      };
    });

    return Promise.all(temp);
  };

  const branchLoader = async () => {
    // get branch filter dropdown
    const temp = branchTypes.map(async (type: any) => {
      const payload = {
        organizationId: organizationID, //'63a9d377b7df547d20a0b6ed',
        branchName: '',
      };
      const result = (await getBranchData(payload)) as any;
      return {
        name: type.name,
        options: result.options ? result.options : result.error,
        payloadKey: getCamelCaseFeatureName(type.name.toLowerCase()),
        selectedValues: ['All'],
        label: type.label,
        displayOrder: type.displayOrder,
      };
    });
    return Promise.all(temp);
  };

  useEffect(() => {
    getLocalStorageValue();
  }, []);

  useEffect(() => {
    organizationID && getHeadData();
    organizationID && getZoneAndBranchData();
  }, [organizationID]);

  const getHeadData = async () => {
    const payload = {
      name: '',
      organizationId: organizationID, //'63a9d377b7df547d20a0b6ed',
    } as any;
    const result = await getReportingHeadData(payload);
    setReportingHeadData(result);
  };

  const getLocalStorageValue = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setUserId(value?.id);
      setorganizationId(value?.organization.id);
      setActionAllowedItem(value?.actionsAllowed);
    } catch (err) {
      console.log(err);
    }
  };
  // console.log('state', state);
  // useEffect(() => {
  //   if (state) {
  //     setIsFiltered(state);
  //   }
  // }, [state]);

  const userListMoreMenu = [
    {
      label: 'View',
      routePath: '/userManagement/userCreation/viewUser',
      params: { state: { userId: viewId } },
      isPermission: getPermission(
        actionAllowedItem,
        'USER_MANAGEMENT',
        'USER_CREATION',
        'VIEW_USERS'
      ),
    },
    {
      label: 'Edit',
      routePath: '/userManagement/userCreation/createUser',
      params: {
        state: {
          userData: selectedRecord,
          isEdit: true,
          isFromList: true,
          selectedUserID: viewId,
        },
      },
      isPermission: getPermission(
        actionAllowedItem,
        'USER_MANAGEMENT',
        'USER_CREATION',
        'VIEW_USERS'
      ),
    },
    {
      label: 'Activate User',
      routePath: '',
      disabled: recordStatus === 'ACTIVE' ? true : false,
      isPermission: true,
    },
    {
      label: 'Deactivate User',
      routePath: '',
      disabled: recordStatus === 'DEACTIVATE' ? true : false,
      isPermission: true,
    },
  ];

  const column = [
    {
      title: '',
      dataIndex: 'id',
      key: 'checkBox',
      width: '60px',
      headerRender: () => {
        return (
          <Checkbox
            color={'secondary'}
            sx={{
              color: '#A8A8A9',
            }}
            style={{
              transform: 'scale(1.2)',
            }}
            indeterminate={
              selected?.length > 0 && selected?.length < sortingData?.length
            }
            checked={
              sortingData?.length > 0 &&
              selected?.length === sortingData?.length
            }
            onChange={handleSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        );
      },
      render: (_: string, row: any, index: number) => {
        const isItemSelected = isSelected(row.id);

        const labelId = `enhanced-table-checkbox-${index}`;
        return (
          <Checkbox
            color={'secondary'}
            sx={{
              color: '#A8A8A9',
            }}
            style={{
              transform: 'scale(1.2)',
            }}
            checked={isItemSelected}
            inputProps={{
              'aria-labelledby': labelId,
            }}
            onChange={() => handleClickCheckbox(row?.id, row?.userStatus)}
          />
        );
      },
    },
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '40px',
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {pagination.pageNumber * pagination.pageSize + index + 1}
          </Stack>
        );
      },
    },
    {
      title: 'Employee ID',
      dataIndex: 'id',
      key: 'id',
      width: '230px',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('id', '', '')}
          >
            <>{text}</>
            {value === 'id' && (
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
          </Stack>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'personalDetails',
      key: 'personalDetails',
      width: '200px',
      render: (_: string, row: any, index: number) => {
        return <Stack>{row?.personalDetails?.employeeName ?? '-'}</Stack>;
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleSortByName('personalDetails', 'employeeName', '')
            }
          >
            <>{text}</>
            {secondValue === 'employeeName' && (
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
          </Stack>
        );
      },
    },
    {
      title: 'Mobile Number',
      dataIndex: 'personalDetails',
      key: 'personalDetails',
      width: '120px',
      render: (_: string, row: any, index: number) => {
        return <Stack>{row?.personalDetails?.mobileNumber ?? '-'}</Stack>;
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleSortByName('personalDetails', 'mobileNumber', '')
            }
          >
            <>{text}</>
            {secondValue === 'mobileNumber' && (
              <IconButton
                sx={{ height: '12px', width: '12px', marginLeft: '10px' }}
              >
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
      title: 'Email ID',
      dataIndex: 'personalDetails',
      key: 'personalDetails',
      width: '240px',
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ width: '220px', display: 'block' }}>
            {row?.personalDetails?.email ?? '-'}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('personalDetails', 'email', '')}
          >
            <>{text}</>
            {secondValue === 'email' && (
              <IconButton
                sx={{ height: '12px', width: '12px', marginLeft: '10px' }}
              >
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
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ width: '200px' }}>
            {row?.lastModifiedDateTime !== null
              ? formatDateTime(row?.lastModifiedDateTime)
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
              justifyContent: 'flex-start',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('lastModifiedDateTime', '', '')}
          >
            <>{text}</>
            {value === 'lastModifiedDateTime' && (
              <IconButton
                sx={{ height: '12px', width: '12px', marginLeft: '10px' }}
              >
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
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      width: '150x',
      render: (_: string, row: any, index: number) => {
        let stateDataValue = row?.state?.map((val: any) => {
          return val.stateName;
        });
        if (stateDataValue?.length > 0) setStateData(stateDataValue.join(','));
        return (
          <Stack>
            {row?.state?.length > 0 ? row?.state[0]?.stateName : '-'}
          </Stack>
        );
      }, // todo,
    },
    // {
    //   title: 'Zonal',
    //   dataIndex: 'state',
    //   key: 'state',
    //   render: (_: string, row: any, index: number) => {
    //     let zoneDataValue = row?.zone?.map((val: any) => {
    //       return val.zoneName;
    //     })
    //     if(zoneDataValue?.length > 0)
    //     setZoneData(zoneDataValue.join(','));
    //     return <Stack>{zoneData ?? '-'}</Stack>;
    //   },
    // },
    {
      title: 'Reporting Head',
      dataIndex: 'reportingTo',
      key: 'reportingTo',
      width: '220px',
      render: (_: string, row: any, index: number) => {
        return row?.reportingTo?.personalDetails?.employeeName ? (
          <Stack>
            {row?.reportingTo?.personalDetails?.employeeName ?? '-'}
          </Stack>
        ) : (
          <Stack>{'-'}</Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('reportingTo', 'reportingTo', '')}
          >
            <>{text}</>
            {secondValue === 'reportingTo' && (
              <IconButton
                sx={{ height: '12px', width: '12px', marginLeft: '10px' }}
              >
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
      title: 'User Role',
      dataIndex: 'roleType',
      key: 'roleType',
      width: '200px',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('roleType', '', '')}
          >
            <>{text}</>
            {value === 'roleType' && (
              <IconButton
                sx={{ height: '12px', width: '12px', marginLeft: '10px' }}
              >
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
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      width: '160px',
      render: (_: string, row: any, index: number) => {
        let branchDataValue = row?.branch?.map((val: any) => {
          return val.branchName;
        });
        if (branchDataValue?.length > 0)
          setBranchData(branchDataValue.join(','));
        return <Stack>{branchData ?? '-'}</Stack>;
      },
    },
    {
      title: 'Designation',
      dataIndex: 'employeeDetails',
      key: 'employeeDetails',
      width: '180px',
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ width: '180px', display: 'block' }}>
            {row?.employeeDetails?.designation ?? '-'}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleSortByName('employeeDetails', 'designation', '')
            }
          >
            <>{text}</>
            {secondValue === 'designation' && (
              <IconButton
                sx={{ height: '12px', width: '12px', marginLeft: '10px' }}
              >
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
      title: 'Status',
      dataIndex: 'userStatus',
      key: 'userStatus',
      width: '130px',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('userStatus', '', '')}
          >
            <>{text}</>
            {value === 'userStatus' && (
              <IconButton
                sx={{ height: '12px', width: '12px', marginLeft: '10px' }}
              >
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
      render: (text: string) => {
        return (
          <Stack
            sx={{
              color: text ? checkTagStatus(text).color : '',
              textTransform: 'capitalize !important',
            }}
          >
            {text ? text : '-'}
          </Stack>
        );
      },
    },
    {
      title: 'More',
      dataIndex: 'id',
      key: 'more',
      width: '70px',
      render: (_: string, row: any, index: number) => {
        return (
          <Stack className="more-btn">
            <MoreVertIcon
              onClick={async (event: any) => {
                setViewId(row?.id);
                setRecordStatus(row?.userStatus);
                handleClick(event);
                const payload = {
                  userId: row?.id, // '63b523bb7c41e0e3521a0fc7', // todo need to remove it row?.id,
                } as any;
                const result = await getDetailofUserItem(payload);
                console.log('result', result);

                if (result?.result) {
                  setSelectedRecord(result?.result);
                } else {
                  setSelectedRecord(row);
                }
              }}
            />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              handleClose={handleClose}
              options={userListMoreMenu}
              openActionModal={() => openActionModal(row)}
            />
          </Stack>
        );
      },
    },
  ];

  const getDetailofUserItem = async (payload: any) => {
    let res = {} as any;
    await getUserCreationDetails(payload)
      .then((response) => {
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const handleError = (err: any) => {
    if (err?.exception?.fieldErrors) {
      const missingFields = err?.exception.fieldErrors?.map(
        (field: string) => `${field}, `
      );
      setApiError(missingFields);
      setModalDesc(missingFields);
    } else if (err?.exception?.shortMessage) {
      setApiError(err?.exception?.shortMessage);
      setModalDesc(err?.exception?.shortMessage);
    } else if (err?.error) {
      setApiError(err?.error + ' ' + err?.path);
      setModalDesc(err?.error + ' ' + err?.path);
    } else {
      setApiError('Something went wrong!');
      setModalDesc('Something went wrong!');
    }
  };

  const GroupButtonData = [
    {
      title: 'All',
    },
    {
      title: 'Active',
    },
    {
      title: 'Deactivated',
    },
  ];

  const customIconBtns = [
    {
      label: 'Activate User',
      inActiveIcon: InActiveIcon,
      activeIcon: ActiveIcon,
      isDisabled: activateCheckbox.length > 0 ? false : true,
    },
    {
      label: 'Deactivate User',
      inActiveIcon: DeactiveUser,
      activeIcon: DeactiveIcon,
      isDisabled: deactivateCheckbox.length > 0 ? false : true,
    },
  ];

  const createUserMenu = [
    {
      label: 'Single User Upload',
      routePath: '/userManagement/userCreation/createUser',
      params: {
        state: {
          userData: {},
          isEdit: false,
          isFromList: false,
          isFiltered: isFiltered,
        },
      },
      isPermission: getPermission(
        actionAllowedItem,
        'USER_MANAGEMENT',
        'USER_CREATION',
        'CREATE_USERS'
      ),
    },
    {
      label: 'Bulk User Upload',
      routePath: '/userManagement/userCreation/bulkUpload',
      params: isFiltered,
      isPermission: getPermission(
        actionAllowedItem,
        'USER_MANAGEMENT',
        'USER_CREATION',
        'BULK_UPLOAD_USER'
      ),
    },
  ];

  useEffect(() => {
    if (decendingSortingData.length > 0) {
      filterData();
    }
  }, [ascending, decendingSortingData]);

  const handleOpenAddUserPopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setIsAddUserPopoverOpen(event.currentTarget);
  };

  const closeAddUserPopover = () => {
    setIsAddUserPopoverOpen(null);
  };

  const filterData = () => {
    const sort = decendingSortingData.sort((a: any, b: any) => {
      if (ascending) {
        if (threeValue) {
          const first = a?.[value]?.[secondValue]?.[threeValue] ?? '';
          const second = b?.[value]?.[secondValue]?.[threeValue] ?? '';
          return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
        }
        if (secondValue) {
          const first = a?.[value]?.[secondValue] ?? '';
          const second = b?.[value]?.[secondValue] ?? '';
          return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
        }
        const first = a?.[value] ?? '';
        const second = b?.[value] ?? '';
        return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
      }
      if (threeValue) {
        const first = a?.[value]?.[secondValue]?.[threeValue] ?? '';
        const second = b?.[value]?.[secondValue]?.[threeValue] ?? '';
        return first.toLowerCase() > second.toLowerCase() ? -1 : 1;
      }
      if (secondValue) {
        const first = a?.[value]?.[secondValue] ?? '';
        const second = b?.[value]?.[secondValue] ?? '';
        return first.toLowerCase() > second.toLowerCase() ? -1 : 1;
      }
      const first = a?.[value] ?? '';
      const second = b?.[value] ?? '';
      return first.toLowerCase() > second.toLowerCase() ? -1 : 1;
    });
    setSortingData([...sort]);
  };

  useEffect(() => {
    filterData();
  }, [ascending, value, secondValue, threeValue]);

  const handleSortByName = (
    name: string,
    secondItem: string,
    threeItem: string
  ) => {
    const secondState = secondItem === '' ? null : secondItem;
    const threeState = threeItem === '' ? null : threeItem;

    if (
      value !== name ||
      secondValue !== secondState ||
      threeValue !== threeState
    ) {
      setAscending(true);
    } else {
      setAscending(!ascending);
    }

    setValue(name);
    setSecondValue(secondState);
    setThreeValue(threeState);
  };

  const handleDeactivateSubmit = async () => {
    let res = [] as any;
    if (activateCheckbox.length > 0) {
      res = activateCheckbox;
    } else {
      res.push(viewId);
    }
    const payload = {
      userId: res,
      userStatus: 'ACTIVE',
      actionUserId: userID,
    } as any;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await updateDeactiveStatusofData(payload);
  };

  const updateDeactiveStatusofData = async (payload: any) => {
    let res = {} as any;
    await updateStatusOfUserCreation(payload)
      .then((response) => {
        setDeactivateModalOpen(false);
        setSuccessModalOpen(true);
        setActivateCheckbox([]);
        setDeactivateCheckbox([]);
        setSelected([]);
        if (response.data.exception) {
          handleError(response?.data ?? '');
        } else {
          setModalDesc(
            'Your request for activating user is successfully sent to the Reviewer.'
          );
        }
      })
      .catch((err) => {
        setDeactivateModalOpen(false);
        console.log(err);
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const handleSubmit = async () => {
    let res = [] as any;
    if (deactivateCheckbox.length > 0) {
      res = deactivateCheckbox;
    } else {
      res.push(viewId);
    }
    const payload = {
      userId: res,
      userStatus: 'DEACTIVATE',
      actionUserId: userID,
    } as any;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await updateActiveStatusofData(payload);
  };

  const updateActiveStatusofData = async (payload: any) => {
    let res = {} as any;
    await updateStatusOfUserCreation(payload)
      .then((response) => {
        setActionModalOpen(false);
        setDeactivateSuccessModalOpen(true);
        setActivateCheckbox([]);
        setDeactivateCheckbox([]);
        setSelected([]);
        if (response.data.exception) {
          handleError(response?.data ?? '');
        } else {
          setModalDesc(
            'Your request for deactivating user is successfully sent to the Reviewer.'
          );
        }
      })
      .catch((err) => {
        console.log(err);
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const showSuceesModal = () => {
    setAnchorEl(null);
    setSuccessModalOpen(false);
  };

  const showDeactivateSuceesModal = () => {
    setAnchorEl(null);
    setDeactivateSuccessModalOpen(false);
  };

  const openActionModal = (record: any) => {
    setSelectedRecord(record);
    if (recordStatus === 'ACTIVE') {
      setActionModalOpen(true);
    } else if (recordStatus === 'DEACTIVATE') {
      setDeactivateModalOpen(true);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = sortingData.map((n: any) => {
        if (n.userStatus === 'ACTIVE') {
          deactivateCheckbox.push(n.id);
        } else if (n.userStatus === 'DEACTIVATE') {
          activateCheckbox.push(n.id);
        } else {
          deactivateCheckbox.push(n.id);
          activateCheckbox.push(n.id);
        }
        return n.id;
      });
      setSelected(newSelected);
      return;
    }
    setActivateCheckbox([]);
    setDeactivateCheckbox([]);
    setSelected([]);
  };

  const isSelected = (id: number) => {
    const res = selected.indexOf(id);
    if ((res && res !== -1) || res === 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleClickCheckbox = (id: number, userStatus: string) => {
    const result = isSelected(id);
    let selectedData = selected;
    if (result) {
      if (userStatus === 'ACTIVE') {
        const index = deactivateCheckbox.indexOf(id);
        deactivateCheckbox.splice(index, 1);
        setDeactivateCheckbox([...deactivateCheckbox]);
      } else if (userStatus === 'DEACTIVATE') {
        const index = activateCheckbox.indexOf(id);
        activateCheckbox.splice(index, 1);
        setActivateCheckbox([...activateCheckbox]);
      } else {
        // to do
        const index = deactivateCheckbox.indexOf(id);
        deactivateCheckbox.splice(index, 1);
        setDeactivateCheckbox([...deactivateCheckbox]);
        const index2 = activateCheckbox.indexOf(id);
        activateCheckbox.splice(index2, 1);
        setActivateCheckbox([...activateCheckbox]);
      }
      const index = selected.indexOf(id);
      selectedData.splice(index, 1);
      setSelected([...selectedData]);
    } else {
      if (userStatus === 'ACTIVE') {
        setDeactivateCheckbox([...deactivateCheckbox, id]);
      } else if (userStatus === 'DEACTIVATE') {
        setActivateCheckbox([...activateCheckbox, id]);
      } else {
        setDeactivateCheckbox([...deactivateCheckbox, id]);
        setActivateCheckbox([...activateCheckbox, id]);
      }
      setSelected([...selectedData, id]);
    }
  };

  // const handleReset = () => {
  //   setResetData(!resetData);
  // };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickButton = (eachBtn: any) => {
    if (eachBtn.label === 'Deactivate User') {
      setActionModalOpen(true);
    } else if (eachBtn.label === 'Activate User') {
      setDeactivateModalOpen(true);
    }
  };
  const [reset, setReset] = useState(false);
  const resetFun = () => {
    setToggleState(!toggleState);
    setDropDownReset(true);
    setIsFiltered(false); //Need to check with Ridhima
    setReportingHeadValue('');
    setPagination({
      pageSize: 10,
      pageNumber: 0,
    });
    localStorage.setItem('userCreationTable', JSON.stringify(false));
    let dropdownFilters = [...stateFilters];
    dropdownFilters = dropdownFilters.map((filter: any) => {
      filter.selectedValues = ['All'];
      return filter;
    });
    setStateFilters(dropdownFilters);
    let zoneDropdownFilters = [...zoneFilters];
    zoneDropdownFilters = zoneDropdownFilters.map((filter: any) => {
      filter.selectedValues = ['All'];
      return filter;
    });
    setZoneFilters(zoneDropdownFilters);
    if (districtFilters) {
      let districtDropdownFilters = [...districtFilters];
      districtDropdownFilters = districtDropdownFilters.map((filter: any) => {
        filter.selectedValues = ['All'];
        return filter;
      });
      setDistrictFilters(districtDropdownFilters);
    }
    let branchDropdownFilters = [...branchFilters];
    branchDropdownFilters = branchDropdownFilters.map((filter: any) => {
      filter.selectedValues = ['All'];
      return filter;
    });
    setBranchFilters(branchDropdownFilters);
    setReset(!reset);
    // setIsFiltered(false);
  };

  useEffect(() => {
    const showTable = localStorage.getItem('userCreationTable');
    if (showTable === 'true') {
      setIsFiltered(true);
    } else setIsFiltered(false);
  }, [localStorage.getItem('userCreationTable')]);

  const searchFun = () => {
    setIsFiltered(true);
    localStorage.setItem('userCreationTable', JSON.stringify(true));
  };

  const setSelectedDropdownValue = async (
    selectedValues: Array<string>,
    selectedDropdown: any
  ) => {
    let dropdownFilters = [...stateFilters];
    dropdownFilters = await dropdownFilters.map((filter: any) => {
      if (filter.name === selectedDropdown.name) {
        filter.selectedValues = selectedValues;
      }
      return filter;
    });
    setStateFilters(dropdownFilters);

    await stateFilters?.forEach(async (filter: any) => {
      if (!filter.selectedValues.includes('All')) {
        setDistrictFilters([]);
        const districtValue = await districtLoader(); //city
        setDistrictFilters(districtValue); //city
      }
    });
  };

  const setZoneSelectedDropdownValue = async (
    selectedValues: Array<string>,
    selectedDropdown: any
  ) => {
    let dropdownFilters = [...zoneFilters];
    dropdownFilters = dropdownFilters.map((filter: any) => {
      if (filter.name === selectedDropdown.name) {
        filter.selectedValues = selectedValues;
      }
      return filter;
    });
    setZoneFilters(dropdownFilters);
  };

  const setDistrictSelectedDropdownValue = async (
    selectedValues: Array<string>,
    selectedDropdown: any
  ) => {
    let dropdownFilters = [...districtFilters];
    dropdownFilters = dropdownFilters.map((filter: any) => {
      if (filter.name === selectedDropdown.name) {
        filter.selectedValues = selectedValues;
      }
      return filter;
    });
    setDistrictFilters(dropdownFilters);
  };

  const setBranchSelectedDropdownValue = async (
    selectedValues: Array<string>,
    selectedDropdown: any
  ) => {
    let dropdownFilters = [...branchFilters];
    dropdownFilters = dropdownFilters.map((filter: any) => {
      if (filter.name === selectedDropdown.name) {
        filter.selectedValues = selectedValues;
      }
      return filter;
    });
    setBranchFilters(dropdownFilters);
  };

  const fetchUserCreationList = async () => {
    const value: any = await localforage.getItem('loggedinUser');
    const payload = {
      page: pagination.pageNumber,
      size: pagination.pageSize,
      actionUserId: value.id,
      // organizationId: value.organization.id,
    } as any;

    if (searchValue !== '') {
      payload['name'] = searchValue;
    }

    if (userStatusValue.length > 0) {
      payload['userStatus'] = userStatusValue;
    }
    await reportingHeadData?.result?.map((option: any) => {
      if (option.name === reportingHeadValue) {
        console.log('option', option);

        payload['reportPersonId'] = option.userId;
      }
    });
    await stateFilters?.forEach((filter: any) => {
      let resData = [] as any;
      if (!filter.selectedValues.includes('All')) {
        filter.selectedValues.map((item: any) => {
          filter.options[0].children.map((item2: any) => {
            if (item === item2.value) {
              resData.push(item2.id);
            }
          });
        });
        payload['stateId'] = resData;
      }
    });
    await zoneFilters?.forEach((filter: any) => {
      let resData = [] as any;
      if (!filter.selectedValues.includes('All')) {
        filter.selectedValues.map((item: any) => {
          filter.options[0].children.map((item2: any) => {
            if (item === item2.value) {
              resData.push(item2.id);
            }
          });
        });
        payload['zoneId'] = resData;
      }
    });
    await districtFilters?.forEach((filter: any) => {
      let resData = [] as any;
      if (!filter.selectedValues.includes('All')) {
        filter.selectedValues.map((item: any) => {
          filter.options[0].children.map((item2: any) => {
            if (item === item2.value) {
              resData.push(item2.id);
            }
          });
        });
        payload['cityId'] = resData;
      }
    });
    await branchFilters?.forEach((filter: any) => {
      let resData = [] as any;
      if (!filter.selectedValues.includes('All')) {
        filter.selectedValues.map((item: any) => {
          filter.options[0].children.map((item2: any) => {
            if (item === item2.value) {
              resData.push(item2.id);
            }
          });
        });
        payload['branchId'] = resData;
      }
    });
    if (searchValue !== '') {
      payload['name'] = searchValue;
    }
    const cardList = (await getListOfCards(payload)) as any;
    // setSortingData(cardList?.result?.content);
    setDecendingSortingData([...(cardList?.result?.content ?? [])]);
    setTotalCount({
      totaLNoOfRecords: cardList?.result?.totalElements,
      totalNoOfPages: cardList?.result?.totalPages,
    });
  };

  // Pagination methods

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
    fetchUserCreationList();
  }, [
    pagination,
    reset,
    isActionModalOpen,
    isDeactivatenModalOpen,
    userStatusValue,
  ]);

  const getZoneAndBranchData = async () => {
    const val = await zoneLoader(); //zone
    setZoneFilters(val); //zone
    const branchValue = await branchLoader(); //branch
    setBranchFilters(branchValue); //branch
  };

  const onTabStatusChange = (item: any) => {
    setPagination({
      pageSize: 10,
      pageNumber: 0,
    });
    if (item.title === 'Active') {
      setUserStatusValue('ACTIVE');
    } else if (item.title === 'Deactivated') {
      setUserStatusValue('DEACTIVATE');
    } else if (item.title === 'All') {
      setUserStatusValue('');
    }
  };

  useEffect(() => {
    console.log('districtFilters', districtFilters);
  }, [districtFilters]);

  return (
    <Stack>
      <Box className="user-header-container">
        <ScreenHeader
          title="Create User"
          info="From here you can create access presets to assign with users in Users Creation."
          showBackButton={false}
        />
        {(getPermission(
          actionAllowedItem,
          'USER_MANAGEMENT',
          'USER_CREATION',
          'CREATE_USERS'
        ) ||
          getPermission(
            actionAllowedItem,
            'USER_MANAGEMENT',
            'USER_CREATION',
            'BULK_UPLOAD_USER'
          )) && (
          <Button
            sx={{
              textTransform: 'capitalize',
              boxShadow: 'none',
              backgroundColor: '#0662B7',
              height: '34px',
            }}
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            id="basic-button"
            onClick={handleOpenAddUserPopover}
          >
            Add New User
          </Button>
        )}
        {openAddUserPopover && (
          <Popover
            id={addNewUserid}
            open={openAddUserPopover}
            anchorEl={isAddUserPopoverOpen}
            handleClose={closeAddUserPopover}
            options={createUserMenu}
          />
        )}
      </Box>
      <Stack className="container">
        <HeaderWithInfo
          isInfoEnabled={true}
          isDownloadEnabled={false}
          header="User List"
          info="From here, you filter the card by its mode, status, category, and surrogate."
        />
        <Grid container spacing={2} className="filters-container">
          <Grid item xs={3}>
            <Typography className="dropdown-label">State</Typography>
            {stateFilters?.map((eachItem: any, index: number) => {
              return (
                <Multiselector
                  options={eachItem?.options}
                  selectedValuesFromParent={eachItem?.selectedValues}
                  sendSelectedValues={(selectedValues: Array<string>) => {
                    var is_same =
                      eachItem.selectedValues.length ===
                        selectedValues.length &&
                      eachItem.selectedValues.every(function (
                        element: any,
                        index: any
                      ) {
                        return element === selectedValues[index];
                      });
                    if (is_same) {
                      return;
                    }
                    setSelectedDropdownValue(selectedValues, eachItem);
                  }}
                  dropdownReset={dropdownReset}
                  toggle={toggleState}
                  key={eachItem.payloadKey}
                />
              );
            })}
          </Grid>
          <Grid item xs={3}>
            <Typography className="dropdown-label">Zone</Typography>
            {zoneFilters != null ? (
              <>
                {zoneFilters?.map((eachItem: any, index: number) => {
                  return (
                    <Multiselector
                      options={eachItem?.options}
                      selectedValuesFromParent={eachItem?.selectedValues}
                      sendSelectedValues={(selectedValues: Array<string>) =>
                        setZoneSelectedDropdownValue(selectedValues, eachItem)
                      }
                      dropdownReset={dropdownReset}
                      toggle={toggleState}
                      key={eachItem.payloadKey}
                    />
                  );
                })}{' '}
              </>
            ) : (
              <Multiselector options={[]} />
            )}
          </Grid>
          <Grid item xs={3}>
            <Typography className="dropdown-label">District</Typography>
            {districtFilters != null ? (
              <>
                {districtFilters?.map((eachItem: any, index: number) => {
                  return (
                    <Multiselector
                      options={eachItem?.options}
                      selectedValuesFromParent={eachItem?.selectedValues}
                      sendSelectedValues={(selectedValues: Array<string>) =>
                        setDistrictSelectedDropdownValue(
                          selectedValues,
                          eachItem
                        )
                      }
                      dropdownReset={dropdownReset}
                      toggle={toggleState}
                      key={eachItem.payloadKey}
                    />
                  );
                })}{' '}
              </>
            ) : (
              <Multiselector options={[]} />
            )}
          </Grid>
          <Grid item xs={3}>
            <Typography className="dropdown-label">Branch</Typography>
            {branchFilters != null ? (
              <>
                {branchFilters?.map((eachItem: any, index: number) => {
                  return (
                    <Multiselector
                      options={eachItem?.options}
                      selectedValuesFromParent={eachItem?.selectedValues}
                      sendSelectedValues={(selectedValues: Array<string>) =>
                        setBranchSelectedDropdownValue(selectedValues, eachItem)
                      }
                      dropdownReset={dropdownReset}
                      toggle={toggleState}
                      key={eachItem.payloadKey}
                    />
                  );
                })}{' '}
              </>
            ) : (
              <Multiselector options={[]} />
            )}
          </Grid>
          <Grid item xs={3}>
            <Typography className="dropdown-label-report">
              Reporting Head
            </Typography>

            <Autocomplete
              // id="free-solo-demo"
              freeSolo
              popupIcon
              options={
                reportingHeadData?.result?.map((option: any) => option.name) ||
                []
              }
              onInputChange={(event, newInputValue) => {
                setReportingHeadValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  className="multiselect"
                  {...params}
                  placeholder="Enter Reporting Head"
                />
              )}
              inputValue={reportingHeadValue}
              sx={{
                '& legend': { display: 'none' },
                '& fieldset': { top: 0 },
                fontSize: '12px',
              }}
            />
          </Grid>
        </Grid>
        <Box className="button-container">
          <BtnOutlined title="Reset" onClick={resetFun} />
          <BtnContained
            title="Search"
            onClick={async () => {
              setIsFiltered(true);
              fetchUserCreationList();
              searchFun();
              setUserStatusValue('');
            }}
          />
        </Box>
      </Stack>

      <Stack className="container" style={{ margin: '0px', width: '100%' }}>
        <HeaderWithInfo
          header="Branch Details"
          isInfoEnabled={false}
          info=""
          isDownloadEnabled={true}
        />

        <Box style={{ marginTop: '20px', display: 'flex' }}>
          {customIconBtns?.map((eachBtn: any) => {
            console.log('customIconButton', customIconBtns);
            return (
              <CustomIconButton
                data={eachBtn}
                onClick={() => onClickButton(eachBtn)}
              />
            );
          })}

          <Stack className="user-list-table-search-filters">
            <Box className="search-container">
              <Box className="search-box">
                <SearchIcon className="search-icon" />
                <InputBase
                  placeholder="Search Name"
                  onChange={(e: any) => {
                    console.log('search event', e.target.value);
                    setSearchValue(e.target.value);
                  }}
                />
              </Box>
              <Box>
                <GroupButton
                  data={GroupButtonData}
                  onChange={onTabStatusChange}
                />
              </Box>
            </Box>
          </Stack>
        </Box>
        {isFiltered ? (
          <Stack sx={{ margin: '20px 0' }}>
            <Box>
              <ListTable
                column={column}
                data={sortingData}
                pagination={{
                  ...pagination,
                  ...totalCount,
                  onPageChange: onPageChange,
                  onPageSizeChange: onPageSizeChange,
                }}
                tabStatus={userStatusValue}
              />
            </Box>
          </Stack>
        ) : (
          <EmptyTablePlaceholder headerData={column1} />
        )}
      </Stack>

      <ActionModal
        openSuccess={isActionModalOpen}
        handleCloseSuccess={() => setActionModalOpen(false)}
        handleSuccess={handleSubmit}
        title={'Request for Deactivation'}
        pause_content={'Do you want to submit request for deactivating user?'}
        close={'Close'}
        submit={'Submit'}
      />

      <ActionModal
        openSuccess={isSuccessModalOpen}
        handleCloseSuccess={showSuceesModal}
        successModalTitle={
          modalDesc ===
          'Your request for activating user is successfully sent to the Reviewer.'
            ? 'Request - Activate User'
            : ''
        }
        successModalMsg={`${modalDesc}`}
        btn={' Close'}
      />
      <ActionModal
        openSuccess={isDeactivatenModalOpen}
        handleCloseSuccess={() => setDeactivateModalOpen(false)}
        handleSuccess={handleDeactivateSubmit}
        title={'Request for Activation'}
        pause_content={'Do you want to submit request for activating user?'}
        close={'Close'}
        submit={'Submit'}
      />

      <ActionModal
        openSuccess={isDeactivateSuccessModalOpen}
        handleCloseSuccess={showDeactivateSuceesModal}
        successModalTitle={
          modalDesc ===
          'Your request for deactivating user is successfully sent to the Reviewer.'
            ? 'Request - Deactivate User'
            : ''
        }
        successModalMsg={`${modalDesc}`}
        btn={' Close'}
      />
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
}

export default UserCreationTab;
