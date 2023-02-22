/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

// MUI components
import {
  Box,
  Button,
  IconButton,
  Typography,
  Stack,
  InputBase,
  Checkbox,
  Menu,
  MenuItem,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MenuProps } from '@mui/material/Menu';
import { styled } from '@mui/material/styles';

// Styles

import { colors } from '../../../../../style/Color';
import './style.scss';

// Assets
import plus from '../../../../../assets/icons/plusIcon.svg';
import Info_Icon from '../../../../../assets/images/info_icon.svg';
import download_icon from '../../../../../assets/icons/download_icon.svg';
import mail_icon from '../../../../../assets/icons/mail_icon.svg';
import active_icon from '../../../../../assets/icons/active.svg';
import disabled_active_org from '../../../../../assets/icons/disabled_active_org.svg';
import Deactive_Normal from '../../../../../assets/icons/Deactive_Normal.svg';
import White_Deactive from '../../../../../assets/icons/White_Deactivate.svg';
import ascending_icon from '../../../../../assets/icons/ascending.svg';
import descending_icon from '../../../../../assets/icons/descending.svg';
// Common components
import BtnOutlined from '../../../../../components/commonComponent/CustomText/Button/Outlined';
import BtnContained from '../../../../../components/commonComponent/CustomText/Button/Contained';
import GroupButton from '../../../../../components/commonComponent/GroupButton/GroupButton';
import ListTable from '../../../../../components/commonComponent/commonListTable/commonListTable';
import CustomModal from '../../../../../components/commonComponent/customModal/CustomModal';
import Multiselector from '../../../../../components/commonComponent/MultiSelectNew';

// Utils and constants
import { checkTagStatus } from '../../../../../utils/tagBasedIndicator/tagStatus';

// Services
import {
  getOrganizationDropDown,
  getOrgStructureListItems,
  updateStatusOfOrgStructure,
} from '../../../../../services/orgStructureServices';
import { dropdownTypes } from '../../organisation.const';
import EmptyTablePlaceholder from '../../../../../components/commonComponent/EmptyTablePlaceholder';
import localforage from 'localforage';
import ErrorMessage from '../../../../../components/commonComponent/ErrorMessage';
import { formatDateTime } from '../../../../../utils/DateTimeFormatter';
import { ScreenHeader } from '../../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import { getPermission } from '../../../../../utils/ActionAllowed/UserActionAllowed';

export const organisationFilterDropdown: salesReportFilterInterface[] = [
  {
    label: 'Org Type',
  },
  {
    label: 'Org Status',
  },
  {
    label: 'Surrogate',
  },
];

export interface salesReportFilterInterface {
  label?: string;
  option?: Array<object>;
}

interface OrgKey {
  organizationType?: string[];
  organizationStatus?: string[];
  surrogateType?: string[];
}

export const GroupButtonData = [
  {
    title: 'All',
  },
  {
    title: 'Activate',
  },
  {
    title: 'Deactivated',
  },
];

