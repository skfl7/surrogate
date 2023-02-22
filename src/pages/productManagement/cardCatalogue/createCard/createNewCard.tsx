/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-computed-key */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Styles
import './createNewCard.scss';

// MUI Components
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Divider,
  Checkbox,
  Snackbar,
  Alert,
  Stack,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import InputAdornment from '@mui/material/InputAdornment';

// Common components
import CheckboxSelectDropdown from '../../../../components/commonComponent/CheckboxSelectDropdown';
import Dropdown from '../../../../components/commonComponent/Dropdown';
import BtnContained from '../../../../components/commonComponent/CustomText/Button/Contained';
import BtnOutlined from '../../../../components/commonComponent/CustomText/Button/Outlined';
import HeaderWithInfo from '../../../../components/commonComponent/HeaderWithInfo';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import TypoText from '../../../../components/commonComponent/CustomText/Textfield';
import TypographyInfo from '../../../../components/commonComponent/CustomText/Info';
import TypographySubTitle from '../../../../components/commonComponent/CustomText/Typography';
import CustomModal from '../../../../components/commonComponent/customModal/CustomModal';

// Assets
import Info_Icon from '../../../../assets/images/info_icon.svg';
import Upload_Img from '../../../../assets/images/uploadImg.svg';
import EditIcon from '../../../../assets/images/edit_card.svg';

// Services
import {
  getCardDropdownData,
  createNewSingleCard,
  imageUpload,
  getCardDetails,
  editSingleCard,
  saveAsDraft,
} from '../../../../services/cardCatalogueServices';
import { getOrganizationDropdownData } from '../../../../services/orgStructureServices';

// constants and utils
import { getCamelCaseFeatureName } from '../../../../utils/getCamelcaseFeatureName';
import { cardDetailsDropdownTypes } from './createCard.const';
import { url } from '../../../../utils/constants/url';
import ErrorMessage from '../../../../components/commonComponent/ErrorMessage';
import { StringConversion } from '../../../../utils/conversions';
import localforage from 'localforage';
import { validateInputFields } from '../../../../utils/validations/input';
import { RegexValidation } from '../../../../utils/Regex';
import BtnText from '../../../../components/commonComponent/CustomText/Button/Text';
import { isConstructorDeclaration } from 'typescript';

const SpendPeriodDataList = [
  { code: '1', name: '1 Month' },
  { code: '2', name: '2 Month' },
  { code: '3', name: '3 Month' },
  { code: '4', name: '4 Month' },
  { code: '5', name: '5 Month' },
  { code: '6', name: '6 Month' },
  { code: '7', name: '7 Month' },
  { code: '10', name: '10 Month' },
  { code: '11', name: '11 Month' },
  { code: '12', name: '12 Month' },
];

let obj = {
  rewardDescription: [{ text: '' }],
  keyBenefits: [{ text: '' }],
  additionalBenefits: [{ text: '' }],
  welcomeBenefits: [{ text: '' }],
};

