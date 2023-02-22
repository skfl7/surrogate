/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Checkbox,
  Radio,
  RadioGroup,
  Grid,
  Autocomplete,
} from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

import { Box, Stack } from '@mui/system';
import './style.scss';
import {
  json,
  useLoaderData,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import HeaderWithInfo from '../../../../components/commonComponent/HeaderWithInfo';
import FirstActiveStepperIcon from '../../../../assets/icons/first_stepper_icon.svg';
import SecondActiveStepperIcon from '../../../../assets/icons/second_active_stepper.svg';
import SecondDisabledStepperIcon from '../../../../assets/icons/second_disabled_stepper.svg';
import CompletedStepperIcon from '../../../../assets/icons/completed_stepper_icon.svg';
import FormControlLabel from '@mui/material/FormControlLabel';
import SearchSelectDropdown from '../../../../components/commonComponent/SearchDropdown';
import SuccessModal from '../../../../components/commonComponent/customModal/CustomModal';
import {
  PersonalDetails,
  EmploymentDetails,
  RoleDetails,
  RoleAccessFrom,
  ReviewerApproverAllocation,
  personalDetailsInterface,
  employmentDetailsInterface,
} from './../userCreation.const';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AccordianLayover } from '../../../../components/commonComponent/CustomAccordian/Accordian';
import { FooterButton } from '../../../../components/commonComponent/FooterButton/FooterButton';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import ReviewerApproverTable from '../../../../components/commonComponent/ReviewerApproverTable';
import Multiselector from '../../../../components/commonComponent/MultiSelectNew';
import moment from 'moment';
import { getOrganizationDropdownData } from '../../../../services/orgStructureServices';
import {
  getAuthorizationActiveDetail,
  getDuplicateRoleData,
  getInitialPageDetails,
} from '../../../../services/roleCreationServices';
import {
  updatePermissionsOfUserCreation,
  addUserMember,
  getBranchList,
  getDistrictList,
  getStateList,
  getZoneList,
  updateUserMember,
  getUserCreationDetails,
  getReviewerApproverData,
  getReportingHeadListUsers,
  saveDraftUserCreation,
  saveDraftUserPermission,
} from '../../../../services/userCreationServices';
import { getCamelCaseFeatureName } from '../../../../utils/getCamelcaseFeatureName';
import {
  branchTypes,
  districtTypes,
  stateTypes,
  zoneTypes,
} from '../../../productManagement/cardCatalogue/card.const';
import localforage from 'localforage';
import {
  DropdownInterface,
  PersonalDetailsInterface,
  UserDataInterface,
  EmployeeDropdownInterface,
  EmployeeDetailsInterface,
} from '../UserCreationInterface';
import ErrorMessage from '../../../../components/commonComponent/ErrorMessage';
import { RegexValidation } from '../../../../utils/Regex';
import { validateInputFields } from '../../../../utils/validations/input';
import CustomModal from '../../../../components/commonComponent/customModal/CustomModal';
export async function singleUserCreationLoader() {
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
const user_data: any = {
  organizationId: '',
  roleType: 'INITIATOR',
  personalDetails: {
    employeeId: '',
    employeeName: '',
    email: '',
    mobileNumber: '',
  },
  channelAccessible: [],
  roleAccessType: '',
  stateId: [],
  cityId: [],
  zoneId: [],
  branchId: [],
  reportingTo: '',
  reportingToSecondary: '',
  employeeDetails: {
    designation: '',
    dateOfJoining: '',
    reportingHead: '',
    optionalReportingHead: '',
  },
};
function CreateUser() {
  const location = useLocation();
  const [isPermission, setIsPermission] = useState<boolean>();
  const [isUserCreated, setIsUserCreated] = useState<boolean>();
  const [isAdminReviewApproved, setIsAdminReviewApproved] = useState<boolean>();
  const { state } = useLocation();

  const [duplicateRoleDataApi, setDuplicateRoleData] = useState([]);
  const [roleAccessData, setRoleAccessData] = useState([]);
  const [authData, setAuthData] = useState<any>();
  const [reviewerApproverData, setSelectedReviewerApproverData] = useState<any>(
    []
  );
  const [reportingHeadData, setReportingHeadData] = useState<any>();
  const [radioButtonText, setRadioButton] = useState<any>('rolePresets');
  const [selectedRoleId, setSelectedRoleId] = useState<any>('');
  const [permissionDisable, setPermissionDisable] = useState<boolean>(false);
  const loaderData = useLoaderData() as any;
  const [userData, setUserData] = useState<UserDataInterface>(user_data);
  const navigate = useNavigate();
  const [channelOptions, setChannelOptions] = useState<DropdownInterface[]>();
  const [selectedChannelOptions, setSelectedChannelOptions] =
    useState<string[]>();
  const [submitbuttonDisabled, setSubmitbuttonDisabled] = useState<boolean>();
  const [stateFilters, setStateFilters] = useState(loaderData.cardListFilters);
  const [zoneFilters, setZoneFilters] = useState<any>();
  const [branchFilters, setBranchFilters] = useState<any>();
  const [cityFilters, setCityFilters] = useState<any>();
  const [apiError, setApiError] = useState('');
  const [isEditMode, setIsEditMode] = useState(
    state?.filteredData?.state?.isEdit || state?.isEdit || false
  );
  const [createdUserId, setCreatedUserId] = useState<any>('');
  const [isCityUpdated, setIsCityUpdated] = useState<boolean>();
  const [isZoneUpdated, setIsZoneUpdated] = useState<boolean>();
  const [isBranchUpdated, setIsBranchUpdated] = useState<boolean>();
  const [editableUserId, setEditableUserId] = useState<any>('');
  const [isReportingToUpdated, setIsReportingToUpdated] = useState<boolean>();
  const [userId, setUserId] = useState<string>('');
  const [organizationID, setorganizationId] = useState('');
  const [loggedInUserChannel, setLoggedInUserChannel] = useState([]);
  const [isTempEdit, setIsTempEdit] = useState<boolean>(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  let checkCount = 0;
  let switchCount = 0;
  let calCount = 0;

  const gobackFun = () => {
    // navigate('/userManagement/userCreation', {
    //   state: state.filteredData,
    // });
    setShowCloseModal(true);
  };

  useEffect(() => {
    getChannelOptions();
    fetchDuplicateRolelist();
    if (state?.filteredData?.state?.isEdit || state?.isEdit) {
      updatePersonalDetails();
    }
    if (!isEditMode) {
      fetchEmptyPermissionData();
    }
    getAuthorizationItemDetails();
    getLocalStorageID();
  }, []);

  useEffect(() => {
    organizationID && getHeadData();
    organizationID && getZoneAndBranchData();
  }, [organizationID]);

  useEffect(() => {
    updateSubmitBtnStatus();
  }, [userData, selectedChannelOptions]);

  useEffect(() => {
    updateCityForEdit();
  }, [cityFilters]);

  useEffect(() => {
    updateZoneForEdit();
  }, [zoneFilters]);

  useEffect(() => {
    updateBranchForEdit();
  }, [branchFilters]);

  const onBackButtonEvent = (e: any) => {
    e.preventDefault();
    setShowCloseModal(true);
  };

  useEffect(() => {
    // window.history.pushState(null, '', window.location.pathname);
    navigate(window.location.pathname, {
      state: {
        ...state,
      },
    });
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  }, []);

  const updatePersonalDetails = () => {
    let propsData = state?.filteredData?.state?.isFromList
      ? state?.filteredData?.state?.userData
      : state.userData;
    let personalDetailsValue = {
      ...userData?.personalDetails,
    };
    let employeeDetailsValue = {
      ...userData?.employeeDetails,
    };
    personalDetailsValue['email'] = propsData?.personalDetails?.email || '';
    personalDetailsValue['employeeName'] =
      propsData?.personalDetails?.employeeName || '';
    personalDetailsValue['employeeId'] =
      propsData?.personalDetails?.employeeId || '';
    personalDetailsValue['mobileNumber'] =
      propsData?.personalDetails?.mobileNumber || '';
    employeeDetailsValue.designation =
      propsData?.employeeDetails?.designation || '';
    employeeDetailsValue.dateOfJoining =
      propsData?.employeeDetails?.dateOfJoining || '';
    if (propsData?.reportingTo) {
      employeeDetailsValue.reportingHead = {
        name: propsData?.reportingTo?.personalDetails?.employeeName || '',
        userId: propsData?.reportingTo?.id || '', //'63aa87938d72dd219bc2875e', //propsData?.reportingTo?.id,
      };
    }
    if (propsData?.reportingToSecondary) {
      employeeDetailsValue.optionalReportingHead = {
        name: propsData?.reportingToSecondary?.personalDetails?.employeeName,
        userId: propsData?.reportingToSecondary.id,
      };
    }
    console.log('user1');
    setUserData((prev: any) => ({
      ...prev,
      organizationId: propsData?.organization?.id || '',
      roleType: propsData?.roleType || '',
      personalDetails: { ...personalDetailsValue },
      channelAccessible: propsData?.channelAccessible || [],
      roleAccessType: propsData?.roleAccessType || '',
      stateId: [],
      cityId: [],
      branchId: [],
      employeeDetails: { ...employeeDetailsValue },
    }));
    setSelectedChannelOptions(
      propsData?.channelAccessible ? [...propsData?.channelAccessible] : []
    );
    setRadioButton(
      propsData?.roleSelection === 'EXISTING_USER_PERMISSION'
        ? 'other'
        : 'rolePresets'
    );
    setSelectedRoleId(
      propsData?.roleCopiedFrom?.id ?? propsData?.userRoleCopiedFrom?.id ?? ''
    );
    setRoleAccessData(propsData?.actionsAllowedResponse ?? []);
    const newArr = propsData?.actionsAllowedResponse?.map((rest: any) => {
      const newData = rest.subAction.map((rest2: any) => {
        if (rest2.roleAccess === 'YES') switchCount++;
      });
      if (switchCount > 0) calCount++;
      switchCount = 0;
      if (rest.roleAccess === 'YES') checkCount++;
    });
    if (checkCount === calCount && checkCount !== 0 && calCount !== 0)
      setPermissionDisable(true);
    else setPermissionDisable(false);
    updateCity(propsData);
    setEditableUserId(propsData?.id);
  };
  const updateCityForEdit = () => {
    if (
      !isCityUpdated &&
      cityFilters?.length > 0 &&
      (state?.filteredData?.state?.isEdit || state?.isEdit)
    ) {
      let cityNameArr: string[] = [];
      let data = state?.filteredData?.state?.isFromList
        ? state?.filteredData?.state?.userData
        : state.userData;
      data?.city?.map((item: any) => {
        cityNameArr.push(item?.cityName);
      });
      setCitySelectedDropdownValue(cityNameArr, cityFilters[0]);
      setIsCityUpdated(true);
    }
  };
  const updateZoneForEdit = () => {
    if (
      !isZoneUpdated &&
      zoneFilters?.length > 0 &&
      (state?.filteredData?.state?.isEdit || state?.isEdit)
    ) {
      let zoneNameArr: string[] = [];
      let data = state?.filteredData?.state?.isFromList
        ? state?.filteredData?.state?.userData
        : state.userData;
      data?.zone?.map((item: any) => {
        zoneNameArr.push(item?.zoneName);
      });
      setZoneSelectedDropdownValue(zoneNameArr, zoneFilters[0]);
      setIsZoneUpdated(true);
    }
  };
  const updateBranchForEdit = () => {
    if (
      !isBranchUpdated &&
      branchFilters?.length > 0 &&
      (state?.filteredData?.state?.isEdit || state?.isEdit)
    ) {
      let branchNameArr: string[] = [];
      let data = state?.filteredData?.state?.isFromList
        ? state?.filteredData?.state?.userData
        : state.userData;
      data?.branch?.map((item: any) => {
        branchNameArr.push(item?.branchName);
      });
      setBranchSelectedDropdownValue(branchNameArr, branchFilters[0]);
      setIsBranchUpdated(true);
    }
  };
  const updateCity = (data: any) => {
    let stateNameArr: string[] = [];
    data?.state?.map((item: any) => {
      stateNameArr.push(item?.stateName);
    });
    setSelectedDropdownValue(stateNameArr, stateFilters[0]);
  };
  const getZoneAndBranchData = async () => {
    const val = await zoneLoader(); //zone
    setZoneFilters(val); //zone
    const branchValue = await branchLoader(); //branch
    setBranchFilters(branchValue); //branch
  };
  const zoneLoader = async () => {
    // get zone filter dropdown
    const temp = zoneTypes.map(async (type: any) => {
      const payload = {
        zoneName: '',
        organizationId: organizationID, //'6372739d388f417cfa1bcdbf',
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
  const branchLoader = async () => {
    // get branch filter dropdown
    const temp = branchTypes.map(async (type: any) => {
      const payload = {
        organizationId: organizationID, // '6372739d388f417cfa1bcdbf',
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
  const getBranchData = async (payload: any) => {
    let res = {};
    await getBranchList(payload)
      .then((response) => {
        const result = response.data?.result;
        if (result) {
          const cityData = result?.map((item: any) => ({
            value: item.branchName,
            title: item.branchName,
            id: item.branchId,
          }));
          res = {
            options: [
              { value: 'All', title: 'All', id: 0, children: [...cityData] },
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
  const getChannelOptions = async () => {
    const payload = {
      dropDown: 'ORGANIZATION_TYPE',
    };
    await getOrganizationDropdownData(payload)
      .then((response: any) => {
        const successResult = response.data?.result;
        if (
          successResult &&
          successResult.organizationDropDown &&
          Array.isArray(successResult.organizationDropDown)
        ) {
          setChannelOptions([...successResult.organizationDropDown]);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err: any) => {
        console.log(err);
        setChannelOptions([]);
        handleError(err?.response?.data ?? '');
      });
  };
  const setSelectedDropdownValue = async (
    selectedValues: Array<string>,
    selectedDropdown: any
  ) => {
    let dropdownFilters = stateFilters && [...stateFilters];
    dropdownFilters = await dropdownFilters?.map((filter: any) => {
      if (filter.name === selectedDropdown.name) {
        filter.selectedValues = selectedValues;
      }
      return filter;
    });
    setStateFilters(dropdownFilters);
    updateSelectedState(selectedDropdown, selectedValues, 'stateId');
    await stateFilters?.forEach(async (filter: any) => {
      if (!filter.selectedValues.includes('All')) {
        setCityFilters([]);
        const cityValue = await cityLoader();
        setCityFilters(cityValue);
      }
    });
  };
  const updateSelectedState = async (
    selectedDropdown: any,
    selectedValues: Array<string>,
    keyName: string
  ) => {
    let idArr: string[] = [];
    selectedDropdown?.options[0]?.children?.map((item: any) => {
      if (selectedValues.includes(item.value)) {
        idArr.push(item.id);
      }
    });

    setUserData((prev: any) => ({
      ...prev,
      [keyName]: [...idArr],
    }));
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
    updateSelectedState(selectedDropdown, selectedValues, 'zoneId');
  };
  const setCitySelectedDropdownValue = async (
    selectedValues: Array<string>,
    selectedDropdown: any
  ) => {
    let dropdownFilters = [...cityFilters];
    dropdownFilters = dropdownFilters.map((filter: any) => {
      if (filter.name === selectedDropdown.name) {
        filter.selectedValues = selectedValues;
      }
      return filter;
    });
    setCityFilters(dropdownFilters);
    updateSelectedState(selectedDropdown, selectedValues, 'cityId');
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
    updateSelectedState(selectedDropdown, selectedValues, 'branchId');
  };
  const cityLoader = async () => {
    // get city filter dropdown
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
      const result = (await getCityData(payload)) as any;
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
  const getCityData = async (payload: any) => {
    let res = {};
    await getDistrictList(payload)
      .then((response) => {
        const result = response.data?.result;
        if (result) {
          const cityData = result?.map((item: any) => ({
            value: item.cityName,
            title: item.cityName,
            id: item.id,
          }));
          res = {
            options: [
              { value: 'All', title: 'All', id: 0, children: [...cityData] },
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
  const goBack = () => {
    navigate(-1);
  };
  // const handleSubmitClick = () => {
  //   //remove this to call api.
  //   // isPermission ? setIsUserCreated(true) : setIsPermission(true);
  //   if (isPermission) {
  //     handlePermissionSubmitClick('SUBMIT');
  //   } else {
  //     setIsPermission(true);
  //   }
  // };
  const handlePermissionSubmitClick = async (requestTypeValue: string) => {
    const payload = {
      userId: createdUserId,
      requestType: requestTypeValue,
      requestResponsiblePeople: [],
    } as any;
    if (radioButtonText === 'rolePresets' && selectedRoleId.length > 0) {
      payload['roleSelection'] = 'ROLE_PRESET';
      payload['roleCopiedFrom'] = selectedRoleId;
    } else if (radioButtonText === 'other' && selectedRoleId.length > 0) {
      payload['roleSelection'] = 'EXISTING_USER_PERMISSION';
      payload['userRoleCopiedFrom'] = selectedRoleId;
    }
    if (roleAccessData?.length > 0) {
      const newArr = roleAccessData?.map((rest: any) => {
        const newData = rest.subAction.map((rest2: any) => {
          const subData = rest2.secondSubActions.map((rest3: any) => {
            let newName = rest3.code;
            delete rest3.code;
            delete rest3.defaultEnable;
            return { ...rest3, name: newName };
          });
          let newName = rest2.code;
          delete rest2.code;
          return { ...rest2, secondSubActions: subData, name: newName };
        });
        let newName = rest.code;
        delete rest.code;
        return { ...rest, subAction: newData, name: newName };
      });
      payload['actionsAllowed'] = newArr;
    }
    if (
      isAdminReviewApproved &&
      reviewerApproverData.length > 0 &&
      userData?.roleType === 'INITIATOR'
    ) {
      payload['requestResponsiblePeople'] = reviewerApproverData;
    }
    payload['actionUserId'] = userId;

    if (requestTypeValue === 'SUBMIT') {
      const result = await setPermissionApiData(payload);
    } else {
      const result = await setDraftPermissionApiData(payload);
    }
  };

  const setPermissionApiData = async (payload: any) => {
    let res = {} as any;
    await updatePermissionsOfUserCreation(payload)
      .then((response) => {
        setIsUserCreated(true);
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const setDraftPermissionApiData = async (payload: any) => {
    let res = {} as any;
    await saveDraftUserPermission(payload)
      .then((response) => {
        setIsUserCreated(true);
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
        handleError(err.response.data);
      });
    return res;
  };

  const changeReviewerApproverOptions = (event: any) => {
    // console.log(
    //   'changeReviewerApproverOptions',
    //   event.target.value,
    //   isAdminReviewApproved
    // );
    if (event.target.value === 'yes,I') {
      setIsAdminReviewApproved(true);
    } else {
      setIsAdminReviewApproved(false);
    }
  };
  const handleChange = (newValue: Dayjs | null) => {
    changeEmploymentData(
      newValue,
      // moment(new Date(newValue).format('DD/MM/YYYY')),
      'dateOfJoining'
    );
  };
  const changeUserData = (
    e: any,
    type: string
    // 'employeeId' | 'employeeName' | 'email' | 'mobileNumber'
  ) => {
    let value = { ...userData?.personalDetails };
    value[`${type as keyof PersonalDetailsInterface}`] = e.target.value;

    setUserData((prev: any) => ({
      ...prev,
      personalDetails: { ...value },
    }));
  };
  const changeEmploymentData = (
    e: any,
    type: string
    // | 'designation'
    // | 'dateOfJoining'
    // | 'reportingHead'
    // | 'optionalReportingHead'
  ) => {
    let value = { ...userData?.employeeDetails };
    value[`${type as keyof EmployeeDetailsInterface}`] =
      type === 'dateOfJoining' ? e : e.target.value;

    setUserData((prev: any) => ({
      ...prev,
      employeeDetails: { ...value },
    }));
  };
  const changeEmploymentDropdownData = (
    name: string,
    type: string
    // 'reportingHead' | 'optionalReportingHead'
  ) => {
    let value = { ...userData?.employeeDetails };
    let arr = reportingHeadData?.options?.filter(
      (item: EmployeeDropdownInterface) => item.name === name
    );
    value[`${type as keyof EmployeeDetailsInterface}`] =
      arr?.length > 0 ? arr[0] : { name: name };

    setUserData((prev: any) => ({
      ...prev,
      employeeDetails: { ...value },
    }));
  };
  const RoleList = {
    defaultName: '',
    options: [
      { name: 'Head', value: 'Head' },
      { name: 'Executive', value: 'Executive' },
      { name: 'Manager', value: 'Manager' },
    ],
  };
  const onChangeChannel = (
    isSelected: boolean,
    selectedItem: DropdownInterface
  ) => {
    if (isSelected) {
      let value = selectedChannelOptions || [];
      setSelectedChannelOptions([...value, selectedItem.code]);
    } else {
      let alreadyPresent = selectedChannelOptions?.find(
        (eachItem) => eachItem === selectedItem.code
      );
      if (alreadyPresent) {
        let value = selectedChannelOptions?.filter(
          (eachItem) => eachItem !== selectedItem?.code
        );
        setSelectedChannelOptions(value);
      }
    }
  };
  const isItemPresent = (selectedItem: DropdownInterface) => {
    let filteredItems = selectedChannelOptions?.filter(
      (item) => item === selectedItem.code
    );
    return filteredItems && filteredItems?.length > 0 ? true : false;
  };
  const updateSubmitBtnStatus = () => {
    let disabled = true;
    if (
      userData?.personalDetails.employeeId !== '' &&
      !RegexValidation.characterNumber.test(
        userData?.personalDetails.employeeId || ''
      ) &&
      userData?.personalDetails.employeeName !== '' &&
      RegexValidation.nameValidation.test(
        userData?.personalDetails.employeeName || ''
      ) &&
      userData?.personalDetails.email !== '' &&
      RegexValidation.EmailPattern.test(
        userData?.personalDetails.email || ''
      ) &&
      userData?.personalDetails.mobileNumber !== '' &&
      RegexValidation.MobilePattern.test(
        userData?.personalDetails.mobileNumber || ''
      ) &&
      userData?.employeeDetails.dateOfJoining &&
      userData?.employeeDetails.designation !== '' &&
      userData?.employeeDetails?.reportingHead?.userId &&
      userData?.employeeDetails?.reportingHead?.userId !== '' &&
      // userData?.employeeDetails.optionalReportingHead !== '' &&
      selectedChannelOptions &&
      selectedChannelOptions?.length > 0 &&
      // userData?.cityId.length > 0 &&
      // userData?.stateId.length > 0 &&
      // userData?.zoneId.length > 0 &&
      // userData?.branchId.length > 0 &&
      userData?.roleType !== '' &&
      userData?.roleAccessType
    ) {
      // console.log(
      //   'date check userData?.employeeDetails.dateOfJoining',
      //   userData?.employeeDetails.dateOfJoining
      // );
      let currentYear = new Date().getTime();
      // console.log('currentYear', currentYear);
      let selectedTime = new Date(
        userData?.employeeDetails.dateOfJoining
      ).getTime();
      disabled = selectedTime > currentYear ? true : false;
    } else {
      disabled = true;
    }
    setSubmitbuttonDisabled(disabled);
  };
  const handleSubmitClick = () => {
    if (isPermission) {
      handlePermissionSubmitClick('SUBMIT');
    } else {
      // setIsPermission(true);
      onSubmitAction('SUBMIT');
    }
  };
  const handleSaveAsDraftClick = () => {
    if (isPermission) {
      handlePermissionSubmitClick('DRAFT');
    } else {
      onSubmitAction('DRAFT');
      navigate('/portal');
    }
  };

  const onSubmitAction = async (submitTypeValue: string) => {
    let payload: any = {};
    payload['organizationId'] = isEditMode
      ? userData.organizationId || organizationID
      : organizationID; //'63a9d377b7df547d20a0b6ed';
    payload['roleType'] = isEditMode ? userData.roleType : 'MEMBER';
    payload['personalDetails'] = {
      employeeId: userData?.personalDetails.employeeId,
      employeeName: userData?.personalDetails.employeeName,
      email: userData?.personalDetails.email,
      mobileNumber: userData?.personalDetails.mobileNumber,
    };
    payload['channelAccessible'] = selectedChannelOptions && [
      ...selectedChannelOptions,
    ];
    payload['roleAccessType'] = userData?.roleAccessType;
    payload['reportingTo'] = userData?.employeeDetails?.reportingHead?.userId;
    payload['reportingToSecondary'] =
      userData?.employeeDetails.optionalReportingHead?.userId;
    payload['employeeDetails'] = {
      designation: userData?.employeeDetails.designation,
      dateOfJoining: moment(userData?.employeeDetails.dateOfJoining).format(
        'YYYY-MM-DD'
      ),
    };
    payload['requestType'] = submitTypeValue;
    if (isEditMode || isTempEdit || submitTypeValue === 'DRAFT') {
      let value =
        state?.filteredData?.state?.selectedUserID ||
        state?.userData?.id ||
        createdUserId;
      payload['userId'] = value ? value : undefined; //'63a9d512d49f6977c06b38d7'; //todo need to check with vignesh
    }
    if (userData?.stateId && userData?.stateId?.length > 0) {
      payload['stateId'] = userData?.stateId;
    }
    if (userData?.cityId && userData?.cityId.length > 0) {
      payload['cityId'] = userData?.cityId;
    }
    if (userData?.zoneId && userData?.zoneId.length > 0) {
      payload['zoneId'] = [...userData?.zoneId];
    }
    if (userData?.branchId && userData?.branchId.length > 0) {
      payload['branchId'] = [...userData?.branchId];
    }
    payload['actionUserId'] = userId;
    console.log('onSubmitAction payload', payload, userData);
    if (isEditMode || isTempEdit) {
      updateUserMember(payload)
        .then((response) => {
          console.log('updateUserMember response', response);
          handleSuccess(response);
        })
        .catch((err) => {
          console.log('updateUserMember err', err);
          handleError(err?.response?.data ?? '');
        });
    } else {
      if (submitTypeValue === 'SUBMIT') {
        console.log('submitDraft');
        addUserMember(payload)
          .then((response) => {
            console.log('addUserMember response', response);
            handleSuccess(response);
          })
          .catch((err) => {
            console.log('addUserMember err', err);
            handleError(err?.response?.data ?? '');
          });
      } else {
        console.log('safeDraft');
        saveDraftUserCreation(payload)
          .then((response) => {
            console.log('addUserMember response', response);
            handleSuccess(response);
          })
          .catch((err) => {
            console.log('addUserMember err', err);
            handleError(err?.response?.data ?? '');
          });
      }
    }
  };

  const handleSuccess = (response: any) => {
    if (response.data.result) {
      isPermission ? setIsUserCreated(true) : setIsPermission(true);
      setCreatedUserId(response.data.result.id);
    } else {
      handleError(response?.data ?? '');
    }
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
  const handleSubmit = () => {
    setIsUserCreated(false);
    navigate('/userManagement/userCreation');
  };
  const fetchDuplicateRolelist = async () => {
    const payload = {
      roleName: '',
    } as any;
    const result = await getDuplicateRoleList(payload);
    setDuplicateRoleData(result);
  };
  const getDuplicateRoleList = async (payload: any) => {
    let res = {} as any;
    await getDuplicateRoleData(payload)
      .then((response) => {
        res = {
          options: [...response?.data?.result],
        };
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };
  const fetchEmptyPermissionData = async () => {
    const value: any = await localforage.getItem('loggedinUser');
    const payload = {
      userId: value.id,
    } as any;
    const result = await getInitialData(payload);
    setRoleAccessData(result?.result?.actionsAllowed);
  };
  const getInitialData = async (payload: any) => {
    let res = {} as any;
    await getInitialPageDetails(payload)
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
  const getAuthorizationItemDetails = async () => {
    let payload = {
      userId: createdUserId,
    };
    await getAuthorizationActiveDetail(payload)
      .then((response) => {
        if (response?.data?.result) {
          const res = response?.data?.result?.authorizationModules;
          setAuthData(res);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        setAuthData([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const getLocalStorageID = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setUserId(value.id);
      setorganizationId(value?.organization.id);
      setLoggedInUserChannel(value.channelAccessible);
      if (value.channelAccessible && value.channelAccessible?.length > 0) {
        setSelectedChannelOptions([...value.channelAccessible]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getHeadData = async () => {
    const payload = {
      name: '',
      organizationId: organizationID, // '63a9d377b7df547d20a0b6ed',
    } as any;
    const result = await getReportingHeadData(payload);
    setReportingHeadData(result);
  };
  const getReportingHeadData = async (payload: any) => {
    let res = {} as any;
    await getReportingHeadListUsers(payload)
      // await getReportingHeadList(payload) //todo need to revert back post testing
      .then((response) => {
        let data = response.data ? response.data : {};
        res = {
          options: data?.result,
        };
      })
      .catch((err) => {
        res = { error: err?.response?.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };
  const fetchFromExistingUsers = async (value: any) => {
    const payload = {
      userId: value.userId,
    } as any;

    const result = await getDetailofItem(payload);
    setRoleAccessData(result?.result?.actionsAllowedResponse);
    setReviewerApproverData(result?.result?.actionsAllowedResponse);
  };
  const getDetailofItem = async (payload: any) => {
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
  const setReviewerApproverData = async (result: any) => {
    // console.log('setReviewerApproverData', result);
    authData?.map((data: any) => {
      let respo = data.subModules.map((data1: any) => {
        data1['isVisible'] = false;
      });
      data['isVisible'] = false;
    });
    const newArr = result?.map((rest: any) => {
      const newData = rest.subAction.map((rest2: any) => {
        if (rest2.roleAccess === 'YES') switchCount++;
      });
      if (switchCount > 0) calCount++;
      switchCount = 0;
      if (rest.roleAccess === 'YES') checkCount++;
    });
    if (checkCount === calCount && checkCount != 0 && calCount != 0)
      setPermissionDisable(true);
    else setPermissionDisable(false);
    let listData = await result?.map((item: any) => {
      item.subAction.map((item2: any) => {
        if (item2.roleAccess === 'YES') {
          authData?.map((data: any) => {
            if (data.code === item.code) {
              let respo = data.subModules.map((data1: any) => {
                if (data1.code === item2.code) {
                  console.log('checking reviewer', data1);
                  data1 = { ...data1, isVisible: true };
                  return data1;
                } else {
                  if (data1.isVisible) {
                    return data1;
                  }
                  data1 = { ...data1, isVisible: false };
                  return data1;
                }
              });
              data.subModules = respo;
              data['isVisible'] = true;
            } else {
              if (data['isVisible'] === true) {
                return;
              }
              data['isVisible'] = false;
            }
          });
        } else {
          authData?.map((data: any) => {
            if (data.code === item.code) {
              let respo2 = data.subModules.map((data1: any) => {
                if (data1.code === item2.code) {
                  data1 = { ...data1, isVisible: false };
                  return data1;
                } else {
                  return data1;
                }
              });
              data.subModules = respo2;
            }
          });
          setAuthData(authData);
          reviewerApproverData?.map((item3: any, index: number) => {
            if (item3.modules === item.code) {
              var filtered = item3?.subModules.filter(function (el: any) {
                return el.subModules != item2.code;
              });
              item3.subModules = filtered;
            }
            if (filtered?.length === 0) {
              reviewerApproverData.splice(index, 1);
            }
          });
        }
      });
    });
  };
  useEffect(() => {
    if (editableUserId?.length > 0) handleReviewerApproverScreen();
  }, [editableUserId]);
  const handleReviewerApproverScreen = async () => {
    const payload = {
      id: editableUserId,
    } as any;
    const result = await getReviewerData(payload);
    let data = result?.result?.map((item: any) => {
      let data2 = item?.subModules?.map((item2: any) => {
        let approverData = item2.approver;
        let reviewerData = item2.reviewer;
        let codeVal2 = item2.subModule;
        let nameVal2 = item2.subModuleName;
        delete item2.subModule;
        delete item2.subModuleName;
        delete item2.approver;
        delete item2.reviewer;
        return {
          ...item2,
          approverData: approverData,
          reviewerData: reviewerData,
          code: codeVal2,
          name: nameVal2,
          isVisible: true,
        };
      });
      let codeVal = item.module;
      let nameVal = item.name;
      delete item.module;
      delete item.name;
      return {
        ...item,
        subModules: data2,
        code: codeVal,
        name: nameVal,
        isVisible: true,
      };
    });
    setAuthData(data);
    if (data.length > 0) {
      setIsAdminReviewApproved(true);
    } else {
      setIsAdminReviewApproved(false);
    }
  };
  const getReviewerData = async (payload: any) => {
    let res = {} as any;
    await getReviewerApproverData(payload)
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

  const getAutoCompleteValue = (key: string) => {
    return key === 'reportingHead'
      ? userData?.employeeDetails?.reportingHead?.name
      : userData?.employeeDetails?.optionalReportingHead?.name;
  };

  return (
    <Stack className="create-user-main-container">
      <Box className="create-user-container">
        <ScreenHeader
          title={isEditMode ? 'Edit User' : 'Create User'}
          info="From here you can create access presets to assign with users in Users Creation."
          showBackButton={true}
          gobackFun={gobackFun}
        />
        <Stack className="underline"></Stack>
        <Stack className="stepper-container">
          <Stack className="steppers">
            <Stack
              onClick={() => {
                if (isPermission) {
                  setIsPermission(false);
                  setIsTempEdit(true);

                  // setUserData(user_data);
                }
              }}
            >
              <img
                src={
                  isPermission ? CompletedStepperIcon : FirstActiveStepperIcon
                }
                alt=""
                className="stepper-icons"
              />
            </Stack>
            <Stack
              className={
                isPermission ? 'enabled-stepper-line' : 'disabled-stepper-line'
              }
            ></Stack>
            <img
              src={
                isPermission
                  ? SecondActiveStepperIcon
                  : SecondDisabledStepperIcon
              }
              alt=""
              className="stepper-icons"
            />
          </Stack>
          <Stack className="steppers-label-container">
            <Stack
              className="stepper-label enabled"
              onClick={() => {
                if (isPermission) {
                  setIsPermission(false);
                  setIsTempEdit(true);
                  // setUserData(user_data);
                }
              }}
            >
              Personal Details
            </Stack>
            <Stack
              className={
                isPermission
                  ? 'stepper-label enabled'
                  : 'stepper-label disabled'
              }
            >
              Permissions
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {isPermission ? (
        <>
          <Stack className="container">
            <HeaderWithInfo
              header="Permission allocation"
              isInfoEnabled={true}
              info="From here, you can add the user’s personal details"
              isDownloadEnabled={false}
            />
            <Stack className="form-container">
              <Typography
                className="each-field-label"
                sx={{ paddingBottom: '5px' }}
              >
                Copy Role Access from
              </Typography>
              <Grid container spacing={2}>
                <RadioGroup
                  defaultValue="rolePresets"
                  name="radio-buttons-group"
                  className="radio-group-container"
                  onChange={(e) => {
                    let value = e.target.value;

                    setUserData((prev: any) => ({
                      ...prev,
                      roleType: { value },
                    }));
                  }}
                >
                  {RoleAccessFrom?.map((eachItem: any, index: number) => {
                    return (
                      <Grid item xs={3} key={index} className="checkbox-label">
                        <FormControlLabel
                          value={eachItem?.value}
                          control={<Radio color="secondary" />}
                          label={eachItem?.label}
                          onClick={() => {
                            fetchEmptyPermissionData();
                            setSelectedRoleId('');
                            setAuthData([]);
                            setRadioButton(eachItem?.value);
                            getAuthorizationItemDetails();
                            setPermissionDisable(false);
                          }}
                        />
                      </Grid>
                    );
                  })}
                </RadioGroup>
              </Grid>
              {radioButtonText === 'rolePresets' && (
                <Stack className="form-container">
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography className="each-field-label">
                        Select User Role
                      </Typography>
                      <SearchSelectDropdown
                        parentValue={selectedRoleId}
                        data={duplicateRoleDataApi}
                        onHandleChange={async (value: any) => {
                          setAuthData([]);
                          await getAuthorizationItemDetails();
                          setRoleAccessData(value?.actionsAllowed);
                          setSelectedRoleId(value.id);
                          await setReviewerApproverData(value?.actionsAllowed);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              )}
              {radioButtonText === 'other' && (
                <Stack className="form-container">
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography className="each-field-label">
                        Select from Existing Users
                      </Typography>
                      <SearchSelectDropdown
                        parentValue={selectedRoleId}
                        data={reportingHeadData}
                        onHandleChange={(value: any) => {
                          // console.log('value', value);
                          setSelectedRoleId(value.userId);
                          fetchFromExistingUsers(value);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              )}
            </Stack>
          </Stack>
          <Stack className="container">
            <HeaderWithInfo
              header="Permission"
              isInfoEnabled={true}
              info="From here, you can add the user’s personal details"
              isDownloadEnabled={false}
            />
            {selectedRoleId.length === 0 && (
              <div style={{ pointerEvents: 'none' }}>
                <AccordianLayover
                  data={roleAccessData}
                  isViewPage={false}
                  handleCallBack={async (data: any) => {
                    const result = await data.map(
                      ({ isExpanded, ...rest }: any) => ({ ...rest })
                    );
                    setRoleAccessData(result);
                    await setReviewerApproverData(result);
                  }}
                />
              </div>
            )}
            {selectedRoleId.length > 0 && (
              <AccordianLayover
                data={roleAccessData}
                isViewPage={false}
                handleCallBack={async (data: any) => {
                  const result = await data.map(
                    ({ isExpanded, ...rest }: any) => ({ ...rest })
                  );
                  const newArr = result.map((rest: any) => {
                    const newData = rest.subAction.map((rest2: any) => {
                      if (rest2.roleAccess === 'YES') switchCount++;
                    });
                    if (switchCount > 0) calCount++;
                    switchCount = 0;
                    if (rest.roleAccess === 'YES') checkCount++;
                  });
                  if (
                    checkCount === calCount &&
                    checkCount != 0 &&
                    calCount != 0 &&
                    selectedRoleId.length > 0
                  )
                    setPermissionDisable(true);
                  else setPermissionDisable(false);
                  setRoleAccessData(result);
                  await setReviewerApproverData(result);
                }}
              />
            )}
          </Stack>
          {userData?.roleAccessType === 'INITIATOR' && (
            <Stack className="container">
              <HeaderWithInfo
                header="Reviewer & Approver allocation"
                isInfoEnabled={true}
                info="From here, you can add the user’s personal details"
                isDownloadEnabled={false}
              />
              <Stack className="form-container">
                <Typography
                  className="each-field-label"
                  sx={{ paddingBottom: '5px' }}
                >
                  Reviewer & Approver allocation
                </Typography>
                <Grid container spacing={2}>
                  <RadioGroup
                    defaultValue={
                      isEditMode && authData.length > 0 ? 'yes,I' : ''
                    }
                    name="radio-buttons-group"
                    className="radio-group-container"
                    onChange={changeReviewerApproverOptions}
                  >
                    {ReviewerApproverAllocation?.map(
                      (eachItem: any, index: number) => {
                        return (
                          <Grid
                            item
                            xs={3}
                            key={index}
                            className="checkbox-label"
                          >
                            <FormControlLabel
                              value={eachItem?.value}
                              control={<Radio color="secondary" />}
                              label={eachItem?.label}
                            />
                          </Grid>
                        );
                      }
                    )}
                  </RadioGroup>
                </Grid>
                {isAdminReviewApproved && (
                  <Stack>
                    <ReviewerApproverTable
                      data={authData}
                      mode={isEditMode ? 'edit' : 'create'}
                      options={reportingHeadData}
                      handleResponseData={(data: any) => {
                        setSelectedReviewerApproverData(data);
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>
          )}
        </>
      ) : (
        <>
          <Stack className="container">
            <HeaderWithInfo
              header="Personal Details"
              isInfoEnabled={true}
              info="From here, you can add the user’s personal details"
              isDownloadEnabled={false}
            />
            <Stack className="form-container">
              <Grid container spacing={2}>
                {PersonalDetails?.map(
                  (eachItem: personalDetailsInterface, index: number) => {
                    // console.log('eachItem', eachItem);
                    return (
                      <Grid item xs={4} key={index}>
                        <Typography
                          sx={{ marginBottom: '5px' }}
                          className="each-field-label"
                        >
                          {eachItem?.label}
                        </Typography>
                        <TextField
                          placeholder={eachItem?.placeHolder}
                          value={
                            userData?.personalDetails[
                              eachItem?.code as keyof PersonalDetailsInterface
                            ]
                          }
                          onChange={(e: any) =>
                            changeUserData(
                              e,
                              eachItem?.code as keyof PersonalDetailsInterface
                            )
                          }
                          error={
                            // (eachItem.code === 'email' ||
                            //   eachItem.code === 'mobileNumber') &&
                            // userData?.personalDetails[
                            //   eachItem?.code as keyof PersonalDetailsInterface
                            // ] !== ''
                            //   ?
                            validateInputFields({
                              textId: eachItem?.code ?? '',
                              value:
                                userData?.personalDetails[
                                  eachItem?.code as keyof PersonalDetailsInterface
                                ] || '',
                            }).showError
                            //  validateMobEmail(
                            //     eachItem.code,
                            // userData?.personalDetails[
                            //   eachItem?.code as keyof PersonalDetailsInterface
                            // ] || ''
                            //   )
                            // :false
                          }
                          helperText={
                            validateInputFields({
                              textId: eachItem?.code ?? '',
                              value:
                                userData?.personalDetails[
                                  eachItem?.code as keyof PersonalDetailsInterface
                                ] || '',
                            }).message
                            // (eachItem.code === 'email' ||
                            //   eachItem.code === 'mobileNumber') &&
                            // userData?.personalDetails[
                            //   eachItem?.code as keyof PersonalDetailsInterface
                            // ] !== ''
                            //   ? validateMobEmail(
                            //       eachItem.code,
                            //       userData?.personalDetails[
                            //         eachItem?.code as keyof PersonalDetailsInterface
                            //       ] || ''
                            //     )
                            //     ? getErrorMessage(eachItem.code)
                            //     : ''
                            //   : ''
                          }
                        />
                      </Grid>
                    );
                  }
                )}
              </Grid>
            </Stack>
          </Stack>
          <Stack className="container">
            <HeaderWithInfo
              header="Employment Details"
              isInfoEnabled={true}
              info="From here, you can add the user’s personal details"
              isDownloadEnabled={false}
            />
            <Stack className="form-container">
              <Grid container spacing={2}>
                {EmploymentDetails?.map(
                  (eachItem: employmentDetailsInterface, index: number) => {
                    return (
                      <Grid item xs={4} key={index}>
                        <Typography
                          className="each-field-label"
                          sx={{ marginBottom: '5px' }}
                        >
                          {eachItem?.label}
                        </Typography>
                        {eachItem?.label === 'Date of Joining' ? (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                              inputFormat="DD MMM YYYY"
                              value={
                                userData?.employeeDetails[
                                  eachItem?.code as keyof personalDetailsInterface
                                ]
                              }
                              onChange={handleChange}
                              disableFuture
                              renderInput={(params) => (
                                <TextField {...params} error={false} />
                              )}
                              components={{
                                OpenPickerIcon: CalendarTodayOutlinedIcon,
                              }}
                              OpenPickerButtonProps={{
                                style: {
                                  color: userData?.employeeDetails[
                                    eachItem?.code as keyof personalDetailsInterface
                                  ]
                                    ? '#0662b7'
                                    : '#D2D2D3',
                                },
                              }}
                            />
                          </LocalizationProvider>
                        ) : eachItem?.label === 'Reporting Head' ||
                          eachItem.label === 'Optional Reporting Head' ? (
                          // let value = eachItem?.label === 'Reporting Head' ? '': '';
                          <Autocomplete
                            inputValue={
                              getAutoCompleteValue(eachItem?.code || '') || ''
                            }
                            id="free-solo-demo"
                            freeSolo
                            options={reportingHeadData?.options?.map(
                              (option: any) => option.name
                            )}
                            onInputChange={(event, newInputValue) => {
                              changeEmploymentDropdownData(
                                newInputValue,
                                eachItem?.code as keyof personalDetailsInterface
                              );
                            }}
                            // if(eachItem?.label === 'Reporting Head'){
                            //   renderInput={(params) => <TextField {...params} placeholder="Enter Reporting Head" />}
                            // }else{
                            // }
                            renderInput={(params) => (
                              <TextField
                                sx={{ fontSize: '14px' }}
                                {...params}
                                placeholder={
                                  eachItem?.label === 'Optional Reporting Head'
                                    ? 'Enter Optional Reporting Head'
                                    : 'Enter Reporting Head'
                                }
                              />
                            )}
                            sx={{
                              '& legend': { display: 'none' },
                              '& fieldset': { top: 0 },
                            }}
                          />
                        ) : (
                          <TextField
                            placeholder={eachItem?.placeHolder}
                            value={
                              userData?.employeeDetails[
                                eachItem?.code as keyof personalDetailsInterface
                              ]
                            }
                            onChange={(e: any) =>
                              changeEmploymentData(
                                e,
                                eachItem?.code as keyof personalDetailsInterface
                              )
                            }
                            error={
                              validateInputFields({
                                textId: eachItem?.code ?? '',
                                value:
                                  userData?.employeeDetails[
                                    eachItem?.code as keyof personalDetailsInterface
                                  ] || '',
                              }).showError
                            }
                            helperText={
                              validateInputFields({
                                textId: eachItem?.code ?? '',
                                value:
                                  userData?.employeeDetails[
                                    eachItem?.code as keyof personalDetailsInterface
                                  ] || '',
                              }).message
                            }
                          />
                        )}
                      </Grid>
                    );
                  }
                )}
              </Grid>
            </Stack>
          </Stack>
          <Stack className="container">
            <HeaderWithInfo
              header="Channel Accessible Details"
              isInfoEnabled={true}
              info="From here, you can add the user’s personal details"
              isDownloadEnabled={false}
            />
            <Stack className="form-container">
              <Typography
                className="each-field-label"
                sx={{ paddingBottom: '5px' }}
              >
                Select Channel
              </Typography>
              <Grid container spacing={2}>
                {channelOptions?.map(
                  (eachItem: DropdownInterface, index: number) => {
                    return (
                      <Grid item xs={2} key={index} className="checkbox-label">
                        <FormControlLabel
                          control={
                            <Checkbox
                              disabled
                              sx={{
                                color: '#A8A8A9',
                              }}
                              style={{
                                transform: 'scale(1.2)',
                              }}
                              checked={isItemPresent(eachItem)}
                              onChange={(e) =>
                                onChangeChannel(e.target.checked, eachItem)
                              }
                            />
                          }
                          label={eachItem?.name}
                        />
                      </Grid>
                    );
                  }
                )}
              </Grid>
            </Stack>
          </Stack>
          <Stack className="container">
            <HeaderWithInfo
              header="Level - State, Zonal, City, Branch"
              isInfoEnabled={true}
              info="From here, you can add the user’s personal details"
              isDownloadEnabled={false}
            />
            <Stack className="form-container">
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography
                    className="each-field-label"
                    sx={{ marginBottom: '5px' }}
                  >
                    State
                  </Typography>
                  {stateFilters?.map((eachItem: any, index: number) => {
                    return (
                      <Multiselector
                        options={eachItem?.options}
                        selectedValuesFromParent={eachItem?.selectedValues}
                        sendSelectedValues={(selectedValues: Array<string>) => {
                          var is_same =
                            eachItem.selectedValues.length ==
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
                      />
                    );
                  })}
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    className="each-field-label"
                    sx={{ marginBottom: '5px' }}
                  >
                    Zone
                  </Typography>
                  {zoneFilters?.map((eachItem: any, index: number) => {
                    return (
                      <Multiselector
                        options={eachItem?.options}
                        selectedValuesFromParent={eachItem?.selectedValues}
                        sendSelectedValues={(selectedValues: Array<string>) =>
                          setZoneSelectedDropdownValue(selectedValues, eachItem)
                        }
                      />
                    );
                  })}
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    className="each-field-label"
                    sx={{ marginBottom: '5px' }}
                  >
                    District
                  </Typography>
                  {cityFilters != null ? (
                    <>
                      {cityFilters?.map((eachItem: any, index: number) => {
                        return (
                          <Multiselector
                            options={eachItem?.options}
                            selectedValuesFromParent={eachItem?.selectedValues}
                            sendSelectedValues={(
                              selectedValues: Array<string>
                            ) =>
                              setCitySelectedDropdownValue(
                                selectedValues,
                                eachItem
                              )
                            }
                          />
                        );
                      })}{' '}
                    </>
                  ) : (
                    <Multiselector options={[]} />
                  )}
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    className="each-field-label"
                    sx={{ marginBottom: '5px' }}
                  >
                    Branch
                  </Typography>
                  {branchFilters?.map((eachItem: any, index: number) => {
                    return (
                      <Multiselector
                        options={eachItem?.options}
                        selectedValuesFromParent={eachItem?.selectedValues}
                        sendSelectedValues={(selectedValues: Array<string>) =>
                          setBranchSelectedDropdownValue(
                            selectedValues,
                            eachItem
                          )
                        }
                      />
                    );
                  })}
                </Grid>
                {/* {DropdownFields?.map((eachItem: any, index: number) => {
                  return (
                    <Grid item xs={4} key={index}>
                      <Typography className="each-field-label">
                        {eachItem?.label}
                      </Typography>
                      <Multiselector options={eachItem?.option} />
                    </Grid>
                  );
                })} */}
              </Grid>
            </Stack>
          </Stack>
          <Stack className="container">
            <HeaderWithInfo
              header="Role Details"
              isInfoEnabled={true}
              info="From here, you can add the user’s personal details"
              isDownloadEnabled={false}
            />
            <Stack className="form-container">
              <Typography
                className="each-field-label"
                sx={{ marginBottom: '5px' }}
              >
                Role Access Type
              </Typography>
              <Grid container spacing={2}>
                <RadioGroup
                  value={userData?.roleAccessType}
                  name="radio-buttons-group"
                  className="radio-group-container"
                  onChange={(e) => {
                    setUserData((prev: any) => ({
                      ...prev,
                      roleAccessType: e.target.value,
                    }));
                  }}
                >
                  {RoleDetails?.map((eachItem: any, index: number) => {
                    return (
                      <Grid item xs={2} key={index} className="checkbox-label">
                        <FormControlLabel
                          value={eachItem?.code}
                          control={<Radio color="secondary" />}
                          label={eachItem?.name}
                        />
                      </Grid>
                    );
                  })}
                </RadioGroup>
              </Grid>
            </Stack>
          </Stack>
        </>
      )}
      {isEditMode ? (
        <FooterButton
          cancel="Close"
          submit="Submit"
          handleSubmitClick={handleSubmitClick}
          handleCancelClick={goBack}
          disabled={isPermission ? permissionDisable : !submitbuttonDisabled}
        />
      ) : (
        <FooterButton
          cancel="Close"
          submit="Submit"
          disabled={isPermission ? permissionDisable : !submitbuttonDisabled}
          saveAsDraft="Save as draft"
          handleSubmitClick={handleSubmitClick}
          handleCancelClick={goBack}
          handleSaveasDraftClick={handleSaveAsDraftClick}
        />
      )}
      {isUserCreated && (
        <SuccessModal
          openSuccess={isUserCreated}
          handleCloseSuccess={handleSubmit}
          successModalTitle={`User ${
            isEditMode ? 'Edited' : 'Created'
          } Successfully`}
          successModalMsg={`Your request for ${
            isEditMode ? 'editing' : 'creating'
          } new user is successfully sent to the Reviewer.`}
          btn={' Close'}
        />
      )}
      {showCloseModal && (
        <CustomModal
          openSuccess={showCloseModal}
          handleCloseSuccess={() => {
            setShowCloseModal(false);
            navigate('/userManagement/userCreation');
          }}
          successModalTitle={'Do you want to Close?'}
          discardModalMsg={
            'Want to discard entered values and go back to list screen?'
          }
          handleSuccess={() => setShowCloseModal(false)}
          yesContinueBtn={'Cancel'}
          closeBtn={'Yes, Close'}
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
}
export default CreateUser;
