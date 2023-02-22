import React, { useEffect, useState } from 'react';
import moment from 'moment';
import localforage from 'localforage';

// MUI components
import {
  Stack,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Divider,
  Checkbox,
  Autocomplete,
} from '@mui/material';
import './onboarding.scss';
import { SelectChangeEvent } from '@mui/material/Select';
import { useLocation, useNavigate } from 'react-router-dom';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Modal from '@mui/material/Modal';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

// Styles
import './onboarding.scss';
import { colors } from '../../../../../style/Color';

// Assets
import Info_Icon from '../../../../../assets/images/info_icon.svg';
import EditIcon from '../../../../../assets/images/edit_card.svg';
import ViewDoc from '../../../../../assets/images/viewDoc.svg';

// Common components
import TypoText from '../../../../../components/commonComponent/CustomText/Textfield';
import TypographyInfo from '../../../../../components/commonComponent/CustomText/Info';
import BtnContained from '../../../../../components/commonComponent/CustomText/Button/Contained';
import BtnOutlined from '../../../../../components/commonComponent/CustomText/Button/Outlined';
import TypographySubTitle from '../../../../../components/commonComponent/CustomText/Typography';
import BtnText from '../../../../../components/commonComponent/CustomText/Button/Text';
import { ScreenHeader } from '../../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import TypographyHead from '../../../../../components/commonComponent/CustomText/Head';
import CustomModal from '../../../../../components/commonComponent/customModal/CustomModal';
import ErrorMessage from '../../../../../components/commonComponent/ErrorMessage';
import HeaderWithInfo from '../../../../../components/commonComponent/HeaderWithInfo';

// Interface
import {
  bankDetailsInterface,
  DirectorDetailsInterface,
  documentValue,
  KeyContactDetailsInterface,
  regulatoryRequirementInterface,
  regulatoryRequirementPaymentInterface,
  SupplierDetailsInterface,
} from '../../orgStructureInterface';

// Services
import {
  getOrganizationDropDown,
  getOrgStructureDetails,
  getOrganizationBankDropdownData,
  registerFintech,
  registerDSA,
  addSingleImageOrg,
  updateDSA,
  updateFintech,
  getOrgStructureFile,
  saveDraftDSA,
} from '../../../../../services/orgStructureServices';
import {
  getDistrictList,
  getReportingHeadList,
  getStateList,
} from '../../../../../services/userCreationServices';
import { getProgramMgntDropdownData } from '../../../../../services/programmeManagementServices';

// Utils
import { RegexValidation } from '../../../../../utils/Regex';
import { url } from '../../../../../utils/constants/url';
import { validateInputFields } from '../../../../../utils/validations/input';

// sub components
import { Upload } from './upload';

