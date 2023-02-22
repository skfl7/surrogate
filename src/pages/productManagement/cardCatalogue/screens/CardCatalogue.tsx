import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import './cardCateloge.scss';
import { useNavigate, json } from 'react-router-dom';
import moment from 'moment';
// MUI components
import {
  MenuItem,
  Checkbox,
  Typography,
  Box,
  Stack,
  Button,
  IconButton,
  Divider,
  Menu,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// Common components
import TypographyInfo from '../../../../components/commonComponent/CustomText/Info';
import CustomModal from '../../../../components/commonComponent/customModal/CustomModal';
import ActionModal from '../../../../components/commonComponent/customModal/ActionModal';
import TypoText from '../../../../components/commonComponent/CustomText/Textfield';
import GroupButton from '../../../../components/commonComponent/GroupButton/GroupButton';
import ListTable from '../../../../components/commonComponent/commonListTable/commonListTable';
import Multiselector from '../../../../components/commonComponent/MultiSelectNew';
// services
import {
  getCardDropdownData,
  getCardList,
  updateCardStatus,
  updateCardSurrogate,
} from '../../../../services/cardCatalogueServices';
// Assets
import Surrogate_icon from '../../../../assets/images/surrogateIcon.svg';
import Surrogate_icon_Active from '../../../../assets/images/surrogateIconActive.svg';
import Pause_icon from '../../../../assets/images/pauseIcon.svg';
import Pause_icon_active from '../../../../assets/images/pause_icon_active.svg';
import Edit_icon from '../../../../assets/images/editIcon.svg';
import Edit_icon_active from '../../../../assets/images/edit_active_icon.svg';
import Resume_icon from '../../../../assets/images/resumeIcon.svg';
import Resume_icon_active from '../../../../assets/images/resume-active-catagolue.svg';
import mail_icon from '../../../../assets/images/emailIcon.svg';
import download_icon from '../../../../assets/images/downloadIcon.svg';
import Info_Icon from '../../../../assets/images/info_icon.svg';
// Utils and constants
import { checkTagStatus } from '../../../../utils/tagBasedIndicator/tagStatus';
import { getCamelCaseFeatureName } from '../../../../utils/getCamelcaseFeatureName';
import { dropdownTypes, statuses } from '../card.const';
import { colors } from '../../../../style/Color';
import { MenuProps } from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import localforage from 'localforage';
import ascending_icon from '../../../../assets/icons/ascending.svg';
import descending_icon from '../../../../assets/icons/descending.svg';
import ErrorMessage from '../../../../components/commonComponent/ErrorMessage';
import { formatDateTime } from '../../../../utils/DateTimeFormatter';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import { getPermission } from '../../../../utils/ActionAllowed/UserActionAllowed';

// Component Loader
export async function cardCatalogueLoader() {
  // get card list
  const cardList = await getListOfCards({ page: 0, size: 10 });
  // get table filter dropdown
  const cardListFilters = getFilters();

  return json(
    {
      cardList,
      cardListFilters,
    },
    { status: 200 }
  );
}

const getFilters = async () => {
  const temp = dropdownTypes.map(async (type: any) => {
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
  const cardListFilters = await Promise.all(temp);
  return cardListFilters;
};
// API methods
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
        if (payload.dropDown !== 'CARD_STATUS') {
          const stateData = result?.cardAddDropdown?.map((item: any) => ({
            value: item.code,
            title: item.name,
          }));
          res = {
            options: [{ value: 'All', title: 'All', children: [...stateData] }],
          };
        } else
          res = {
            options: [{ code: 'All', name: 'All' }, ...result.cardAddDropdown],
          };
      }
    })
    .catch((err) => {
      res = { error: err?.response?.data };
    });
  return res;
};
const getListOfCards = async (payload: any) => {
  let res = {};
  await getCardList(payload)
    .then((response) => {
      res = response.data ? response.data : {};
    })
    .catch((err) => {
      console.log(err);
      res = { error: err?.response?.data };
    });
  return res;
};
export interface cardCatalogueFilterInterface {
  label?: string;
  option?: Array<object>;
}
export interface dataHeaderList {
  id: string;
  cardName: string;
  productID: string;
  businessID: string;
  cardMode: string;
  cardCategory: string;
  cardStatus: string;
  more?: string;
}
export interface dataList {
  id: number;
  cardName: string;
  productID: number;
  businessID: number;
  cardMode: string;
  cardCategory: string;
  cardStatus: string;
  more?: string;
}
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
      borderRadius: 6,
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
export const CardCatalogue = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState('All');
  const [actionAllowedItem, setActionAllowedItem] = useState([]);

  // Surrogate selection related sate
  const [surrogateSelection, setSurrogateSelection] = useState(false);
  const [removeSurrogateModal, setRemoveSurrogateModal] = useState(false);
  const [surrogateSuccessSelection, setSurrogateSuccessSelection] =
    useState(false);
  const [surrogateData, setSurrogateData] = useState({
    selectedRadio: 'assign',
    buttontext: 'Assign',
    hasDate: false,
  });
  // Reume card related state
  const [resumeModal, setResumeModal] = useState(false);
  const [resumeSuccessModal, setResumeSuccessModal] = useState(false);
  // Pause card related state
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);
  const [pauseData, setPauseData] = useState({
    selectedRadio: 'normal-pause',
    buttontext: 'Pause Now',
    hasDate: false,
  });
  const [showPauseSuccessModal, setShowPauseSuccessModal] =
    useState<boolean>(false);
  const [showScheduledPauseSuccessModal, setShowScheduledPauseSuccessModal] =
    useState<boolean>(false);
  // Edit pause related state
  const [editPauseModal, setEditModal] = useState(false);
  const [editSuccessModal, setEditSuccessModal] = useState(false);
  // Table related state
  const [cardList, setCardList] = useState<any>([]);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 0,
  });
  const [totalCount, setTotalCount] = useState({
    totaLNoOfRecords: 0,
    totalNoOfPages: 0,
  });
  const [selected, setSelected] = useState<any[]>([]);
  const [filters, setFilters] = useState<any[]>([]);
  //sorting
  const [decendingSortingData, setDecendingSortingData] = useState<any>([]);
  const [value, setValue] = React.useState<any>('lastModifiedDateTime');
  const [secondValue, setSecondValue] = React.useState<any>(null);
  const [threeValue, setThreeValue] = React.useState<any>(null);
  const [ascending, setAscending] = useState<boolean>(false);
  // Modal content
  const [modalContent, setModalContent] = useState('');
  // Anchor related state
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  // API error state
  const [apiError, setApiError] = useState('');
  const openCardMenu = Boolean(anchorEl);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  // Selected row to view or edit
  const [selectedRow, setSelectedRow] = useState({} as any);
  const [userID, setUserId] = useState<string>();
  const open = Boolean(anchorElement);
  const NORMAL_PAUSE = 'Pause Now';
  const SCHEDULED_PAUSE = 'Schedule Pause';
  //sorting methods
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
    setCardList([...sort]);
  };
  useEffect(() => {
    // if (decendingSortingData.length > 0) {
    filterData();
    // }
  }, [ascending, value, secondValue, threeValue, decendingSortingData]);

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
  // List data preparation methods
  useEffect(() => {
    getLocalStorageID();
  }, []);
  const didMount = useRef(false);

  // Fetch filters
  useEffect(() => {
    async function fetchFilters() {
      const filters = await getFilters();
      setFilters(filters);
      console.log('filetrs:', filters);
    }
    fetchFilters();
  }, []);

  const getLocalStorageID = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setUserId(value.id);
      setActionAllowedItem(value?.actionsAllowed);
    } catch (err) {
      console.log(err);
    }
  };
  const prepareCardList = (responseData: any) => {
    const result = responseData?.result;
    if (result && result.content && Array.isArray(result.content)) {
      // setCardList(result.content);
      setDecendingSortingData([...(result.content ?? [])]);
      setTotalCount({
        totaLNoOfRecords: result?.totalElements,
        totalNoOfPages: result?.totalPages,
      });
    } else if (responseData.exception) handleError(responseData);
    else if (responseData.error && responseData.error.error) {
      handleError(responseData.error);
    }
  };
  const fetchCardList = async (dropdownFilters: Array<any>) => {
    const payload = {
      page: pagination.pageNumber,
      size: pagination.pageSize,
      // cardName: ascending, //todo need not send this key to BE
    } as any;
    dropdownFilters.forEach((filter: any) => {
      if (!filter.selectedValues.includes('All'))
        payload[filter.payloadKey] = filter.selectedValues;
    });
    const result = await getListOfCards(payload);
    prepareCardList(result);
  };

  useEffect(() => {
    fetchCardList(filters);
  }, [pagination]);

  const handleClick = (
    event: React.MouseEvent<HTMLTableCellElement>,
    row: any
  ) => {
    setAnchorElement(event.currentTarget);
    setSelectedRow(row);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };
  const handleCardMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCardMenuClose = () => {
    setAnchorEl(null);
  };
  const singleCardOpen = () => {
    navigate('/productManagement/cardCatalogue/singleupload');
  };
  const bulkCardOpen = () => {
    navigate('/productManagement/cardCatalogue/bulkupload');
  };
  // Close all modals
  const closeModal = () => {
    fetchCardList(filters);
    setSurrogateSelection(false);
    setSurrogateSuccessSelection(false);
    setResumeModal(false);
    setResumeSuccessModal(false);
    setRemoveSurrogateModal(false);
    setShowPauseSuccessModal(false);
    setShowScheduledPauseSuccessModal(false);
    setShowPauseModal(false);
    setEditModal(false);
    setEditSuccessModal(false);
    setPauseData({
      selectedRadio: 'normal-pause',
      buttontext: 'Pause Now',
      hasDate: false,
    });
    setSurrogateData({
      selectedRadio: 'assign',
      buttontext: 'Assign',
      hasDate: false,
    });
  };
  // pause-edit modal API call
  const successModal = async (
    remarksText: string,
    startDate: any,
    endDate: any
  ) => {
    setShowPauseModal(false);
    if (pauseData.selectedRadio === 'normal-pause') {
      const payload = {
        cardId: selected.map((item: any) => item.id),
        cardStatus: 'PAUSED',
        startDate: moment().format('YYYY-MM-DD hh:mm:ss'),
        remarks: remarksText,
        actionUserId: userID,
      };
      const result = await cardStatusUpdate(payload, (apiResponse: string) => {
        if (apiResponse === 'success') {
          setShowPauseSuccessModal(true);
          setToDefault();
        }
      });
    } else if (pauseData.selectedRadio === 'scheduled-pause') {
      const payload = {
        cardId: selected.map((item: any) => item.id),
        cardStatus: 'PAUSE_SCHEDULED',
        startDate: startDate.format('YYYY-MM-DD hh:mm:ss'),
        endDate: endDate.format('YYYY-MM-DD hh:mm:ss'),
        remarks: remarksText,
        actionUserId: userID,
      };
      const result = await cardStatusUpdate(payload, (apiResponse: string) => {
        if (apiResponse === 'success') {
          setShowScheduledPauseSuccessModal(true);
          setToDefault();
        }
      });
    }
  };
  // Surrogate selection modal API call
  const handleSurrogateSubmit = async (
    remarksText: string,
    startDate: any,
    endDate: any,
    selectedSurrogates: Array<string>
  ) => {
    let surrogateSelectedNames = [] as string[];
    const surrogateTypeFilter = filters.find(
      (filter: any) => filter.payloadKey === 'surrogateType'
    );
    if (surrogateTypeFilter) {
      surrogateSelectedNames = selectedSurrogates.map((surr: string) => {
        const name =
          surrogateTypeFilter.options[0]?.children?.find(
            (option: any) => option.value === surr
          )?.title || '';
        return name;
      });
    }
    setSurrogateSelection(false);
    if (surrogateData.selectedRadio === 'assign') {
      const payload = {
        cardId: selected.map((item: any) => item.id),
        surrogateTypes: selectedSurrogates,
        updateAction: 'ADD',
        actionUserId: userID,
      };
      const result = await cardSurrogateUpdate(
        payload,
        (apiResponse: string) => {
          if (apiResponse === 'success') {
            setSurrogateSuccessSelection(true);
            setToDefault();
            setModalContent(
              `Your actions for Assign Surrogate request of ${surrogateSelectedNames.toString()} were successfully sent to the reviewer.`
            );
          }
        }
      );
    } else if (surrogateData.selectedRadio === 'remove') {
      const payload = {
        cardId: selected.map((item: any) => item.id),
        surrogateTypes: selectedSurrogates,
        updateAction: 'REMOVE',
        actionUserId: userID,
      };
      const result = await cardSurrogateUpdate(
        payload,
        (apiResponse: string) => {
          if (apiResponse === 'success') {
            setRemoveSurrogateModal(true);
            setToDefault();
            setModalContent(
              `Your actions to Remove Surrogate request of ${surrogateSelectedNames.toString()} were sent to reviewer successfullly.`
            );
          }
        }
      );
    }
  };
  // Resume card modal API call
  const handleResumeSuccess = async (remarksText: string) => {
    setResumeModal(false);
    const payload = {
      cardId: selected.map((item: any) => item.id),
      cardStatus: 'ACTIVE',
      remarks: remarksText,
      actionUserId: userID,
    };
    const result = await cardStatusUpdate(payload, (apiResponse: string) => {
      if (apiResponse === 'success') {
        setResumeSuccessModal(true);
        setToDefault();
      }
    });
  };
  // Edit-pause modal API call
  const handleEditSuccess = async (
    remarksText: string,
    startDate: any,
    endDate: any
  ) => {
    setEditModal(false);
    if (pauseData.selectedRadio === 'normal-pause') {
      const payload = {
        cardId: selected.map((item: any) => item.id),
        cardStatus: 'PAUSED',
        startDate: moment().format('YYYY-MM-DD hh:mm:ss'),
        remarks: remarksText,
        actionUserId: userID,
      };
      const result = await cardStatusUpdate(payload, (apiResponse: string) => {
        if (apiResponse === 'success') {
          setEditSuccessModal(true);
          setToDefault();
          setModalContent(
            `Your action for pause the Card request was successully sent to the reviewer`
          );
        }
      });
    } else if (pauseData.selectedRadio === 'scheduled-pause') {
      const payload = {
        cardId: selected.map((item: any) => item.id),
        cardStatus: 'PAUSE_SCHEDULED',
        startDate: startDate.format('YYYY-MM-DD HH:mm:ss'),
        endDate: endDate.format('YYYY-MM-DD HH:mm:ss'),
        remarks: remarksText,
        actionUserId: userID,
      };
      const result = await cardStatusUpdate(payload, (apiResponse: string) => {
        if (apiResponse === 'success') {
          setEditSuccessModal(true);
          setToDefault();
          setModalContent(
            `Your Edit pause request from ${startDate.format(
              'DD MMM YYYY, h:mm A'
            )} to ${endDate.format(
              'DD MMM YYYY, h:mm A'
            )} action has been successfully sent to Reviewer.`
          );
        }
      });
    }
  };
  // after status update
  const setToDefault = () => {
    setSelected([]);
  };
  // card status update service call
  const cardStatusUpdate = async (payload: any, callback: Function) => {
    let res = {};
    await updateCardStatus(payload)
      .then((response) => {
        res = response.data ? response.data : {};
        callback('success');
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };
  // card surrogate update service call
  const cardSurrogateUpdate = async (payload: any, callback: Function) => {
    let res = {};
    await updateCardSurrogate(payload)
      .then((response) => {
        res = response.data ? response.data : {};
        callback('success');
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  // Tab status related things
  const GroupButtonData =
    filters.find((filter: any) => filter.name === 'CARD_STATUS')?.options || [];
  const onTabStatusChange = (item: any) => {
    setTabValue(item.code);
    let dropdownFilters = [...filters];
    dropdownFilters = dropdownFilters.map((filter: any) => {
      if (filter.payloadKey === 'cardStatus') {
        filter.selectedValues = [item.code];
      }
      return filter;
    });

    let value = {
      pageSize: 10,
      pageNumber: 0,
    };
    setPagination({
      ...value,
    });
    setFilters(dropdownFilters);
    fetchCardList(dropdownFilters);
  };

  // Table checkbox methods
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // const newSelected = cardList?.map((n: any) => n.id);
      setSelected(cardList);
      return;
    }
    setSelected([]);
  };
  const isSelected = (row: any) => {
    const res = selected.find((sel: any) => sel.id === row.id);
    return res ? true : false;
  };
  const handleClickCheckbox = (event: any, row: any) => {
    let selectedRecords = [...selected];
    if (event?.target?.checked) {
      !selectedRecords.find((record: any) => record.id === row.id) &&
        selectedRecords.push(row);
    } else
      selectedRecords = selectedRecords.filter(
        (record: any) => record.id !== row.id
      );
    setSelected(selectedRecords);
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
  // Columns
  const column = [
    {
      title: '',
      dataIndex: 'checkbox',
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
              selected.length > 0 && selected.length < cardList.length
            }
            checked={cardList.length > 0 && selected.length === cardList.length}
            onChange={handleSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        );
      },
      render: (_: string, row: any, index: number) => {
        const isItemSelected = isSelected(row);
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
            onChange={(event) => handleClickCheckbox(event, row)}
          />
        );
      },
    },
    {
      title: '#',
      dataIndex: 'count',
      key: 'count',
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
      title: 'Card Name',
      dataIndex: 'cardName',
      key: 'cardName',
      width: '220px',
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
            onClick={() => handleSortByName('cardName', '', '')}
          >
            <>{text}</>
            {value === 'cardName' && (
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
      title: 'Business ID',
      dataIndex: 'business',
      key: 'business',
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
            onClick={() => handleSortByName('business', '', '')}
          >
            <>{text}</>
            {value === 'business' && (
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
            {row?.lastModifiedDateTime !== null
              ? formatDateTime(row?.lastModifiedDateTime)
              : '-'}
          </Stack>
        );
      },
    },
    {
      title: 'Card Mode',
      dataIndex: 'cardMode',
      key: 'cardMode',
      width: '160px',
      render: (_: string, row: any, index: number) => {
        const cardModeFilter = filters.find(
          (filter: any) => filter.payloadKey === 'cardMode'
        );

        let selectedOption = row.cardMode;

        if (cardModeFilter) {
          selectedOption = cardModeFilter.options[0]?.children?.find(
            (option: any) => option.value === row.cardMode
          )?.title;
        }
        return <Stack>{selectedOption}</Stack>;
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
            onClick={() => handleSortByName('cardMode', '', '')}
          >
            <>{text}</>
            {value === 'cardMode' && (
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
      title: 'Card Category',
      dataIndex: 'cardCategory',
      key: 'cardCategory',
      width: '160px',
      render: (_: string, row: any, index: number) => {
        const cardCategoryFilter = filters.find(
          (filter: any) => filter.payloadKey === 'cardCategory'
        );
        let selectedOption = row.cardCategory;
        if (cardCategoryFilter) {
          selectedOption = cardCategoryFilter.options[0].children?.find(
            (option: any) => option.value === row.cardCategory
          )?.title;
        }
        return <Stack>{selectedOption}</Stack>;
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
            onClick={() => handleSortByName('cardCategory', '', '')}
          >
            <>{text}</>
            {value === 'cardCategory' && (
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
      title: 'Card Status',
      dataIndex: 'cardStatus',
      key: 'cardStatus',
      width: '160px',
      render: (_: string, row: any, index: number) => {
        const cardStatusFilter = filters.find(
          (filter: any) => filter.payloadKey === 'cardStatus'
        );
        let selectedOption = row.cardStatus;
        if (cardStatusFilter) {
          selectedOption = cardStatusFilter.options?.find(
            (option: any) => option.code === row.cardStatus
          )?.name;
        }
        return (
          <Stack
            sx={{
              color: selectedOption ? checkTagStatus(selectedOption).color : '',
            }}
          >
            {selectedOption}
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
            onClick={() => handleSortByName('cardStatus', '', '')}
          >
            <>{text}</>
            {value === 'cardStatus' && (
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
      title: 'Surrogate Type',
      dataIndex: 'surrogateType',
      key: 'surrogateType',
      width: '160px',
      render: (_: string, row: any, index: number) => {
        let surrogateValue = '';
        row?.surrogateType?.map((item: string, index: number) => {
          if (index !== 0) {
            surrogateValue = surrogateValue + ',' + item;
          } else {
            surrogateValue = item;
          }
        });
        return (
          <Stack
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {surrogateValue}
          </Stack>
        );
      },
    },
    {
      title: 'More',
      dataIndex: 'more',
      key: 'more',
      width: '70px',
      render: (_: string, row: any, index: number) => {
        return (
          <>
            <Stack
              id="more-button"
              onClick={(e: React.MouseEvent<HTMLTableCellElement>) =>
                handleClick(e, row)
              }
              aria-controls={open ? 'more-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{ padding: '5px', borderBottom: 'none', cursor: 'pointer' }}
            >
              <MoreVertIcon />
            </Stack>

            <StyledMenu
              id="more-menu"
              anchorEl={anchorElement}
              open={open}
              MenuListProps={{
                'aria-labelledby': 'more-button',
              }}
              onClose={handleClose}
            >
              {getPermission(
                actionAllowedItem,
                'PRODUCT_MANAGEMENT',
                'CARD_CATALOGUE',
                'VIEW_CARD'
              ) && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/productManagement/cardCatalogue/singleupload', {
                      state: {
                        type: 'view',
                        cardId: selectedRow.id,
                      },
                    });
                  }}
                >
                  View
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/productManagement/cardCatalogue/singleupload', {
                    state: {
                      type: 'edit',
                      cardId: selectedRow.id,
                    },
                  });
                }}
              >
                Edit
              </MenuItem>
            </StyledMenu>
          </>
        );
      },
    },
  ];
  // fetch filter dropdown selected values
  const setSelectedDropdownValue = (
    selectedValues: Array<string>,
    selectedDropdown: any
  ) => {
    let dropdownFilters = [...filters];
    dropdownFilters = dropdownFilters.map((filter: any) => {
      if (filter.name === selectedDropdown.name) {
        filter.selectedValues = selectedValues;
      }
      return filter;
    });
    setFilters(dropdownFilters);
  };
  const resetFilters = () => {
    let dropdownFilters = [...filters];
    dropdownFilters = dropdownFilters.map((filter: any) => {
      filter.selectedValues = ['All'];
      return filter;
    });
    setFilters(dropdownFilters);
    fetchCardList(dropdownFilters);
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
  // Disable condition check
  const isDisabled = (action: string) => {
    if (selected.length > 0) {
      if (action === 'resume') {
        // Resume will be enabled if any of the selected records is in paused or pause scheduled status
        const isResumable = selected.some(
          (item: any) =>
            item.cardStatus === statuses.PAUSED ||
            item.cardStatus === statuses.PAUSE_SCHEDULED
        );
        return !isResumable;
      } else if (action === 'pause') {
        // Pause will be enabled if any of the selected records is in active status
        const isPausable = selected.some(
          (item: any) => item.cardStatus === statuses.ACTIVE
        );
        return !isPausable;
      } else if (action === 'pause-schedule') {
        // Pause will be enabled if any of the selected records is in active status
        const isPauseSchedulable = selected.some(
          (item: any) =>
            item.cardStatus === statuses.PAUSED ||
            item.cardStatus === statuses.PAUSE_SCHEDULED
        );
        return !isPauseSchedulable;
      }
      // else case is for surrogate selection. No status condition check for this
      else return false;
    }
    return true;
  };
  const handlePauseRadioChange = (change: any) => {
    if (change.radio) {
      if (change.radio === 'scheduled-pause') {
        setPauseData({
          selectedRadio: 'scheduled-pause',
          buttontext: 'Pause',
          hasDate: true,
        });
      } else
        setPauseData({
          selectedRadio: 'normal-pause',
          buttontext: 'Pause Now',
          hasDate: false,
        });
    }
  };
  const handleSurrogateRadioChange = (change: any) => {
    if (change.radio) {
      if (change.radio === 'assign') {
        setSurrogateData({
          selectedRadio: 'assign',
          buttontext: 'Assign',
          hasDate: false,
        });
      } else
        setSurrogateData({
          selectedRadio: 'remove',
          buttontext: 'Remove',
          hasDate: false,
        });
    }
  };
  return (
    <Stack>
      <Stack>
        <Box className="cardHeader">
          <Box>
            <ScreenHeader
              title=" Card Catalogue"
              info="Manage card information from here."
              showBackButton={false}
            />
          </Box>
          <Box>
            <Button
              sx={{ textTransform: 'capitalize', backgroundColor: '#0662B7' }}
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              aria-controls={openCardMenu ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openCardMenu ? 'true' : undefined}
              onClick={handleCardMenuClick}
              id="basic-button"
            >
              Add New Card
            </Button>
            <StyledMenuDropDown
              id="basic-menu"
              anchorEl={anchorEl}
              open={openCardMenu}
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
              <MenuItem onClick={singleCardOpen}>Single Card Upload</MenuItem>
              {getPermission(
                actionAllowedItem,
                'PRODUCT_MANAGEMENT',
                'CARD_CATALOGUE',
                'BULK_UPLOAD_CARD'
              ) && <MenuItem onClick={bulkCardOpen}>Bulk Card Upload</MenuItem>}
            </StyledMenuDropDown>
          </Box>
        </Box>
        <Box className="body1">
          <Box className="container1">
            <TypoText title="Card List" color="#151515" />
            <img className="img1" src={Info_Icon} alt="" />
            <TypographyInfo title="Filter cards by mode/status/category/surrogate here." />
          </Box>
          <Divider />
          <Box className="bodyBox">
            <Grid container spacing={2}>
              {filters?.map((eachItem: any, index: number) => {
                return eachItem.displayOrder !== -1 ? (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Typography
                      className="dropdown-label"
                      sx={{
                        fontWeight: 500,
                        fontSize: '12px',
                        letterSpacing: '0.004em',
                        paddingBottom: '4px',
                      }}
                    >
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
          <Box className="boxBtn">
            <Button
              sx={{
                textTransform: 'capitalize',
                fontSize: '14px',
                fontWeight: 500,
              }}
              color="secondary"
              variant="outlined"
              onClick={resetFilters}
            >
              Reset
            </Button>
            <Button
              sx={{ textTransform: 'capitalize' }}
              color="secondary"
              variant="contained"
              onClick={() => fetchCardList(filters)}
            >
              Search
            </Button>
          </Box>
        </Box>
        <Box sx={{ marginTop: 4 }}>
          <Box
            sx={{
              paddingX: 4,
              backgroundColor: 'white',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 0',
                borderBottom: `2px solid ${colors.lightGrey}`,
              }}
            >
              <Box>
                <Typography>Card Details</Typography>
              </Box>
              <Stack>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
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
            </Box>
          </Box>

          <Box className="body2">
            <Stack direction="row" spacing={3} sx={{ margin: '30px 0px' }}>
              {getPermission(
                actionAllowedItem,
                'PRODUCT_MANAGEMENT',
                'CARD_CATALOGUE',
                'ACTIVE_DE_ACTIVE_CARD'
              ) && (
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={isDisabled('resume')}
                  onClick={() => setResumeModal(true)}
                  sx={{
                    padding: '4px 8px',
                    fontSize: '14px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    textTransform: 'capitalize',
                    letterSpacing: '0.0025em',
                  }}
                >
                  <IconButton sx={{ padding: '0', marginRight: '8px' }}>
                    {isDisabled('resume') ? (
                      <img src={Resume_icon} alt="resumeIcon" />
                    ) : (
                      <img src={Resume_icon_active} alt="resumeIcon" />
                    )}
                  </IconButton>
                  Resume card
                </Button>
              )}
              {getPermission(
                actionAllowedItem,
                'PRODUCT_MANAGEMENT',
                'CARD_CATALOGUE',
                'ACTIVE_DE_ACTIVE_CARD'
              ) && (
                <Button
                  variant="contained"
                  color="secondary"
                  // className="btn"
                  onClick={() => setShowPauseModal(true)}
                  disabled={isDisabled('pause')}
                  sx={{
                    padding: '4px 8px',
                    fontSize: '14px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    textTransform: 'capitalize',
                    letterSpacing: '0.0025em',
                  }}
                >
                  <IconButton sx={{ padding: '0', marginRight: '8px' }}>
                    {isDisabled('pause') ? (
                      <img src={Pause_icon} alt="pauseIcon" />
                    ) : (
                      <img src={Pause_icon_active} alt="resumeIcon" />
                    )}
                  </IconButton>
                  pause card
                </Button>
              )}
              {getPermission(
                actionAllowedItem,
                'PRODUCT_MANAGEMENT',
                'CARD_CATALOGUE',
                'ACTIVE_DE_ACTIVE_CARD'
              ) && (
                <Button
                  variant="contained"
                  color="secondary"
                  // className="btn"
                  disabled={isDisabled('pause-schedule')}
                  onClick={() => {
                    setEditModal(true);
                    setPauseData({
                      selectedRadio: 'scheduled-pause',
                      buttontext: 'Pause',
                      hasDate: true,
                    });
                  }}
                  sx={{
                    padding: '4px 8px',
                    fontSize: '14px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    textTransform: 'capitalize',
                    letterSpacing: '0.0025em',
                  }}
                >
                  <IconButton sx={{ padding: '0', marginRight: '8px' }}>
                    {isDisabled('pause-schedule') ? (
                      <img src={Edit_icon} alt="edit icon" />
                    ) : (
                      <img src={Edit_icon_active} alt="edit icon" />
                    )}
                  </IconButton>
                  Edit Pause
                </Button>
              )}
              {getPermission(
                actionAllowedItem,
                'PRODUCT_MANAGEMENT',
                'CARD_CATALOGUE',
                'ASSIGN_SURROGATE_CARD'
              ) && (
                <Button
                  variant="contained"
                  color="secondary"
                  // className="btn"
                  disabled={isDisabled('surrogate-selection')}
                  onClick={() => setSurrogateSelection(true)}
                  sx={{
                    padding: '4px 8px',
                    fontSize: '14px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    textTransform: 'capitalize',
                    letterSpacing: '0.0025em',
                  }}
                >
                  <IconButton sx={{ padding: '0', marginRight: '8px' }}>
                    {isDisabled('surrogate-selection') ? (
                      <img src={Surrogate_icon} alt="surrogateIcon" />
                    ) : (
                      <img src={Surrogate_icon_Active} alt="surrogateIcon" />
                    )}
                  </IconButton>
                  surrogate card selection
                </Button>
              )}
            </Stack>
            <Stack>
              <Box>
                <GroupButton
                  data={GroupButtonData}
                  onChange={onTabStatusChange}
                />
              </Box>
            </Stack>
          </Box>
          <Box className="tableBox">
            <ListTable
              column={column}
              data={cardList}
              // isItemSelected={selected.map((item: any) => item.id)}
              selectedKey="id"
              pagination={{
                ...pagination,
                ...totalCount,
                onPageChange: onPageChange,
                onPageSizeChange: onPageSizeChange,
              }}
              tabStatus={tabValue}
              tableHeight="370px"
            />
          </Box>
        </Box>
      </Stack>
      {/* -------------- Surrogate selection modals ----------- */}
      {surrogateSelection && (
        <ActionModal
          isOpen={surrogateSelection}
          header="Surrogate Selection"
          description="You can assign or remove surrogate."
          hasPrimaryCta={true}
          primaryCtaText={surrogateData.buttontext}
          handlePrimaryCtaClick={handleSurrogateSubmit}
          hasOutlinedCta={true}
          outlinedCtaText={'close'}
          handleOutlinedCtaClick={closeModal}
          hasRadio={true}
          defaultRadio={'assign'}
          radioOptions={[
            {
              value: 'assign',
              label: 'Assign Surrogate',
            },
            {
              value: 'remove',
              label: 'Remove Surrogate',
            },
          ]}
          hasCheckbox={true}
          checkboxOptions={
            filters.find((filter: any) => filter.payloadKey === 'surrogateType')
              ?.options[0]?.children || []
          }
          handleChange={handleSurrogateRadioChange}
        />
      )}
      {surrogateSuccessSelection && (
        <CustomModal
          openSuccess={surrogateSuccessSelection}
          handleCloseSuccess={closeModal}
          successModalTitle={'Assign - Surrogate'}
          successModalMsg={modalContent}
          btn={' Close'}
        />
      )}
      {removeSurrogateModal && (
        <CustomModal
          openSuccess={removeSurrogateModal}
          handleCloseSuccess={closeModal}
          successModalTitle={'Remove - Surrogate'}
          successModalMsg={modalContent}
          btn={' Close'}
        />
      )}
      {/* ------------- Resume modals ------------- */}
      {resumeModal && (
        <ActionModal
          isOpen={resumeModal}
          header="Card - Resume Now"
          description="You can resume your card from here."
          hasPrimaryCta={true}
          primaryCtaText={'Submit'}
          handlePrimaryCtaClick={handleResumeSuccess}
          hasOutlinedCta={true}
          outlinedCtaText={'Close'}
          handleOutlinedCtaClick={closeModal}
          hasTextbox={true}
          textboxHeader={'Add Remarks'}
          maxWords={500}
        />
      )}
      {resumeSuccessModal && (
        <CustomModal
          openSuccess={resumeSuccessModal}
          handleCloseSuccess={closeModal}
          successModalTitle={'Card - Resume'}
          successModalMsg={
            'Your action for resuming the card request Surrogate was successfully sent to the reviewer.'
          }
          btn={' Close'}
        />
      )}
      {/* ------------------ Pause Card Modals------------------- */}
      {showPauseModal && (
        <ActionModal
          isOpen={showPauseModal}
          header=" Card - Pause"
          description="You can pause it or perform a scheduled pause."
          hasPrimaryCta={true}
          primaryCtaText={pauseData.buttontext}
          handlePrimaryCtaClick={successModal}
          hasOutlinedCta={true}
          outlinedCtaText={'Close'}
          handleOutlinedCtaClick={closeModal}
          hasRadio={true}
          defaultRadio="normal-pause"
          radioOptions={[
            {
              value: 'normal-pause',
              label: NORMAL_PAUSE,
            },
            {
              value: 'scheduled-pause',
              label: SCHEDULED_PAUSE,
            },
          ]}
          hasDate={pauseData.hasDate}
          dateDescription={
            'Please choose a date range to perform a scheduled pause.'
          }
          hasTextbox={true}
          textboxHeader={'Add Remarks'}
          maxWords={500}
          handleChange={handlePauseRadioChange}
        />
      )}
      {showPauseSuccessModal && (
        <CustomModal
          openSuccess={showPauseSuccessModal}
          handleCloseSuccess={closeModal}
          successModalTitle={'Card - Pause Now'}
          successModalMsg={
            ' Your action for pause the Card request was successully sent to the reviewer'
          }
          btn={' Close'}
        />
      )}
      {showScheduledPauseSuccessModal && (
        <CustomModal
          openSuccess={showScheduledPauseSuccessModal}
          handleCloseSuccess={closeModal}
          successModalTitle={'Card - Scheduled Pause'}
          successModalMsg={
            'Your action for Scheduled Pause the Card request was successfully sent to reviewer'
          }
          btn={' Close'}
        />
      )}
      {/* ------------- Edit pause modals ---------------- */}
      {editPauseModal && (
        <ActionModal
          isOpen={editPauseModal}
          header=" Card - Edit Pause"
          description="You can pause it or perform a scheduled pause."
          hasPrimaryCta={true}
          primaryCtaText={pauseData.buttontext}
          handlePrimaryCtaClick={handleEditSuccess}
          hasOutlinedCta={true}
          outlinedCtaText={'Close'}
          handleOutlinedCtaClick={closeModal}
          hasRadio={true}
          defaultRadio="scheduled-pause"
          radioOptions={[
            {
              value: 'normal-pause',
              label: NORMAL_PAUSE,
            },
            {
              value: 'scheduled-pause',
              label: SCHEDULED_PAUSE,
            },
          ]}
          hasDate={pauseData.hasDate}
          dateDescription={
            'Please choose a date range to perform a scheduled pause.'
          }
          hasTextbox={true}
          textboxHeader={'Add Remarks'}
          maxWords={500}
          handleChange={handlePauseRadioChange}
        />
      )}
      {editSuccessModal && (
        <CustomModal
          openSuccess={editSuccessModal}
          handleCloseSuccess={closeModal}
          successModalTitle={'Card - Edit Pause'}
          successModalMsg={modalContent}
          btn={' Close'}
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