const CreateNewCard = () => {
  const [review, setReview] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [isCardCreated, setIsCardCreated] = useState(false);
  const [isCardSavedAsDraft, setIsCardSavedAsDraft] = useState(false);
  const [editPage, setEditPage] = useState(false);
  // const [cardData, setData] = useState<any>();

  // Image related state
  const [imgUploadStatus, setImgUploadStatus] = useState('initial');
  const [selectedFile, setSelectedFile] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  // currency benefits
  const [currencyBenefits, setCurrencyBenefits] = useState(false);
  const [currencyBenefitsDetails, setCurrencyBenefitsDetails] = useState({
    markUpCharge: null,
    spentLimitPerTransaction: null,
    description: '',
  });

  // airmiles beefits
  const [airmilesBenefits, setAirmilesBenefits] = useState(false);
  const [checkEmptyValues, setCheckEmptyValues] = useState(false);
  const [airmilesBenefitsDetails, setAirmilesBenefitsDetails] = useState({
    airmiles: null,
    minimumSpend: null,
    description: '',
  });

  // cashback benefits
  const [cashbackBenefits, setCashbackBenefits] = useState(false);
  const [cashbackBenefitsDetails, setCashbackBenefitsDetails] = useState({
    cashback: null,
    cashbackMinimumSpend: null,
    spendCategories: ['All'],
    description: '',
  });

  const [open, setOpen] = useState(false);

  // rewards
  const [removeClick, setRemoveClick] = useState({
    reward: false,
    keyBenefits: false,
    additionalBenefits: false,
    welcomeBenefits: false,
  });
  const [dataObj, setDataObj] = useState(obj);

  // Card details
  const [cardDetails, setCardDetails] = useState({
    bussinessId: '',
    cardName: '',
    interestRate: null,
    cardMode: '',
    cardType: '',
    cardCategory: '',
    maxCardLimit: null,
  }) as any;

  // surrogate types
  const [chosenSurrogates, setChoosenSurrogate] = useState<string[]>([]);

  // Channels
  const [selectChannels, setSelectChannels] = useState<string[]>([]);
  const [channels, setChannels] = useState([] as any[]);

  // eligibility criteria
  const [eligibilityCriteria, setEligibilityCriteria] = useState({
    cibilScore: null,
    salaryLimit: null,
    // ITRLimit: null,
    C4CLimit: null,
    AQBLimit: null,
    RCValue: null,

    EQUIFAX: null,
    EXPERIAN: null,
    CRIF: null,
  });

  // add on card
  const [addOnCard, setAddOnCard] = useState(false);

  // dropdown fields data
  const [cardDetailsDropdownList, setCardDetailsDropdownList] = useState(
    [] as any[]
  );

  // Joining fee details
  const [joiningFeeDetails, setJoiningFeeDetails] = useState({
    joiningFee: null,
    joiningFeeSpendLimit: null,
    joiningFeeSpendPeriod: null,
    joiningFeeDescription: '',
  });

  // Annual fee details
  const [annualFeeDetails, setAnnualFeeDetails] = useState({
    annualFee: null,
    annualFeeSpendLimit: null,
    annualFeeSpendPeriod: null,
    annualFeeDescription: '',
  });

  // Fuel charges
  const [fuelSurchargeDetails, setFuelSurchargeDetails] = useState({
    fuelSurcharge: null,
    fuelSurchargeSpendLimit: null,
    fuelSurchargeSpendPeriod: null,
    fuelSurchargeDescription: '',
  });

  // Empty fields
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  // Api error message
  const [apiError, setApiError] = useState('');

  // Submit disabled
  const [isDisabled, setIsDisabled] = useState(true);

  // router variabled
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [userID, setUserId] = useState<string>();
  //validation for number
  const validateNumber = /^[0-9]+$/;
  useEffect(() => {
    getLocalStorageID();
  }, []);

  useEffect(() => {
    updateSubmitBtn();
  }, [
    imgUrl,
    cardDetails,
    chosenSurrogates,
    eligibilityCriteria,
    joiningFeeDetails,
    annualFeeDetails,
    currencyBenefits,
    currencyBenefitsDetails.description,
    currencyBenefitsDetails.spentLimitPerTransaction,
    currencyBenefitsDetails.markUpCharge,
    airmilesBenefits,
    airmilesBenefitsDetails.airmiles,
    airmilesBenefitsDetails.minimumSpend,
    airmilesBenefitsDetails.description,
    cashbackBenefits,
    cashbackBenefitsDetails.cashback,
    cashbackBenefitsDetails.cashbackMinimumSpend,
    cashbackBenefitsDetails.spendCategories,
    cashbackBenefitsDetails.description,
    fuelSurchargeDetails,
    fuelSurchargeDetails.fuelSurcharge,
    fuelSurchargeDetails.fuelSurchargeDescription,
    fuelSurchargeDetails.fuelSurchargeSpendLimit,
    fuelSurchargeDetails.fuelSurchargeSpendPeriod,
  ]);

  const getLocalStorageID = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setUserId(value.id);
    } catch (err) {
      console.log(err);
    }
  };

  const goBack = () => {
    setShowCloseModal(true);
    // navigate(-1);
  };

  // const didMount = useRef(false);
  useEffect(() => {
    // if (!didMount.current) {
    //   didMount.current = true;
    //   return;
    // } else {

    if (state?.type === 'edit') {
      setReview(false);
      setEditPage(true);
      fetchCardDetails(state.cardId);
    } else if (state?.type === 'view') {
      setReview(true);
      setEditPage(false);
      fetchCardDetails(state.cardId);
    }
    fetchDropdownData();
    fetchChannels();
    // }
  }, []);

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

  // useEffect(() => {
  //   if (finishStatus) {
  //     setShowCloseModal(true);
  //     // navigate('/productManagement/cardCatalogue');
  //   }
  // }, [finishStatus]);

  // window.onpopstate = function (event) {
  //   // "event" object seems to contain value only when the back button is clicked
  //   // and if the pop state event fires due to clicks on a button
  //   // or a link it comes up as "undefined"

  //   if (event) {
  //     alert('hyy');
  //     // Code to handle back button or prevent from navigation
  //     event.preventDefault();
  //     event.stopPropagation();
  //     event.stopImmediatePropagation();
  //     // console.log('clicked');
  //     // setShowCloseModal(true);
  //   } else {
  //     // Continue user action through link or button
  //   }
  // };

  const updateSubmitBtn = () => {
    let validateForAll: any = true;
    let validateForParticularcurrencyBenefits: any = true;
    let validateForParticularairmilesBenefits: any = true;
    let validateForParticularcashbackBenefits: any = true;
    let validateEligibilityCriteria: any = true;
    let c4cValidate: any = true;
    let AQBLimitValidate: any = false;
    let RcVechileValueValidate: any = false;
    let salaryLimitValidate: any = false;

    if (
      imgUrl !== '' &&
      cardDetails?.bussinessId !== '' &&
      !RegexValidation.characterNumber.test(cardDetails?.bussinessId || '') &&
      cardDetails?.cardName !== '' &&
      RegexValidation.onlycharacterAndDot.test(cardDetails?.cardName || '') &&
      cardDetails?.interestRate !== null &&
      cardDetails?.cardType !== '' &&
      cardDetails?.cardCategory !== '' &&
      cardDetails?.maxCardLimit !== null &&
      RegexValidation.onlyNumber.test(cardDetails?.maxCardLimit || '') &&
      chosenSurrogates.length > 0 &&
      joiningFeeDetails.joiningFee !== null &&
      annualFeeDetails.annualFee !== '' &&
      annualFeeDetails.annualFeeDescription !== '' &&
      fuelSurchargeDetails.fuelSurcharge !== '' &&
      fuelSurchargeDetails.fuelSurchargeSpendLimit !== null &&
      fuelSurchargeDetails.fuelSurchargeSpendPeriod !== null &&
      fuelSurchargeDetails.fuelSurchargeDescription !== ''
    ) {
      validateForAll = false;
    } else {
      validateForAll = true;
    }

    if (
      (eligibilityCriteria.EXPERIAN !== null,
      eligibilityCriteria.EXPERIAN !== '' &&
        eligibilityCriteria.CRIF !== null &&
        eligibilityCriteria.CRIF !== '' &&
        eligibilityCriteria.cibilScore !== null &&
        eligibilityCriteria.cibilScore !== '' &&
        eligibilityCriteria.EQUIFAX !== null &&
        eligibilityCriteria.EQUIFAX !== '')
    ) {
      validateEligibilityCriteria = false;
    } else validateEligibilityCriteria = true;

    if (chosenSurrogates.includes('C4C') === true) {
      if (
        eligibilityCriteria.C4CLimit !== null &&
        eligibilityCriteria.C4CLimit !== ''
      ) {
        c4cValidate = false;
      } else {
        c4cValidate = true;
      }
    } else if (chosenSurrogates.includes('C4C') === false) {
      c4cValidate = false;
    }

    if (chosenSurrogates.includes('AA') === true) {
      if (
        eligibilityCriteria.AQBLimit !== null &&
        eligibilityCriteria.AQBLimit !== ''
      ) {
        AQBLimitValidate = false;
      } else {
        AQBLimitValidate = true;
      }
    } else if (chosenSurrogates.includes('AA') === false) {
      AQBLimitValidate = false;
    }

    if (chosenSurrogates.includes('RC') === true) {
      if (
        eligibilityCriteria.RCValue !== null &&
        eligibilityCriteria.RCValue !== ''
      ) {
        RcVechileValueValidate = false;
      } else {
        RcVechileValueValidate = true;
      }
    } else if (chosenSurrogates.includes('RC') === false) {
      RcVechileValueValidate = false;
    }

    if (chosenSurrogates.includes('PAYROLL') === true) {
      if (
        eligibilityCriteria.salaryLimit !== null &&
        eligibilityCriteria.salaryLimit !== ''
      ) {
        salaryLimitValidate = false;
      } else {
        salaryLimitValidate = true;
      }
    } else if (chosenSurrogates.includes('PAYROLL') === false) {
      salaryLimitValidate = false;
    }

    if (currencyBenefits === true) {
      if (
        currencyBenefitsDetails.markUpCharge !== null &&
        currencyBenefitsDetails.spentLimitPerTransaction !== null &&
        currencyBenefitsDetails.description !== ''
      ) {
        validateForParticularcurrencyBenefits = false;
      }
    } else if (currencyBenefits === false) {
      validateForParticularcurrencyBenefits = false;
    }

    if (airmilesBenefits === true) {
      if (
        airmilesBenefitsDetails.airmiles !== null &&
        airmilesBenefitsDetails.minimumSpend !== null &&
        airmilesBenefitsDetails.description !== ''
      ) {
        validateForParticularairmilesBenefits = false;
      }
    } else if (airmilesBenefits === false) {
      validateForParticularairmilesBenefits = false;
    }

    if (cashbackBenefits === true) {
      if (
        cashbackBenefitsDetails.cashback !== null &&
        cashbackBenefitsDetails.cashbackMinimumSpend !== null &&
        // cashbackBenefitsDetails.spendCategories.length !== 0 &&
        cashbackBenefitsDetails.description !== ''
      ) {
        validateForParticularcashbackBenefits = false;
      }
    } else if (cashbackBenefits === false) {
      validateForParticularcashbackBenefits = false;
    }

    setIsDisabled(
      validateForAll === false &&
        validateForParticularcurrencyBenefits === false &&
        validateForParticularairmilesBenefits === false &&
        validateForParticularcashbackBenefits === false &&
        validateEligibilityCriteria === false &&
        AQBLimitValidate === false &&
        c4cValidate === false &&
        RcVechileValueValidate === false &&
        salaryLimitValidate === false
        ? false
        : true
    );
  };

  // API call methods

  const fetchCardDetails = async (cardId: string) => {
    const payload = {
      id: cardId,
    };
    await getCardDetails(payload)
      .then((response) => {
        if (response.data.result) {
          const { result } = response.data;
          // Image
          setSelectedFile(
            url.DEV_URL + url.CARD_SERVICES + 'view/' + location.state?.cardId
          );
          setImgUrl(result.fileName);
          // Joining fee details
          setJoiningFeeDetails({
            joiningFee: result.joiningFee,
            joiningFeeSpendLimit: result.joiningFeeWavierLimit,
            joiningFeeSpendPeriod: result.joiningFeePeriod,
            joiningFeeDescription: result.joiningFeeDescription,
          });
          // Annual fee details
          setAnnualFeeDetails({
            annualFee: result.annualFee,
            annualFeeSpendLimit: result.annualFeeWavierLimit,
            annualFeeSpendPeriod: result.annualFeePeriod,
            annualFeeDescription: result.annualFeeDescription,
          });
          // Fuel charge description
          setFuelSurchargeDetails({
            fuelSurcharge: result.fuelSurcharge,
            fuelSurchargeSpendLimit: result.fuelSurchargeLimit,
            fuelSurchargeSpendPeriod: result.fuelSurchargePeriod,
            fuelSurchargeDescription: result.fuelSurchargeDescription,
          });
          // set rewards
          setDataObj({
            rewardDescription: result.rewardsDescription || [{ text: '' }],
            welcomeBenefits: result.welcomeBenefit || [{ text: '' }],
            keyBenefits: result.keyBenefit || [{ text: '' }],
            additionalBenefits: result.additionalBenefit || [{ text: '' }],
          });
          // card details
          setCardDetails((prevState: any) => ({
            bussinessId: result.business,
            cardName: result.cardName,
            cardCategory: result.cardCategory,
            cardMode: result.cardMode,
            cardType: result.cardType,
            maxCardLimit: result.maximumCardLimit,
            interestRate: result.interestRate,
          }));
          // surrogate type
          setChoosenSurrogate(result.surrogateType || []);
          // channels
          setSelectChannels(result.organizationTypes || []);
          // eligibility criteria
          setEligibilityCriteria({
            cibilScore: result.cibil,
            salaryLimit: result.salary,
            // ITRLimit: result.itr,
            C4CLimit: result.c4c,
            AQBLimit: result.aqb,
            RCValue: result.rc,
            EQUIFAX: result.equifax,
            EXPERIAN: result.experian,
            CRIF: result.crif,
          });
          // add on card
          setAddOnCard(result.addOnCard);
          // benefits
          setCashbackBenefits(
            result.benefit?.cashBack?.cashbackMinimumSpend ? true : false
          );
          setAirmilesBenefits(
            result.benefit?.airmiles?.minimumSpend ? true : false
          );
          setCurrencyBenefits(
            result.benefit?.currencyMarkup?.spentLimitPerTransaction
              ? true
              : false
          );
          // Benefit details
          if (result.benefit) {
            const { benefit } = result;
            benefit.currencyMarkup &&
              setCurrencyBenefitsDetails(benefit.currencyMarkup);
            benefit.airmiles && setAirmilesBenefitsDetails(benefit.airmiles);
            benefit.cashBack && setCashbackBenefitsDetails(benefit.cashBack);
          }
        } else if (response.data?.exception) {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        console.log(err);
        handleError(err?.response?.data);
        setApiError('please upload proper image');
      });
  };

  const fetchDropdownData = async () => {
    let cardListFilters = [] as any;
    const temp = cardDetailsDropdownTypes?.map(async (type: any) => {
      const payload = {
        dropDown: type.name,
      };
      const result = (await getDropdownOptions(payload)) as any;
      const dropdownObj = {
        name: type.name,
        options: result.options ? result.options : result.error,
        payloadKey: getCamelCaseFeatureName(type.name.toLowerCase()),
        selectedValues: ['All'],
        label: type.label,
        displayOrder: type.displayOrder,
      };
      return dropdownObj;
    });
    cardListFilters = await Promise.all(temp);
    setCardDetailsDropdownList(cardListFilters);
  };

  const fetchChannels = async () => {
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
          setChannels([...successResult.organizationDropDown]);
        } else if (response.data.exception) {
          handleError(response?.data ?? '');
        }
      })
      .catch((err: any) => {
        console.log(err);
        handleError(err?.response?.data ?? '');
      });
  };

  const getDropdownOptions = async (payload: any) => {
    let res = {};
    await getCardDropdownData(payload)
      .then((response) => {
        const result = response.data?.result;
        if (
          result &&
          result?.cardAddDropdown &&
          Array.isArray(result.cardAddDropdown)
        ) {
          res = {
            options: [
              {
                code: 'All',
                name: 'All',
              },
              ...result.cardAddDropdown,
            ],
          };
        } else if (response.data.exception) {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        res = { error: err.response.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const handleUploadClick = (event: any) => {
    var file = event.target.files[0];
    let imageAsBase64 = URL.createObjectURL(file);

    setSelectedFile(imageAsBase64);
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log('file', file, '--- name ---', file.name);
    imageUpload(formData)
      .then((response) => {
        if (response?.data?.fileName) {
          setImgUploadStatus('uploaded');
          setImgUrl(response?.data?.fileName);
          // setIsDisabled(false);
        } else if (response.data?.exception) {
          // setIsDisabled(true);
          if (response.data?.exception?.shortMessage) {
            setApiError(response.data.exception.shortMessage);
          } else {
            setApiError(
              'Error in image upload. Please try with a different image!'
            );
          }
        }
      })
      .catch((err) => {
        console.log('err----', err);
        setApiError(
          'Error in image upload. Please try with a different image!'
        );
        setIsDisabled(true);

        if (err.response?.data?.error)
          setApiError(
            err.response?.data?.error + ' ' + err.response?.data?.path
          );
      });
  };

  // Surrogate selection

  const selectSurrogates = (e: any, surrogate: any) => {
    let selectedSurrogates = [...chosenSurrogates];
    if (e.target.checked) {
      if (!selectedSurrogates.find((sur: string) => sur === surrogate.code))
        selectedSurrogates.push(surrogate.code);
    } else
      selectedSurrogates = selectedSurrogates.filter(
        (sur: string) => sur !== surrogate.code
      );
    setChoosenSurrogate(selectedSurrogates);
  };

  // Channel selection

  const selectChannelsValues = (e: any, channel: any) => {
    let selectedChannels = [...selectChannels];
    if (e.target.checked) {
      if (!selectedChannels.find((ch: string) => ch === channel.code)) {
        selectedChannels.push(channel.code);
      }
    } else
      selectedChannels = selectedChannels.filter(
        (ch: string) => ch !== channel.code
      );
    setSelectChannels(selectedChannels);
  };

  // Card details drop down change

  const setCheckboxSelectDropdownValues = (
    selectedValues: string,
    selectedDropdown: any
  ) => {
    if (selectedDropdown.name === 'CARD_MODE') {
      setCardDetails((prevState: any) => ({
        ...prevState,
        ['cardMode']: selectedValues,
      }));
    } else if (selectedDropdown.name === 'CARD_TYPE') {
      setCardDetails((prevState: any) => ({
        ...prevState,
        ['cardType']: selectedValues,
      }));
    } else if (selectedDropdown.name === 'CARD_CATEGORY') {
      setCardDetails((prevState: any) => ({
        ...prevState,
        ['cardCategory']: selectedValues,
      }));
    }
  };

  // handle benefits change
  const welcomeBenefitsOnChange = (e: any, index: number) => {
    const value = e?.target?.value ?? '';
    setDataObj((prev: any) => {
      let newValue = prev.welcomeBenefits;
      newValue[index].text = value;
      return { ...prev, welcomeBenefits: newValue };
    });
  };

  const additionalBenefitsOnChange = (e: any, index: number) => {
    const value = e?.target?.value ?? '';
    setDataObj((prev: any) => {
      let newValue = prev.additionalBenefits;
      newValue[index].text = value;
      return { ...prev, additionalBenefits: newValue };
    });
  };

  const keyBenefitsOnChange = (e: any, index: number) => {
    const value = e?.target?.value ?? '';
    setDataObj((prev: any) => {
      let newValue = prev.keyBenefits;
      newValue[index].text = value;
      return { ...prev, keyBenefits: newValue };
    });
  };

  const rewardDescriptionOnChange = (e: any, index: number) => {
    const value = e?.target?.value;
    setDataObj((prev: any) => {
      let newValue = prev.rewardDescription;
      newValue[index].text = value;
      return { ...prev, rewardDescription: newValue };
    });
  };

  // add benefits
  const AddRewardList = () => {
    let newVal = { text: '' };
    setDataObj((prev) => ({
      ...prev,
      rewardDescription: [...prev.rewardDescription, newVal],
    }));
    setRemoveClick((prev) => ({
      ...prev,
      reward: true,
    }));
  };

  const AddKeyList = () => {
    let newVal = { text: '' };
    setDataObj((prev) => ({
      ...prev,
      keyBenefits: [...prev.keyBenefits, newVal],
    }));
    setRemoveClick((prev) => ({
      ...prev,
      keyBenefits: true,
    }));
  };

  const AddAdditionalList = () => {
    let newVal = { text: '' };
    setDataObj((prev) => ({
      ...prev,
      additionalBenefits: [...prev.additionalBenefits, newVal],
    }));
    setRemoveClick((prev) => ({
      ...prev,
      additionalBenefits: true,
    }));
  };

  const AddWelcomeList = () => {
    let newVal = { text: '' };
    setDataObj((prev) => ({
      ...prev,
      welcomeBenefits: [...prev.welcomeBenefits, newVal],
    }));
    setRemoveClick((prev) => ({
      ...prev,
      welcomeBenefits: true,
    }));
  };

  // Remove benefits
  const removeWelcome = (index: number) => {
    let newData = dataObj?.welcomeBenefits ?? [];
    newData.splice(index, 1);
    setDataObj((prev) => ({
      ...prev,
      welcomeBenefits: newData,
    }));
  };

  const removeReward = (index: number) => {
    let newData = dataObj?.rewardDescription ?? [];
    newData.splice(index, 1);
    setDataObj((prev) => ({
      ...prev,
      rewardDescription: newData,
    }));
  };

  const removeKeyBenefits = (index: number) => {
    let newData = dataObj?.keyBenefits ?? [];
    newData.splice(index, 1);
    setDataObj((prev) => ({
      ...prev,
      keyBenefits: newData,
    }));
  };

  const removeAdditionalBenefits = (index: number) => {
    let newData = dataObj?.additionalBenefits ?? [];
    newData.splice(index, 1);
    setDataObj((prev) => ({
      ...prev,
      additionalBenefits: newData,
    }));
  };

  const editNewPage = () => {
    setReview(false);
    setEditPage(true);
  };

  // handle api errors

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

  // Form saveAsDraft method

  const handleSaveDraft = (e: any, flag: string) => {
    e.preventDefault();
    setCheckEmptyValues(true);
    if (cardDetails?.bussinessId !== '') {
      if (
        cashbackBenefitsDetails.spendCategories.length === 1 &&
        cashbackBenefitsDetails.spendCategories[0] === 'All'
      ) {
        cashbackBenefitsDetails.spendCategories = SpendCategoryList.filter(
          (spend: any) => spend.code !== 'All'
        )?.map((category: any) => category.code);
        setCashbackBenefitsDetails((prevState: any) => ({
          ...prevState,
          ['spendCategories']: cashbackBenefitsDetails.spendCategories,
        }));
      }

      const benefit: any = {};

      if (currencyBenefits) {
        benefit['currencyMarkup'] = currencyBenefitsDetails;
      }
      if (airmilesBenefits) {
        benefit['airmiles'] = airmilesBenefitsDetails;
      }

      if (cashbackBenefits) {
        benefit['cashBack'] = cashbackBenefitsDetails;
      }

      const payload: any = {
        requestType: 'DRAFT',
        fileName: imgUrl,
        business: cardDetails?.bussinessId,
        cardName: cardDetails?.cardName,
        interestRate: cardDetails?.interestRate,
        cardMode: cardDetails?.cardMode,
        cardType: cardDetails?.cardType,
        cardCategory: cardDetails?.cardCategory,
        maximumCardLimit: cardDetails?.maxCardLimit,

        surrogateType: chosenSurrogates,

        organizationTypes: selectChannels,

        cibil: eligibilityCriteria?.cibilScore,
        salary: eligibilityCriteria?.salaryLimit,
        // itr: eligibilityCriteria?.ITRLimit,
        c4c: eligibilityCriteria?.C4CLimit,
        aqb: eligibilityCriteria?.AQBLimit,
        rc: eligibilityCriteria?.RCValue,

        equifax: eligibilityCriteria?.EQUIFAX,
        experian: eligibilityCriteria?.EXPERIAN,
        crif: eligibilityCriteria?.CRIF,

        addOnCard: addOnCard,

        benefit: benefit,

        joiningFee: joiningFeeDetails?.joiningFee,
        joiningFeeWavierLimit: joiningFeeDetails?.joiningFeeSpendLimit,
        joiningFeePeriod: joiningFeeDetails?.joiningFeeSpendPeriod,
        joiningFeeDescription: joiningFeeDetails.joiningFeeDescription,

        annualFee: annualFeeDetails?.annualFee,
        annualFeeWavierLimit: annualFeeDetails?.annualFeeSpendLimit,
        annualFeePeriod: annualFeeDetails?.annualFeeSpendPeriod,
        annualFeeDescription: annualFeeDetails.annualFeeDescription,

        fuelSurcharge: fuelSurchargeDetails?.fuelSurcharge,
        fuelSurchargeLimit: fuelSurchargeDetails?.fuelSurchargeSpendLimit,
        fuelSurchargePeriod: fuelSurchargeDetails?.fuelSurchargeSpendPeriod,
        fuelSurchargeDescription: fuelSurchargeDetails.fuelSurchargeDescription,

        rewardsDescription: dataObj.rewardDescription,
        welcomeBenefit: dataObj.welcomeBenefits,
        additionalBenefit: dataObj.additionalBenefits,
        keyBenefit: dataObj.keyBenefits,
        cardId: location.state?.cardId,
        actionUserId: userID,
      };

      saveAsDraft(payload)
        .then((response) => {
          if (response.data?.exception) {
            handleError(response.data);
          } else {
            setIsCardSavedAsDraft(true);
          }
        })
        .catch((err) => {
          console.log('err', err);
          handleError(err.response.data);
        });
    }
  };

  // Form submit method

  const handleSubmit = (e: any, flag: string) => {
    e.preventDefault();
    if (cardDetails?.bussinessId !== '') {
      if (
        cashbackBenefitsDetails.spendCategories.length === 1 &&
        cashbackBenefitsDetails.spendCategories[0] === 'All'
      ) {
        cashbackBenefitsDetails.spendCategories = SpendCategoryList.filter(
          (spend: any) => spend.code !== 'All'
        )?.map((category: any) => category.code);
        setCashbackBenefitsDetails((prevState: any) => ({
          ...prevState,
          ['spendCategories']: cashbackBenefitsDetails.spendCategories,
        }));
      }

      const benefit: any = {};

      if (currencyBenefits) {
        benefit['currencyMarkup'] = currencyBenefitsDetails;
      }
      if (airmilesBenefits) {
        benefit['airmiles'] = airmilesBenefitsDetails;
      }

      if (cashbackBenefits) {
        benefit['cashBack'] = cashbackBenefitsDetails;
      }

      const payload: any = {
        requestType: flag === 'Submit' ? 'SUBMIT' : 'DRAFT',
        fileName: imgUrl,
        business: cardDetails?.bussinessId,
        cardName: cardDetails?.cardName,
        interestRate: cardDetails?.interestRate,
        cardMode: cardDetails?.cardMode,
        cardType: cardDetails?.cardType,
        cardCategory: cardDetails?.cardCategory,
        maximumCardLimit: cardDetails?.maxCardLimit,
        surrogateType: chosenSurrogates,
        organizationTypes: selectChannels,
        cibil: eligibilityCriteria?.cibilScore,
        salary: eligibilityCriteria?.salaryLimit,
        // itr: eligibilityCriteria?.ITRLimit,
        c4c: eligibilityCriteria?.C4CLimit,
        aqb: eligibilityCriteria?.AQBLimit,
        rc: eligibilityCriteria?.RCValue,

        equifax: eligibilityCriteria?.EQUIFAX,
        experian: eligibilityCriteria?.EXPERIAN,
        crif: eligibilityCriteria?.CRIF,

        addOnCard: addOnCard,

        benefit: benefit,

        joiningFee: joiningFeeDetails?.joiningFee,
        joiningFeeWavierLimit: joiningFeeDetails?.joiningFeeSpendLimit,
        joiningFeePeriod: joiningFeeDetails?.joiningFeeSpendPeriod,
        joiningFeeDescription: joiningFeeDetails.joiningFeeDescription,

        annualFee: annualFeeDetails?.annualFee,
        annualFeeWavierLimit: annualFeeDetails?.annualFeeSpendLimit,
        annualFeePeriod: annualFeeDetails?.annualFeeSpendPeriod,
        annualFeeDescription: annualFeeDetails.annualFeeDescription,

        fuelSurcharge: fuelSurchargeDetails?.fuelSurcharge,
        fuelSurchargeLimit: fuelSurchargeDetails?.fuelSurchargeSpendLimit,
        fuelSurchargePeriod: fuelSurchargeDetails?.fuelSurchargeSpendPeriod,
        fuelSurchargeDescription: fuelSurchargeDetails.fuelSurchargeDescription,

        rewardsDescription: dataObj.rewardDescription,
        welcomeBenefit: dataObj.welcomeBenefits,
        additionalBenefit: dataObj.additionalBenefits,
        keyBenefit: dataObj.keyBenefits,
        cardId: location.state?.cardId,
        actionUserId: userID,
      };

      const emptyFields = [] as string[];

      Object.entries(payload).forEach((entry: any) => {
        const key = entry[0];
        const value = entry[1];
        if (
          key !== 'benefit' &&
          key !== 'addOnCard' &&
          key !== 'cardId' &&
          key !== 'rewardsDescription' &&
          key !== 'welcomeBenefit' &&
          key !== 'additionalBenefit' &&
          key !== 'keyBenefit'
        )
          if (key === 'benefit') {
            // if (
            //   value === null ||
            //   // ((typeof value === 'string' || typeof value === '"Array"') &&
            //   value?.length === 0 ||
            //   (typeof value !== 'number' && Object.keys(value)?.length === 0)
            // ) {
            //   emptyFields.push(key);
            // }
            if (
              currencyBenefits &&
              (currencyBenefitsDetails.markUpCharge === null ||
                currencyBenefitsDetails.spentLimitPerTransaction === null ||
                currencyBenefitsDetails.description === '')
            )
              emptyFields.push('currency mark up charges');
            if (
              airmilesBenefits &&
              (airmilesBenefitsDetails.airmiles === null ||
                airmilesBenefitsDetails.minimumSpend === null ||
                airmilesBenefitsDetails.description === '')
            )
              emptyFields.push('airmiles');

            if (
              cashbackBenefits &&
              (cashbackBenefitsDetails.cashback === null ||
                cashbackBenefitsDetails.cashbackMinimumSpend === null ||
                cashbackBenefitsDetails.spendCategories.length === 0 ||
                cashbackBenefitsDetails.description === '')
            )
              emptyFields.push('cashback');
          } else if (
            key === 'rewardsDescription' ||
            key === 'welcomeBenefit' ||
            key === 'additionalBenefit' ||
            key === 'keyBenefit'
          ) {
            payload[key]?.forEach((ben: { text: string }) => {
              if (ben.text.length === 0) emptyFields.push(key);
            });
          }
      });
      setEmptyFields(emptyFields);

      if (emptyFields.length === 0)
        if (editPage) {
          editSingleCard(payload)
            .then((response) => {
              if (response.data?.exception) {
                handleError(response?.data ?? '');
              } else {
                if (flag === 'Submit') setIsCardCreated(true);
                else setIsCardSavedAsDraft(true);
              }
            })
            .catch((err) => {
              console.log('err', err);
              handleError(err?.response?.data ?? '');
            });
        } else
          createNewSingleCard(payload)
            .then((response) => {
              if (response.data?.exception) {
                handleError(response?.data ?? '');
              } else {
                if (flag === 'Submit') setIsCardCreated(true);
                else setIsCardSavedAsDraft(true);
              }
            })
            .catch((err) => {
              console.log('err', err);
              handleError(err?.response?.data ?? '');
            });
    }
  };

  const surrogateTypes =
    cardDetailsDropdownList.find(
      (dropdown: any) => dropdown.name === 'SURROGATE_TYPE'
    )?.options || [];

  const SpendCategoryList =
    cardDetailsDropdownList.find(
      (dropdown: any) => dropdown.name === 'SPEND_CATEGORY'
    )?.options || [];

    const dropDownplaceholder=[
      "Choose"
    ]

  return (
    <form>
      <Box className="create-single-card">
        {review ? (
          <Box className="reviewbox1">
            <Box className="head" sx={{ marginBottom: '15px' }}>
              <Box className="headFull">
                <Box onClick={goBack}>
                  <ArrowBackIcon className="headback" />
                </Box>
                <Box>
                  <TypoText
                    title={`${cardDetails?.cardName} - ${cardDetails?.cardType} (ID No. ${location.state?.cardId})`}
                  />
                  <TypographyInfo title="From here you can add your new card" />
                </Box>
              </Box>

              <Box className="headIconBox">
                <Button onClick={editNewPage} className="btn">
                  <IconButton className="icon">
                    <img
                      src={EditIcon}
                      style={{
                        filter: '',
                      }}
                      alt=""
                    />
                  </IconButton>
                  Edit Card
                </Button>
              </Box>
            </Box>
            <Divider />

            <Box className="body">
              <Box className="bodyBox">
                <Card className="card" sx={{ cursor: 'pointer' }}>
                  <img
                    className="img"
                    src={
                      url.DEV_URL +
                      url.CARD_SERVICES +
                      'view/' +
                      location.state?.cardId
                    }
                    onClick={() => setOpen(true)}
                    alt="Card"
                  />

                  {open && (
                    <Modal
                      keepMounted
                      open={open}
                      onClose={() => setOpen(false)}
                      aria-labelledby="keep-mounted-modal-title"
                      aria-describedby="keep-mounted-modal-description"
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100vw',
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
                              justifyContent: 'space-between',
                              paddingBottom: '15px',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: '16px',
                                color: '#231F20',
                                letterSpacing: '0.001em',
                              }}
                            >
                              {`Card Photo - ${cardDetails?.cardName || ''} - ${
                                cardDetails?.cardType || ''
                              }`}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: '16px',
                                color: '#0662B7',
                                letterSpacing: '0.0125em',
                                cursor: 'pointer',
                              }}
                              onClick={() => setOpen(false)}
                            >
                              Close
                            </Typography>
                          </Box>
                          <Box className="cardImageBox">
                            <img
                              style={{
                                width: '35vw',
                                objectFit: 'contain',
                              }}
                              alt=""
                              src={
                                url.DEV_URL +
                                url.CARD_SERVICES +
                                'view/' +
                                location.state?.cardId
                              }
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Modal>
                  )}
                </Card>
              </Box>

              <Box>
                <Grid container className="textGrid" spacing={5}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box className="businessText">
                      <Typography className="commonTextViewHeader">
                        Business ID
                      </Typography>
                      <Typography className="commonTextViewSubHeader">
                        {cardDetails?.bussinessId || '-'}
                      </Typography>
                      {/* <TypoText
                        id={'businessId'}
                        title={cardDetails?.bussinessId || '-'}
                      /> */}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography className="commonTextViewHeader">
                        Card Name
                      </Typography>
                      <Typography className="commonTextViewSubHeader">
                        {cardDetails?.cardName || '-'}
                      </Typography>
                      {/* <TypoText color="grey" title="Card Name" />
                      <TypoText
                        id={'cardName'}
                        title={cardDetails?.cardName || '-'}
                      /> */}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography className="commonTextViewHeader">
                        Interest Rate (in %)
                      </Typography>
                      <Typography className="commonTextViewSubHeader">
                        {(cardDetails?.interestRate &&
                          cardDetails?.interestRate + '%') ||
                          '-'}
                      </Typography>
                      {/* <TypoText color="grey" title="Interest Rate (in%)" />
                      <TypoText
                        required={true}
                        id={'interestRate'}
                        title={cardDetails?.interestRate + '%' || '-'}
                      /> */}
                    </Box>
                  </Grid>
                </Grid>

                <Grid container spacing={5}>
                  {/* <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography className="commonTextViewHeader">
                        Card Type
                      </Typography>
                      <Typography className="commonTextViewSubHeader">
                        {cardDetails?.cardType || '-'}
                        {cardDetails.cardMode || '-'}
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography className="commonTextViewHeader">
                        Card Mode
                      </Typography>
                      <Typography className="commonTextViewSubHeader">
                        {cardDetails?.cardMode || '-'}
                        {/* {cardDetails.cardType || '-'} */}
                      </Typography>
                      {/* <TypoText color="grey" title="Card Type" />
                      <Typography>{cardDetails.cardType || '-'}</Typography> */}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography className="commonTextViewHeader">
                        Card Type
                      </Typography>
                      <Typography className="commonTextViewSubHeader">
                        {cardDetails.cardType || '-'}
                      </Typography>
                      {/* <TypoText color="grey" title="Card Type" />
                      <Typography>{cardDetails.cardType || '-'}</Typography> */}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography className="commonTextViewHeader">
                        Card Category
                      </Typography>
                      <Typography className="commonTextViewSubHeader">
                        {cardDetails?.cardCategory || '-'}
                      </Typography>
                      {/* <TypoText color="grey" title="Card Category" />
                      <Typography>{cardDetails.cardCategory || '-'}</Typography> */}
                    </Box>
                  </Grid>
                </Grid>

                <Grid container className="maximumCardGrid">
                  <Grid item xs={12} sm={6} md={4}>
                    <Box className="textField">
                      <Typography className="commonTextViewHeader">
                        Maximum Card Limit
                      </Typography>
                      <Typography className="commonTextViewSubHeader">
                        {cardDetails?.maxCardLimit
                          ? StringConversion(
                              cardDetails?.maxCardLimit,
                              false,
                              true,
                              false
                            )
                          : '-'}
                      </Typography>
                      {/* <TypoText color="grey" title="Maximum Card Limit" />
                      <TypoText
                        title={
                          cardDetails?.maxCardLimit
                            ? StringConversion(
                                cardDetails.maxCardLimit,
                                false,
                                true,
                                false
                              )
                            : '-'
                        }
                      /> */}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box className="box1">
            <Box className="head">
              <Box className="headFull">
                {editPage ? (
                  <ScreenHeader
                    title="Edit Card Details"
                    info="Edit your card details here."
                    showBackButton={true}
                  />
                ) : (
                  <ScreenHeader
                    title="Add New Card"
                    info="Add your new card here."
                    showBackButton={true}
                    gobackFun={goBack}
                  />
                )}
              </Box>

              {/* {editPage && (
                <Box>
                  <Button
                    className="headId"
                    sx={{ textTransform: 'capitalize' }}
                  >
                    ID.No. {location.state.cardId}
                  </Button>
                </Box>
              )} */}
            </Box>
          </Box>
        )}
        {!review && (
          <>
            <Box className="box2">
              <HeaderWithInfo
                header="Upload Photo"
                isInfoEnabled={true}
                info="Upload the image of the card"
                isDownloadEnabled={false}
              />
              {selectedFile === '' ? (
                <Box className="ImgUploadBox">
                  <Card
                    className="imgCard"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #F3F3F3,#F3F3F3)',
                    }}
                  >
                    <input
                      accept=".png"
                      className="imge-upload-input"
                      type="file"
                      id="contained-button-file"
                      onChange={handleUploadClick}
                    />

                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      htmlFor="contained-button-file"
                    >
                      <img src={Upload_Img} alt="" />
                    </IconButton>
                    <Button
                      aria-label="upload picture"
                      component="label"
                      htmlFor="contained-button-file"
                      sx={{ textTransform: 'capitalize' }}
                      color="secondary"
                    >
                      Upload
                    </Button>
                  </Card>
                </Box>
              ) : (
                <Box className="ImgUploadBox">
                  <Card className="imgCard">
                    <img className="img" src={selectedFile} alt="Card" />
                  </Card>
                  <input
                    accept=".png"
                    className="imge-upload-input"
                    type="file"
                    id="contained-button-file"
                    onChange={handleUploadClick}
                  />
                  <Button
                    aria-label="upload picture"
                    component="label"
                    htmlFor="contained-button-file"
                    sx={{ textTransform: 'capitalize' }}
                    color="secondary"
                  >
                    Re-upload
                  </Button>
                </Box>
              )}
            </Box>
            <Box className="box3">
              <HeaderWithInfo
                header="Enter Card Details"
                isInfoEnabled={true}
                info="From here you can can add the card information"
                isDownloadEnabled={false}
              />

              <Grid container className="cardDetailGrid1" spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ gap: 2 }}>
                    <Typography className="enterCardDetailsFieldTextSingleUpload">
                      Business ID
                    </Typography>
                    <TypoText
                      id="bussinessId"
                      placeholder="Business ID"
                      handleChange={(e: any, id: string) => {
                        setCardDetails((prevState: any) => ({
                          ...prevState,
                          [id]: e.target.value,
                        }));
                      }}
                      value={cardDetails?.bussinessId}
                      required={true}
                      // textError={}
                      type="text"
                      textError={
                        validateInputFields({
                          textId: 'bussinessId',
                          value: cardDetails?.bussinessId,
                          checkEmptyValue: checkEmptyValues,
                        }).showError
                      }
                      errorMessage={
                        validateInputFields({
                          textId: 'bussinessId',
                          value: cardDetails?.bussinessId,
                          checkEmptyValue: checkEmptyValues,
                        }).message
                      }
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography className="enterCardDetailsFieldTextSingleUpload">
                      Card Name
                    </Typography>
                    <TypoText
                      placeholder="Card Name"
                      handleChange={(e: any, id: string) => {
                        setCardDetails((prevState: any) => ({
                          ...prevState,
                          [id]: e.target.value,
                        }));
                      }}
                      id="cardName"
                      value={cardDetails?.cardName}
                      required={true}
                      type="text"
                      textError={
                        validateInputFields({
                          textId: 'cardName',
                          value: cardDetails?.cardName,
                          // checkEmptyValue: checkEmptyValues,
                        }).showError
                      }
                      errorMessage={
                        validateInputFields({
                          textId: 'cardName',
                          value: cardDetails?.cardName,
                          // checkEmptyValue: checkEmptyValues,
                        }).message
                      }
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography className="enterCardDetailsFieldTextSingleUpload">
                      Interest Rate (in%)
                    </Typography>
                    <TypoText
                      className="enterCardDetailsInterestRate"
                      placeholder="Interest Rate in%"
                      handleChange={(e: any, id: string) => {
                        if (
                          e.target.value &&
                          // Number(e.target.value) >= 0 &&
                          Number(e.target.value) <= 60
                        ) {
                          setCardDetails((prevState: any) => ({
                            ...prevState,
                            [id]: Number(Number(e.target.value).toFixed(2)),
                          }));
                        } else if (e?.target?.value === '') {
                          setCardDetails((prevState: any) => ({
                            ...prevState,
                            [id]: '',
                          }));
                        }
                      }}
                      id="interestRate"
                      value={cardDetails?.interestRate}
                      required={true}
                      type="number"
                    />
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                {cardDetailsDropdownList?.map(
                  (
                    eachItem: {
                      displayOrder: number;
                      label: string;
                      options: Array<any>;
                      payloadKey: string;
                    },
                    index: number
                  ) => {
                    const cardDetailsKey = eachItem.payloadKey || 'cardMode';
                    return (
                      eachItem.displayOrder !== -1 && (
                        <Grid
                          sx={{ width: '250px' }}
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          key={index}
                        >
                          <Typography className="enterCardDetailsField-dropdown-label">
                            {eachItem?.label}
                          </Typography>
                          <Dropdown
                            data={eachItem?.options.filter(
                              (option: any) => option.code !== 'All'
                            )}
                            onSelect={(e: any) => {
                              setCheckboxSelectDropdownValues(
                                e.target.value,
                                eachItem
                              );
                            }}
                            selectedValue={
                              (cardDetails &&
                                cardDetails[eachItem.payloadKey]) ||
                              ''
                            }
                            label={dropDownplaceholder.map((item)=>item)}
                          />
                        </Grid>
                      )
                    );
                  }
                )}
              </Grid>
              <Grid
                container
                sx={{
                  marginTop: 2,
                }}
              >
                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '97%',
                    }}
                  >
                    <Typography className="enterCardDetailsFieldTextSingleUpload">
                      Maximum Card Limit
                    </Typography>
                    <TypoText
                      placeholder="Enter maximum card limit"
                      handleChange={(e: any, id: string) => {
                        if (
                          e.target.value &&
                          validateNumber.test(e.target.value)
                        ) {
                          setCardDetails((prevState: any) => ({
                            ...prevState,
                            [id]: e.target.value,
                          }));
                        } else if (e?.target?.value === '') {
                          setCardDetails((prevState: any) => ({
                            ...prevState,
                            [id]: '',
                          }));
                        }
                      }}
                      id="maxCardLimit"
                      value={cardDetails?.maxCardLimit}
                      required={true}
                      type="number"
                      textError={
                        validateInputFields({
                          textId: 'maxCardLimit',
                          value: cardDetails?.maxCardLimit,
                          checkEmptyValue: checkEmptyValues,
                        }).showError
                      }
                      errorMessage={
                        validateInputFields({
                          textId: 'maxCardLimit',
                          value: cardDetails?.maxCardLimit,
                          checkEmptyValue: checkEmptyValues,
                        }).message
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        )}

        {review ? (
          <Box className="reviewbox2">
            <Box className="surrogateHead">
              <TypoText title=" Surrogate" />
              <img src={Info_Icon} alt="Info" />
              <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna. " />
            </Box>
            <Divider />
            <Box className="surrogateBody">
              <Typography variant="body2" className="title">
                Surrogate
              </Typography>
              <Typography className="text">
                {chosenSurrogates.length > 0
                  ? chosenSurrogates.toString()
                  : '-'}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box className="box4">
            <HeaderWithInfo
              header="Choose Surrogate"
              isInfoEnabled={true}
              info="Choose a preferred surrogate type for the card."
              isDownloadEnabled={false}
            />

            <Grid container className="chooseSurrogateGrid">
              {surrogateTypes.map(
                (option: any) =>
                  option.code !== 'All' && (
                    <Grid item md={2} key={option.code} spacing={0}>
                      <Box className="box">
                        <Checkbox
                          style={{
                            transform: 'scale(1.2)',
                          }}
                          sx={{
                            color: '#A8A8A9',
                          }}
                          color="secondary"
                          onChange={(e: any) => selectSurrogates(e, option)}
                          checked={chosenSurrogates.some(
                            (surrogate: string) => surrogate === option.code
                          )}
                        />

                        <Typography className="text" display="inline">
                          {option.name}
                        </Typography>
                      </Box>
                    </Grid>
                  )
              )}
            </Grid>
          </Box>
        )}

        {review ? (
          <Box className="reviewbox3">
            <Box className="channelHead">
              <TypoText title=" Channels" />
              <img src={Info_Icon} alt="info" />
              <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
            </Box>
            <Divider />

            <Box className="channelBody">
              <Typography variant="body2" className="title">
                Channels
              </Typography>
              <Typography className="text">
                {selectChannels.length > 0 ? selectChannels.toString() : '-'}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box className="box5">
            <HeaderWithInfo
              header="Select Channels"
              isInfoEnabled={true}
              info="Choose a channel for the card."
              isDownloadEnabled={false}
            />
            <Grid container className="chooseChannelGrid">
              {channels &&
                channels.map((channel: any) => (
                  <Grid item md={2} key={channel.code} spacing={0}>
                    <Box className="box">
                      <Checkbox
                        style={{
                          transform: 'scale(1.2)',
                        }}
                        sx={{
                          color: '#A8A8A9',
                        }}
                        color="secondary"
                        onChange={(e: any) => selectChannelsValues(e, channel)}
                        checked={selectChannels.some(
                          (ch: string) => ch === channel.code
                        )}
                      />

                      <Typography className="text" display="inline">
                        {channel.name}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}

        {review ? (
          <Box sx={{ backgroundColor: 'white', marginTop: 3, padding: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1,
                paddingBottom: 2,
              }}
            >
              <TypoText title="Eligibility Criteria " />
              <img src={Info_Icon} alt="info" />
              <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
            </Box>
            <Divider />

            <Grid container sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Bureau score
                </Typography>
                <Typography className="CommonReviewText">
                  {eligibilityCriteria.cibilScore}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  EQUIFAX
                </Typography>
                <Typography className="CommonReviewText">
                  {eligibilityCriteria.EQUIFAX
                    ? StringConversion(
                        eligibilityCriteria.EQUIFAX,
                        false,
                        true,
                        false
                      )
                    : '-'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  EXPERIAN
                </Typography>
                <Typography className="CommonReviewText">
                  {eligibilityCriteria.EXPERIAN
                    ? StringConversion(
                        eligibilityCriteria.EXPERIAN,
                        false,
                        true,
                        false
                      )
                    : '-'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  CRIF
                </Typography>
                <Typography className="CommonReviewText">
                  {eligibilityCriteria.CRIF
                    ? StringConversion(
                        eligibilityCriteria.CRIF,
                        false,
                        true,
                        false
                      )
                    : '-'}
                </Typography>
              </Grid>

              {eligibilityCriteria.salaryLimit !== null &&
                eligibilityCriteria.salaryLimit !== undefined &&
                eligibilityCriteria.salaryLimit !== '' && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" className="CommonReviewTitle">
                      Salary Limit
                    </Typography>
                    <Typography className="CommonReviewText">
                      {eligibilityCriteria.salaryLimit
                        ? StringConversion(
                            eligibilityCriteria.salaryLimit,
                            false,
                            true,
                            false
                          )
                        : '-'}
                    </Typography>
                  </Grid>
                )}
              {/* <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  ITR Limit
                </Typography>
                <Typography className="CommonReviewText">
                  {eligibilityCriteria.ITRLimit
                    ? StringConversion(
                        eligibilityCriteria.ITRLimit,
                        false,
                        true,
                        false
                      )
                    : '-'}
                </Typography>
              </Grid> */}
              {eligibilityCriteria.C4CLimit !== null &&
                eligibilityCriteria.C4CLimit !== undefined &&
                eligibilityCriteria.C4CLimit !== '' && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" className="CommonReviewTitle">
                      C4C Limit
                    </Typography>
                    <Typography className="CommonReviewText">
                      {eligibilityCriteria.C4CLimit
                        ? StringConversion(
                            eligibilityCriteria.C4CLimit,
                            false,
                            true,
                            false
                          )
                        : '-'}
                    </Typography>
                  </Grid>
                )}

              {eligibilityCriteria.AQBLimit !== null &&
                eligibilityCriteria.AQBLimit !== undefined &&
                eligibilityCriteria.AQBLimit !== '' && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" className="CommonReviewTitle">
                      AQB Limit (6 Month)
                    </Typography>
                    <Typography className="CommonReviewText">
                      {eligibilityCriteria.AQBLimit
                        ? StringConversion(
                            eligibilityCriteria.AQBLimit,
                            false,
                            true,
                            false
                          )
                        : '-'}
                    </Typography>
                  </Grid>
                )}

              {eligibilityCriteria.RCValue !== null &&
                eligibilityCriteria.RCValue !== undefined &&
                eligibilityCriteria.RCValue !== '' && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" className="CommonReviewTitle">
                      RC (Vehicle Value)
                    </Typography>
                    <Typography className="CommonReviewText">
                      {eligibilityCriteria.RCValue
                        ? StringConversion(
                            eligibilityCriteria.RCValue,
                            false,
                            true,
                            false
                          )
                        : '-'}
                    </Typography>
                  </Grid>
                )}
            </Grid>
          </Box>
        ) : (
          <Box className="box6">
            <HeaderWithInfo
              header="Eligibility Criteria"
              isInfoEnabled={true}
              info="Add customer eligibility parameters here."
              isDownloadEnabled={false}
            />

            <Grid container className="eligibilityGrid " spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ gap: 2 }}>
                  <Typography className="enterCardDetailsFieldTextSingleUpload">
                    Bureau score
                  </Typography>

                  <TypoText
                    placeholder="Bureau score"
                    handleChange={(e: any, id: string) => {
                      if (
                        e.target.value &&
                        Number(e.target.value) > 0 &&
                        Number(e.target.value) <= 900
                      ) {
                        setEligibilityCriteria((prevState: any) => ({
                          ...prevState,
                          [id]: Number(e.target.value),
                        }));
                      } else if (e?.target?.value === '') {
                        setEligibilityCriteria((prevState: any) => ({
                          ...prevState,
                          [id]: '',
                        }));
                      }
                    }}
                    inputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    id="cibilScore"
                    value={eligibilityCriteria?.cibilScore}
                    required={true}
                    // type="number"
                    textError={
                      validateInputFields({
                        textId: 'cibilScore',
                        value: cardDetails?.cibilScore,
                        checkEmptyValue: checkEmptyValues,
                      }).showError
                    }
                    errorMessage={
                      validateInputFields({
                        textId: 'cibilScore',
                        value: cardDetails?.cibilScore,
                        checkEmptyValue: checkEmptyValues,
                      }).message
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ gap: 2 }}>
                  <Typography className="enterCardDetailsFieldTextSingleUpload">
                    Equifax
                  </Typography>

                  <TypoText
                    placeholder="00.00"
                    handleChange={(e: any, id: string) => {
                      if (e.target.value && Number(e.target.value) <= 900) {
                        setEligibilityCriteria((prevState: any) => ({
                          ...prevState,
                          [id]: Number(e.target.value),
                        }));
                      } else if (e?.target?.value === '') {
                        setEligibilityCriteria((prevState: any) => ({
                          ...prevState,
                          [id]: '',
                        }));
                      }
                    }}
                    inputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    id="EQUIFAX"
                    value={eligibilityCriteria?.EQUIFAX}
                    required={true}
                    // type="number"
                    textError={
                      validateInputFields({
                        textId: 'cibilScore',
                        value: cardDetails?.cibilScore,
                        checkEmptyValue: checkEmptyValues,
                      }).showError
                    }
                    errorMessage={
                      validateInputFields({
                        textId: 'cibilScore',
                        value: cardDetails?.cibilScore,
                        checkEmptyValue: checkEmptyValues,
                      }).message
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ gap: 2 }}>
                  <Typography className="enterCardDetailsFieldTextSingleUpload">
                    Experian
                  </Typography>

                  <TypoText
                    placeholder="00.00"
                    handleChange={(e: any, id: string) => {
                      if (e.target.value && Number(e.target.value) <= 900) {
                        setEligibilityCriteria((prevState: any) => ({
                          ...prevState,
                          [id]: Number(e.target.value),
                        }));
                      } else if (e?.target?.value === '') {
                        setEligibilityCriteria((prevState: any) => ({
                          ...prevState,
                          [id]: '',
                        }));
                      }
                    }}
                    inputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    id="EXPERIAN"
                    value={eligibilityCriteria?.EXPERIAN}
                    required={true}
                    type="number"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ gap: 2 }}>
                  <Typography className="enterCardDetailsFieldTextSingleUpload">
                    CRIF
                  </Typography>

                  <TypoText
                    placeholder="00.00"
                    handleChange={(e: any, id: string) => {
                      if (e.target.value && Number(e.target.value) <= 900) {
                        setEligibilityCriteria((prevState: any) => ({
                          ...prevState,
                          [id]: Number(e.target.value),
                        }));
                      } else if (e?.target?.value === '') {
                        setEligibilityCriteria((prevState: any) => ({
                          ...prevState,
                          [id]: '',
                        }));
                      }
                    }}
                    inputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    id="CRIF"
                    value={eligibilityCriteria?.CRIF}
                    required={true}
                    type="number"
                  />
                </Box>
              </Grid>

              {chosenSurrogates.includes('PAYROLL') && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography className="enterCardDetailsFieldTextSingleUpload">
                      Salary Limit
                    </Typography>
                    <TypoText
                      placeholder="00.00"
                      // handleChange={(e: any, id: string) => {
                      //   setEligibilityCriteria((prevState: any) => ({
                      //     ...prevState,
                      //     [id]: Number(e.target.value),
                      //   }));
                      // }}
                      handleChange={(e: any, id: string) => {
                        if (
                          e.target.value &&
                          validateNumber.test(e.target.value)
                        ) {
                          setEligibilityCriteria((prevState: any) => ({
                            ...prevState,
                            [id]: e.target.value,
                          }));
                        } else if (e?.target?.value === '') {
                          setEligibilityCriteria((prevState: any) => ({
                            ...prevState,
                            [id]: '',
                          }));
                        }
                      }}
                      id="salaryLimit"
                      value={eligibilityCriteria?.salaryLimit}
                      required={true}
                      type="number"
                      inputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
              )}

              {/* <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography className="enterCardDetailsFieldTextSingleUpload">
                    ITR Limit
                  </Typography>

                  <TypoText
                    placeholder="₹ 00.00"
                    // handleChange={(e: any, id: string) => {
                    //   setEligibilityCriteria((prevState: any) => ({
                    //     ...prevState,
                    //     [id]: Number(e.target.value),
                    //   }));
                    // }}
                    handleChange={(e: any, id: string) => {
                      if (
                        e.target.value &&
                        validateNumber.test(e.target.value)
                      ) {
                        setEligibilityCriteria((prevState: any) => ({
                          ...prevState,
                          [id]: e.target.value,
                        }));
                      } else if (e?.target?.value === '') {
                        setEligibilityCriteria((prevState: any) => ({
                          ...prevState,
                          [id]: '',
                        }));
                      }
                    }}
                    id="ITRLimit"
                    value={eligibilityCriteria?.ITRLimit}
                    required={true}
                    type="number"
                  />
                </Box>
              </Grid> */}
              {/* </Grid> */}

              {/* <Grid container className="eligibilityGrid " spacing={2}> */}
              {chosenSurrogates.includes('C4C') && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography className="enterCardDetailsFieldTextSingleUpload">
                      C4C Limit
                    </Typography>

                    <TypoText
                      placeholder="00.00"
                      // handleChange={(e: any, id: string) => {
                      //   setEligibilityCriteria((prevState: any) => ({
                      //     ...prevState,
                      //     [id]: Number(e.target.value),
                      //   }));
                      // }}
                      handleChange={(e: any, id: string) => {
                        if (
                          e.target.value &&
                          validateNumber.test(e.target.value)
                        ) {
                          setEligibilityCriteria((prevState: any) => ({
                            ...prevState,
                            [id]: e.target.value,
                          }));
                        } else if (e?.target?.value === '') {
                          setEligibilityCriteria((prevState: any) => ({
                            ...prevState,
                            [id]: '',
                          }));
                        }
                      }}
                      id="C4CLimit"
                      value={eligibilityCriteria?.C4CLimit}
                      required={true}
                      type="number"
                      inputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
              )}

              {chosenSurrogates.includes('AA') && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography className="enterCardDetailsFieldTextSingleUpload">
                      AQB Limit (6 Month)
                    </Typography>

                    <TypoText
                      placeholder="00.00"
                      // handleChange={(e: any, id: string) => {
                      //   setEligibilityCriteria((prevState: any) => ({
                      //     ...prevState,
                      //     [id]: Number(e.target.value),
                      //   }));
                      // }}
                      handleChange={(e: any, id: string) => {
                        if (
                          e.target.value &&
                          validateNumber.test(e.target.value)
                        ) {
                          setEligibilityCriteria((prevState: any) => ({
                            ...prevState,
                            [id]: Number(e.target.value),
                          }));
                        } else if (e?.target?.value === '') {
                          setEligibilityCriteria((prevState: any) => ({
                            ...prevState,
                            [id]: '',
                          }));
                        }
                      }}
                      id="AQBLimit"
                      value={eligibilityCriteria?.AQBLimit}
                      required={true}
                      type="number"
                      inputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
              )}

              {chosenSurrogates.includes('RC') && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography className="enterCardDetailsFieldTextSingleUpload">
                      RC (Vehicle Value)
                    </Typography>

                    <TypoText
                      placeholder="00.00"
                      // handleChange={(e: any, id: string) => {
                      //   setEligibilityCriteria((prevState: any) => ({
                      //     ...prevState,
                      //     [id]: Number(e.target.value),
                      //   }));
                      // }}
                      handleChange={(e: any, id: string) => {
                        if (
                          e.target.value &&
                          validateNumber.test(e.target.value)
                        ) {
                          setEligibilityCriteria((prevState: any) => ({
                            ...prevState,
                            [id]: e.target.value,
                          }));
                        } else if (e?.target?.value === '') {
                          setEligibilityCriteria((prevState: any) => ({
                            ...prevState,
                            [id]: '',
                          }));
                        }
                      }}
                      id="RCValue"
                      value={eligibilityCriteria?.RCValue}
                      required={true}
                      type="number"
                      inputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {review ? (
          <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1,
                paddingBottom: 2,
              }}
            >
              <TypoText title=" Add on Card Availability" />
              <img src={Info_Icon} alt="info" />
              <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
            </Box>
            <Divider />

            <Box
              sx={{
                paddingTop: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="body2" className="CommonReviewTitle">
                Add On Card
              </Typography>
              <Typography className="CommonReviewText">
                {addOnCard ? 'Applicable' : 'Not Applicable'}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box className="box5">
            <HeaderWithInfo
              header="Add On Card Availability"
              isInfoEnabled={true}
              info="From here, you can choose extra card for same card details"
              isDownloadEnabled={false}
            />

            <Grid container className="chooseChannelGrid">
              <Grid item>
                <Box className="box">
                  <Checkbox
                    style={{
                      transform: 'scale(1.2)',
                    }}
                    sx={{
                      color: '#A8A8A9',
                    }}
                    color="secondary"
                    onChange={(e: any) => setAddOnCard(e.target.checked)}
                    checked={addOnCard}
                  />
                  <Typography className="text">Add On Card</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {review ? (
          <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 2,
                paddingBottom: 2,
              }}
            >
              <TypoText title="Benifits" />
              <img src={Info_Icon} alt="info" />
              <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
            </Box>
            <Divider />

            <Box
              sx={{
                paddingY: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" className="CommonReviewTitle">
                  Currency Markup Charges
                </Typography>
                <Typography className="CommonReviewText">
                  {currencyBenefitsDetails.markUpCharge
                    ? `${currencyBenefitsDetails.markUpCharge} %`
                    : '-'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" className="CommonReviewTitle">
                  Currency Markup Description
                </Typography>
                <Typography className="CommonReviewText">
                  {currencyBenefitsDetails.description || '-'}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Grid container sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Airmiles
                </Typography>
                <Typography className="CommonReviewText">
                  {airmilesBenefitsDetails.airmiles
                    ? StringConversion(
                        airmilesBenefitsDetails.airmiles,
                        false,
                        false,
                        false
                      )
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Airmiles Minimum Spends
                </Typography>
                <Typography className="CommonReviewText">
                  {airmilesBenefitsDetails.minimumSpend
                    ? StringConversion(
                        airmilesBenefitsDetails.minimumSpend,
                        false,
                        true,
                        false
                      )
                    : '-'}
                </Typography>
              </Grid>
            </Grid>

            <Box>
              <Typography
                variant="body2"
                className="CommonReviewTitle"
                sx={{ marginTop: '20px' }}
              >
                Air miles Description
              </Typography>
              <Typography className="CommonReviewText">
                {airmilesBenefitsDetails.description || '-'}
              </Typography>
            </Box>
            <Divider sx={{ padding: 2 }} />
            <Grid container sx={{ marginTop: 2 }}>
              {/* <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '80%',
                }}
              > */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Cashback
                </Typography>
                <Typography className="CommonReviewText">
                  {cashbackBenefitsDetails.cashback
                    ? `${cashbackBenefitsDetails.cashback}%`
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Cashback Minimum Spends
                </Typography>
                <Typography className="CommonReviewText">
                  {cashbackBenefitsDetails.cashbackMinimumSpend
                    ? StringConversion(
                        cashbackBenefitsDetails.cashbackMinimumSpend,
                        false,
                        true,
                        false
                      )
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Spend Category
                </Typography>
                <Typography className="CommonReviewText">
                  {cashbackBenefitsDetails.spendCategories.length > 0
                    ? cashbackBenefitsDetails.spendCategories.toString()
                    : '-'}
                </Typography>
              </Grid>
              {/* </Box> */}

              <Grid item md={12}>
                <Typography
                  variant="body2"
                  className="CommonReviewTitle"
                  sx={{ marginTop: '20px' }}
                >
                  Cashback Description
                </Typography>
                <Typography className="CommonReviewText">
                  {cashbackBenefitsDetails.description || '-'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box className="box7">
            <HeaderWithInfo
              header="Benefits"
              isInfoEnabled={true}
              info="Add benefits/details of the card here."
              isDownloadEnabled={false}
            />

            <Box className="benefitsBox">
              <Box className="box">
                <Stack>
                  <Checkbox
                    style={{
                      transform: 'scale(1.2)',
                    }}
                    sx={{
                      color: '#A8A8A9',
                    }}
                    onClick={() => {
                      let value = currencyBenefits;
                      if (!value) {
                        // setCurrencyBenefitsDetails((prev: any) => ({
                        //   ...prev.

                        // }))
                        setCurrencyBenefitsDetails((prevState: any) => ({
                          ...prevState,
                          markUpCharge: null,
                          spentLimitPerTransaction: null,
                          description: '',
                        }));
                      }
                      setCurrencyBenefits(!currencyBenefits);
                    }}
                    color="secondary"
                    checked={currencyBenefits}
                  />
                </Stack>

                <Typography className="text">
                  Currency Markup Charges
                </Typography>
              </Box>
              {currencyBenefits && (
                <Box sx={{ paddingX: 2, marginTop: 2 }}>
                  <Grid container spacing={5}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box>
                        <TypographySubTitle title="Currency Markup Charges (in %)" />
                        <TypoText
                          placeholder="Enter Currency Markup Charges (in %) "
                          value={currencyBenefitsDetails?.markUpCharge}
                          handleChange={(e: any, id: string) => {
                            if (
                              e.target.value &&
                              Number(e.target.value) <= 100
                            ) {
                              setCurrencyBenefitsDetails((prevState: any) => ({
                                ...prevState,
                                [id]: Number(Number(e.target.value).toFixed(2)),
                              }));
                            } else if (e?.target?.value === '') {
                              setCurrencyBenefitsDetails((prevState: any) => ({
                                ...prevState,
                                [id]: '',
                              }));
                            }
                          }}
                          // handleChange={(e: any, id: string) => {
                          //   setCurrencyBenefitsDetails((prevState: any) => ({
                          //     ...prevState,
                          //     [id]: Number(e.target.value),
                          //   }));
                          // }}
                          id="markUpCharge"
                          required={true}
                          type="number"
                          inputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box>
                        <TypographySubTitle title="Maximum Spent Limit Per Transaction" />
                        <TypoText
                          placeholder="00.00"
                          value={
                            currencyBenefitsDetails?.spentLimitPerTransaction
                          }
                          inputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                          }}
                          handleChange={(e: any, id: string) => {
                            if (
                              e.target.value &&
                              validateNumber.test(e.target.value)
                            ) {
                              setCurrencyBenefitsDetails((prevState: any) => ({
                                ...prevState,
                                [id]: e.target.value,
                              }));
                            } else if (e?.target?.value === '') {
                              setCurrencyBenefitsDetails((prevState: any) => ({
                                ...prevState,
                                [id]: '',
                              }));
                            }
                          }}
                          id="spentLimitPerTransaction"
                          required={true}
                          type="number"
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ marginY: 3 }} className="joiningFeeFull">
                    <TypographySubTitle title="Currency Markup Descripition" />
                    <Box className="textField">
                      <TypoText
                        placeholder="3.50% of the transaction value as a foreign currency transaction fee."
                        value={currencyBenefitsDetails?.description}
                        handleChange={(e: any, id: string) => {
                          setCurrencyBenefitsDetails((prevState: any) => ({
                            ...prevState,
                            [id]: e.target.value,
                          }));
                        }}
                        id="description"
                        required={true}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
              <Box className="box">
                <Checkbox
                  style={{
                    transform: 'scale(1.2)',
                  }}
                  sx={{
                    color: '#A8A8A9',
                  }}
                  onClick={() => {
                    let value = airmilesBenefits;

                    if (value) {
                      setAirmilesBenefitsDetails((prevState: any) => ({
                        ...prevState,
                        airmiles: null,
                        minimumSpend: null,
                        description: '',
                      }));
                    }
                    setAirmilesBenefits(!airmilesBenefits);
                  }}
                  color="secondary"
                  checked={airmilesBenefits}
                />
                <Typography className="text">Airmiles</Typography>
              </Box>
              {airmilesBenefits && (
                <Box sx={{ paddingX: 2, marginTop: 2 }}>
                  <Grid container spacing={5}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box>
                        <TypographySubTitle title="Airmiles" />
                        <TypoText
                          placeholder="Enter Airmiles (in %)"
                          value={airmilesBenefitsDetails?.airmiles}
                          inputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                          handleChange={(e: any, id: string) => {
                            if (
                              e.target.value &&
                              validateNumber.test(e.target.value)
                            ) {
                              setAirmilesBenefitsDetails((prevState: any) => ({
                                ...prevState,
                                [id]: e.target.value,
                              }));
                            } else if (e?.target?.value === '') {
                              setAirmilesBenefitsDetails((prevState: any) => ({
                                ...prevState,
                                [id]: '',
                              }));
                            }
                          }}
                          type="number"
                          id="airmiles"
                          required={true}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box>
                        <TypographySubTitle title="Airmiles - Minmum Spends" />
                        <TypoText
                          placeholder="00.00"
                          inputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                          }}
                          value={airmilesBenefitsDetails?.minimumSpend}
                          handleChange={(e: any, id: string) => {
                            if (
                              e.target.value &&
                              validateNumber.test(e.target.value)
                            ) {
                              setAirmilesBenefitsDetails((prevState: any) => ({
                                ...prevState,
                                [id]: e.target.value,
                              }));
                            } else if (e?.target?.value === '') {
                              setAirmilesBenefitsDetails((prevState: any) => ({
                                ...prevState,
                                [id]: '',
                              }));
                            }
                          }}
                          id="minimumSpend"
                          required={true}
                          type="number"
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ marginY: 3 }} className="joiningFeeFull">
                    <TypographySubTitle title="Airmiles Description" />
                    <Box className="textField">
                      <TypoText
                        placeholder="Get 4 Frequent Flyer Air miles for every Citi Prestige reward point you transfer to our airline partners"
                        value={airmilesBenefitsDetails?.description}
                        handleChange={(e: any, id: string) => {
                          setAirmilesBenefitsDetails((prevState: any) => ({
                            ...prevState,
                            [id]: e.target.value,
                          }));
                        }}
                        id="description"
                        required={true}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
              <Box className="box">
                <Checkbox
                  style={{
                    transform: 'scale(1.2)',
                  }}
                  sx={{
                    color: '#A8A8A9',
                  }}
                  onClick={() => {
                    let value = cashbackBenefits;

                    if (value) {
                      setCashbackBenefitsDetails((prevState: any) => ({
                        ...prevState,
                        cashback: null,
                        cashbackMinimumSpend: null,
                        spendCategories: [],
                        description: '',
                      }));
                    }
                    setCashbackBenefits(!cashbackBenefits);
                  }}
                  color="secondary"
                  checked={cashbackBenefits}
                />
                <Typography className="text">Cashbacks</Typography>
              </Box>
              {cashbackBenefits && (
                <Box sx={{ paddingX: 2, marginTop: 2 }}>
                  <Grid container spacing={5}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box>
                        <TypographySubTitle title="Cashback (in %)" />
                        <TypoText
                          placeholder="Enter Cashback (in %)"
                          inputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                          value={cashbackBenefitsDetails?.cashback}
                          // handleChange={(e: any, id: string) => {
                          //   setCashbackBenefitsDetails((prevState: any) => ({
                          //     ...prevState,
                          //     [id]: Number(e.target.value),
                          //   }));
                          // }}
                          handleChange={(e: any, id: string) => {
                            if (
                              e.target.value &&
                              Number(e.target.value) <= 100
                            ) {
                              setCashbackBenefitsDetails((prevState: any) => ({
                                ...prevState,
                                [id]: Number(Number(e.target.value).toFixed(2)),
                              }));
                            } else if (e?.target?.value === '') {
                              setCashbackBenefitsDetails((prevState: any) => ({
                                ...prevState,
                                [id]: '',
                              }));
                            }
                          }}
                          id="cashback"
                          required={true}
                          type="number"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box>
                        <TypographySubTitle title="Cashback - Minmum Spends" />
                        <TypoText
                          placeholder="00.00"
                          inputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                          }}
                          value={cashbackBenefitsDetails?.cashbackMinimumSpend}
                          handleChange={(e: any, id: string) => {
                            if (
                              e.target.value &&
                              validateNumber.test(e.target.value)
                            ) {
                              setCashbackBenefitsDetails((prevState: any) => ({
                                ...prevState,
                                [id]: Number(e.target.value),
                              }));
                            } else if (e?.target?.value === '') {
                              setCashbackBenefitsDetails((prevState: any) => ({
                                ...prevState,
                                [id]: '',
                              }));
                            }
                          }}
                          id="cashbackMinimumSpend"
                          required={true}
                          type="number"
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <TypographySubTitle title="Select Spend Category" />
                      <CheckboxSelectDropdown
                        options={SpendCategoryList}
                        // handleCloseModal={handleCloseModal}
                        sendSelectedValues={(selectedValues: Array<String>) =>
                          setCashbackBenefitsDetails((prevState: any) => ({
                            ...prevState,
                            ['spendCategories']: selectedValues,
                          }))
                        }
                        selectedValuesFromParent={
                          cashbackBenefitsDetails?.spendCategories
                        }
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ marginY: 2 }} className="joiningFeeFull">
                    <TypographySubTitle title="Cashback Description" />
                    <Box className="textField">
                      <TypoText
                        placeholder="W5% cashback will be rewarded to you on purchases of movie tickets, bill payments, or on any payments made for utilities done through Citi Billpay."
                        value={cashbackBenefitsDetails?.description}
                        handleChange={(e: any, id: string) => {
                          setCashbackBenefitsDetails((prevState: any) => ({
                            ...prevState,
                            [id]: e.target.value,
                          }));
                        }}
                        id="description"
                        required={true}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {review ? (
          <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 2,
              }}
            >
              <TypoText title="Fee & Fee Wavier Details" />
              <img src={Info_Icon} alt="info" />
              <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
            </Box>
            <Divider sx={{ paddingTop: 2 }} />

            <Grid container sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Joining Fee
                </Typography>
                <Typography className="CommonReviewText">
                  {joiningFeeDetails.joiningFee
                    ? `${joiningFeeDetails.joiningFee}`
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Joining Fee Wavier Limit
                </Typography>
                <Typography className="CommonReviewText">
                  {joiningFeeDetails.joiningFeeSpendLimit
                    ? StringConversion(
                        joiningFeeDetails.joiningFeeSpendLimit,
                        false,
                        true,
                        false
                      )
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Period
                </Typography>
                <Typography className="CommonReviewText">
                  {joiningFeeDetails.joiningFeeSpendPeriod
                    ? `${joiningFeeDetails.joiningFeeSpendPeriod} Months`
                    : '-'}
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ paddingY: 2 }}>
              <Typography variant="body2" className="CommonReviewTitle">
                Joining Fee Description
              </Typography>
              <Typography className="CommonReviewText">
                {joiningFeeDetails.joiningFeeDescription || '-'}
              </Typography>
            </Box>
            <Divider />

            <Grid container sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Annual Fee
                </Typography>
                <Typography className="CommonReviewText">
                  {annualFeeDetails.annualFee
                    ? StringConversion(
                        annualFeeDetails.annualFee,
                        false,
                        true,
                        false
                      )
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Annual Fee Wavier Limit
                </Typography>
                <Typography className="CommonReviewText">
                  {annualFeeDetails.annualFeeSpendLimit
                    ? StringConversion(
                        annualFeeDetails.annualFeeSpendLimit,
                        false,
                        true,
                        false
                      )
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Period
                </Typography>
                <Typography className="CommonReviewText">
                  {annualFeeDetails.annualFeeSpendPeriod
                    ? `${annualFeeDetails.annualFeeSpendPeriod} Months`
                    : '-'}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ paddingY: 2 }}>
              <Typography variant="body2" className="CommonReviewTitle">
                Annual Fee Description
              </Typography>
              <Typography className="CommonReviewText">
                {annualFeeDetails.annualFeeDescription || '-'}
              </Typography>
            </Box>
            <Divider sx={{ paddingX: 2 }} />

            <Grid container sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Fuel Surcharge
                </Typography>
                <Typography className="CommonReviewText">
                  {fuelSurchargeDetails.fuelSurcharge
                    ? `${fuelSurchargeDetails.fuelSurcharge} %`
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="CommonReviewTitle">
                  Fuel Surcharge Wavier Limit
                </Typography>
                <Typography className="CommonReviewText">
                  {fuelSurchargeDetails.fuelSurchargeSpendLimit
                    ? StringConversion(
                        fuelSurchargeDetails.fuelSurchargeSpendLimit,
                        false,
                        true,
                        false
                      )
                    : '-'}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ paddingY: 2 }}>
              <Typography variant="body2" className="CommonReviewTitle">
                Fuel Surcharge Description
              </Typography>
              <Typography className="CommonReviewText">
                {fuelSurchargeDetails.fuelSurchargeDescription || '-'}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box className="box8">
            <HeaderWithInfo
              header="Fee & Fee Wavier Details"
              isInfoEnabled={true}
              info="From here you can add fee wavier details"
              isDownloadEnabled={false}
            />
            <Box className="joiningFeeBox">
              <Typography className="text" sx={{ color: '#151515' }}>
                Joining Fee
              </Typography>
              {/* <Typography className="text" sx={{ color: '#AFAEAF' }}>
                (optional)
              </Typography> */}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography className="commonTypoTextField">
                    Joining Fee
                  </Typography>

                  <TypoText
                    placeholder="00.00"
                    inputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    value={joiningFeeDetails?.joiningFee}
                    // handleChange={(e: any, id: string) => {
                    //   setJoiningFeeDetails((prevState: any) => ({
                    //     ...prevState,
                    //     [id]: Number(e.target.value),
                    //   }));
                    // }}
                    handleChange={(e: any, id: string) => {
                      if (
                        e.target.value &&
                        validateNumber.test(e.target.value)
                      ) {
                        setJoiningFeeDetails((prevState: any) => ({
                          ...prevState,
                          [id]: e.target.value,
                        }));
                      } else if (e?.target?.value === '') {
                        setJoiningFeeDetails((prevState: any) => ({
                          ...prevState,
                          [id]: '',
                        }));
                      }
                    }}
                    id="joiningFee"
                    type="number"
                  />
                  <Typography className="joiningFeeGrid">
                    Enter ₹0 for No Joining Fee
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography className="commonTypoTextField">
                    Joining Fee Wavier SpendLimit
                  </Typography>

                  <TypoText
                    placeholder="00.00"
                    value={joiningFeeDetails?.joiningFeeSpendLimit}
                    inputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    // handleChange={(e: any, id: string) => {
                    //   setJoiningFeeDetails((prevState: any) => ({
                    //     ...prevState,
                    //     [id]: Number(e.target.value),
                    //   }));
                    // }}
                    handleChange={(e: any, id: string) => {
                      if (
                        e.target.value &&
                        validateNumber.test(e.target.value)
                      ) {
                        setJoiningFeeDetails((prevState: any) => ({
                          ...prevState,
                          [id]: e.target.value,
                        }));
                      } else if (e?.target?.value === '') {
                        setJoiningFeeDetails((prevState: any) => ({
                          ...prevState,
                          [id]: '',
                        }));
                      }
                    }}
                    id="joiningFeeSpendLimit"
                    type="number"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Typography className="commonTypoTextField">
                  Spend Period
                </Typography>
                <Dropdown
                  data={SpendPeriodDataList}
                  onSelect={(e: any) => {
                    setJoiningFeeDetails((prevState: any) => ({
                      ...prevState,
                      ['joiningFeeSpendPeriod']: Number(e.target.value),
                    }));
                  }}
                  selectedValue={
                    (joiningFeeDetails?.joiningFeeSpendPeriod &&
                      `${joiningFeeDetails?.joiningFeeSpendPeriod}`) ??
                    ''
                  }
                  dropdownType={'Months'}
                />
              </Grid>
            </Grid>

            <Box className="joiningFeeFull">
              <Typography className="commonTypoTextField">
                Joining Fee Description
              </Typography>

              <Box className="textField">
                <TypoText
                  placeholder="Enter Joining Fee Description"
                  value={joiningFeeDetails?.joiningFeeDescription}
                  handleChange={(e: any, id: string) => {
                    setJoiningFeeDetails((prevState: any) => ({
                      ...prevState,
                      [id]: e.target.value,
                    }));
                  }}
                  id="joiningFeeDescription"
                />
              </Box>
            </Box>

            <Box
              className="CommonjoiningFeeBox"
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                padding: '15px 0 20px 0',
                marginTop: '25px',
              }}
            >
              <Typography className="text" sx={{ color: '#151515' }}>
                Annual Fee
              </Typography>
              {/* <Typography className="text" sx={{ color: '#AFAEAF' }}>
                (optional)
              </Typography> */}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography className="commonTypoTextField">
                    Enter Annual Fee
                  </Typography>

                  <TypoText
                    placeholder="Enter Annual Fee (in %)"
                    value={annualFeeDetails?.annualFee}
                    // handleChange={(e: any, id: string) => {
                    //   setAnnualFeeDetails((prevState: any) => ({
                    //     ...prevState,
                    //     [id]: Number(e.target.value),
                    //   }));
                    // }}
                    handleChange={(e: any, id: string) => {
                      if (e.target.value && Number(e.target.value) <= 100) {
                        setAnnualFeeDetails((prevState: any) => ({
                          ...prevState,
                          [id]: Number(Number(e.target.value).toFixed(2)),
                        }));
                      } else if (e?.target?.value === '') {
                        setAnnualFeeDetails((prevState: any) => ({
                          ...prevState,
                          [id]: '',
                        }));
                      }
                    }}
                    id="annualFee"
                    type="number"
                  />
                  <Typography className="annualFeeGrid">
                    Enter ₹0 for No Joining Fee
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography className="commonTypoTextField">
                    Annual Fee Wavier SpendLimit
                  </Typography>

                  <TypoText
                    placeholder="00.00"
                    inputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    value={annualFeeDetails?.annualFeeSpendLimit}
                    // handleChange={(e: any, id: string) => {
                    //   setAnnualFeeDetails((prevState: any) => ({
                    //     ...prevState,
                    //     [id]: Number(e.target.value),
                    //   }));
                    // }}
                    handleChange={(e: any, id: string) => {
                      if (
                        e.target.value &&
                        validateNumber.test(e.target.value)
                      ) {
                        setAnnualFeeDetails((prevState: any) => ({
                          ...prevState,
                          [id]: e.target.value,
                        }));
                      } else if (e?.target?.value === '') {
                        setAnnualFeeDetails((prevState: any) => ({
                          ...prevState,
                          [id]: '',
                        }));
                      }
                    }}
                    id="annualFeeSpendLimit"
                    type="number"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography className="commonTypoTextField">
                  Spend Period
                </Typography>

                <Dropdown
                  data={SpendPeriodDataList}
                  onSelect={(e: any) => {
                    setAnnualFeeDetails((prevState: any) => ({
                      ...prevState,
                      ['annualFeeSpendPeriod']: Number(e.target.value),
                    }));
                  }}
                  selectedValue={
                    (annualFeeDetails?.annualFeeSpendPeriod &&
                      `${annualFeeDetails?.annualFeeSpendPeriod}`) ||
                    ''
                  }
                  dropdownType={'Months'}
                />
              </Grid>
            </Grid>
            <Box className="currencyMarkupDescription">
              <Typography className="commonTypoTextField">
                Currency Markup Description
              </Typography>

              <Box className="fullText">
                <TypoText
                  placeholder="Enter Currency Markup Charges (in %)"
                  value={annualFeeDetails?.annualFeeDescription}
                  handleChange={(e: any, id: string) => {
                    setAnnualFeeDetails((prevState: any) => ({
                      ...prevState,
                      [id]: e.target.value,
                    }));
                  }}
                  id="annualFeeDescription"
                />
              </Box>
            </Box>
            <Box
              className="CommonjoiningFeeBox"
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                padding: '15px 0 20px 0',
                marginTop: '25px',
              }}
            >
              <Typography className="text" sx={{ color: '#151515' }}>
                Fuel Surcharge
              </Typography>
              {/* <Typography className="text" sx={{ color: '#AFAEAF' }}>
                (optional)
              </Typography> */}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography className="commonTypoTextField">
                    Fuel Surcharge (in %)
                  </Typography>

                  <TypoText
                    placeholder="Enter fuel surcharge in %"
                    value={fuelSurchargeDetails?.fuelSurcharge}
                    // handleChange={(e: any, id: string) => {
                    //   setFuelSurchargeDetails((prevState: any) => ({
                    //     ...prevState,
                    //     [id]: Number(e.target.value),
                    //   }));
                    // }}
                    handleChange={(e: any, id: string) => {
                      if (e.target.value && Number(e.target.value) <= 100) {
                        setFuelSurchargeDetails((prevState: any) => ({
                          ...prevState,
                          [id]: Number(Number(e.target.value).toFixed(2)),
                        }));
                      } else if (e?.target?.value === '') {
                        setFuelSurchargeDetails((prevState: any) => ({
                          ...prevState,
                          [id]: '',
                        }));
                      }
                    }}
                    id="fuelSurcharge"
                    type="number"
                  />
                  <Typography className="fuelSurchargeGrid">
                    Enter ₹0 to cancel Fuel Surcharge wavier
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography className="commonTypoTextField">
                    Fuel Surcharge Wavier Spend Limit
                  </Typography>

                  <TypoText
                    placeholder="00.00"
                    inputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    value={fuelSurchargeDetails?.fuelSurchargeSpendLimit}
                    // handleChange={(e: any, id: string) => {
                    //   setFuelSurchargeDetails((prevState: any) => ({
                    //     ...prevState,
                    //     [id]: Number(e.target.value),
                    //   }));
                    // }}
                    handleChange={(e: any, id: string) => {
                      if (
                        e.target.value &&
                        validateNumber.test(e.target.value)
                      ) {
                        setFuelSurchargeDetails((prevState: any) => ({
                          ...prevState,
                          [id]: e.target.value,
                        }));
                      } else if (e?.target?.value === '') {
                        setFuelSurchargeDetails((prevState: any) => ({
                          ...prevState,
                          [id]: '',
                        }));
                      }
                    }}
                    id="fuelSurchargeSpendLimit"
                    type="number"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography className="commonTypoTextField">
                  Spend Period
                </Typography>

                <Dropdown
                  data={SpendPeriodDataList}
                  onSelect={(e: any) => {
                    setFuelSurchargeDetails((prevState: any) => ({
                      ...prevState,
                      ['fuelSurchargeSpendPeriod']: Number(e.target.value),
                    }));
                  }}
                  selectedValue={
                    (fuelSurchargeDetails?.fuelSurchargeSpendPeriod &&
                      `${fuelSurchargeDetails?.fuelSurchargeSpendPeriod}`) ||
                    ''
                  }
                  dropdownType={'Months'}
                />
              </Grid>
            </Grid>

            <Box className="fuelSurchargeDescription">
              <Typography className="commonTypoTextField">
                Fuel Surcharge Description
              </Typography>

              <Box className="fullText">
                <TypoText
                  placeholder="Enter Fuel Surcharge Description"
                  value={fuelSurchargeDetails?.fuelSurchargeDescription}
                  handleChange={(e: any, id: string) => {
                    setFuelSurchargeDetails((prevState: any) => ({
                      ...prevState,
                      [id]: e.target.value,
                    }));
                  }}
                  id="fuelSurchargeDescription"
                />
              </Box>
            </Box>
          </Box>
        )}

        {review ? (
          <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1,
                paddingBottom: 2,
              }}
            >
              <TypoText title=" Rewards" />
              <img src={Info_Icon} alt="info" />
              <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
            </Box>
            <Divider />
            {dataObj?.rewardDescription?.length > 0
              ? dataObj.rewardDescription.map((desc: any, index: number) => (
                  <Box
                    sx={{
                      paddingTop: 2,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="body2" className="CommonReviewTitle">
                      Reward Description {index + 1}
                    </Typography>
                    <Typography className="CommonReviewText">
                      {desc.text || '-'}
                    </Typography>
                  </Box>
                ))
              : '-'}
          </Box>
        ) : (
          <Box className="box9">
            <Box className="rewardHeader">
              <HeaderWithInfo
                header="Rewards"
                isInfoEnabled={true}
                info="Add your reward contents here"
                isDownloadEnabled={false}
                underline={true}
              />
              <Box>
                <Button
                  className="headerbtn"
                  color="secondary"
                  onClick={AddRewardList}
                >
                  <ControlPointIcon />
                  <Typography className="btnText">Add description</Typography>
                </Button>
              </Box>
            </Box>

            {dataObj.rewardDescription.map((item: any, index: number) => {
              return (
                <Box className="rewardDescriptionBox">
                  <Typography className="commonTypoTextField">
                    Reward Description {index + 1}{' '}
                  </Typography>

                  <Box className="fullText">
                    <TypoText
                      placeholder="Enter Description for the Rewards"
                      handleChange={(e: any) =>
                        rewardDescriptionOnChange(e, index)
                      }
                      id="rewardDescription"
                      value={item?.text}
                    />
                  </Box>
                  <Box className="newText">
                    {dataObj.rewardDescription.length > 1 ? (
                      <Button
                        sx={{ textTransform: 'capitalize' }}
                        onClick={() => removeReward(index)}
                        color="secondary"
                        startIcon={<RemoveCircleOutlineIcon />}
                      >
                        Remove
                      </Button>
                    ) : (
                      ''
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {review ? (
          <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1,
                paddingBottom: 2,
              }}
            >
              <TypoText title=" Key Benefits" />
              <img src={Info_Icon} alt="info" />
              <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
            </Box>
            <Divider />
            {dataObj.keyBenefits?.length > 0
              ? dataObj.keyBenefits.map((benefit: any, index: number) => (
                  <Box
                    sx={{
                      paddingTop: 2,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="body2" className="CommonReviewTitle">
                      {`Key Benefits ${index + 1}`}
                    </Typography>
                    <Typography className="CommonReviewText">
                      {benefit.text || '-'}
                    </Typography>
                  </Box>
                ))
              : '-'}
          </Box>
        ) : (
          <Box className="box10">
            <Box className="keyBenefitsHeader">
              <HeaderWithInfo
                header="Key Benefits"
                isInfoEnabled={true}
                info="Add your key benefits from here"
                isDownloadEnabled={false}
                underline={true}
              />
              <Box className="headerbtn">
                <Button sx={{ gap: 1 }} color="secondary" onClick={AddKeyList}>
                  <ControlPointIcon />
                  <Typography className="btnText">Add description</Typography>
                </Button>
              </Box>
            </Box>

            {dataObj.keyBenefits.map((item: any, index: number) => {
              return (
                <Box className="keyBenefitsDescriptionBox">
                  <Typography className="commonTypoTextField">
                    Key Benefits Description {index + 1}
                  </Typography>

                  <Box className="fullText">
                    <TypoText
                      placeholder="Enter Description for the key benefits "
                      handleChange={(e: any) => keyBenefitsOnChange(e, index)}
                      id="keyBenefits"
                      value={item?.text}
                    />
                  </Box>
                  <Box className="newText">
                    {dataObj.keyBenefits.length > 1 ? (
                      <Button
                        sx={{ textTransform: 'capitalize' }}
                        onClick={() => removeKeyBenefits(index)}
                        color="secondary"
                        startIcon={<RemoveCircleOutlineIcon />}
                      >
                        Remove
                      </Button>
                    ) : (
                      ''
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {review ? (
          <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1,
                paddingBottom: 2,
              }}
            >
              <TypoText title=" Additional Benefits" />
              <img src={Info_Icon} alt="info" />
              <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
            </Box>
            <Divider />

            <Box
              sx={{
                paddingTop: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {dataObj.additionalBenefits?.length > 0
                ? dataObj.additionalBenefits.map(
                    (benefit: any, index: number) => (
                      <Box>
                        <Typography
                          variant="body2"
                          className="CommonReviewTitle"
                        >
                          {`Additional Benefits ${index + 1}`}
                        </Typography>
                        <Typography className="CommonReviewText">
                          {benefit.text || '-'}
                        </Typography>
                      </Box>
                    )
                  )
                : '-'}
            </Box>
          </Box>
        ) : (
          <Box className="box11">
            <Box className="additionalBenefitsHeader">
              <HeaderWithInfo
                header="Additional Benefits"
                isInfoEnabled={true}
                info="Add your additional benefits here"
                isDownloadEnabled={false}
                underline={true}
              />
              <Box className="headerbtn">
                <Button
                  sx={{ gap: 1 }}
                  color="secondary"
                  onClick={AddAdditionalList}
                >
                  <ControlPointIcon />
                  <Typography className="btnText">Add description</Typography>
                </Button>
              </Box>
            </Box>

            {dataObj.additionalBenefits.map((item: any, index: number) => (
              <Box className="additionalBenefitsDescriptionBox">
                <Typography className="commonTypoTextField">
                  Additional Benefits Description {index + 1}
                </Typography>

                <Box className="fullText">
                  <TypoText
                    placeholder="Enter Description for the Additional benefits"
                    handleChange={(e: any) =>
                      additionalBenefitsOnChange(e, index)
                    }
                    id="additionalBenefits"
                    value={item?.text}
                  />
                </Box>
                <Box className="newText">
                  {dataObj.additionalBenefits.length > 1 ? (
                    <Button
                      sx={{ textTransform: 'capitalize' }}
                      onClick={() => removeAdditionalBenefits(index)}
                      color="secondary"
                      startIcon={<RemoveCircleOutlineIcon />}
                    >
                      Remove
                    </Button>
                  ) : (
                    ''
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {review ? (
          <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1,
                paddingBottom: 2,
              }}
            >
              <TypoText title=" Welcome Benefits" />
              <img src={Info_Icon} alt="info" />
              <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
            </Box>
            <Divider />

            <Box
              sx={{
                paddingTop: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {dataObj.welcomeBenefits?.length > 0
                ? dataObj.welcomeBenefits.map((benefit: any, index: number) => (
                    <Box>
                      <Typography variant="body2" className="CommonReviewTitle">
                        {`Welcome Benefits ${index + 1}`}
                      </Typography>
                      <Typography className="CommonReviewText">
                        {benefit.text || '-'}
                      </Typography>
                    </Box>
                  ))
                : '-'}
            </Box>
          </Box>
        ) : (
          <Box className="box12">
            <Box className="welcomeBenefitsHeader">
              <HeaderWithInfo
                header="Welcome Benefits"
                isInfoEnabled={true}
                info="Add your additional benefits here"
                isDownloadEnabled={false}
                underline={true}
              />
              <Box className="headerbtn">
                <Button
                  sx={{ textTransform: 'capitalize', gap: 1 }}
                  color="secondary"
                  onClick={AddWelcomeList}
                >
                  <ControlPointIcon />
                  <Typography className="btnText">Add Description</Typography>
                </Button>
              </Box>
            </Box>

            {dataObj.welcomeBenefits.map((item: any, index: number) => {
              return (
                <Box className="welcomeBenefitsDescriptionBox">
                  <Typography className="commonTypoTextField">
                    Welcome Benefits Description {index + 1}
                  </Typography>

                  <Box className="fullText">
                    <TypoText
                      placeholder="Enter Description for the welcome benefits "
                      handleChange={(e: any) =>
                        welcomeBenefitsOnChange(e, index)
                      }
                      id="welcomeBenefits"
                      value={item?.text}
                    />
                  </Box>
                  <Box className="newText">
                    {dataObj.welcomeBenefits.length > 1 ? (
                      <Button
                        sx={{ textTransform: 'capitalize' }}
                        onClick={() => removeWelcome(index)}
                        color="secondary"
                        startIcon={<RemoveCircleOutlineIcon />}
                      >
                        Remove
                      </Button>
                    ) : (
                      ''
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {review ? (
          <Box
            sx={{
              backgroundColor: 'white',
              marginTop: 2,
              padding: 2,
              position: 'fixed',
              bottom: 0,
              right: 0,
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  textTransform: 'capitalize',
                  fontSize: '12px',
                  minWidth: '120px',
                  height: '40px',
                }}
                onClick={() => navigate('/productManagement/cardCatalogue')}
              >
                Close
              </Button>
              {/* <BtnContained
                onClick={(e: any) =>
                  navigate('/productManagement/cardCatalogue')
                }
                title="close"
              /> */}
            </Box>
          </Box>
        ) : (
          <Box className="footer">
            <Box className="box">
              <BtnOutlined
                onClick={() => {
                  setShowCloseModal(true);
                }}
                style={{
                  '&:hover': {
                    border: '1px solid red',
                  },
                }}
                title="close"
              />

              <BtnText
                onClick={(e: any) => handleSaveDraft(e, 'SaveAsDraft')}
                title="Save as draft"
                type="submit"
              />

              <BtnContained
                title="Submit"
                type="submit"
                onClick={(e: any) => handleSubmit(e, 'Submit')}
                disabled={isDisabled}
              />
            </Box>
          </Box>
        )}
      </Box>

      {showCloseModal && (
        <CustomModal
          openSuccess={showCloseModal}
          handleCloseSuccess={() => {
            setShowCloseModal(false);
            navigate('/productManagement/cardCatalogue');
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

      {isCardCreated && (
        <CustomModal
          openSuccess={isCardCreated}
          handleCloseSuccess={() => {
            setIsCardCreated(false);
            navigate('/productManagement/cardCatalogue');
          }}
          successModalTitle={'Card Created Successfully'}
          successModalMsg={
            'Your request for creating new Card is successfully sent to the Reviewer.'
          }
          btn={' Close'}
        />
      )}

      {isCardSavedAsDraft && (
        <CustomModal
          openSuccess={isCardSavedAsDraft}
          handleCloseSuccess={() => {
            setIsCardSavedAsDraft(false);
            navigate('/productManagement/cardCatalogue');
          }}
          successModalTitle={'Card Saved as Draft Successfully'}
          successModalMsg={
            'Your request for saving new Card as Draft is successfully sent to the Reviewer.'
          }
          btn={' Close'}
        />
      )}

      {emptyFields.length > 0 && (
        <Snackbar
          open={true}
          // autoHideDuration={6000}
          onClose={() => setEmptyFields([])}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="error"
            // sx={{ width: '100%' }}
          >
            {`${emptyFields.toString()} are empty. Please fill all the fields`}
          </Alert>
        </Snackbar>
      )}

      {apiError.length !== 0 && (
        <ErrorMessage
          message={apiError}
          handleClose={() => setApiError('')}
          severity="error"
          duration={3000}
        />
      )}
    </form>
  );
};

export default CreateNewCard;