const directorDetailsTemplate = {
  name: '',
  mobileNumber: '',
  email: '',
  gender: '',
  dob: '',
  role: '',
  designation: '',
  address: '',
};
const keyContactDetailsTemplate = {
  name: '',
  mobileNumber: '',
  email: '',
  role: '',
  designation: '',
  reportingHead: '',
};
const supplierDetailsTemplate = {
  supplierName: '',
  workAddress: '',
  stateRef: '',
  stateName: '',
  stateId: [],
  cityRef: '',
  countryRef: 'India',
  operatingCity: '',
  tellNumber: '',
  email: '',
  businessSince: '',
  businessNature: '',
  companyNature: '',
  companyClarity: '',
  companyRegistrationNo: '',
  majorProducts: '',
  serviceDescription: '',
};
const regulatoryRequirementTemplate = {
  registerNumber: '',
  pfregisterNumberFile: '',
  tinNumber: '',
  tinNumberFile: '',
  tinFileUploadSuccess: false,
  gstNumber: '',
  gstNumberFile: '',
  gstNumberFileUploadSuccess: false,
  panNumber: '',
  panNumberFile: '',
  panNumberFileUploadSuccess: false,
  shopNumber: '',
  shopNumberFile: '',
  shopNumberFileUploadSuccess: false,
  esicNumber: '',
  esicNumberFile: '',
  esicNumberFileUploadSuccess: false,
  pfRegisterNumber: '',
  pfNumberFile: '',
  pfNumberfileUploadSuccess: false,
};
const bankDetailsTemplate = {
  bankName: '',
  bankAccountNumber: '',
  ifscCode: '',
  addressline1: '',
  addressline2: '',
  pincode: '',
  micrCode: '',
  micrCodeFile: '',
  micrCodeFileSuccess: false,
};
const regulatoryRequirementPaymentTemplate = {
  payeeDetails: '',
  payeeAddress: '',
  defaultCreditPeriod: 0,
  reason: '',
};
export const Onboarding = () => {
  const [progress, setProgress] = useState(0);
  const [declartion, setDeclartion] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [activeDocLink, setActiveDocLink] = useState('');
  const [value, setValue] = useState('');
  const handleOpen = (value: any) => {
    setOpen(true);
    setActiveDocLink(value);
  };
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [dateValue, setDateValue] = React.useState('');
  const [viewData, setViewData] = React.useState<any>();
  const [showSuccesModal, setShowSuccesModal] = useState(false);
  const [viewMode, setViewMode] = useState<string>(
    state?.isEditable ? 'add' : 'view'
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [supplierDetailsData, setSupplierDetailsData] =
    useState<SupplierDetailsInterface>(supplierDetailsTemplate);
  const [directorDetails, setDirectorDetails] = useState<
    DirectorDetailsInterface[]
  >([{ ...directorDetailsTemplate }]);
  const [keyContactDetails, setKeyContactDetails] = useState<
    KeyContactDetailsInterface[]
  >([{ ...keyContactDetailsTemplate }]);
  const [regulatoryRequirementPayment, setRegulatoryRequirementPayment] =
    useState<regulatoryRequirementPaymentInterface>(
      regulatoryRequirementPaymentTemplate
    );
  const [regulatoryRequirement, setRegulatoryRequirement] =
    useState<regulatoryRequirementInterface>(regulatoryRequirementTemplate);
  const [bankDetailsData, setBankDetailsData] =
    useState<bankDetailsInterface>(bankDetailsTemplate);
  const [stateList, setStateList] = useState<any>([]);
  const [cityList, setCityList] = useState<any>([]);
  const [getListSurrogateItems, setGetListSurrogateItems] = useState<any>([]);
  const [getNatureOfBussinessItems, setGetNatureOfBussinessItems] =
    useState<any>([]);
  const [getNatureOfCompanyItems, setGetNatureOfCompanyItems] = useState<any>(
    []
  );
  const [getClarityOnCompanyItems, setGetClarityOnCompanyItems] = useState<any>(
    []
  );
  const [getListOfGenderItems, setGetListOfGenderItems] = useState<any>([]);
  const [getListOfUserRoleItems, setGetListOfUserRoleItems] = useState<any>([]);
  const [directorUserRolesItems, setDirectorUserRoleItems] = useState<any>([]);
  const [selectedSurrogate, setSelectedSurrogate] = useState<any>([]);
  const [getListOfBankItems, setGetListOfBankItems] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [apiError, setApiError] = useState('');
  const [submitBtnStatus, setSubmitBtnStatus] = useState<boolean>();
  const [documentData, setDocumentData] = useState<documentValue>();
  const [reportingHeadData, setReportingHeadData] = useState<any>([]);
  const [userId, setUserId] = useState<string>('');
  const [organizationID, setorganizationId] = useState();
  const [reportingID, setReportingID] = useState<string[]>([]);
  const [tempDirectorDetailsArray, setTempDirectorDetailsArray] = useState([]);
  const [tempKeyContactArray, setTempKeyContactArray] = useState([]);
  const [showCloseModal, setShowCloseModal] = useState(false);
  let headerCount = 0;
  let keyHeaderCount = 0;

  /*useEffect*/

  useEffect(() => {
    if ((isEditMode && state?.isEditable) || viewMode === 'view') {
      getOrgStructureDetailItems();
    }
  }, [viewMode, isEditMode]);

  useEffect(() => {
    viewData && updateValueToEdit();
  }, [viewData]);

  useEffect(() => {
    getProgramDropDownData();
    // getListItemSurrogate();
    getListOfNatureOfCompany();
    getListOfNatureOfBussiness();
    getListOfClarityOnCompany();
    getLisOfGender();
    getListOfUserRole();
    getDirectorDetailsUserRole();
    getListOfBank();
    getStateData();
    getLocalStorageID();
  }, []);

  useEffect(() => {
    organizationID && getHeadData();
  }, [organizationID]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress !== 0) {
        setProgress((oldProgress) => {
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  useEffect(() => {
    if (supplierDetailsData?.stateRef) {
      getCityData();
    }
  }, [supplierDetailsData?.stateRef]);

  useEffect(() => {
    if (state?.setEditMode) {
      setIsEditMode(true);
    }
  }, []);

  useEffect(() => {
    updateSubmitBtnStatus();
  }, [
    selectedSurrogate,
    supplierDetailsData,
    directorDetails,
    bankDetailsData,
    keyContactDetails,
    declartion,
    regulatoryRequirement,
    regulatoryRequirementPayment,
  ]);

  useEffect(() => {
    if (reportingHeadData) {
      assignReportingHead();
    }
  }, [reportingHeadData, keyContactDetails]);

  const getLocalStorageID = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      const id = value.id;
      setUserId(id);
      setorganizationId(value?.organization.id);
    } catch (err) {
      console.log(err);
    }
  };

  const onBackButtonEvent = (e: any) => {
    if (state?.isEditable) {
      e.preventDefault();
      setShowCloseModal(true);
    }
  };

  useEffect(() => {
    if (state?.isEditable) {
      // window.history.pushState(null, '', window.location.pathname);
      console.log('check window');
      navigate('/userManagement/orgStructure/DSA', {
        state: {
          ...state,
        },
      });
      window.addEventListener('popstate', onBackButtonEvent);
    }

    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  }, []);

  const updateSubmitBtnStatus = () => {
    let validSupplierDetails = false;
    let validKeyDetails = false;
    let validDirectorDetails = false;
    let validBankDetails = false;
    let validregulatoryRequirementDetails = false;
    let validregulatoryRequirementDetailsPayment = false;
    let validTinUpload =
      regulatoryRequirement.tinNumberFile === '' ||
      !regulatoryRequirement.tinNumberFile
        ? true
        : regulatoryRequirement.tinNumberFileSuccess;
    let validGSTUpload =
      regulatoryRequirement.gstNumberFile === '' ||
      !regulatoryRequirement.gstNumberFile
        ? true
        : regulatoryRequirement.gstNumberFileSuccess;
    let validPANUpload =
      regulatoryRequirement.panNumberFile === '' ||
      !regulatoryRequirement.panNumberFile
        ? true
        : regulatoryRequirement.panNumberFileSuccess;
    let validShopNumberUpload =
      regulatoryRequirement.shopNumberFile === '' ||
      !regulatoryRequirement.shopNumberFile
        ? true
        : regulatoryRequirement.shopNumberFileSuccess;
    let validESICUpload =
      regulatoryRequirement.esicNumberFile === '' ||
      !regulatoryRequirement.esicNumberFile
        ? true
        : regulatoryRequirement.esicNumberFileSuccess;
    let validPFUpload =
      regulatoryRequirement.pfNumberFile === '' ||
      !regulatoryRequirement.pfNumberFile
        ? true
        : regulatoryRequirement.pfNumberFileSuccess;
    let validCancelledChequeUpload =
      bankDetailsData.micrCodeFile === '' || !bankDetailsData.micrCodeFile
        ? true
        : bankDetailsData.micrCodeFileSuccess;

    if (
      selectedSurrogate?.length > 0 &&
      supplierDetailsData?.supplierName !== '' &&
      RegexValidation.onlycharacterAndDot.test(
        supplierDetailsData?.supplierName || ''
      ) &&
      supplierDetailsData?.workAddress !== '' &&
      supplierDetailsData?.cityRef !== '' &&
      supplierDetailsData?.stateRef !== '' &&
      supplierDetailsData?.countryRef !== '' &&
      supplierDetailsData?.operatingCity !== '' &&
      RegexValidation.onlycharacter.test(
        supplierDetailsData?.operatingCity || ''
      ) &&
      supplierDetailsData?.tellNumber !== '' &&
      RegexValidation.MobilePattern.test(
        supplierDetailsData?.tellNumber || ''
      ) &&
      supplierDetailsData?.email !== '' &&
      RegexValidation.EmailPattern.test(supplierDetailsData?.email || '') &&
      supplierDetailsData?.businessSince !== '' &&
      supplierDetailsData?.companyNature !== '' &&
      supplierDetailsData?.businessNature !== '' &&
      supplierDetailsData?.companyRegistrationNo !== '' &&
      !RegexValidation.characterNumber.test(
        supplierDetailsData?.companyRegistrationNo || ''
      ) &&
      supplierDetailsData?.majorProducts !== '' &&
      !RegexValidation.characterNumber.test(
        supplierDetailsData?.majorProducts || ''
      ) &&
      supplierDetailsData?.serviceDescription !== '' &&
      !RegexValidation.characterNumber.test(
        supplierDetailsData?.serviceDescription || ''
      ) &&
      declartion
    ) {
      let currentYear = new Date().getFullYear();
      validSupplierDetails =
        Number(supplierDetailsData.businessSince) <= currentYear ? true : false;
    } else {
      validSupplierDetails = false;
    }
    if (keyContactDetails?.length > 0) {
      let objData = keyContactDetails[0];
      if (
        objData.name !== '' &&
        RegexValidation.onlycharacterAndDot.test(objData.name || '') &&
        objData.mobileNumber !== '' &&
        RegexValidation.MobilePattern.test(objData.mobileNumber || '') &&
        objData.email !== '' &&
        RegexValidation.EmailPattern.test(objData.email || '') &&
        objData.role !== '' &&
        objData.designation !== '' &&
        !RegexValidation.characterNumber.test(objData.designation || '') &&
        objData.reportingHead !== ''
      ) {
        validKeyDetails = true;
      } else {
        validKeyDetails = false;
      }
    } else {
      validKeyDetails = false;
    }
    if (directorDetails?.length > 0) {
      let dirData = directorDetails[0];
      if (
        dirData.name !== '' &&
        RegexValidation.onlycharacterAndDot.test(dirData.name || '') &&
        dirData.mobileNumber !== '' &&
        RegexValidation.MobilePattern.test(dirData.mobileNumber || '') &&
        dirData.email !== '' &&
        RegexValidation.EmailPattern.test(dirData.email || '') &&
        dirData.gender !== '' &&
        dirData.dob !== '' &&
        dirData.role !== '' &&
        dirData.designation !== '' &&
        !RegexValidation.characterNumber.test(dirData.designation || '') &&
        dirData.address !== ''
      ) {
        validDirectorDetails = true;
      } else {
        validDirectorDetails = false;
      }
    } else {
      validDirectorDetails = false;
    }
    if (
      bankDetailsData?.bankName !== '' &&
      bankDetailsData?.bankAccountNumber !== '' &&
      RegexValidation.bankAccountNumber.test(
        bankDetailsData.bankAccountNumber || ''
      ) &&
      bankDetailsData?.ifscCode !== '' &&
      RegexValidation.ifscCode.test(bankDetailsData.ifscCode || '') &&
      bankDetailsData?.addressline1 !== '' &&
      bankDetailsData?.addressline2 !== '' &&
      bankDetailsData?.pincode !== '' &&
      RegexValidation.pincode.test(bankDetailsData.pincode || '') &&
      bankDetailsData?.micrCode !== '' &&
      bankDetailsData?.micrCodeFile !== '' &&
      RegexValidation.micrCodeValidate.test(bankDetailsData.micrCode || '')
      // bankDetailsData?.micrCodeFile !== ''
    ) {
      validBankDetails = true;
    } else {
      validBankDetails = false;
    }
    if (
      regulatoryRequirement?.registerNumber !== '' &&
      !RegexValidation.characterNumber.test(
        regulatoryRequirement?.registerNumber || ''
      ) &&
      regulatoryRequirement?.tinNumber !== '' &&
      !RegexValidation.capLetterNumber.test(
        regulatoryRequirement.tinNumber || ''
      ) &&
      regulatoryRequirement?.gstNumber !== '' &&
      RegexValidation.gstNumber.test(regulatoryRequirement.gstNumber || '') &&
      regulatoryRequirement?.panNumber !== '' &&
      RegexValidation.panNumberValidate.test(
        regulatoryRequirement.panNumber?.toUpperCase() || ''
      ) &&
      regulatoryRequirement?.shopNumber !== '' &&
      !RegexValidation.capLetterNumber.test(
        regulatoryRequirement.shopNumber || ''
      ) &&
      regulatoryRequirement?.esicNumber !== '' &&
      !RegexValidation.capLetterNumber.test(
        regulatoryRequirement.esicNumber || ''
      ) &&
      regulatoryRequirement?.pfRegisterNumber !== '' &&
      !RegexValidation.capLetterNumber.test(
        regulatoryRequirement.pfRegisterNumber || ''
      )
    ) {
      validregulatoryRequirementDetails = true;
    } else {
      validregulatoryRequirementDetails = false;
    }
    if (
      regulatoryRequirementPayment?.payeeDetails !== '' &&
      !RegexValidation.characterNumber.test(
        regulatoryRequirementPayment?.payeeDetails || ''
      ) &&
      regulatoryRequirementPayment?.payeeAddress !== '' &&
      regulatoryRequirementPayment?.defaultCreditPeriod !== '' &&
      RegexValidation.onlyNumber.test(
        regulatoryRequirementPayment?.defaultCreditPeriod || ''
      )
    ) {
      validregulatoryRequirementDetailsPayment = true;
    } else {
      validregulatoryRequirementDetailsPayment = false;
    }
    setSubmitBtnStatus(
      validSupplierDetails &&
        validKeyDetails &&
        validDirectorDetails &&
        validBankDetails &&
        validregulatoryRequirementDetails &&
        validregulatoryRequirementDetailsPayment &&
        validTinUpload &&
        validGSTUpload &&
        validPANUpload &&
        validShopNumberUpload &&
        validESICUpload &&
        validPFUpload &&
        validCancelledChequeUpload
        ? false
        : true
    );
  };

  const getReportingHeadData = async (payload: any) => {
    let res = {};
    await getReportingHeadList(payload)
      .then((response) => {
        res = response?.data ? response?.data : {};
      })
      .catch((err) => {
        res = { error: err?.response?.data };
      });
    return res;
  };

  const getHeadData = async () => {
    const payload = {
      name: '',
      organizationId: organizationID, //'63a9d377b7df547d20a0b6ed',
    } as any;
    const result: any = await getReportingHeadData(payload);
    if (result?.result) {
      setReportingHeadData(result);
    }
  };

  const getCityData = async () => {
    const payload = {
      name: '',
      stateId: supplierDetailsData?.stateId,
    };
    await getDistrictList(payload)
      .then((response: any) => {
        const result = response?.data?.result ?? [];
        if (result) {
          setCityList(result);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err: any) => {
        setCityList([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const getStateData = async () => {
    const payload = {
      name: '',
    };
    let res = {};
    await getStateList(payload)
      .then((response: any) => {
        const result = response?.data?.result ?? [];
        if (result) {
          setStateList(result);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err: any) => {
        res = { error: err?.response?.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const getProgramDropDownData = () => {
    let payload = {
      programDropDown: 'PROGRAM_TYPE',
    };
    getProgramMgntDropdownData(payload)
      .then((response: any) => {
        if (response?.data?.result) {
          setGetListSurrogateItems(
            response?.data?.result?.programDropDown || []
          );
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err: any) => {
        setGetListSurrogateItems([]);
        handleError(err?.response?.data ?? '');
      });
  };
  // const getListItemSurrogate = () => {
  //   let payload = {
  //     dropDown: 'ORGANIZATION_TYPE',
  //   };
  //   getOrganizationDropDown(payload)
  //     .then((response) => {
  //       setGetListSurrogateItems(
  //         response?.data?.result.organizationDropDown || []
  //       );
  //     })
  //     .catch((err) => {
  //       setGetListSurrogateItems([]);
  //     });
  // };
  const getListOfNatureOfBussiness = () => {
    let payload = {
      dropDown: 'ORGANIZATION_NATURE_OF_BUSINESS',
    };
    getOrganizationDropDown(payload)
      .then((response) => {
        if (response?.data?.result) {
          setGetNatureOfBussinessItems(
            response?.data?.result?.organizationDropDown || []
          );
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        setGetNatureOfBussinessItems([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const getListOfNatureOfCompany = () => {
    let payload = {
      dropDown: 'ORGANIZATION_NATURE_OF_COMPANY',
    };
    getOrganizationDropDown(payload)
      .then((response) => {
        if (response?.data?.result) {
          setGetNatureOfCompanyItems(
            response?.data?.result?.organizationDropDown || []
          );
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        setGetNatureOfCompanyItems([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const getListOfClarityOnCompany = () => {
    let payload = {
      dropDown: 'ORGANIZATION_CLARITY_ON_COMPANY',
    };
    getOrganizationDropDown(payload)
      .then((response) => {
        if (response?.data?.result) {
          setGetClarityOnCompanyItems(
            response?.data?.result?.organizationDropDown || []
          );
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        setGetClarityOnCompanyItems([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const getLisOfGender = () => {
    let payload = {
      dropDown: 'ORGANIZATION_GENDER',
    };
    getOrganizationDropDown(payload)
      .then((response) => {
        if (response?.data?.result) {
          setGetListOfGenderItems(
            response?.data?.result?.organizationDropDown || []
          );
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        setGetListOfGenderItems([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const getDirectorDetailsUserRole = () => {
    let payload = {
      dropDown: 'ORGANIZATION_DIRECTOR_ROLE',
    };
    getOrganizationDropDown(payload)
      .then((response) => {
        if (response?.data?.result) {
          setDirectorUserRoleItems(
            response?.data?.result?.organizationDropDown || []
          );
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        setDirectorUserRoleItems([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const getListOfUserRole = () => {
    let payload = {
      dropDown: 'ORGANIZATION_KEY_CONTACT_ROLE', //'ORGANIZATION_DIRECTOR_ROLE',
    };
    getOrganizationDropDown(payload)
      .then((response) => {
        if (response?.data?.result) {
          setGetListOfUserRoleItems(
            response?.data?.result?.organizationDropDown || []
          );
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        setGetListOfUserRoleItems([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const getListOfBank = () => {
    let payload = {
      bankName: '',
    };
    getOrganizationBankDropdownData(payload)
      .then((response) => {
        if (response?.data?.result) {
          setGetListOfBankItems(response?.data?.result || []);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        setGetListOfBankItems([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const getOrgStructureDetailItems = () => {
    let payload = {
      organizationId: state?.id, //state.id, todo
    };
    getOrgStructureDetails(payload)
      .then((response) => {
        if (response?.data?.result) {
          setViewData(response.data.result);
          if (
            response?.data?.result?.regulatoryRequirement ||
            response?.data?.result?.bankDetails?.cancelledCheckFile
          ) {
            updateOrgFileData(
              response?.data?.result?.regulatoryRequirement,
              response?.data?.result?.bankDetails?.cancelledCheckFile
            );
          }
        }
      })
      .catch((err) => {
        console.log('getOrgStructure response', err);
        handleError(err?.response?.data ?? '');
      });
  };

  useEffect(() => {
    if (isEditMode && state?.isEditable) {
      updateFileData();
    }
  }, [viewData, documentData]);

  const updateOrgFileData = (
    regulatoryRequirementData: any,
    cancelledChequeValue?: string
  ) => {
    let keyArr = [
      'esicNumberFileData',
      'gstNumberFileData',
      'panNumberFileData',
      'pfNumberFileData',
      'shopNumberFileData',
      'tinNumberFileData',
      'cancelledCheckFile',
    ];
    let arrValue = [
      regulatoryRequirementData?.esicNumberFile,
      regulatoryRequirementData?.gstNumberFile,
      regulatoryRequirementData?.panNumberFile,
      regulatoryRequirementData?.pfNumberFile,
      regulatoryRequirementData?.shopNumberFile,
      regulatoryRequirementData?.tinNumberFile,
      cancelledChequeValue,
    ];
    keyArr.forEach((item: any, index: number) => {
      arrValue[index] && getOrgFileData(arrValue[index], item);
    });
  };

  const getOrgFileData = async (fileName: string, key: string) => {
    await getOrgStructureFile(fileName)
      .then((response) => {
        if (response?.data) {
          setDocumentData((prev) => ({
            ...prev,
            [key]: fileName,
          }));
        }
      })
      .catch((err) => {
        console.log('getOrgFileData err', err);
        handleError(err?.response?.data ?? '');
      });
  };

  const updateValueToEdit = () => {
    let supplierDetailsDataRef = { ...supplierDetailsData };
    let payeeRef = { ...regulatoryRequirementPayment };
    let regulatoryRequirementRef = { ...regulatoryRequirement };
    let bankDetailsDataRef = { ...bankDetailsData };
    setSelectedSurrogate(
      viewData?.surrogateTypeList ? [...viewData?.surrogateTypeList] : []
    );
    supplierDetailsDataRef.supplierName =
      viewData?.supplierDetails?.supplierName || '';
    supplierDetailsDataRef.workAddress =
      viewData?.supplierDetails?.workAddress || '';
    supplierDetailsDataRef.stateId = [
      viewData?.supplierDetails?.state?.id || '',
    ];
    supplierDetailsDataRef.stateRef =
      viewData?.supplierDetails?.state?.id || '';
    supplierDetailsDataRef.cityId = [viewData?.supplierDetails?.city?.id || ''];
    supplierDetailsDataRef.cityRef = viewData?.supplierDetails?.city?.id || '';
    supplierDetailsDataRef.countryRef = 'India';
    supplierDetailsDataRef.operatingCity =
      viewData?.supplierDetails?.operatingCity || '';
    supplierDetailsDataRef.tellNumber =
      viewData?.supplierDetails?.tellNumber || '';
    supplierDetailsDataRef.email = viewData?.supplierDetails?.email || '';
    supplierDetailsDataRef.businessSince =
      viewData?.supplierDetails?.businessSince || '';
    supplierDetailsDataRef.businessNature =
      viewData?.supplierDetails?.natureOfBusiness || '';
    supplierDetailsDataRef.companyNature =
      viewData?.supplierDetails?.natureOfCompany || '';
    supplierDetailsDataRef.companyClarity =
      viewData?.supplierDetails?.clarityOfCompany || '';
    supplierDetailsDataRef.companyRegistrationNo =
      viewData?.supplierDetails?.companyRegistration || '';
    supplierDetailsDataRef.majorProducts =
      viewData?.supplierDetails?.majorProducts || '';
    supplierDetailsDataRef.serviceDescription =
      viewData?.supplierDetails?.descriptionItems || '';
    payeeRef.defaultCreditPeriod =
      viewData?.payeeDetails?.defaultCreditPeriod || '';
    payeeRef.payeeAddress = viewData?.payeeDetails?.payeeAddress || '';
    payeeRef.payeeDetails = viewData?.payeeDetails?.payeeDetails || '';
    payeeRef.reason = viewData?.payeeDetails?.reason || '';
    if (viewData?.directorDetails?.length > 0) {
      let directorArr = [...viewData?.directorDetails];
      // let directorArr = [
      //   {
      //     address: 'string',
      //     designation: 'string',
      //     dob: 'string',
      //     email: 'string',
      //     gender: 'MALE',
      //     mobileNumber: 'string',
      //     name: 'string',
      //     role: 'ADMIN',
      //   },
      // ];
      setDirectorDetails([...directorArr]);
    }
    if (viewData?.keyContactDetails?.length > 0) {
      let arr = [...viewData?.keyContactDetails];
      let final = arr?.map((item: any) => {
        // item.reportingHead = getReportingHeadId(false, item.reportingHead);
        // delete item.userId; //comment for //testing purpose
        return item;
      });
      setKeyContactDetails([...final]);
    }
    regulatoryRequirementRef.registerNumber =
      viewData?.regulatoryRequirement?.registerNumber || '';
    regulatoryRequirementRef.tinNumber =
      viewData?.regulatoryRequirement?.tinNumber || '';
    regulatoryRequirementRef.tinNumberFile =
      viewData?.regulatoryRequirement?.tinNumberFile || '';
    regulatoryRequirementRef.gstNumber =
      viewData?.regulatoryRequirement?.gstNumber || '';
    regulatoryRequirementRef.gstNumberFile =
      viewData?.regulatoryRequirement?.gstNumberFile || '';
    regulatoryRequirementRef.panNumber =
      viewData?.regulatoryRequirement?.panNumber || '';
    regulatoryRequirementRef.panNumberFile =
      viewData?.regulatoryRequirement?.panNumberFile || '';
    regulatoryRequirementRef.shopNumber =
      viewData?.regulatoryRequirement?.shopNumber || '';
    regulatoryRequirementRef.shopNumberFile =
      viewData?.regulatoryRequirement?.shopNumberFile || '';
    regulatoryRequirementRef.esicNumber =
      viewData?.regulatoryRequirement?.esicNumber || '';
    regulatoryRequirementRef.esicNumberFile =
      viewData?.regulatoryRequirement?.esicNumberFile || '';
    regulatoryRequirementRef.pfRegisterNumber =
      viewData?.regulatoryRequirement?.pfRegisterNumber || '';
    regulatoryRequirementRef.pfNumberFile =
      viewData?.regulatoryRequirement?.pfRegisterNumberFile || '';
    bankDetailsDataRef.bankName = viewData?.bankDetails?.bankName || '';
    bankDetailsDataRef.addressline1 =
      viewData?.bankDetails?.branchAddress1 || '';
    bankDetailsDataRef.addressline2 =
      viewData?.bankDetails?.branchAddress2 || '';
    bankDetailsDataRef.ifscCode = viewData?.bankDetails?.ifscCode || '';
    bankDetailsDataRef.bankAccountNumber =
      viewData?.bankDetails?.bankAccountNumber || '';
    bankDetailsDataRef.pincode = viewData?.bankDetails?.pincode || '';
    bankDetailsDataRef.micrCode = viewData?.bankDetails?.micrCode || '';
    bankDetailsDataRef.micrCodeFile = documentData?.cancelledCheckFile || ''; // viewData?.bankDetails?.cancelledCheckFile
    bankDetailsDataRef.micrCodeFileSuccess = documentData?.cancelledCheckFile
      ? true
      : false;
    setSupplierDetailsData((prev: any) => ({
      ...prev,
      ...supplierDetailsDataRef,
    }));
    setRegulatoryRequirement((prev: any) => ({
      ...prev,
      ...regulatoryRequirementRef,
    }));
    setBankDetailsData((prev: any) => ({
      ...prev,
      ...bankDetailsDataRef,
    }));
    setRegulatoryRequirementPayment((prev: any) => ({
      ...prev,
      ...payeeRef,
    }));
    setDeclartion(viewData?.declaration ? true : false);
  };
  const DOBStyle = {
    '& .MuiInputBase-root-MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline':
      {
        border: '1px solid black',
      },

    '& .MuiOutlinedInput-input:focused': {
      borderColor: '1px solid red',
    },
  };

  const updateKeyFromKeyContactArray = (data: any) => {
    let final = data?.filter((item: any, index: number) => {
      if (!item.keyDetailsUpdate) {
        return item;
      }
    });
    setTempKeyContactArray(final);
  };

  const AddKeyContact = () => {
    keyHeaderCount = 0;
    setKeyContactDetails((prev) => [...prev, { ...keyContactDetailsTemplate }]);
    updateKeyFromKeyContactArray([
      ...keyContactDetails,
      { ...keyContactDetailsTemplate },
    ]);
  };

  const removeKeyContact = (selectedIndex: number) => {
    // setKeyContactDetails((prev) => {
    //   let removeItem = [...prev];
    //   removeItem.splice(selectedIndex, 1);
    //   return [...removeItem];
    // });

    //new client requirement
    let arr = [...keyContactDetails];
    let final = arr?.map((item: any, index: number) => {
      if (index === selectedIndex) item.keyDetailsUpdate = 'REMOVE';
      return item;
    });
    keyHeaderCount = 0;
    setKeyContactDetails([...final]);
    updateKeyFromKeyContactArray(final);
  };

  const updateKeyFromProprietorArray = (data: any) => {
    let final = data?.filter((item: any, index: number) => {
      if (!item.keyDetailsUpdate) {
        return item;
      }
    });
    setTempDirectorDetailsArray(final);
  };

  const AddProprietor = () => {
    headerCount = 0;
    setDirectorDetails((prev) => [...prev, { ...directorDetailsTemplate }]);
    updateKeyFromProprietorArray([
      ...directorDetails,
      { ...directorDetailsTemplate },
    ]);
  };

  const removeProprietor = (selectedIndex: number) => {
    // setDirectorDetails((prev) => {
    //   let removeItem = [...prev];
    //   removeItem.splice(index, 1);
    //   return [...removeItem];
    // });

    let arr = [...directorDetails];
    let final = arr?.map((item: any, index: number) => {
      if (index === selectedIndex) item.keyDetailsUpdate = 'REMOVE';
      return item;
    });
    headerCount = 0;
    setDirectorDetails([...final]);
    updateKeyFromProprietorArray(final);
  };

  const renderEditModeText = (
    textPlaceholder: string,
    textId: string,
    subTitleTitle: string,
    moduleName: string,
    value?: string,
    index = 0
  ) => {
    return (
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <Box sx={{ gap: 2 }}>
          <TypographySubTitle title={subTitleTitle} />
          {textId !== 'countryRef' ? (
            <TypoText
              placeholder={textPlaceholder}
              id={textId}
              value={value}
              handleChange={(e: any) => {
                if (moduleName === 'supplier_profile') {
                  onChangeSupplierData(e, textId);
                } else if (moduleName === 'director_detail') {
                  onChangeDirectorDetails(e, textId, index);
                } else if (moduleName === 'key_contact') {
                  onChangekeyContactDetails(e, textId, index);
                } else if (moduleName === 'regulatory_requirement_payment') {
                  onChangeRegulatoryRequirementPayment(e, textId);
                } else if (moduleName === 'banking_details') {
                  onChangeBankDetails(e, textId);
                }
              }}
              textError={
                validateInputFields({ textId: textId, value: value }).showError
              }
              errorMessage={
                validateInputFields({ textId: textId, value: value }).message
              }
            />
          ) : (
            <TypoText
              placeholder={textPlaceholder}
              id={textId}
              value={'India'}
              disable={true}
            />
          )}
        </Box>
      </Grid>
    );
  };
  const renderViewModeText = (
    textColor: string,
    textTitle: string,
    subTitleColor: string,
    subTitleTile: string
  ) => {
    return (
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <Box sx={{ gap: 2 }}>
          <TypographySubTitle color={subTitleColor} title={subTitleTile} />
          <TypoText color={textColor} title={textTitle} />
        </Box>
      </Grid>
    );
  };

  const handleCloseSuccess = () => {
    setShowSuccesModal(false);
    // setViewMode('view');
    navigate('/userManagement/orgStructure');
  };

  // onChangeSupplierData
  const onChangeSupplierData = (e: any, keyName: string) => {
    let Statelist: string[] = [];
    const value = keyName === 'businessSince' ? e : e?.target?.value;
    setSupplierDetailsData((prev: any) => {
      return { ...prev, [keyName]: value };
    });
    if (keyName === 'stateRef') {
      Statelist.push(e?.target?.value);
      setSupplierDetailsData((prev: any) => {
        return { ...prev, ['stateId']: Statelist };
      });
    }
    if (keyName === 'cityRef') {
      cityList.push(e?.target?.value.id);
      setSupplierDetailsData((prev: any) => {
        return { ...prev, ['cityId']: cityList };
      });
    }
  };
  // onChangeDirectorDetails
  const onChangeDirectorDetails = (e: any, keyName: string, index: number) => {
    const value = keyName === 'dob' ? e : e?.target?.value;
    setDirectorDetails((prev: any) => {
      let result = [...prev];
      result[index][keyName] = value;
      return [...result];
    });
  };
  //onchangekeycontactdetails
  const onChangekeyContactDetails = (
    e: any,
    keyName: string,
    index: number
  ) => {
    const value = keyName === 'reportingHead' ? e : e?.target?.value;
    setKeyContactDetails((prev: any) => {
      let result = [...prev];
      result[index][keyName] = value;
      return [...result];
    });
  };

  //onChangeRegulatoryRequirement Payment
  const onChangeRegulatoryRequirementPayment = (e: any, keyName: string) => {
    const value = e?.target?.value;
    setRegulatoryRequirementPayment((prev: any) => {
      return { ...prev, [keyName]: value };
    });
  };

  const updateUploadedFileStatus = (
    key: string,
    isSuccess: boolean,
    keyValue?: string
  ) => {
    if (isSuccess) {
      setRegulatoryRequirement((prev: any) => {
        return {
          ...prev,
          [key]: keyValue,
          [`${key}Success`]: isSuccess,
        };
      });
    } else {
      keyValue && keyValue !== '' && setApiError(keyValue);
      setRegulatoryRequirement((prev: any) => {
        return {
          ...prev,
          [key]: keyValue,
          [`${key}Success`]: isSuccess,
        };
      });
    }
  };

  const onChangeRegulatoryRequirement = (e: any, keyName: string) => {
    const value = e?.target?.value;
    setRegulatoryRequirement((prev: any) => {
      return { ...prev, [keyName]: value };
    });
  };

  const onChangeBankDetails = (e: any, keyName: string) => {
    const value = keyName === 'micrCodeFile' ? e : e?.target?.value;
    setBankDetailsData((prev: any) => {
      return { ...prev, [keyName]: value };
    });
  };

  const addSurrogateBoxSelected = (e: any, name: any) => {
    const value = e?.target?.checked;
    let alreadyPresent = selectedSurrogate?.find(
      (eachItem: any) => eachItem === name
    );
    setSelectedSurrogate((prev: any) => {
      if (value) {
        return [...prev, name];
      } else {
        if (alreadyPresent) {
          return selectedSurrogate?.filter(
            (eachItem: any) => eachItem !== name
          );
        }
      }
    });
  };

  const imageUploadCallBack = (id: string, event: any) => {
    var file = event.target.files[0];
    let imageAsBase64 = URL.createObjectURL(file);
    setSelectedFile(imageAsBase64);
    const formData = new FormData();
    formData.append('file', file, file.name);
    addSingleImageOrg(formData)
      .then((response: any) => {
        if (response?.data?.fileName) {
          if (id === 'micrCodeFile') {
            setBankDetailsData((prev: any) => {
              return {
                ...prev,
                [id]: response?.data?.fileName,
                [`${id}Success`]: true,
              };
            });
          } else {
            updateUploadedFileStatus(id, true, response?.data?.fileName);
          }
        } else if (response.data?.exception) {
          if (response.data?.exception?.shortMessage) {
            setApiError(response.data.exception.shortMessage);
            if (id === 'micrCodeFile') {
              setBankDetailsData((prev: any) => {
                return {
                  ...prev,
                  [id]: response.data?.exception?.shortMessage,
                  [`${id}Success`]: false,
                };
              });
            } else {
              updateUploadedFileStatus(
                id,
                false,
                response.data?.exception?.shortMessage
              );
            }
          } else {
            if (id === 'micrCodeFile') {
              setBankDetailsData((prev: any) => {
                return {
                  ...prev,
                  [id]: response.data?.exception?.shortMessage,
                  [`${id}Success`]: false,
                };
              });
            } else {
              updateUploadedFileStatus(
                id,
                false,
                'Error in image upload. Please try with a different image!'
              );
            }
            setApiError(
              'Error in image upload. Please try with a different image!'
            );
          }
        }
      })
      .catch((err: any) => {
        handleError(err?.response?.data ?? '');
      });
  };

  const handleError = (err: any) => {
    if (err?.exception?.fieldErrors) {
      const missingFields = err?.exception?.fieldErrors?.map(
        (field: string) => `${field}, `
      );
      setApiError(missingFields);
    } else if (err?.exception?.shortMessage)
      setApiError(err?.exception?.shortMessage);
    else if (err?.error) setApiError(err?.error + ' ' + err?.path);
    else setApiError('Something went wrong!');
  };

  const assignReportingHead = () => {
    let resultArr: string[] = [];
    keyContactDetails.map((mainItem: any) => {
      const value = mainItem?.reportingHead;
      let id = '-';
      let arr = reportingHeadData?.result?.filter(
        (item: any) => item.name === value || item.userId === value
      );
      id = arr?.length > 0 ? arr[0]?.userId : '';
      resultArr.push(id);
    });
    setReportingID(resultArr);
  };

  const getReportingHead = (value: string) => {
    let name = '-';
    let id = '-';
    if (reportingHeadData?.result?.length > 0) {
      let arr = reportingHeadData?.result?.filter(
        (item: any) => item.name === value || item.userId === value
      );

      name = arr?.length > 0 ? arr[0]?.name : '';
      id = arr?.length > 0 ? arr[0]?.userId : '';
    }
    return name;
  };

  const getReportingHeadId = (requiredId: boolean, value: string) => {
    let id = '-';
    let name = '--';
    if (reportingHeadData?.result?.length > 0) {
      let arr = reportingHeadData?.result?.filter((item: any) =>
        requiredId ? item.name === value : item.userId === value
      );
      id = arr?.length > 0 ? arr[0]?.userId : '';
      name = arr?.length > 0 ? arr[0]?.name : '';
    }
    return requiredId ? id : name;
  };

  const submitBtnAction = (submitAction: string) => {
    // setShowSuccesModal(true);
    let payload: any = {};
    let regularReqData: any = {
      registerNumber: regulatoryRequirement?.registerNumber,
      tinNumber: regulatoryRequirement?.tinNumber,
      gstNumber: regulatoryRequirement?.gstNumber,
      panNumber: regulatoryRequirement?.panNumber,
      pfRegisterNumber: regulatoryRequirement?.pfRegisterNumber,
      shopNumber: regulatoryRequirement?.shopNumber,
      esicNumber: regulatoryRequirement?.esicNumber,
    };
    if (regulatoryRequirement?.tinNumberFile !== '') {
      regularReqData['tinNumberFile'] = regulatoryRequirement?.tinNumberFile;
    }
    if (regulatoryRequirement?.gstNumberFile !== '') {
      regularReqData['gstNumberFile'] = regulatoryRequirement?.gstNumberFile;
    }
    if (regulatoryRequirement?.panNumberFile !== '') {
      regularReqData['panNumberFile'] = regulatoryRequirement?.panNumberFile;
    }
    if (regulatoryRequirement?.shopNumberFile !== '') {
      regularReqData['shopNumberFile'] = regulatoryRequirement?.shopNumberFile;
    }
    if (regulatoryRequirement?.esicNumberFile !== '') {
      regularReqData['esicNumberFile'] = regulatoryRequirement?.esicNumberFile;
    }
    if (regulatoryRequirement?.pfNumberFile !== '') {
      regularReqData['pfNumberFile'] = regulatoryRequirement?.pfNumberFile;
    }
    payload['requestType'] = submitAction;
    payload['surrogateTypeList'] = [...selectedSurrogate];
    // payload['surrogateTypeList'] = ['C4C'];
    payload['organizationType'] =
      state?.value || viewData?.organizationType || '';
    payload['actionUserId'] = userId;
    payload['supplierDetails'] = {
      supplierName: supplierDetailsData?.supplierName,
      workAddress: supplierDetailsData?.workAddress,
      stateRef: supplierDetailsData?.stateRef,
      cityRef: supplierDetailsData?.cityRef,
      operatingCity: supplierDetailsData?.operatingCity,
      tellNumber: supplierDetailsData?.tellNumber,
      email: supplierDetailsData?.email,
      businessSince: supplierDetailsData?.businessSince,
      descriptionItems: supplierDetailsData?.serviceDescription,
      country: supplierDetailsData?.countryRef,
      companyRegistration: supplierDetailsData?.companyRegistrationNo,
      majorProducts: supplierDetailsData?.majorProducts,
      natureOfBusiness: supplierDetailsData?.businessNature,
      clarityOfCompany: supplierDetailsData?.companyClarity,
      natureOfCompany: supplierDetailsData?.companyNature,
    };
    payload['regulatoryRequirement'] = {
      ...regularReqData,
      // registerNumber: regulatoryRequirement?.registerNumber,
      // tinNumber: regulatoryRequirement?.tinNumber,
      // gstNumber: regulatoryRequirement?.gstNumber,
      // panNumber: regulatoryRequirement?.panNumber,
      // pfRegisterNumber: regulatoryRequirement?.pfRegisterNumber,
      // shopNumber: regulatoryRequirement?.shopNumber,
      // esicNumber: regulatoryRequirement?.esicNumber,
      // tinNumberFile: regulatoryRequirement?.tinNumberFile ,
      // gstNumberFile: regulatoryRequirement?.gstNumberFile,
      // panNumberFile: regulatoryRequirement?.panNumberFile,
      // shopNumberFile: regulatoryRequirement?.shopNumberFile,
      // esicNumberFile: regulatoryRequirement?.esicNumberFile,
      // pfNumberFile: regulatoryRequirement?.pfNumberFile,
    };
    payload['declaration'] =
      'All information I have provided is true and accurate.';
    payload['bankDetails'] = {
      bankName: bankDetailsData?.bankName,
      bankAccountNumber: bankDetailsData?.bankAccountNumber,
      ifscCode: bankDetailsData?.ifscCode,
      // branchAddress: 'address',
      branchAddress1: bankDetailsData?.addressline1,
      branchAddress2: bankDetailsData?.addressline2,
      pincode: bankDetailsData?.pincode,
      micrCode: bankDetailsData?.micrCode,
      cancelledCheckFile: bankDetailsData?.micrCodeFile,
    };
    // payload['directorDetails'] = [...directorDetails];
    payload['payeeDetails'] = {
      payeeDetails: regulatoryRequirementPayment?.payeeDetails,
      payeeAddress: regulatoryRequirementPayment?.payeeAddress,
      defaultCreditPeriod: regulatoryRequirementPayment?.defaultCreditPeriod,
      reason: regulatoryRequirementPayment?.reason,
    };
    if (isEditMode) {
      payload['id'] = viewData?.id;
      let dirDetailsArr: any[] = [];
      dirDetailsArr = directorDetails?.map((item: any) => {
        if (item.userId) {
          item.keyDetailsUpdate =
            item?.keyDetailsUpdate === 'REMOVE'
              ? item.keyDetailsUpdate
              : 'UPDATE';
        } else {
          item.keyDetailsUpdate = 'ADD';
        }
        return item;
      });
      payload['directorDetails'] = [...dirDetailsArr];
    } else {
      let dirDetailsArr: any[] = [];
      dirDetailsArr = directorDetails?.map((item: any) => {
        // item.keyDetailsUpdate = 'ADD';
        return item;
      });
      payload['directorDetails'] = [...dirDetailsArr];
    }

    if (isEditMode) {
      // payload['id'] = viewData?.id;
      let keyDetailsArr: any[] = [];
      keyDetailsArr = keyContactDetails?.map((item: any, index: any) => {
        // item.reportingHead = getReportingHeadId(true, item.reportingHead);

        if (item.userId) {
          item.keyDetailsUpdate =
            item?.keyDetailsUpdate === 'REMOVE'
              ? item.keyDetailsUpdate
              : 'UPDATE';
        } else {
          item.keyDetailsUpdate = 'ADD';
        }

        return { ...item, reportingHead: reportingID[index] };
      });
      payload['keyContactDetails'] = [...keyDetailsArr];
    } else {
      let keyDetailsArr: any[] = [];
      keyDetailsArr = keyContactDetails?.map((item: any, index: any) => {
        item.reportingHead = reportingID[index];
        // item.reportingHead = getReportingHeadId(true, item.reportingHead);
        // item.keyDetailsUpdate = 'ADD';
        return item;
      });
      payload['keyContactDetails'] = [...keyDetailsArr];
    }

    if (!isEditMode && viewMode === 'add') {
      if (state?.value === 'DSA') {
        registerDSA(payload)
          .then((response) => {
            if (response.data.result) {
              setShowSuccesModal(true);
            } else {
              handleError(response?.data ?? '');
            }
          })
          .catch((err) => {
            console.log('registerDSA err', err);
            handleError(err?.response?.data ?? '');
          });
      } else {
        registerFintech(payload)
          .then((response) => {
            if (response.data.result) {
              setShowSuccesModal(true);
            } else {
              handleError(response?.data ?? '');
            }
          })
          .catch((err) => {
            console.log(err, 'registerFintech err');
            handleError(err?.response?.data ?? '');
          });
      }
    } else {
      if (state?.value === 'DSA') {
        updateDSA(payload)
          .then((response) => {
            if (response.data.result) {
              setShowSuccesModal(true);
            } else {
              handleError(response?.data ?? '');
            }
          })
          .catch((err) => {
            handleError(err?.response?.data ?? '');
          });
      } else {
        updateFintech(payload)
          .then((response) => {
            if (response.data.result) {
              setShowSuccesModal(true);
            } else {
              handleError(response?.data ?? '');
            }
          })
          .catch((err) => {
            handleError(err?.response?.data ?? '');
          });
      }
    }
  };

  const saveBtnAction = (saveAction: string) => {
    // setShowSuccesModal(true);
    let payload: any = {};
    let regularReqData: any = {
      registerNumber: regulatoryRequirement?.registerNumber,
      tinNumber: regulatoryRequirement?.tinNumber,
      gstNumber: regulatoryRequirement?.gstNumber,
      panNumber: regulatoryRequirement?.panNumber,
      pfRegisterNumber: regulatoryRequirement?.pfRegisterNumber,
      shopNumber: regulatoryRequirement?.shopNumber,
      esicNumber: regulatoryRequirement?.esicNumber,
    };
    if (regulatoryRequirement?.tinNumberFile !== '') {
      regularReqData['tinNumberFile'] = regulatoryRequirement?.tinNumberFile;
    }
    if (regulatoryRequirement?.gstNumberFile !== '') {
      regularReqData['gstNumberFile'] = regulatoryRequirement?.gstNumberFile;
    }
    if (regulatoryRequirement?.panNumberFile !== '') {
      regularReqData['panNumberFile'] = regulatoryRequirement?.panNumberFile;
    }
    if (regulatoryRequirement?.shopNumberFile !== '') {
      regularReqData['shopNumberFile'] = regulatoryRequirement?.shopNumberFile;
    }
    if (regulatoryRequirement?.esicNumberFile !== '') {
      regularReqData['esicNumberFile'] = regulatoryRequirement?.esicNumberFile;
    }
    if (regulatoryRequirement?.pfNumberFile !== '') {
      regularReqData['pfNumberFile'] = regulatoryRequirement?.pfNumberFile;
    }
    payload['requestType'] = saveAction;
    payload['surrogateTypeList'] = [...selectedSurrogate];
    // payload['surrogateTypeList'] = ['C4C'];
    payload['organizationType'] =
      state?.value || viewData?.organizationType || '';
    payload['actionUserId'] = userId;
    payload['supplierDetails'] = {
      supplierName: supplierDetailsData?.supplierName,
      workAddress: supplierDetailsData?.workAddress,
      stateRef: supplierDetailsData?.stateRef,
      cityRef: supplierDetailsData?.cityRef,
      operatingCity: supplierDetailsData?.operatingCity,
      tellNumber: supplierDetailsData?.tellNumber,
      email: supplierDetailsData?.email,
      businessSince: supplierDetailsData?.businessSince,
      descriptionItems: supplierDetailsData?.serviceDescription,
      country: supplierDetailsData?.countryRef,
      companyRegistration: supplierDetailsData?.companyRegistrationNo,
      majorProducts: supplierDetailsData?.majorProducts,
      natureOfBusiness: supplierDetailsData?.businessNature,
      clarityOfCompany: supplierDetailsData?.companyClarity,
      natureOfCompany: supplierDetailsData?.companyNature,
    };
    payload['regulatoryRequirement'] = {
      ...regularReqData,
    };
    payload['declaration'] =
      'All information I have provided is true and accurate.';
    payload['bankDetails'] = {
      bankName: bankDetailsData?.bankName,
      bankAccountNumber: bankDetailsData?.bankAccountNumber,
      ifscCode: bankDetailsData?.ifscCode,
      branchAddress1: bankDetailsData?.addressline1,
      branchAddress2: bankDetailsData?.addressline2,
      pincode: bankDetailsData?.pincode,
      micrCode: bankDetailsData?.micrCode,
      cancelledCheckFile: bankDetailsData?.micrCodeFile,
    };
    payload['payeeDetails'] = {
      payeeDetails: regulatoryRequirementPayment?.payeeDetails,
      payeeAddress: regulatoryRequirementPayment?.payeeAddress,
      defaultCreditPeriod: regulatoryRequirementPayment?.defaultCreditPeriod,
      reason: regulatoryRequirementPayment?.reason,
    };

    saveDraftDSA(payload)
      .then((response) => {
        if (response.data?.exception) {
          setShowSuccesModal(true);
        } else {
          console.log('err');
          // handleError(response.data);
        }
      })
      .catch((err) => {
        console.log('err', err);
        // handleError(err.response.data);
      });
  };

  const isSurrogateSelected = (key: string) => {
    return selectedSurrogate?.length > 0
      ? selectedSurrogate?.includes(key)
      : false;
  };

  // const getReportingHeadName = (selectedId: string) => {
  //   let value = '-';
  //   if (reportingHeadData?.result?.length > 0) {
  //     let arr = reportingHeadData?.result?.filter(
  //       (item: any) => item.userId === selectedId
  //     );
  //     value = arr?.length > 0 ? arr[0]?.name : '';
  //   }
  //   return value;
  // };

  const updateFileData = () => {
    setRegulatoryRequirement((prev: regulatoryRequirementInterface) => {
      return {
        ...prev,
        tinNumberFile: documentData?.tinNumberFileData,
        tinFileUploadSuccess: documentData?.tinNumberFileData ? true : false,
        esicNumberFile: documentData?.esicNumberFileData,
        esicNumberFileSuccess: documentData?.esicNumberFileData ? true : false,
        gstNumberFile: documentData?.gstNumberFileData,
        gstNumberFileSuccess: documentData?.gstNumberFileData ? true : false,
        panNumberFile: documentData?.panNumberFileData,
        panNumberFileSuccess: documentData?.panNumberFileData ? true : false,
        pfNumberFile: documentData?.pfNumberFileData,
        pfNumberFileSuccess: documentData?.pfNumberFileData ? true : false,
        shopNumberFile: documentData?.shopNumberFileData,
        shopNumberFileSuccess: documentData?.shopNumberFileData ? true : false,
      };
    });

    setBankDetailsData((prev: bankDetailsInterface) => {
      return {
        ...prev,
        micrCodeFile: documentData?.cancelledCheckFile,
        micrCodeFileSuccess: documentData?.cancelledCheckFile ? true : false,
      };
    });
  };

  return (
    <Stack>
      <Box className="onboarding">
        {viewMode === 'view' && (
          <Box className="title-header">
            <Box className="header-box">
              <Box className="head">
                <Box onClick={() => navigate(-1)}>
                  <ArrowBackIcon className="arrow" />
                </Box>
                <Box>
                  <TypoText
                    title={` ${
                      state?.value === 'DSA'
                        ? `View - ${
                            supplierDetailsData?.supplierName || ''
                          } - DSA `
                        : `${
                            supplierDetailsData?.supplierName || ''
                          } - Fintech Partner`
                    }`}
                  />
                  <TypographyInfo title="Onboard your partners here" />
                </Box>
              </Box>
              <Box>
                {/* <Button className="id-btn">{`ID.NO ${state?.id || ''}`}</Button> */}
                <Button
                  className="btn"
                  onClick={() => {
                    setIsEditMode(true);
                    setViewMode('add');
                    updateFileData();
                    // updateValueToEdit();
                  }}
                >
                  <span
                    className="icon-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: '10px',
                    }}
                  >
                    <img src={EditIcon} alt="EditIcon" />
                  </span>
                  Edit
                </Button>
              </Box>
            </Box>
          </Box>
        )}
        {viewMode === 'add' && (
          <Box className="add-header">
            <ScreenHeader
              title={`${
                state?.value === 'DSA'
                  ? 'DSA Onboarding'
                  : 'Fintech Partners Onboarding'
              } `}
              info="Onboard your partners here."
              showBackButton={false}
            />
          </Box>
        )}
        <Box className="surrogate-container">
          <Box>
            <Box className="surrogate-box">
              <HeaderWithInfo
                header="Surrogate"
                isInfoEnabled={true}
                info="Choose a surrogate for your partners here"
                isDownloadEnabled={false}
              />
            </Box>
            <Divider sx={{ marginY: '20px' }} />
            {viewMode === 'add' ? (
              <Box className="add-surrogate" sx={{ width: '100%' }}>
                <Typography className="add-surrogate-text">
                  Select Surrogate
                </Typography>
                <Box className="add-surrogate-content">
                  <Grid container>
                    {getListSurrogateItems?.map((items: any, index: number) => {
                      return (
                        <Grid item xs={12} sm={12} md={6} lg={4}>
                          <Box className="add-surrogate-box" key={index}>
                            <Checkbox
                              style={{
                                transform: 'scale(1.2)',
                              }}
                              sx={{
                                color: '#A8A8A9',
                              }}
                              color="secondary"
                              checked={isSurrogateSelected(items.code)}
                              onChange={(e: any) =>
                                addSurrogateBoxSelected(e, items.code)
                              }
                            />
                            <Typography className="add-surrogate-item">
                              {items.name}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </Box>
            ) : (
              <Box>
                <TypographySubTitle color={colors.greyHead} title="Surrogate" />
                {viewData &&
                  viewData.surrogateTypeList?.map((item: any) => {
                    return <TypoText color={colors.darkColor} title={item} />;
                  })}
              </Box>
            )}
          </Box>
        </Box>
        <Box className="supplier-container">
          <Box className="supplier-box">
            <HeaderWithInfo
              header="Supplier Profile"
              isInfoEnabled={true}
              info="Add company details of your partner here"
              isDownloadEnabled={false}
            />
          </Box>
          <Divider sx={{ marginY: '20px' }} />
          <Grid container columnSpacing={4} rowSpacing={3}>
            {viewMode === 'add'
              ? renderEditModeText(
                  'Supplier Name',
                  'supplierName',
                  'Supplier Name',
                  'supplier_profile',
                  supplierDetailsData.supplierName
                )
              : renderViewModeText(
                  colors.darkColor,
                  viewData?.supplierDetails?.supplierName || '-',
                  colors.greyHead,
                  'Supplier Company'
                )}
            {viewMode === 'add'
              ? renderEditModeText(
                  'Address Line 1',
                  'workAddress',
                  'Work Address',
                  'supplier_profile',
                  supplierDetailsData.workAddress
                )
              : renderViewModeText(
                  colors.darkColor,
                  viewData?.supplierDetails?.workAddress || '-',
                  colors.greyHead,
                  'Work Address' //todo need to work here
                )}
            {viewMode === 'add' ? (
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <FormControl fullWidth>
                  <TypographySubTitle title="State" />
                  <Select
                    fullWidth
                    sx={{
                      height: '40px',
                      textTransform: 'capitalize',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                    onChange={(selected: any) => {
                      onChangeSupplierData(selected, 'stateRef');
                    }}
                    value={supplierDetailsData?.stateRef}
                  >
                    {/* <Paper variant="outlined" elevation={2}> */}
                    <MenuItem disabled>Select</MenuItem>
                    {stateList?.map((items: any, index: number) => {
                      return (
                        <MenuItem
                          value={items.id}
                          sx={{ textTransform: 'capitalize', fontSize: '14px' }}
                          key={index}
                        >
                          {items.stateName}
                        </MenuItem>
                      );
                    })}
                    {/* </Paper> */}
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              renderViewModeText(
                colors.darkColor,
                viewData?.supplierDetails?.state?.stateName || '-',
                colors.greyHead,
                'State'
              )
            )}
            {viewMode === 'add' ? (
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <FormControl fullWidth>
                  <TypographySubTitle title="City" />
                  <Select
                    fullWidth
                    sx={{
                      height: '40px',
                      textTransform: 'capitalize',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                    onChange={(selected: any) => {
                      onChangeSupplierData(selected, 'cityRef');
                    }}
                    value={supplierDetailsData.cityRef}
                  >
                    {/* <Paper variant="outlined" elevation={2}> */}
                    <MenuItem disabled>Select</MenuItem>
                    {cityList?.map((items: any, index: number) => {
                      return (
                        <MenuItem
                          value={items?.id}
                          sx={{ textTransform: 'capitalize', fontSize: '14px' }}
                          key={index}
                        >
                          {items?.cityName}
                        </MenuItem>
                      );
                    })}
                    {/* </Paper> */}
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              renderViewModeText(
                colors.darkColor,
                viewData?.supplierDetails?.city?.cityName || '-',
                colors.greyHead,
                'City'
              )
            )}
            {viewMode === 'add'
              ? renderEditModeText(
                  'Country',
                  'countryRef',
                  'Country',
                  'supplier_profile',
                  supplierDetailsData.countryRef
                )
              : renderViewModeText(
                  colors.darkColor,
                  viewData?.supplierDetails?.country || '-',
                  colors.greyHead,
                  'Country'
                )}
            {viewMode === 'add'
              ? renderEditModeText(
                  'Enter Operational Cities',
                  'operatingCity',
                  'Cities of Operations',
                  'supplier_profile',
                  supplierDetailsData?.operatingCity
                )
              : renderViewModeText(
                  colors.darkColor,
                  viewData?.supplierDetails?.operatingCity || '-',
                  colors.greyHead,
                  'Cities of Operations'
                )}
            {viewMode === 'add'
              ? renderEditModeText(
                  'Enter Telephone No',
                  'tellNumber',
                  'Telephone No',
                  'supplier_profile',
                  supplierDetailsData?.tellNumber
                )
              : renderViewModeText(
                  colors.darkColor,
                  viewData?.supplierDetails?.tellNumber || '-',
                  colors.greyHead,
                  'Telephone No'
                )}
            {viewMode === 'add'
              ? renderEditModeText(
                  'Mail ID',
                  'email',
                  'E-mail ID',
                  'supplier_profile',
                  supplierDetailsData?.email
                )
              : renderViewModeText(
                  colors.darkColor,
                  viewData?.supplierDetails?.email || '-',
                  colors.greyHead,
                  'E-Mail ID'
                )}
            {viewMode === 'add' ? (
              <Grid item xs={12} sm={12} md={6} lg={4} className="datePicker">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TypographySubTitle title="Year of inc./ in Business Since" />
                  <DesktopDatePicker
                    toolbarPlaceholder="DD MMM YYYY"
                    openTo="year"
                    // views={['date month year']}
                    value={supplierDetailsData?.businessSince}
                    onChange={(newValue: any) => {
                      onChangeSupplierData(
                        moment(new Date(newValue)).format('YYYY'),
                        'businessSince'
                      );
                    }}
                    maxDate={new Date()}
                    disableFuture
                    renderInput={(params) => (
                      <TextField
                        sx={DOBStyle}
                        size="small"
                        {...params}
                        fullWidth
                        error={false}
                      />
                    )}
                    components={{
                      OpenPickerIcon: CalendarTodayOutlinedIcon,
                    }}
                    OpenPickerButtonProps={{
                      style: {
                        color: supplierDetailsData.businessSince
                          ? '#0662b7'
                          : '#D2D2D3',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            ) : (
              renderViewModeText(
                colors.darkColor,
                viewData?.supplierDetails?.businessSince || '-',
                colors.greyHead,
                'Year of inc./ in Business Since'
              )
            )}
            {viewMode === 'add' ? (
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <FormControl fullWidth>
                  <TypographySubTitle title="Nature of Business" />
                  <Select
                    fullWidth
                    sx={{
                      height: '40px',
                      textTransform: 'capitalize',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                    // renderValue={(selected: any) => {
                    //   if (!selected) {
                    //     return (
                    //       <Stack
                    //         sx={{
                    //           color: '#B3B3B3',
                    //           fontWeight: '400',
                    //           fontSize: '14px',
                    //           letterSpacing: '0.0025em',
                    //         }}
                    //       >
                    //         Choose existing role for duplication
                    //       </Stack>
                    //     );
                    //   }<>
                    //   <MenuItem disabled>Select</MenuItem>
                    //   {getNatureOfBussinessItems?.map(
                    //     (items: any, index: number) => {
                    //       return (
                    //         <MenuItem
                    //           value={items.name}
                    //           sx={{ textTransform: 'capitalize' }}
                    //           key={index}
                    //           // onClick={{
                    //           //   setValue(items.name);
                    //           // }}
                    //         >
                    //           {items.name}
                    //         </MenuItem>
                    //       );
                    //     }
                    //   )};
                    //   </>
                    // }}

                    onChange={(selected: any) => {
                      onChangeSupplierData(selected, 'businessNature');
                    }}
                    value={supplierDetailsData.businessNature}
                  >
                    <MenuItem disabled>Select</MenuItem>
                    {getNatureOfBussinessItems?.map(
                      (items: any, index: number) => {
                        return (
                          <MenuItem
                            value={items.name}
                            sx={{
                              textTransform: 'capitalize',
                              fontSize: '14px',
                            }}
                            key={index}
                            // onClick={{
                            //   setValue(items.name);
                            // }}
                          >
                            {items.name}
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              renderViewModeText(
                colors.darkColor,
                viewData?.supplierDetails?.natureOfBusiness || '-',
                colors.greyHead,
                'Nature of Business'
              )
            )}
            {viewMode === 'add' ? (
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <FormControl fullWidth>
                  <TypographySubTitle title="Nature of Company" />
                  <Select
                    fullWidth
                    sx={{
                      height: '40px',
                      textTransform: 'capitalize',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                    onChange={(selected: any) => {
                      onChangeSupplierData(selected, 'companyNature');
                    }}
                    value={supplierDetailsData.companyNature}
                  >
                    {/* <Paper variant="outlined" elevation={2}> */}
                    <MenuItem disabled>Select</MenuItem>
                    {getNatureOfCompanyItems?.map(
                      (items: any, index: number) => {
                        return (
                          <MenuItem
                            value={items.name}
                            key={index}
                            sx={{
                              textTransform: 'capitalize',
                              fontSize: '14px',
                            }}
                          >
                            {items.name}
                          </MenuItem>
                        );
                      }
                    )}
                    {/* </Paper> */}
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              renderViewModeText(
                colors.darkColor,
                viewData?.supplierDetails?.natureOfCompany || '-',
                colors.greyHead,
                'Nature of Company'
              )
            )}
            {viewMode === 'add' ? (
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <FormControl fullWidth>
                  <TypographySubTitle title="Clarity on Company" />
                  <Select
                    fullWidth
                    sx={{
                      height: '40px',
                      textTransform: 'capitalize',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                    onChange={(selected: any) => {
                      onChangeSupplierData(selected, 'companyClarity');
                    }}
                    value={supplierDetailsData.companyClarity}
                  >
                    {/* <Paper variant="outlined" elevation={2}> */}
                    <MenuItem disabled>Select</MenuItem>
                    {getClarityOnCompanyItems?.map(
                      (items: any, index: number) => {
                        return (
                          <MenuItem
                            value={items.name}
                            key={index}
                            sx={{
                              textTransform: 'capitalize',
                              fontSize: '14px',
                            }}
                          >
                            {items.name}
                          </MenuItem>
                        );
                      }
                    )}
                    {/* </Paper> */}
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              renderViewModeText(
                colors.darkColor,
                viewData?.supplierDetails?.clarityOfCompany || '-',
                colors.greyHead,
                'Clarity on Company'
              )
            )}
          </Grid>
          <Grid
            container
            sx={{ marginY: '2px' }}
            columnSpacing={4}
            rowSpacing={3}
          >
            {viewMode === 'add'
              ? renderEditModeText(
                  'Enter Company Registration No',
                  'companyRegistrationNo',
                  'Company Registration No',
                  'supplier_profile',
                  supplierDetailsData.companyRegistrationNo
                )
              : renderViewModeText(
                  colors.darkColor,
                  viewData?.supplierDetails?.companyRegistration || '-',
                  colors.greyHead,
                  'Company Registration Number'
                )}
            {viewMode === 'add'
              ? renderEditModeText(
                  'Enter Major Products',
                  'majorProducts',
                  'Major Products',
                  'supplier_profile',
                  supplierDetailsData.majorProducts
                )
              : renderViewModeText(
                  colors.darkColor,
                  viewData?.supplierDetails?.majorProducts || '-',
                  colors.greyHead,
                  'Major Products'
                )}
            {viewMode === 'add'
              ? renderEditModeText(
                  'Digital Credit card insurance',
                  'serviceDescription',
                  'Description of items/services',
                  'supplier_profile',
                  supplierDetailsData.serviceDescription
                )
              : renderViewModeText(
                  colors.darkColor,
                  viewData?.supplierDetails?.descriptionItems || '-',
                  colors.greyHead,
                  'Description of items/ Services'
                )}
          </Grid>
        </Box>
        <Box className="proprietor-container">
          <Box className="proprietor-container-box">
            <Box className="proprietor-head">
              <HeaderWithInfo
                header="Proprietor/ All Directors/ All Partners"
                isInfoEnabled={true}
                info="Add key personal information of your partner(s) here."
                isDownloadEnabled={false}
              />
            </Box>
            <Divider sx={{ marginY: '20px' }} />
            {viewMode === 'add' && (
              <Box>
                <Button
                  color="secondary"
                  sx={{ textTransform: 'capitalize' }}
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={AddProprietor}
                >
                  Add New Person
                </Button>
              </Box>
            )}
          </Box>
          {tempDirectorDetailsArray.length <= 1 && (
            <Divider sx={{ marginY: '20px' }} />
          )}

          {directorDetails?.map((item: any, index) => {
            if (item?.keyDetailsUpdate !== 'REMOVE') {
              const allowHeader =
                viewMode === 'add' &&
                (index !== 0 || directorDetails?.length > 1) &&
                tempDirectorDetailsArray.length > 1;

              if (allowHeader) {
                headerCount = headerCount + 1;
              }
              // todo ***
              return (
                <>
                  {allowHeader && (
                    <Box>
                      {<Divider sx={{ marginY: '20px' }} />}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <TypoText
                          title={`Proprietor/ All Directors/ All Partners - ${headerCount}`}
                        />
                        <Button
                          color="secondary"
                          onClick={() => removeProprietor(index)}
                          startIcon={<HighlightOffIcon />}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  )}
                  {viewMode === 'view' && (
                    <>
                      {index !== 0 && (
                        <>
                          <Divider sx={{ marginTop: '60px' }} />
                          <Box
                            className="proprietor-head"
                            sx={{ marginTop: '20px', marginBottom: '20px' }}
                          >
                            <TypoText
                              title={`Proprietor/ All Directors/ All Partners - ${
                                index + 1
                              }`}
                            />
                          </Box>
                        </>
                      )}
                      <Grid
                        container
                        sx={{ marginBottom: '20px' }}
                        columnSpacing={4}
                        rowSpacing={3}
                      >
                        {renderViewModeText(
                          colors.darkColor,
                          item?.name || '-',
                          colors.greyHead,
                          'Name'
                        )}
                        {renderViewModeText(
                          colors.darkColor,
                          item?.mobileNumber || '-',
                          colors.greyHead,
                          'Mobile Number'
                        )}
                        {renderViewModeText(
                          colors.darkColor,
                          item?.email || '-',
                          colors.greyHead,
                          'E-mail ID'
                        )}
                        {renderViewModeText(
                          colors.darkColor,
                          item?.gender || '-',
                          colors.greyHead,
                          'Gender'
                        )}
                        {renderViewModeText(
                          colors.darkColor,
                          item?.dob || '-',
                          colors.greyHead,
                          'Date of Birth'
                        )}
                        {renderViewModeText(
                          colors.darkColor,
                          item?.role || '-',
                          colors.greyHead,
                          'User Role'
                        )}
                        {renderViewModeText(
                          colors.darkColor,
                          item?.designation || '-',
                          colors.greyHead,
                          'Designation'
                        )}
                        {renderViewModeText(
                          colors.darkColor,
                          item?.address || '-',
                          colors.greyHead,
                          'Address'
                        )}
                      </Grid>
                    </>
                  )}
                  <Grid container columnSpacing={4} rowSpacing={3}>
                    {viewMode === 'add' && (
                      <>
                        {renderEditModeText(
                          'Enter Name',
                          'name',
                          'Name',
                          'director_detail',
                          item.name,
                          index
                        )}
                        {renderEditModeText(
                          'Enter Mobile No',
                          'mobileNumber',
                          'Mobile No',
                          'director_detail',
                          item.mobileNumber,
                          index
                        )}
                        {renderEditModeText(
                          'Enter E-mail ID',
                          'email',
                          'E-mail ID',
                          'director_detail',
                          item.email,
                          index
                        )}
                      </>
                    )}
                    {viewMode === 'add' && (
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <FormControl fullWidth>
                          <TypographySubTitle title="Gender" />
                          <Select
                            fullWidth
                            sx={{
                              height: '40px',
                              textTransform: 'capitalize',
                              fontSize: '14px',
                            }}
                            onChange={(selected: any) => {
                              onChangeDirectorDetails(
                                selected,
                                'gender',
                                index
                              );
                            }}
                            value={item.gender}
                          >
                            {/* <Paper variant="outlined" elevation={2}> */}
                            <MenuItem disabled>Select</MenuItem>
                            {getListOfGenderItems?.map(
                              (items: any, index: number) => {
                                return (
                                  <MenuItem
                                    value={items.name}
                                    key={index}
                                    sx={{
                                      textTransform: 'capitalize',
                                      fontSize: '14px',
                                    }}
                                  >
                                    {items.name}
                                  </MenuItem>
                                );
                              }
                            )}
                            {/* </Paper> */}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    {viewMode === 'add' && (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={4}
                        className="datePicker"
                      >
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TypographySubTitle title="Date of Birth" />
                            <DesktopDatePicker
                              openTo="year"
                              views={['year', 'month', 'day']}
                              inputFormat="DD MMM YYYY"
                              value={directorDetails[index].dob}
                              onChange={(newValue: any) => {
                                onChangeDirectorDetails(
                                  moment(new Date(newValue)).format(
                                    'YYYY-MM-DD'
                                  ),
                                  'dob',
                                  index
                                );
                                setDateValue(newValue);
                              }}
                              maxDate={new Date()}
                              renderInput={(params) => (
                                <TextField
                                  sx={DOBStyle}
                                  size="small"
                                  fullWidth
                                  {...params}
                                  error={false}
                                />
                              )}
                              components={{
                                OpenPickerIcon: CalendarTodayOutlinedIcon,
                              }}
                              OpenPickerButtonProps={{
                                style: {
                                  color: dateValue ? '#0662b7' : '#D2D2D3',
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Grid>
                    )}
                    {viewMode === 'add' && (
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <FormControl fullWidth>
                          <TypographySubTitle title="User Role" />
                          <Select
                            fullWidth
                            sx={{
                              height: '40px',
                              textTransform: 'capitalize',
                              fontSize: '14px',
                            }}
                            onChange={(selected: any) => {
                              onChangeDirectorDetails(selected, 'role', index);
                            }}
                            value={item.role}
                          >
                            {/* <Paper variant="outlined" elevation={2}> */}
                            <MenuItem disabled>Select</MenuItem>
                            {directorUserRolesItems?.map(
                              (items: any, index: number) => {
                                return (
                                  <MenuItem
                                    value={items.name}
                                    key={index}
                                    sx={{
                                      textTransform: 'capitalize',
                                      fontSize: '14px',
                                    }}
                                  >
                                    {items.name}
                                  </MenuItem>
                                );
                              }
                            )}
                            {/* </Paper> */}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    {viewMode === 'add' &&
                      renderEditModeText(
                        'Enter Company Registration No.',
                        'designation',
                        'Designation',
                        'director_detail',
                        item.designation,
                        index
                      )}
                    {viewMode === 'add' &&
                      renderEditModeText(
                        'Enter Address',
                        'address',
                        'Address',
                        'director_detail',
                        item.address,
                        index
                      )}
                  </Grid>
                  {/* </Grid> */}
                </>
              );
            }
          })}
        </Box>
        <Box className="keycontact-container">
          <Box className="keycontact-container-box">
            <Box className="keycontact-head">
              <HeaderWithInfo
                header="Key Contact Details"
                isInfoEnabled={true}
                info="Add your partner's contact information here."
                isDownloadEnabled={false}
              />
            </Box>
            {viewMode === 'add' && (
              <Box>
                <Button
                  color="secondary"
                  sx={{ textTransform: 'capitalize' }}
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={AddKeyContact}
                >
                  Add New Person
                </Button>
              </Box>
            )}
          </Box>
          {tempKeyContactArray.length <= 1 && (
            <Divider sx={{ marginY: '20px' }} />
          )}
          {keyContactDetails?.map((item: any, index) => {
            if (item?.keyDetailsUpdate !== 'REMOVE') {
              const allowKeyHeader =
                viewMode === 'add' &&
                (index !== 0 || keyContactDetails?.length > 1) &&
                tempKeyContactArray.length > 1;

              if (allowKeyHeader) {
                keyHeaderCount = keyHeaderCount + 1;
              }

              return (
                <Box>
                  {allowKeyHeader && (
                    <Box>
                      {<Divider sx={{ marginY: '20px' }} />}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <TypoText
                          title={`Key Contact Person ${keyHeaderCount}`}
                        />
                        <Button
                          color="secondary"
                          onClick={() => removeKeyContact(index)}
                          startIcon={<HighlightOffIcon />}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  )}
                  {viewMode === 'view' && (
                    <>
                      {index !== 0 && (
                        <>
                          <Divider sx={{ marginTop: '40px' }} />
                          <Box
                            className="proprietor-head"
                            sx={{ marginY: '20px' }}
                          >
                            <TypoText
                              title={`Key Contact Details - ${index + 1}`}
                            />
                          </Box>
                        </>
                      )}
                      <Grid
                        container
                        sx={{ marginBottom: '20px' }}
                        columnSpacing={4}
                        rowSpacing={3}
                      >
                        {renderViewModeText(
                          colors.darkColor,
                          item?.name || '-',
                          colors.greyHead,
                          'Name'
                        )}
                        {renderViewModeText(
                          colors.darkColor,
                          item?.mobileNumber || '-',
                          colors.greyHead,
                          'Mobile Number'
                        )}
                        {renderViewModeText(
                          colors.darkColor,
                          item?.email || '-',
                          colors.greyHead,
                          'E-mail ID'
                        )}
                        {renderViewModeText(
                          colors.darkColor,
                          item?.role || '-',
                          colors.greyHead,
                          'User Role'
                        )}
                        {renderViewModeText(
                          colors.darkColor,
                          item?.designation || '-',
                          colors.greyHead,
                          'Designation'
                        )}
                        {renderViewModeText(
                          colors.darkColor,
                          item?.reportingHead
                            ? getReportingHead(item?.reportingHead)
                            : '-',
                          colors.greyHead,
                          'Reporting Head'
                        )}
                      </Grid>
                    </>
                  )}
                  <Grid container rowSpacing={3} columnSpacing={4}>
                    {viewMode === 'add' && (
                      <>
                        {renderEditModeText(
                          'Enter Name',
                          'name',
                          'Name',
                          'key_contact',
                          item.name,
                          index
                        )}
                        {renderEditModeText(
                          'Enter Contact Number',
                          'mobileNumber',
                          'Contact Number',
                          'key_contact',
                          item.mobileNumber,
                          index
                        )}
                        {renderEditModeText(
                          '@M2P.com',
                          'email',
                          'E-mail ID',
                          'key_contact',
                          item.email,
                          index
                        )}
                      </>
                    )}
                    {viewMode === 'add' && (
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <FormControl fullWidth>
                          <TypographySubTitle title="User Role" />
                          <Select
                            fullWidth
                            sx={{
                              height: '40px',
                              textTransform: 'capitalize',
                              fontSize: '14px',
                            }}
                            onChange={(selected: any) => {
                              onChangekeyContactDetails(
                                selected,
                                'role',
                                index
                              );
                            }}
                            value={item.role}
                          >
                            <MenuItem disabled>Select</MenuItem>
                            {getListOfUserRoleItems.map(
                              (items: any, index: number) => {
                                return (
                                  <MenuItem
                                    value={items.name}
                                    key={index}
                                    sx={{
                                      textTransform: 'capitalize',
                                      fontSize: '14px',
                                    }}
                                  >
                                    {items.name}
                                  </MenuItem>
                                );
                              }
                            )}
                          </Select>
                          <Box
                            sx={{
                              display: 'flex',
                              paddingTop: '8px',
                              gap: 1,
                              // width: '400px',
                            }}
                          >
                            <img
                              style={{ width: '13px', height: '13px' }}
                              src={Info_Icon}
                              alt={'info'}
                            />
                            <Typography
                              sx={{ fontSize: '9px', fontWeight: '400' }}
                            >
                              Please Assign Super Admin role if needed.
                            </Typography>
                          </Box>
                        </FormControl>
                      </Grid>
                    )}
                    {viewMode === 'add' &&
                      renderEditModeText(
                        'Enter Designation',
                        'designation',
                        'Designation',
                        'key_contact',
                        item.designation,
                        index
                      )}
                    {viewMode === 'add' && (
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <TypographySubTitle title={' Reporting Head'} />
                        <Autocomplete
                          // size="small"
                          freeSolo
                          popupIcon
                          options={
                            (reportingHeadData?.result?.length > 0 &&
                              reportingHeadData?.result?.map(
                                (option: any) => option.name
                              )) ||
                            []
                          }
                          inputValue={getReportingHead(item?.reportingHead)}
                          onInputChange={(event, newInputValue) => {
                            onChangekeyContactDetails(
                              newInputValue,
                              'reportingHead',
                              index
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              sx={{ height: '2.4375em' }}
                              {...params}
                              placeholder="Enter Reporting Head"
                            />
                          )}
                          sx={{
                            '& legend': { display: 'none' },
                            '& fieldset': { top: 0 },
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>
              );
            }
          })}
        </Box>
        {viewMode === 'add' && (
          <Box className="item-container">
            <Box>
              <Box className="item-container-box">
                <HeaderWithInfo
                  header="Regulatory Requirement"
                  isInfoEnabled={true}
                  info="Add key regulatory requirement(s) for your partner here."
                  isDownloadEnabled={false}
                />
              </Box>
              <Divider sx={{ marginY: '20px' }} />
              <Box>
                <Grid
                  container
                  sx={{ marginBottom: '20px' }}
                  columnSpacing={4}
                  rowSpacing={3}
                >
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <TypographySubTitle title="Registration Number (MSMED)" />
                    <TypoText
                      placeholder="Enter Registration Number"
                      id="registerNumber"
                      handleChange={(e: any) => {
                        onChangeRegulatoryRequirement(e, 'registerNumber');
                      }}
                      value={regulatoryRequirement?.registerNumber}
                      textError={
                        validateInputFields({
                          textId: 'registerNumber',
                          value: regulatoryRequirement?.registerNumber,
                        }).showError
                      }
                      errorMessage={
                        validateInputFields({
                          textId: 'registerNumber',
                          value: regulatoryRequirement?.registerNumber,
                        }).message
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ marginBottom: '20px' }}
                  columnSpacing={4}
                  rowSpacing={3}
                >
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <TypographySubTitle title="TIN Number" />
                    <TypoText
                      placeholder="Enter TIN Number"
                      id="tinNumber"
                      handleChange={(e: any) => {
                        onChangeRegulatoryRequirement(e, 'tinNumber');
                      }}
                      value={regulatoryRequirement?.tinNumber}
                      textError={
                        validateInputFields({
                          textId: 'tinNumber',
                          value: regulatoryRequirement?.tinNumber,
                        }).showError
                      }
                      errorMessage={
                        validateInputFields({
                          textId: 'tinNumber',
                          value: regulatoryRequirement?.tinNumber,
                        }).message
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <Upload
                      id="tinNumberFile"
                      title="Attach Copy of TIN Number"
                      callbackFunc={imageUploadCallBack}
                      keyValue={regulatoryRequirement.tinNumberFile}
                      danger={!regulatoryRequirement.tinNumberFileSuccess}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ marginBottom: '20px' }}
                  columnSpacing={4}
                  rowSpacing={3}
                >
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <TypographySubTitle title="GST Number" />
                    <TypoText
                      placeholder="Enter GST Number"
                      id="gstNumber"
                      handleChange={(e: any) => {
                        onChangeRegulatoryRequirement(e, 'gstNumber');
                      }}
                      value={regulatoryRequirement?.gstNumber}
                      textError={
                        validateInputFields({
                          textId: 'gstNumber',
                          value: regulatoryRequirement?.gstNumber,
                        }).showError
                      }
                      errorMessage={
                        validateInputFields({
                          textId: 'gstNumber',
                          value: regulatoryRequirement?.gstNumber,
                        }).message
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <Upload
                      title="Attach Copy of GST Number"
                      danger={!regulatoryRequirement.gstNumberFileSuccess}
                      callbackFunc={imageUploadCallBack}
                      keyValue={regulatoryRequirement.gstNumberFile}
                      id="gstNumberFile"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ marginBottom: '20px' }}
                  columnSpacing={4}
                  rowSpacing={3}
                >
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <TypographySubTitle title="PAN Number" />
                    <TypoText
                      placeholder="Enter PAN Number"
                      id="panNumber"
                      handleChange={(e: any) => {
                        onChangeRegulatoryRequirement(e, 'panNumber');
                      }}
                      value={regulatoryRequirement?.panNumber}
                      textError={
                        validateInputFields({
                          textId: 'panNumber',
                          value: regulatoryRequirement?.panNumber,
                        }).showError
                      }
                      errorMessage={
                        validateInputFields({
                          textId: 'panNumber',
                          value: regulatoryRequirement?.panNumber,
                        }).message
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <Upload
                      title="Attach Copy of PAN Number"
                      danger={!regulatoryRequirement.panNumberFileSuccess}
                      callbackFunc={imageUploadCallBack}
                      id="panNumberFile"
                      keyValue={regulatoryRequirement.panNumberFile}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ marginBottom: '20px' }}
                  columnSpacing={4}
                  rowSpacing={3}
                >
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <TypographySubTitle title="Shop & Establishment" />
                    <TypoText
                      placeholder="Enter Shop & Establishment"
                      id="shopNumber"
                      handleChange={(e: any) => {
                        onChangeRegulatoryRequirement(e, 'shopNumber');
                      }}
                      value={regulatoryRequirement?.shopNumber}
                      textError={
                        validateInputFields({
                          textId: 'shopNumber',
                          value: regulatoryRequirement?.shopNumber,
                        }).showError
                      }
                      errorMessage={
                        validateInputFields({
                          textId: 'shopNumber',
                          value: regulatoryRequirement?.shopNumber,
                        }).message
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <Upload
                      title="Attach Copy of Shop & Establishment"
                      callbackFunc={imageUploadCallBack}
                      id="shopNumberFile"
                      danger={!regulatoryRequirement.shopNumberFileSuccess}
                      keyValue={regulatoryRequirement.shopNumberFile}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ marginBottom: '20px' }}
                  columnSpacing={4}
                  rowSpacing={3}
                >
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <TypographySubTitle title="ESIC Registration No" />
                    <TypoText
                      placeholder="Enter ESIC Registration No"
                      id="esicNumber"
                      handleChange={(e: any) => {
                        onChangeRegulatoryRequirement(e, 'esicNumber');
                      }}
                      value={regulatoryRequirement?.esicNumber}
                      textError={
                        validateInputFields({
                          textId: 'esicNumber',
                          value: regulatoryRequirement?.esicNumber,
                        }).showError
                      }
                      errorMessage={
                        validateInputFields({
                          textId: 'esicNumber',
                          value: regulatoryRequirement?.esicNumber,
                        }).message
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <Upload
                      title="Attach Copy of ESIC Registration No"
                      callbackFunc={imageUploadCallBack}
                      id="esicNumberFile"
                      danger={!regulatoryRequirement.esicNumberFileSuccess}
                      keyValue={regulatoryRequirement.esicNumberFile}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ marginBottom: '20px' }}
                  columnSpacing={4}
                  rowSpacing={3}
                >
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <TypographySubTitle title="PF Registration No" />
                    <TypoText
                      placeholder="Enter PF Registration No"
                      id="pfRegisterNumber"
                      handleChange={(e: any) => {
                        onChangeRegulatoryRequirement(e, 'pfRegisterNumber');
                      }}
                      value={regulatoryRequirement?.pfRegisterNumber}
                      textError={
                        validateInputFields({
                          textId: 'pfRegisterNumber',
                          value: regulatoryRequirement?.pfRegisterNumber,
                        }).showError
                      }
                      errorMessage={
                        validateInputFields({
                          textId: 'pfRegisterNumber',
                          value: regulatoryRequirement?.pfRegisterNumber,
                        }).message
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <Upload
                      title="Attach Copy of PF Registration No"
                      callbackFunc={imageUploadCallBack}
                      id="pfNumberFile"
                      danger={!regulatoryRequirement.pfNumberFileSuccess}
                      keyValue={regulatoryRequirement.pfNumberFile}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        )}
        {viewMode === 'view' && (
          <Box className="item-container">
            <Box>
              <HeaderWithInfo
                header="Regulatory Requirement"
                isInfoEnabled={true}
                info="Add key regulatory requirement(s) for your partner here."
                isDownloadEnabled={false}
              />

              <Divider sx={{ marginY: 2 }} />
              <Grid
                container
                sx={{ marginBottom: '20px' }}
                columnSpacing={4}
                rowSpacing={3}
              >
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title="Registration Number (MSMED)"
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={
                        viewData?.regulatoryRequirement?.registerNumber || '-'
                      }
                    />
                    <Box className="regulatory-img">
                      {viewData?.regulatoryRequirement?.registerNumberFile ? (
                        <img
                          onClick={() =>
                            handleOpen(
                              viewData?.regulatoryRequirement
                                ?.registerNumberFile
                            )
                          }
                          className="img"
                          src={ViewDoc}
                          alt="tin"
                        />
                      ) : (
                        <div className="no-image-box">No Image</div>
                      )}
                    </Box>
                    {/* <img
                      onClick={() =>
                        handleOpen(documentData?.shopNumberFileData)
                      }
                      className="img"
                      src={ViewDoc}
                    /> */}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title="TIN Number"
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={viewData?.regulatoryRequirement?.tinNumber || '-'}
                    />
                    <Box className="regulatory-img">
                      {viewData?.regulatoryRequirement?.tinNumberFile ? (
                        <img
                          onClick={() =>
                            handleOpen(
                              viewData?.regulatoryRequirement?.tinNumberFile
                            )
                          }
                          className="img"
                          src={ViewDoc}
                          alt="tin"
                        />
                      ) : (
                        <div className="no-image-box">No Image</div>
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title="GST Number"
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={viewData?.regulatoryRequirement?.gstNumber || '-'}
                    />
                    <Box className="regulatory-img">
                      {viewData?.regulatoryRequirement?.gstNumberFile ? (
                        <img
                          onClick={() =>
                            handleOpen(
                              viewData?.regulatoryRequirement?.gstNumberFile
                            )
                          }
                          className="img"
                          src={ViewDoc}
                          alt="gstNumber"
                        />
                      ) : (
                        <div className="no-image-box">No Image</div>
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title="PAN Number"
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={viewData?.regulatoryRequirement?.panNumber || '-'}
                    />
                    <Box className="regulatory-img">
                      {viewData?.regulatoryRequirement?.panNumberFile ? (
                        <img
                          onClick={() =>
                            handleOpen(
                              viewData?.regulatoryRequirement?.panNumberFile
                            )
                          }
                          className="img"
                          src={ViewDoc}
                          alt="pan number"
                        />
                      ) : (
                        <div className="no-image-box">No Image</div>
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title="ESIC Registration No"
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={viewData?.regulatoryRequirement?.esicNumber || '-'}
                    />
                    <Box className="regulatory-img">
                      {viewData?.regulatoryRequirement?.esicNumberFile ? (
                        <img
                          onClick={() =>
                            handleOpen(
                              viewData?.regulatoryRequirement?.esicNumberFile
                            )
                          }
                          className="img"
                          src={ViewDoc}
                          alt="ESIC Number"
                        />
                      ) : (
                        <div className="no-image-box">No Image</div>
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title="PF Registration No"
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={
                        viewData?.regulatoryRequirement?.pfRegisterNumber || '-'
                      }
                    />
                    <Box className="regulatory-img">
                      {viewData?.regulatoryRequirement?.pfNumberFile ? (
                        <img
                          onClick={() =>
                            handleOpen(
                              viewData?.regulatoryRequirement?.pfNumberFile
                            )
                          }
                          className="img"
                          src={ViewDoc}
                          alt="PF number"
                        />
                      ) : (
                        <div className="no-image-box">No Image</div>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        <Box className="item-container">
          <Box className="item-container-box">
            <HeaderWithInfo
              header="Regulatory Requirement"
              isInfoEnabled={true}
              info="Add key regulatory requirement(s) for your partner here."
              isDownloadEnabled={false}
            />
          </Box>
          <Divider sx={{ marginY: '20px' }} />
          <Box>
            <Grid
              container
              sx={{ marginBottom: '20px' }}
              columnSpacing={4}
              rowSpacing={3}
            >
              {viewMode === 'add'
                ? renderEditModeText(
                    'Enter Payee details',
                    'payeeDetails',
                    'Payment / Cheque in Favor Of - Payee Details',
                    'regulatory_requirement_payment',
                    regulatoryRequirementPayment.payeeDetails
                  )
                : renderViewModeText(
                    colors.darkColor,
                    viewData?.payeeDetails?.payeeAddress || '-',
                    colors.greyHead,
                    'Payee Address (Pref)'
                  )}
              {viewMode === 'add'
                ? renderEditModeText(
                    'Enter Payee address',
                    'payeeAddress',
                    'Payee Address (Pref)',
                    'regulatory_requirement_payment',
                    regulatoryRequirementPayment.payeeAddress
                  )
                : renderViewModeText(
                    colors.darkColor,
                    viewData?.payeeDetails?.defaultCreditPeriod || '-',
                    colors.greyHead,
                    'Default Credit Period (Days)'
                  )}
              {viewMode === 'add'
                ? renderEditModeText(
                    '15',
                    'defaultCreditPeriod',
                    'Default Credit Period (Days)',
                    'regulatory_requirement_payment',
                    String(
                      regulatoryRequirementPayment?.defaultCreditPeriod || ''
                    )
                  )
                : ''}
              {viewMode === 'view' &&
                renderViewModeText(
                  colors.darkColor,
                  viewData?.payeeDetails?.payeeDetails || '-',
                  colors.greyHead,
                  'Payment / Cheque in Favor Of - Payee Details'
                )}

              {/* {viewMode === 'add' ? (
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ marginBottom: '20px', width: '100%' }}>
                    <TypographySubTitle title="If Payee's name is different, please specify the reason for same. (Optional)" />
                    <TextField
                      size="small"
                      fullWidth
                      // label="(optional)"
                      placeholder="(optional)"
                      onChange={(e: any) => {
                        onChangeRegulatoryRequirementPayment(e, 'reason');
                      }}
                      value={regulatoryRequirementPayment?.reason}
                    />
                  </Box>
                </Grid>
              ) : (
                renderViewModeText(
                  colors.darkColor,
                  viewData?.payeeDetails?.reason || '-',
                  colors.greyHead,
                  'Reason'
                )
              )} */}
            </Grid>
            {viewMode === 'add' ? (
              <Box sx={{ marginBottom: '20px', width: '100%' }}>
                <TypographySubTitle title="If Payee's name is different, please specify the reason for same. (Optional)" />
                <TextField
                  size="small"
                  fullWidth
                  // label="(optional)"
                  placeholder="(optional)"
                  onChange={(e: any) => {
                    onChangeRegulatoryRequirementPayment(e, 'reason');
                  }}
                  value={regulatoryRequirementPayment?.reason}
                />
              </Box>
            ) : (
              renderViewModeText(
                colors.darkColor,
                viewData?.payeeDetails?.reason || '-',
                colors.greyHead,
                'Reason'
              )
            )}
          </Box>
        </Box>
        {viewMode === 'add' && (
          <Box
            sx={{
              backgroundColor: 'white',
              marginTop: '25px',
              padding: '20px 30px',
              borderRadius: '5px',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <HeaderWithInfo
                header="Banking details mandatory for Electronic transfer"
                isInfoEnabled={true}
                info="Add your partner's bank details here."
                isDownloadEnabled={false}
              />
            </Box>
            <Divider sx={{ marginY: '20px' }} />
            <Box>
              <Grid
                container
                sx={{ marginBottom: '20px' }}
                columnSpacing={4}
                rowSpacing={3}
              >
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <FormControl fullWidth>
                    <TypographySubTitle title="Bank Name" />
                    <Select
                      fullWidth
                      sx={{
                        height: '40px',
                        textTransform: 'capitalize',
                        fontSize: '14px',
                      }}
                      onChange={(selected: any) => {
                        onChangeBankDetails(selected, 'bankName');
                      }}
                      value={bankDetailsData?.bankName}
                    >
                      <MenuItem disabled>Select</MenuItem>
                      {getListOfBankItems.map((items: any, index: number) => {
                        return (
                          <MenuItem
                            value={items.bankName}
                            key={index}
                            sx={{
                              textTransform: 'capitalize',
                              fontSize: '14px',
                            }}
                          >
                            {items.bankName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                {viewMode === 'add' &&
                  renderEditModeText(
                    'Enter Bank Account Number',
                    'bankAccountNumber',
                    'Bank Account Number',
                    'banking_details',
                    bankDetailsData.bankAccountNumber
                  )}
                {viewMode === 'add' &&
                  renderEditModeText(
                    'Enter IFSC Code',
                    'ifscCode',
                    'IFSC Code',
                    'banking_details',
                    bankDetailsData.ifscCode
                  )}
                {viewMode === 'add' &&
                  renderEditModeText(
                    'Enter Address line 1',
                    'addressline1',
                    'Address Line 1',
                    'banking_details',
                    bankDetailsData?.addressline1
                  )}
                {viewMode === 'add' &&
                  renderEditModeText(
                    'Enter Address line 2',
                    'addressline2',
                    'Address line 2',
                    'banking_details',
                    bankDetailsData?.addressline2
                  )}
                {viewMode === 'add' &&
                  renderEditModeText(
                    'Enter Pincode',
                    'pincode',
                    'Pincode',
                    'banking_details',
                    bankDetailsData?.pincode
                  )}

                {viewMode === 'add' && (
                  <Grid item xs={12} sm={12} md={6} lg={4}>
                    <TypographySubTitle
                      fullWidth
                      title="MICR Code (9 digits)"
                    />
                    <TypoText
                      fullWidth
                      placeholder="Enter MICR Code"
                      id="micrCode"
                      handleChange={(e: any) => {
                        onChangeBankDetails(e, 'micrCode');
                      }}
                      value={bankDetailsData?.micrCode}
                      textError={
                        validateInputFields({
                          textId: 'micrCode',
                          value: bankDetailsData?.micrCode,
                        }).showError
                      }
                      errorMessage={
                        validateInputFields({
                          textId: 'micrCode',
                          value: bankDetailsData?.micrCode,
                        }).message
                      }
                    />
                  </Grid>
                )}
                {viewMode === 'add' && (
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <Upload
                      title="Attach Copy of Cancelled Cheque"
                      id="micrCodeFile"
                      callbackFunc={imageUploadCallBack}
                      danger={!bankDetailsData.micrCodeFileSuccess}
                      keyValue={bankDetailsData.micrCodeFile}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>
        )}
        {viewMode === 'add' && (
          <Box
            sx={{
              backgroundColor: 'white',
              marginTop: '25px',
              padding: '20px 30px',
              marginBottom: '100px',
              borderRadius: '5px',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <HeaderWithInfo
                header="Declaration"
                isInfoEnabled={true}
                info="Confirm the information you have provided to proceed."
                isDownloadEnabled={false}
              />
            </Box>
            <Divider sx={{ marginY: '20px' }} />
            <Box sx={{ width: '90%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Checkbox
                    style={{
                      transform: 'scale(1.2)',
                    }}
                    sx={{
                      color: '#A8A8A9',
                    }}
                    onClick={() => setDeclartion(!declartion)}
                    checked={declartion}
                    color="secondary"
                    size="medium"
                  />
                  <Typography
                    sx={{
                      fontSize: {
                        sm: '12px',
                        lg: '14px',
                      },
                      fontWeight: '400',
                    }}
                  >
                    All information I have provided is true and accurate.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        {viewMode === 'view' && (
          <Box
            sx={{
              backgroundColor: 'white',
              marginTop: '25px',
              padding: '20px 30px',
              borderRadius: '5px',
              marginBottom: '100px',
            }}
          >
            <Box>
              <HeaderWithInfo
                header="Banking details mandatory for Electronic transfer"
                isInfoEnabled={true}
                info="Add your partner's bank details here."
                isDownloadEnabled={false}
              />
              <Divider sx={{ marginY: 2 }} />

              <Grid
                container
                sx={{ marginBottom: '20px' }}
                columnSpacing={4}
                rowSpacing={3}
              >
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title="Bank Name"
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={viewData?.bankDetails?.bankName || '-'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title="Bank Account Number"
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={viewData?.bankDetails?.bankAccountNumber || '-'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title="IFSC Code"
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={viewData?.bankDetails?.ifscCode || '-'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title={'Address Line 1'}
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={viewData?.bankDetails?.branchAddress1 || '-'}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title={'Address Line 2'}
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={viewData?.bankDetails?.branchAddress2 || '-'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title="Pincode"
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={viewData?.bankDetails?.pincode || '-'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title="MICR Code (9 digit)"
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={viewData?.bankDetails?.micrCode || '-'}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{ marginBottom: '20px' }}
                columnSpacing={4}
                rowSpacing={3}
              >
                <Grid item xs={12} sm={12} md={6} lg={4}>
                  <Box sx={{ gap: 2 }}>
                    <TypographySubTitle
                      color={colors.greyHead}
                      title="Cancelled Cheque"
                    />
                    <TypoText
                      color={colors.darkColor}
                      title={viewData?.bankDetails?.cancelledCheckFile}
                    />
                    <Box className="regulatory-img">
                      {viewData?.bankDetails?.cancelledCheckFile ? (
                        <img
                          src={ViewDoc}
                          onClick={() =>
                            // handleOpen(
                            //   `${url.DEV_URL}${url.ORGANIZATION_SERVICES}view/${viewData?.bankDetails?.cancelledCheckFile}`
                            // )
                            handleOpen(
                              viewData?.bankDetails?.cancelledCheckFile
                            )
                          }
                          className="img"
                          alt="cheque"
                        />
                      ) : (
                        <div className="no-image-box">No Image</div>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        <Box
          sx={{
            marginTop: '20px',
            backgroundColor: 'white',
            position: 'fixed',
            bottom: 0,
            right: 0,
            width: '100%',
            borderTop: '1px solid #e9edf5',
            boxShadow:
              '0px 2px 10px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
          }}
        >
          {viewMode === 'add' ? (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                padding: '20px',
              }}
              className="footer-cta"
            >
              <BtnOutlined onClick={() => navigate(-1)} title="close" />
              <BtnText
                title="Save as draft"
                onClick={() => saveBtnAction('DRAFT')}
              />
              <BtnContained
                // disabled={!declartion}
                disabled={submitBtnStatus}
                onClick={() => submitBtnAction('SUBMIT')}
                title="Submit"
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: {
                  sm: 'center',
                  md: 'flex-end',
                },
                padding: '20px',
              }}
              className="footer-close-cta"
            >
              <BtnContained onClick={() => navigate(-1)} title="close" />
            </Box>
          )}
        </Box>
      </Box>

      {showCloseModal && (
        <CustomModal
          openSuccess={showCloseModal}
          handleCloseSuccess={() => {
            setShowCloseModal(false);
            navigate('/userManagement/orgStructure');
          }}
          successModalTitle={'Do you want to Close?'}
          discardModalMsg={
            'Want to discard entered values and go back to list screen?'
          }
          handleSuccess={() => setShowCloseModal(false)}
          yesContinueBtn={'Back to Form'}
          closeBtn={'Yes, Close'}
        />
      )}

      {showSuccesModal && (
        <CustomModal
          openSuccess={showSuccesModal}
          handleCloseSuccess={handleCloseSuccess}
          successModalTitle={'Create Organisation'}
          successModalMsg={
            ' Your request for creating new organisation is succesfully sent to the reviewer'
          } //todo need to check once
          btn={' Close'}
        />
      )}
      {apiError?.length !== 0 && (
        <ErrorMessage
          message={apiError}
          handleClose={() => setApiError('')}
          severity="error"
          duration={3000}
        />
      )}
      {open && (
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // width: '100vw',
              height: '100vh',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '20px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: '15px',
                }}
              >
                <Typography
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '16px',
                    color: '#0662B7',
                    letterSpacing: '0.0125em',
                    cursor: 'pointer',
                  }}
                  onClick={handleClose}
                >
                  Close
                </Typography>
              </Box>
              <Box className="cardImageBox" id="cardImageBox">
                <img
                  // src={   url.DEV_URL +
                  //   url.ORGANIZATION_SERVICES +
                  //   'view/' +
                  //   activeDocLink}
                  src={`${url.DEV_URL}${url.ORGANIZATION_SERVICES}view/${activeDocLink}`}
                  style={{
                    width: '70vw',
                    height: '70vh',
                  }}
                  alt=""
                />
              </Box>
            </Box>
          </Box>
        </Modal>
      )}
    </Stack>
  );
};