export const OrganisationDetails = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number[]>([]);
  const [ascending, setAscending] = useState<boolean>(false);
  // table related state
  const [orgStructureData, setOrgStructureData] = useState<any>([]);
  const [decendingSortingData, setDecendingSortingData] = useState<any>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Activate modal states
  const [activateModal, setActivateModal] = useState<boolean>(false);
  const [activateSuccessModal, setActivateSuccessModal] =
    useState<boolean>(false);

  // Deactivate modal state
  const [deactivateModal, setDeactivateModal] = useState<boolean>(false);
  const [deactivateSuccessModal, setDeactivateSuccessModal] =
    useState<boolean>(false);

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);
  const [isItem, setIsItem] = useState<boolean>(false);
  const [pauseMethod, setPauseMethod] = useState('Pause Now');
  // const [editSchedulePause, setEditSchedulePause] = useState(false);
  // const [successEditSchedulePause, setSuccessEditSchedulePause] =
  //   useState(false);
  // const [successEditPause, setSuccessEditPause] = useState(false);
  const openOrgMenu = Boolean(anchorEl);
  const [addOrganisationModal, setAddOrganiationModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [activateCheckbox, setActivateCheckbox] = useState<any>([]);
  const [deactivateCheckbox, setDeactivateCheckbox] = useState<any>([]);
  const [filterTableObj, setFilterTableObj] = useState<any>({});
  const [userId, setUserId] = useState<string>('');
  const [viewId, setViewId] = useState<string>('');
  const [loggedInUserChannel, setLoggedInUserChannel] = useState([]);
  const [organisationStatusValue, setOrganisationStatusValue] = useState<
    string[]
  >([]);
  const menuOpen = Boolean(anchorElement);
  const [filters, setFilters] = useState<Array<any>>([]);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 0,
  });
  const [totalCount, setTotalCount] = useState({
    totaLNoOfRecords: 0,
    totalNoOfPages: 0,
  });
  const [recordStatus, setRecordStatus] = React.useState('ACTIVE');
  const [value, setValue] = React.useState<any>('lastModifiedDateTime');
  const [secondValue, setSecondValue] = React.useState<any>(null);
  const [threeValue, setThreeValue] = React.useState<any>(null);
  const [reset, setReset] = useState(false);
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
      title: 'Org.ID',
    },
    {
      title: 'Org.Name',
    },
    { title: 'Org.Type' },
    { title: 'Start Date' },
    { title: 'State' },
    { title: 'Status' },
    { title: 'More' },
  ];
  // API error state
  const [apiError, setApiError] = useState('');

  // Use effect calls

  const didMount = useRef(false);
  useEffect(() => {
    // if (!didMount.current) {
    //   didMount.current = true;
    //   return;
    // } else
    fetchOrgList(filters);
  }, [pagination]);

  useEffect(() => {
    getFilters();
    getLocalStorageValue();
  }, []);

  useEffect(() => {
    fetchOrgList();
  }, [organisationStatusValue]);
  // Get filter dropdown data

  const getDropdownOptions = async (payload: any) => {
    let res = {};
    await getOrganizationDropDown(payload)
      .then((response) => {
        const result = response.data?.result;
        if (
          result &&
          result?.organizationDropDown &&
          Array.isArray(result.organizationDropDown)
        ) {
          if (payload.dropDown !== 'CARD_STATUS') {
            const stateData = result?.organizationDropDown?.map(
              (item: any) => ({
                value: item.code,
                title: item.name,
              })
            );
            res = {
              options: [
                { value: 'All', title: 'All', children: [...stateData] },
              ],
            };
          } else
            res = {
              options: [
                { code: 'All', name: 'All' },
                ...result.organizationDropDown,
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

  const getFilters = async () => {
    const temp = dropdownTypes.map(async (type: any) => {
      const payload = {
        dropDown: type.name,
      };
      const result = (await getDropdownOptions(payload)) as any;
      return {
        name: type.name,
        options: result.options ? result.options : result.error,
        payloadKey: type.key,
        selectedValues: ['All'],
        label: type.label,
        displayOrder: type.displayOrder,
      };
    });

    const orgListFilters = await Promise.all(temp);
    setFilters(orgListFilters);
  };

  // Get table data

  const getListOfOrganisation = async (payload: any) => {
    let res = {};
    await getOrgStructureListItems(payload)
      .then((response) => {
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        res = { error: err?.response?.data };
      });
    return res;
  };

  const prepareOrgList = (responseData: any) => {
    const result = responseData?.result;
    if (result && result.content && Array.isArray(result.content)) {
      // setOrgStructureData(result.content);
      setDecendingSortingData(result?.content ?? []);
      setTotalCount({
        totaLNoOfRecords: result?.totalElements,
        totalNoOfPages: result?.totalPages,
      });
      setActivateSuccessModal(false);
      setDeactivateSuccessModal(false);
    } else if (responseData.exception) handleError(responseData);
    else if (responseData.error && responseData.error.error) {
      handleError(responseData.error);
    }
  };

  const fetchOrgList = async (dropdownFilters?: Array<any>) => {
    let payload = {
      page: pagination.pageNumber,
      size: pagination.pageSize,
      // cardName: ascending,
    } as any;

    if (Object.keys(filterTableObj).length > 0) {
      payload = { ...payload, ...filterTableObj };
    }
    if (searchValue !== '') {
      payload['name'] = searchValue;
    }
    if (organisationStatusValue.length > 0) {
      payload['organizationStatus'] = organisationStatusValue;
    }
    dropdownFilters?.forEach((filter: any) => {
      if (!filter.selectedValues.includes('All'))
        payload[filter.payloadKey] = filter.selectedValues;
    });
    const result = await getListOfOrganisation(payload);
    prepareOrgList(result);
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

  const fetchSearchBasedList = async () => {
    const payload: any = {
      page: pagination.pageNumber,
      size: pagination.pageSize,
      name: searchValue,
      ...filterTableObj,
    };
    const res: any = await getListOfOrganisation(payload);
    // setOrgStructureData(res?.result?.content);
    setDecendingSortingData([...(res?.result?.content ?? [])]);
    setTotalCount({
      totaLNoOfRecords: res?.result?.totalElements,
      totalNoOfPages: res?.result?.totalPages,
    });
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      fetchSearchBasedList();
    }, 500);

    return () => clearTimeout(getData);
  }, [searchValue]);

  // fetch filter dropdown selected values

  const setSelectedDropdownValue = (
    selectedValues: Array<string>,
    selectedDropdown: any
  ) => {
    let obj: OrgKey = {};
    if (selectedValues[0] !== 'All') {
      let value = selectedDropdown.payloadKey;
      obj[value as keyof OrgKey] = selectedValues;
      setFilterTableObj((prev: any) => {
        return { ...prev, ...obj };
      });
    } else {
      setFilterTableObj({});
    }
    let dropdownFilters = [...filters];
    dropdownFilters = dropdownFilters.map((filter: any) => {
      if (filter.name === selectedDropdown.name) {
        filter.selectedValues = selectedValues;
      }
      return filter;
    });
    setFilters(dropdownFilters);
  };

  const updateOrgList = async () => {
    const payload = {
      page: pagination.pageNumber,
      size: pagination.pageSize,
      // cardName: ascending,
    } as any;

    const result = await getListOfOrganisation(payload);
    prepareOrgList(result);
  };
  const resetFilters = () => {
    let dropdownFilters = [...filters];
    dropdownFilters = dropdownFilters.map((filter: any) => {
      filter.selectedValues = ['All'];
      return filter;
    });
    setFilters(dropdownFilters);
    fetchOrgList(dropdownFilters);
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
    const showTable = localStorage.getItem('bankReportListTable');

    if (showTable === 'true') {
      setIsFiltered(true);
    } else setIsFiltered(false);
  }, [localStorage.getItem('bankReportListTable')]);

  const searchFun = async () => {
    setIsFiltered(true);
    localStorage.setItem('bankReportListTable', JSON.stringify(true));
    const payload: any = {
      page: pagination.pageNumber,
      size: pagination.pageSize,
      ...filterTableObj,
    };
    if (searchValue !== '') {
      payload['name'] = searchValue;
    }
    const result = await getListOfOrganisation(payload);
    prepareOrgList(result);
  };

  const resetFun = () => {
    setReset(!reset);
    setIsFiltered(false);
    setFilterTableObj({});
    resetFilters();
    localStorage.setItem('bankReportListTable', JSON.stringify(false));
  };

  const getLocalStorageValue = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setUserId(value.id);
      setLoggedInUserChannel(value.channelAccessible);
      setActionAllowedItem(value?.actionsAllowed);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCardMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCardMenuClose = () => {
    setAnchorEl(null);
  };

  const addOrganisationOpen = () => {
    setAnchorEl(null);
    setAddOrganiationModal(true);
  };

  const handleSuccess = () => {
    if (pauseMethod === 'DSA') {
      navigate('/userManagement/orgStructure/DSA', {
        state: {
          isEditable: true,
          value: pauseMethod,
        },
      });
    }
    if (pauseMethod === 'Fintech') {
      navigate('/userManagement/orgStructure/DSA', {
        state: {
          isEditable: true,
          value: 'FINTECH',
        },
      });
    }
  };

  const organisationOpen = () => {
    navigate('/userManagement/orgStructure/bulkUpload');
    setAnchorEl(null);
  };
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = orgStructureData.map((n: any) => {
        if (n.organizationStatus === 'ACTIVE') {
          deactivateCheckbox.push(n.id);
        } else if (n.organizationStatus === 'DEACTIVATE') {
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
  const handleClickCheckbox = (id: number, organizationStatus: string) => {
    const result = isSelected(id);
    let selectedData = selected;
    if (result) {
      if (organizationStatus === 'ACTIVE') {
        const index = deactivateCheckbox.indexOf(id);
        deactivateCheckbox.splice(index, 1);
        setDeactivateCheckbox([...deactivateCheckbox]);
      } else if (organizationStatus === 'DEACTIVATE') {
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
      if (organizationStatus === 'ACTIVE') {
        setDeactivateCheckbox([...deactivateCheckbox, id]);
      } else if (organizationStatus === 'DEACTIVATE') {
        setActivateCheckbox([...activateCheckbox, id]);
      } else {
        setDeactivateCheckbox([...deactivateCheckbox, id]);
        setActivateCheckbox([...activateCheckbox, id]);
      }
      setSelected([...selectedData, id]);
    }
  };

  const handleActivateSubmit = async () => {
    let res = [] as any;
    if (deactivateCheckbox.length > 0) {
      res = deactivateCheckbox;
    } else {
      res.push(viewId);
    }
    const payload = {
      userId: userId,
      idList: res,
      organizationStatus: 'DEACTIVATE',
    } as any;
    const result = await updateStatusofData(payload, 'DEACTIVATE');
  };

  const handleDeactivateSubmit = async () => {
    let res = [] as any;
    if (activateCheckbox?.length > 0) {
      res = activateCheckbox;
    } else {
      res.push(viewId);
    }
    const payload = {
      userId: userId,
      idList: res,
      organizationStatus: 'ACTIVE',
    } as any;
    const result = await updateStatusofData(payload, 'ACTIVE');
  };

  const updateStatusofData = async (
    payload: any,
    organisationStatus: string
  ) => {
    let res = {} as any;
    await updateStatusOfOrgStructure(payload)
      .then((response) => {
        if (response.data.result || response.status === 200) {
          if (organisationStatus === 'DEACTIVATE') {
            setDeactivateModal(false);
            setDeactivateSuccessModal(true);
          }
          if (organisationStatus === 'ACTIVE') {
            setActivateModal(false);
            setActivateSuccessModal(true);
          }
          setActivateCheckbox([]);
          setDeactivateCheckbox([]);
          setSelected([]);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        console.log(err);
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  useEffect(() => {
    if (decendingSortingData.length > 0) {
      filterData();
    }
  }, [ascending, value, secondValue, threeValue, decendingSortingData]);

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
    setOrgStructureData([...sort]);
  };

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
  const handleClose = () => {
    setAnchorElement(null);
  };
  const handleClick = (event: any, row: any, index: number) => {
    setAnchorElement(event.currentTarget);
    setViewId(row?.id);
  };

  const NORMAL_PAUSE = 'Pause Now';
  const SCHEDULED_PAUSE = 'Schedule Pause';

  const pauseMethodChange = (value: any) => {
    setPauseMethod(value);
  };

  const closeModal = () => {
    // setEditSchedulePause(false);
    // setSuccessEditPause(false);
    // setSuccessEditSchedulePause(false);
    setAddOrganiationModal(false);
  };

  const successModal = () => {
    if (pauseMethod === NORMAL_PAUSE) {
      // setEditSchedulePause(false);
      // setSuccessEditPause(true);
    }
    if (pauseMethod === SCHEDULED_PAUSE) {
      // setSuccessEditSchedulePause(true);
      // setEditSchedulePause(false);
    }
  };

  const [tabStatus, setTabStatus] = useState('All');
  const onTabStatusChange = (item: any) => {
    setTabStatus(item.title);
    setPagination({
      pageSize: 10,
      pageNumber: 0,
    });

    if (item.title === 'Activate') {
      let arr1: string[] = [];
      arr1.push('ACTIVE');
      setOrganisationStatusValue(arr1);
    } else if (item.title === 'Deactivated') {
      let arr2: string[] = [];
      arr2.push('DEACTIVATE');
      setOrganisationStatusValue(arr2);
    } else if (item.title === 'All') {
      setOrganisationStatusValue([]);
    }
  };

  const column = [
    {
      title: '',
      dataIndex: 'id',
      key: 'checkBox',
      width: '70px',
      headerRender: () => {
        return (
          <Checkbox
            color={'secondary'}
            sx={{
              color: '#A8A8A9',
              transform: { lg: 'scale(1.2)' },
            }}
            indeterminate={
              selected.length > 0 && selected.length < orgStructureData.length
            }
            checked={
              orgStructureData.length > 0 &&
              selected.length === orgStructureData.length
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
        setIsItem(isItemSelected);
        const labelId = `enhanced-table-checkbox-${index}`;
        return (
          <Checkbox
            color={'secondary'}
            sx={{
              color: '#A8A8A9',
              transform: { lg: 'scale(1.2)' },
            }}
            checked={isItemSelected}
            inputProps={{
              'aria-labelledby': labelId,
            }}
            onChange={() =>
              handleClickCheckbox(row?.id, row?.organizationStatus)
            }
          />
        );
      },
    },
    {
      title: '#',
      dataIndex: 'count',
      key: 'count',
      width: '70px',
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {pagination.pageNumber * pagination.pageSize + (index + 1)}
          </Stack>
        );
      },
    },
    {
      title: 'Org.ID',
      dataIndex: 'id',
      key: 'id',
      width: '220px',
      render: (name: any, row: any, index: number) => {
        return <Stack>{row?.id}</Stack>;
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
            onClick={() => handleSortByName('id', '', '')}
          >
            <>{text}</>
            {value === 'id' && (
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
      title: 'Org.Name',
      dataIndex: 'supplierDetails',
      key: 'supplierDetails',
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
              handleSortByName('supplierDetails', 'supplierName', '')
            }
          >
            <>{text}</>
            {secondValue === 'supplierName' && (
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
        return <Stack>{row?.supplierDetails?.supplierName ?? ''}</Stack>;
      },
    },
    {
      title: 'Org.Type',
      dataIndex: 'organizationType',
      key: 'organizationType',
      width: '130px',
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
            onClick={() => handleSortByName('organizationType', '', '')}
          >
            <>{text}</>
            {value === 'organizationType' && (
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
      title: 'Start Date',
      dataIndex: 'onBoardDateTime',
      key: 'onBoardDateTime',
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
            onClick={() => handleSortByName('onBoardDateTime', '', '')}
          >
            <>{text}</>
            {value === 'onBoardDateTime' && (
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
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {row?.onBoardDateTime != null
              ? formatDateTime(row?.onBoardDateTime)
              : '--'}
          </Stack>
        );
      },
    },
    {
      title: 'Date & Time',
      dataIndex: 'lastModifiedDateTime',
      key: 'lastModifiedDateTime',
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
            onClick={() => handleSortByName('lastModifiedDateTime', '', '')}
          >
            <>{text}</>
            {value === 'lastModifiedDateTime' && (
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
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {row?.lastModifiedDateTime != null
              ? formatDateTime(row?.lastModifiedDateTime)
              : '--'}
          </Stack>
        );
      },
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      width: '180px',
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
              handleSortByName('supplierDetails', 'state', 'stateName')
            }
          >
            <>{text}</>
            {threeValue === 'stateName' && (
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
        return <Stack>{row?.supplierDetails?.state?.stateName ?? '-'}</Stack>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'organizationStatus',
      key: 'organizationStatus',
      width: '150px',
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
            onClick={() => handleSortByName('organizationStatus', '', '')}
          >
            <>{text}</>
            {value === 'organizationStatus' && (
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
          <Stack
            sx={{
              color: row?.organizationStatus
                ? checkTagStatus(row?.organizationStatus).color
                : '',
            }}
          >
            {row?.organizationStatus}
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
            <Stack
              id="more-button"
              onClick={(e: any) => {
                handleClick(e, row, index);
                setRecordStatus(row.organizationStatus);
              }}
              aria-controls={open ? 'more-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{ padding: '5px', borderBottom: 'none' }}
            >
              <MoreVertIcon />
            </Stack>

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
              {getPermission(
                actionAllowedItem,
                'USER_MANAGEMENT',
                'ORGANIZATION_STRUCTURE',
                'VIEW_ORGANIZATION'
              ) && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/userManagement/orgStructure/DSA', {
                      state: {
                        isEditable: false,
                        id: viewId, //name, //'63b55827de08223268acb3ac',
                      },
                    });
                  }}
                  style={{ padding: '10px 20px', textAlign: 'left' }}
                >
                  View Org.
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/userManagement/orgStructure/DSA', {
                    state: {
                      isEditable: true,
                      id: viewId, //'63b55827de08223268acb3ac',
                      setEditMode: true,
                    },
                  });
                }}
                style={{ padding: '10px 20px', textAlign: 'left' }}
              >
                Edit Org.
              </MenuItem>
              <MenuItem
                style={{ padding: '10px 20px', textAlign: 'left' }}
                onClick={() => {
                  handleClose();
                  setActivateModal(!activateModal);
                }}
                disabled={recordStatus === 'ACTIVE' ? true : false}
              >
                Activate Org
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  setDeactivateModal(!deactivateModal);
                }}
                style={{ padding: '10px 20px', textAlign: 'left' }}
                disabled={recordStatus === 'DEACTIVATE' ? true : false}
              >
                Deactivate Org
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

  const StyledMenuDropDown = styled((props: MenuProps) => <Menu {...props} />)(
    () => ({
      '& .MuiPaper-root': {
        borderRadius: '4px',
        minWidth: '257px',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.16))',
        '& .MuiMenu-list': {
          padding: '2px',
        },
        '& .MuiMenuItem-root': {
          padding: '15px 22px',
          fontSize: '14px',
          fontWeight: '400',
          fontFamily: 'Ilisarniq',
        },
      },
    })
  );

  return (
    <Box className="organisationContainer">
      <Box className="organisationHeader">
        <Box>
          <ScreenHeader
            title="Organisation Details"
            info="Manage all organisations in the system from here."
            showBackButton={false}
          />
        </Box>
        {(getPermission(
          actionAllowedItem,
          'USER_MANAGEMENT',
          'ORGANIZATION_STRUCTURE',
          'CREATE_ORGANIZATION'
        ) ||
          getPermission(
            actionAllowedItem,
            'USER_MANAGEMENT',
            'ORGANIZATION_STRUCTURE',
            'BULK_UPLOAD_ORGANIZATION'
          )) && (
          <Box>
            <Button
              variant="contained"
              className="organizationBtn"
              aria-controls={openOrgMenu ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openOrgMenu ? 'true' : undefined}
              onClick={handleCardMenuClick}
              id="basic-button"
            >
              <IconButton className="icon">
                <img src={plus} alt="resumeIcon" className="plusIconOrg" />
              </IconButton>
              Add Organisation
            </Button>

            <StyledMenuDropDown
              id="basic-menu"
              anchorEl={anchorEl}
              open={openOrgMenu}
              onClose={handleCardMenuClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {getPermission(
                actionAllowedItem,
                'USER_MANAGEMENT',
                'ORGANIZATION_STRUCTURE',
                'CREATE_ORGANIZATION'
              ) && (
                <MenuItem
                  onClick={addOrganisationOpen}
                  sx={{
                    fontSize: { sm: '12px !important', md: '14px !important' },
                  }}
                >
                  Add Organisation
                </MenuItem>
              )}
              {getPermission(
                actionAllowedItem,
                'USER_MANAGEMENT',
                'ORGANIZATION_STRUCTURE',
                'BULK_UPLOAD_ORGANIZATION'
              ) && (
                <MenuItem
                  onClick={organisationOpen}
                  sx={{
                    fontSize: { sm: '12px !important', md: '14px !important' },
                  }}
                >
                  Organisation Bulk Upload
                </MenuItem>
              )}
            </StyledMenuDropDown>
          </Box>
        )}
      </Box>

      <Box className="organisationListHeader">
        <Box className="organisationList">
          <Box
            className="organisationContent"
            sx={{
              borderBottom: `2px solid ${colors.lightGrey}`,
              paddingBottom: '12px',
            }}
          >
            <Typography className="organizationTitle">
              Organisation List
            </Typography>
            <Stack className="info-org-icon">
              <Stack>
                <img
                  className="Info-Icon"
                  src={Info_Icon}
                  alt=""
                  width="20px"
                  height="20px"
                  style={{ marginRight: '8px' }}
                />
              </Stack>
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: '400',
                }}
                color="textSecondary"
              >
                Filter by org type/state/status/surrogate from here.
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Box>
          <Box className="organisation-checkbox-select-dropdown">
            <Grid container spacing={2}>
              {filters?.map((eachItem: any, index: number) => {
                return eachItem.displayOrder !== -1 ? (
                  <Grid item xs={12} md={4} lg={3} key={index}>
                    <Typography className="dropdown-label-orgSturcture">
                      {eachItem?.label}
                    </Typography>
                    <Multiselector
                      options={eachItem?.options}
                      selectedValuesFromParent={eachItem?.selectedValues}
                      sendSelectedValues={(selectedValues: Array<string>) =>
                        setSelectedDropdownValue(selectedValues, eachItem)
                      }
                    />
                  </Grid>
                ) : null;
              })}
            </Grid>
          </Box>
        </Box>
        <Box className="organisationResetBtn">
          <BtnOutlined title="Reset" onClick={resetFun} />
          <BtnContained title="Search" onClick={searchFun} />
        </Box>
      </Box>

      <Box className="organisationTableContainer">
        <Stack
          className="organisationHeaderContainer"
          sx={{
            borderBottom: `2px solid ${colors.lightGrey}`,
            paddingBottom: '12px',
          }}
        >
          <Stack className="organisationHeaderTable">
            <Stack>
              <Typography>Organisation Details</Typography>
            </Stack>
            <Stack>
              <Stack>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { sm: 1, md: 2 },
                  }}
                >
                  <Stack
                    className="btnIcon"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img src={download_icon} alt="download_icon" />
                  </Stack>
                  <Stack
                    className="btnIcon"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img src={mail_icon} alt="mail_icon" />
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          className="tableNavbar"
          style={{
            opacity: isFiltered ? '' : '0.6',
            pointerEvents: isFiltered ? 'auto' : 'none',
          }}
        >
          {getPermission(
            actionAllowedItem,
            'USER_MANAGEMENT',
            'ORGANIZATION_STRUCTURE',
            'ACTIVE_DE_ACTIVE_ORGANIZATION'
          ) && (
            <Stack className="btn-container-org">
              <Button
                variant="contained"
                color="secondary"
                disabled={activateCheckbox.length > 0 ? false : true}
                className="orgStructureBtnActive"
                onClick={() => setActivateModal(!activateModal)}
              >
                <IconButton sx={{ padding: '0', marginRight: '8px' }}>
                  <img
                    src={
                      activateCheckbox.length > 0
                        ? active_icon
                        : disabled_active_org
                    }
                    alt="resumeIcon"
                  />
                </IconButton>
                Activate Org
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disabled={deactivateCheckbox.length > 0 ? false : true}
                className="orgStructureBtnDeActive"
                onClick={() => setDeactivateModal(!deactivateModal)}
              >
                <IconButton sx={{ padding: '0', marginRight: '8px' }}>
                  <img
                    src={
                      deactivateCheckbox.length > 0
                        ? White_Deactive
                        : Deactive_Normal
                    }
                    alt="resumeIcon"
                  />
                </IconButton>
                Deactivate Org
              </Button>
            </Stack>
          )}
          <Box className="organisation-search-container">
            <Box className="organisation-search-box">
              <InputBase
                placeholder="Search"
                onChange={(e) => setSearchValue(e.target.value)}
                className="classNameSearch"
              />
              <SearchIcon className="organisation-search-icon" />
            </Box>
            <Box
              sx={{ padding: { sm: '0 0 20px 0', md: '0' } }}
              className="groupButtonOrgStructure"
            >
              <GroupButton
                data={GroupButtonData}
                onChange={onTabStatusChange}
              />
            </Box>
          </Box>
        </Stack>

        {isFiltered ? (
          <Stack>
            <ListTable
              column={column}
              data={orgStructureData}
              isItemSelected={selected}
              selectedKey="id"
              pagination={{
                ...pagination,
                ...totalCount,
                onPageChange: onPageChange,
                onPageSizeChange: onPageSizeChange,
              }}
              tabStatus={tabStatus}
            />
          </Stack>
        ) : (
          <Stack className="padding-container">
            <EmptyTablePlaceholder headerData={column1} />
            {/* <ChooseCategoryToViewData /> */}
          </Stack>
        )}
      </Box>

      {activateModal && (
        <CustomModal
          openSuccess={activateModal}
          handleSuccess={handleDeactivateSubmit}
          handleCloseSuccess={() => {
            setActivateModal(false);
          }}
          title={'Request for Activation'}
          pause_content={
            'Do you want to submit request for Activating Organisation?'
          }
          close={'Close'}
          submit={'Submit'}
        />
      )}

      {activateSuccessModal && (
        <CustomModal
          openSuccess={activateSuccessModal}
          handleCloseSuccess={updateOrgList}
          successModalTitle={'Activation Organisation'}
          successModalMsg={
            'Your request for Activating Org is successfully sent to the Reviewer.'
          }
          btn={' Close'}
        />
      )}

      {deactivateModal && (
        <CustomModal
          openSuccess={deactivateModal}
          handleSuccess={handleActivateSubmit}
          handleCloseSuccess={() => {
            setDeactivateModal(false);
          }}
          title={'Request for Deactivation'}
          pause_content={
            'Do you want to submit request for Deactivating Organisation?'
          }
          close={'Close'}
          submit={'Submit'}
        />
      )}

      {deactivateSuccessModal && (
        <CustomModal
          openSuccess={deactivateSuccessModal}
          handleCloseSuccess={updateOrgList}
          successModalTitle={'Deactivation Organisation'}
          successModalMsg={
            'Your request for Deactivating Org is successfully sent to the Reviewer.'
          }
          btn={' Close'}
        />
      )}

      {/* {editSchedulePause && (
        <CustomModal
          openSuccess={editSchedulePause}
          handleCloseSuccess={closeModal}
          handleSuccess={successModal}
          title={'Deactivate '}
          pause_content={'You can pause it or perform a scheduled pause.'}
          scheduledPause_content={
            'Please choose a date range to perform a scheduled pause.'
          }
          textarea_title={'Add Remarks'}
          radioValuOne={NORMAL_PAUSE}
          radioValuTwo={SCHEDULED_PAUSE}
          dateRange_title={'Enter Date range'}
          maxLength={'Maximum of 500 words'}
          pauseMethodChecking={(arg1: string) => pauseMethodChange(arg1)}
          close={'Close'}
          submit={'Submit'}
          datepickerLabelStart={'Start Date and time'}
          datepickerLabelEnd={'End Date and time'}
          pauseStatusKey={'Schedule Pause'}
        />
      )} */}

      {/* {successEditPause && (
        <CustomModal
          openSuccess={successEditPause}
          handleCloseSuccess={closeModal}
          successModalTitle={`Deactivated - Pause`}
          successModalMsg={
            ' Your action of pausing - Card For Card Surrogate has been successully sent to the reviewer'
          }
          btn={' Close'}
        />
      )} */}
      {/* {successEditSchedulePause && (
        <CustomModal
          openSuccess={successEditSchedulePause}
          handleCloseSuccess={closeModal}
          successModalTitle={`Deactivated- Scheduled Pause`}
          successModalMsg={
            'Your action of Scheduled Pause - Card For Card Surrogate From  DD/MM/YYYTo DD/MM/YYY is successfully sent to reviewer'
          }
          btn={' Close'}
        />
      )} */}

      {addOrganisationModal && (
        <CustomModal
          openSuccess={addOrganisationModal}
          handleCloseSuccess={closeModal}
          title={'Add Organisation'}
          pause_content={'Select Channel type to add OrganisationOne'}
          close={'Close'}
          submit={'Proceed'}
          radioValuOne={'DSA'}
          radioValuTwo={'Fintech'}
          pauseMethodChecking={(arg1: string) => pauseMethodChange(arg1)}
          pauseStatusKey={'DSA'}
          handleSuccess={handleSuccess}
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
};
