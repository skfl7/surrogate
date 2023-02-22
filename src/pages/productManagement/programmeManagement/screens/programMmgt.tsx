import { useEffect, useState } from 'react';
import moment from 'moment';
import localforage from 'localforage';

// MUI components
import { Button, IconButton, Stack, Typography } from '@mui/material';

// styles
import { colors } from '../../../../style/Color';

// Utiles
import {
  programMmgt,
  tabBar,
  tagBasedIndicator,
} from '../../../../utils/Constants';

// program management sub components
import { ListView } from './listComponents/listView';
import CardList from './listComponents/cardList';

// Assets
import cardListIcon from '../../../../assets/images/cardListIcon.svg';
import ListIcon from '../../../../assets/images/list_layout.svg';
import resumeIcon from '../../../../assets/images/resume_surrogate_icon.svg';
import resumeActive from '../../../../assets/images/resume-active-icon.svg';
import ScheduleEditIcon from '../../../../assets/images/edit_scheduled_pause_icon.svg';
import ScheduleEditIconActive from '../../../../assets/images/editScheduleActive.svg';
import pauseIcon from '../../../../assets/images/pause_surrogate_icon.svg';
import pauseActive from '../../../../assets/images/pauseActive.svg';

// Common components
import CustomModal from '../../../../components/commonComponent/customModal/CustomModal';
import ErrorMessage from '../../../../components/commonComponent/ErrorMessage';

// Interface
import {
  cardStatusInterface,
  ProgrammeManagementCardItemInterface,
} from '../programmeMgntInterface';

// Services
import {
  getProgramMgntDropdownData,
  getProgramMgntListItems,
  updateProgramMgntItemStatus,
} from '../../../../services/programmeManagementServices';

import {
  getPermission,
  getPermissionn,
} from '../../../../utils/ActionAllowed/UserActionAllowed';
export const ProgramManagementScreen = () => {
  const [listView, setListView] = useState<boolean>(true);
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);
  const [successEditSchedulePause, setSuccessEditSchedulePause] =
    useState<boolean>(false);
  const [editSchedulePause, setEditSchedulePause] = useState(false);
  const [successEditPause, setSuccessEditPause] = useState(false);
  const [showPauseSuccessModal, setShowPauseSuccessModal] =
    useState<boolean>(false);
  const [showResumeModal, setShowResumeModal] = useState<boolean>(false);
  const [showResumeSuccessModal, setShowResumeSuccessModal] =
    useState<boolean>(false);
  const [showScheduledPauseSuccessModal, setShowScheduledPauseSuccessModal] =
    useState<boolean>(false);
  const [pauseMethod, setPauseMethod] = useState('Pause Now');
  const [surrogateData, setSurrogateData] = useState<
    ProgrammeManagementCardItemInterface[]
  >([]);
  const [statusOptions, setStatusOptions] = useState<cardStatusInterface[]>([]);
  const [resumeBtnEnabled, setResumeBtnEnabled] = useState<boolean>(false);
  const [pauseBtnEnabled, setpauseBtnEnabled] = useState<boolean>(false);
  const [scheduledPauseBtnEnabled, setScheduledPauseBtnEnabled] =
    useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<
    ProgrammeManagementCardItemInterface[]
  >([]);
  const [scheduledPauseStartDate, setScheduledPauseStartDate] = useState(
    new Date()
  );
  const [scheduledPauseEndDate, setScheduledPauseEndDate] = useState(
    new Date()
  );
  const [remarks, setRemarks] = useState<string>('');
  const [successModalTitle, setSuccessModalTitle] = useState<string>('');
  const [userID, setUserId] = useState<string>();
  const [selectedCheckedItems, setSelectedCheckedItems] = useState('');
  const [apiError, setApiError] = useState('');
  const [singleSelectedValue, setSingleSelectedValue] =
    useState<ProgrammeManagementCardItemInterface[]>();
  const [isSingleSelectionEnabled, setIsSingleSelectionEnabled] =
    useState<boolean>();
  const [maxWordsExists, setMaxWordsExists] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [resumeItNowCheck, setResumeItNowCheck] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [actionAllowedItem, setActionAllowedItem] = useState([]);
  const [checkedProgram, setCheckedProgram] = useState<string[]>([]);
  let checkedList = '';

  // const getvalue = () => {
  //   getPermissionn('PRODUCT_MANAGEMENT')
  //     .then((res) => {
  //       console.log("res",res)
  //     })
  //     .catch((err) => {
  //       console.log("err")
  //     });
  // };
  // console.log('getVlaue', getvalue);
  // console.log('actionAllowed', actionAllowed);

  /* useEffect */
  useEffect(() => {
    getLocalStorageValue();
    getProgramDropDownData();
  }, []);

  useEffect(() => {
    userID && getProgrammeManagementListItems();
  }, [userID]);

  useEffect(() => {
    if (pauseMethod === NORMAL_PAUSE) {
      setErrorMessage(false);
      if (remarks?.length > 4) {
        setButtonDisabled(false);
      }
    }
  }, [pauseMethod]);

  // useEffect(() => {
  //   if (!resumeItNowCheck) {
  //     updateActionButtons();
  //   } else {
  //   }
  // }, [selectedItems]);

  useEffect(() => {
    // console.log(scheduledPauseStartDate.getTime(), 'scheduledPauseStartDate');
    if (scheduledPauseStartDate > scheduledPauseEndDate) {
      if (
        new Date(scheduledPauseStartDate).getTime() >
        new Date(scheduledPauseEndDate).getTime()
      ) {
        setErrorMessage(true);
        setButtonDisabled(true);
      }
    } else {
      setErrorMessage(false);
      if (remarks?.length > 4) {
        setErrorMessage(false);
        setButtonDisabled(false);
      }
      // setButtonDisabled(false);
    }
  }, [scheduledPauseStartDate, scheduledPauseEndDate]);

  useEffect(() => {
    if (
      isSingleSelectionEnabled &&
      singleSelectedValue &&
      singleSelectedValue?.length > 0
    ) {
      setSelectedCheckedItems(singleSelectedValue[0]?.programTypeName || '');
    }
  }, [isSingleSelectionEnabled, singleSelectedValue]);

  useEffect(() => {
    if (selectedItems) {
      let value: any = '';
      let program: string[] = [];
      if (resumeItNowCheck) {
        value = selectedItems[0]?.programTypeName;
      } else {
        selectedItems?.map((item: any) => {
          if (value === '' || program.length === 0) {
            value = item?.programTypeName;
          } else {
            value = value + ',' + item?.programTypeName;
          }
          program.push(item?.programStatus);
        });
      }
      console.log('program check', program);
      if (!resumeItNowCheck) {
        updateActionButtons();
      }
      setCheckedProgram(program);
      setSelectedCheckedItems(value);
    }
    // selectedItems.map((val: any) => {
    //   return (checkedList += val?.programTypeName + '  ');
    // });
    // const finalCheckedList = checkedList + '';
    // setSelectedCheckedItems(finalCheckedList);
  }, [selectedItems]);

  const getLocalStorageValue = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setUserId(value.id);
      setActionAllowedItem(value?.actionsAllowed);
    } catch (err) {
      console.log(err);
    }
  };

  const updateResumeItNow = (value: boolean) => {
    setResumeItNowCheck(value);
  };

  const getProgramDropDownData = () => {
    let payload = {
      programDropDown: 'PROGRAM_STATUS',
    };
    getProgramMgntDropdownData(payload)
      .then((response) => {
        if (response?.data?.result) {
          setStatusOptions(response?.data?.result?.programDropDown || []);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        setStatusOptions([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const getProgrammeManagementListItems = () => {
    let payload = {
      userId: userID,
    };
    // setSuccessModalTitle('');
    setRemarks('');
    setSelectedItems([]);
    getProgramMgntListItems(payload)
      .then((response) => {
        if (response?.data?.result) {
          setSurrogateData(response?.data?.result || []);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        setSurrogateData([]);
        handleError(err?.response?.data ?? '');
      });
  };
  // const getProgrammeManagementItemDetail = () => {
  //   let payload = {
  //     programId: '631f03cf091ecfb0f2aaa55a',
  //     userId: userID,
  //   };
  //   getProgramMgntItemDetail(payload)
  //     .then((response) => {
  //       console.log('getProgrammeManagementItemDetail response', response);
  //     })
  //     .catch((err) => {
  //       console.log('getProgrammeManagementItemDetail response', err);
  //     });
  // };

  const getFilteredItemsId = (status: string) => {
    let filteredArr = [];
    if (isSingleSelectionEnabled && singleSelectedValue) {
      let arr = [];
      arr.push(singleSelectedValue[0]?.id);
      return arr;
    } else {
      if (
        status === tagBasedIndicator.ACTIVE ||
        status === tagBasedIndicator.PAUSED ||
        status === tagBasedIndicator.PAUSED_SCHEDULED
      ) {
        filteredArr = selectedItems?.filter(
          (eachItem) =>
            eachItem?.programStatus === tagBasedIndicator.ACTIVE ||
            eachItem?.programStatus === tagBasedIndicator.PAUSED ||
            eachItem?.programStatus === tagBasedIndicator.PAUSED_SCHEDULED
        );
      } else {
        filteredArr = selectedItems?.filter(
          (eachItem) => eachItem?.programStatus === tagBasedIndicator.ACTIVE
        );
      }
      let idArr = filteredArr.map((eachItem) => {
        return eachItem?.id;
      });
      return idArr;
    }
  };
  const modalFunResume = () => {
    setShowResumeModal(true);
  };
  const modalFunPause = () => {
    setShowPauseModal(true);
  };
  const modalScheduledPauseFun = () => {
    // setEditScheduleState(true);
    setEditSchedulePause(true);
  };
  const updateItemStatus = () => {
    if (pauseMethod === NORMAL_PAUSE) {
      let idArr = getFilteredItemsId(tagBasedIndicator.PAUSED);
      let payload = {
        idList: [...idArr],
        programStatus: tagBasedIndicator.PAUSED,
        pauseStartDate: moment(scheduledPauseStartDate).format(
          'YYYY-MM-DD hh:mm:ss'
        ),
        remarks: remarks,
        userId: userID,
      };
      setShowPauseModal(false);
      updateProgramManagementItemStatus(tagBasedIndicator.PAUSED, payload);
    } else {
      let idArr = getFilteredItemsId(tagBasedIndicator.PAUSED_SCHEDULED);
      let payload = {
        idList: [...idArr],
        programStatus: tagBasedIndicator.PAUSED_SCHEDULED,
        remarks: 'remarks',
        pauseStartDate: moment(new Date(scheduledPauseStartDate)).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        pauseEndDate: moment(new Date(scheduledPauseEndDate)).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        userId: userID,
      };
      setEditSchedulePause(false);
      updateProgramManagementItemStatus(
        tagBasedIndicator.PAUSED_SCHEDULED,
        payload
      );
    }
    setEditSchedulePause(false);
    setShowPauseModal(false);
  };
  const updateProgramManagementItemStatus = (status: string, payload: any) => {
    updateProgramMgntItemStatus(payload)
      .then((response) => {
        if (response?.data?.result) {
          console.log('updateProgramManagementItemStatus response', response);
          let value = '';

          response?.data?.result?.map((item: any) => {
            if (value === '') {
              value = item?.programType;
            } else {
              value = value + ',' + item?.programType;
            }
          });

          console.log('value of pause', value);
          setSuccessModalTitle(value);
          switch (status) {
            case tagBasedIndicator.ACTIVE:
              setShowResumeSuccessModal(true);
              break;
            case tagBasedIndicator.PAUSED:
              setShowPauseSuccessModal(true);
              break;
            case tagBasedIndicator.PAUSED_SCHEDULED:
              setShowScheduledPauseSuccessModal(true);
              break;
          }
          getProgrammeManagementListItems();
          setIsSingleSelectionEnabled(false);
          setSingleSelectedValue([]);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        console.log('updateProgramManagementItemStatus err', err);
        handleError(err?.response?.data ?? '');
      });
  };
  const closeModal = () => {
    setShowPauseModal(false);
    setShowPauseSuccessModal(false);
    setShowScheduledPauseSuccessModal(false);
    setShowResumeModal(false);
    setShowResumeSuccessModal(false);
    setEditSchedulePause(false);
    setSuccessEditPause(false);
    setSuccessEditSchedulePause(false);
  };
  const NORMAL_PAUSE = 'Pause Now';
  const SCHEDULED_PAUSE = 'Schedule Pause';
  const pauseMethodChange = (value: any) => {
    console.log('method checking', value);
    setPauseMethod(value);
  };
  const datePickerStartFun = (e: any) => {
    console.log('start date', e);
    // setEditScheduleState(false);
    setScheduledPauseStartDate(e);
  };
  const datePickerEndFun = (e: any) => {
    setScheduledPauseEndDate(e);
  };

  const textareaonchangeFun = (e: any) => {
    setRemarks(e?.target?.value ?? '');
  };

  useEffect(() => {
    if (remarks?.length < 4) {
      setButtonDisabled(true);
    } else if (remarks?.length > 500) {
      setMaxWordsExists(true);
      setButtonDisabled(true);
    } else {
      if (scheduledPauseStartDate > scheduledPauseEndDate) {
        if (pauseMethod === NORMAL_PAUSE) {
          setErrorMessage(false);
          setButtonDisabled(false);
        } else {
          setErrorMessage(true);
          setButtonDisabled(true);
        }
      } else {
        setButtonDisabled(false);
      }
      // setButtonDisabled(false);
      setMaxWordsExists(false);
    }
  }, [remarks]);

  // const successModal = () => {
  //   if (pauseMethod === NORMAL_PAUSE) {
  //     setShowPauseModal(false);
  //     setShowPauseSuccessModal(true);
  //   }
  //   if (pauseMethod === SCHEDULED_PAUSE) {
  //     setShowPauseModal(false);
  //     setShowScheduledPauseSuccessModal(true);
  //   }
  // };
  const handleResumeSubmit = () => {
    let idArr = getFilteredItemsId(tagBasedIndicator.ACTIVE);
    let payload = {
      idList: [...idArr],
      programStatus: tagBasedIndicator.ACTIVE,
      remarks: remarks,
      userId: userID,
    };
    setShowResumeModal(false);
    updateProgramManagementItemStatus(tagBasedIndicator.ACTIVE, payload);
  };
  const onChangeSelectItems = (
    isSelected: boolean,
    item: ProgrammeManagementCardItemInterface,
    resumeItNow?: boolean
  ) => {
    let alreadyPresent = selectedItems?.find(
      (eachItem) => eachItem.id === item.id
    );
    if (isSelected) {
      console.log('1');
      if (resumeItNow) {
        console.log('2', [item]);

        setSelectedItems([item]);
      } else {
        console.log('3', [...selectedItems, item]);
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      if (alreadyPresent) {
        let value = selectedItems?.filter(
          (eachItem) => eachItem?.id !== item?.id
        );
        setSelectedItems(value);
      }
    }
  };
  console.log('selected check', checkedProgram);
  console.log('selected items', selectedItems);
  console.log('selected box', selectedCheckedItems);

  const onChangeAllItems = (
    itemsArr: ProgrammeManagementCardItemInterface[]
  ) => {
    setSelectedItems([...itemsArr]);
  };

  const onChangeSingleSelectedItems = (isSelected: boolean, item: any) => {
    setIsSingleSelectionEnabled(isSelected);
    setSingleSelectedValue(item);
  };
  const updateActionButtons = () => {
    let resumeStatus = false;
    let pausedStatus = false;
    let scheduledPauseStatus = false;
    let prev = '';
    selectedItems?.map((eachItem) => {
      if (eachItem?.programStatus === tagBasedIndicator.ACTIVE) {
        if (prev === 'pause') {
          pausedStatus = true;
          scheduledPauseStatus = true;
        } else {
          pausedStatus = true;
          scheduledPauseStatus = false;
        }
      }
      if (
        eachItem.programStatus === tagBasedIndicator.PAUSED ||
        eachItem.programStatus === tagBasedIndicator.PAUSED_SCHEDULED
      ) {
        prev = 'pause';
        resumeStatus = true;
        scheduledPauseStatus = true;
      }
    });
    setResumeBtnEnabled(resumeStatus);
    setpauseBtnEnabled(pausedStatus);
    setScheduledPauseBtnEnabled(scheduledPauseStatus);
  };

  const updateRemarks = (e: any) => {
    setRemarks(e.target.value);
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
  return (
    <Stack
      sx={{
        padding: '25px 30px 50px 30px',
        backgroundColor: colors.white,
        borderRadius: '8px',
      }}
    >
      <Stack
        sx={{
          borderBottom: `2px solid ${colors.lightGrey}`,
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack>
            <Typography variant="subtitle1" sx={{ letterSpacing: 0.5 }}>
              {tabBar.PROGRAMME_MANAGEMENT}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                letterSpacing: 0.2,
                color: '#A3A3A5',
                paddingBottom: '20px',
              }}
            >
              {tabBar.TEMPORARILY_PAUSE}
            </Typography>
          </Stack>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Stack
              sx={{
                padding: '0 10px',
              }}
              onClick={() => {
                setListView(true);
                setSelectedItems([]);
              }}
            >
              <IconButton>
                <img
                  src={cardListIcon}
                  alt="cardIcon"
                  style={{
                    filter:
                      listView === true
                        ? 'invert(16%) sepia(97%) saturate(2280%) hue-rotate(207deg) brightness(100%) contrast(91%)'
                        : '',
                  }}
                />
              </IconButton>
            </Stack>
            <Stack
              sx={{
                padding: '0 10px',
              }}
              onClick={() => {
                setListView(false);
                setSelectedItems([]);
              }}
            >
              <IconButton>
                <img
                  src={ListIcon}
                  alt="ListIcon"
                  style={{
                    filter:
                      listView === false
                        ? 'invert(15%) sepia(98%) saturate(2693%) hue-rotate(209deg) brightness(97%) contrast(87%)'
                        : '',
                  }}
                />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack>
        <Stack direction="row" spacing={3} sx={{ margin: '30px 0px' }}>
          <Button
            variant="contained"
            color="secondary"
            disabled={!resumeBtnEnabled}
            sx={{
              padding: '4px 8px',
              fontSize: '14px',
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              textTransform: 'capitalize',
              letterSpacing: '0.0025em',
            }}
            onClick={() => modalFunResume()}
          >
            <IconButton sx={{ padding: '0', marginRight: '8px' }}>
              {resumeBtnEnabled ? (
                <img src={resumeActive} alt="resumeIcon" />
              ) : (
                <img src={resumeIcon} alt="resumeIcon" />
              )}
            </IconButton>
            {programMmgt.RESUME_SURROGATE}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={!pauseBtnEnabled}
            sx={{
              padding: '4px 8px',
              fontSize: '14px',
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              textTransform: 'capitalize',
              letterSpacing: '0.0025em',
            }}
            onClick={() => modalFunPause()}
          >
            <IconButton sx={{ padding: '0', marginRight: '8px' }}>
              {pauseBtnEnabled ? (
                <img src={pauseActive} alt="pauseIcon" />
              ) : (
                <img src={pauseIcon} alt="pauseIcon" />
              )}
            </IconButton>
            {programMmgt.PAUSE_SURROGATE}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={!scheduledPauseBtnEnabled}
            sx={{
              padding: '4px 8px',
              fontSize: '14px',
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              textTransform: 'capitalize',
              letterSpacing: '0.0025em',
            }}
            onClick={() => modalScheduledPauseFun()}
          >
            <IconButton sx={{ padding: '0', marginRight: '8px' }}>
              {scheduledPauseBtnEnabled ? (
                <img src={ScheduleEditIconActive} alt="ScheduleEditIcon" />
              ) : (
                <img src={ScheduleEditIcon} alt="ScheduleEditIcon" />
              )}
            </IconButton>
            {programMmgt.EDIT_SCHEDULE_PAUSE}
          </Button>
        </Stack>
      </Stack>

      {showPauseModal && (
        <CustomModal
          openSuccess={showPauseModal}
          handleCloseSuccess={closeModal}
          handleSuccess={updateItemStatus}
          title={`${selectedCheckedItems} - PAUSE`}
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
          // editSchedule={editScheduleState}
          datepickerLabelStart={'Start Date and time'}
          datepickerLabelEnd={'End Date and time'}
          pauseStatusKey={'Pause Now'}
          datePickerStartFun={datePickerStartFun}
          datePickerEndFun={datePickerEndFun}
          startDatevalue={scheduledPauseStartDate}
          endDatevalue={scheduledPauseEndDate}
          dateErrorMessage={errorMessage}
          startTimeValue={new Date(scheduledPauseStartDate).getTime()}
          endTimeValue={new Date(scheduledPauseEndDate).getTime()}
          textareaonchangeFun={textareaonchangeFun}
          textAreaValue={remarks}
          buttonDisabled={buttonDisabled}
          maxWordsExists={maxWordsExists}
          // buttonDisabled={remarks === '' ? true : false}
        />
      )}

      {showPauseSuccessModal && (
        <CustomModal
          openSuccess={showPauseSuccessModal}
          handleCloseSuccess={closeModal}
          successModalTitle={`${successModalTitle} - Pause`}
          successModalMsg={` Your action of pausing - ${successModalTitle} has been successully sent to the reviewer`}
          btn={' Close'}
        />
      )}
      {showScheduledPauseSuccessModal && (
        <CustomModal
          openSuccess={showScheduledPauseSuccessModal}
          handleCloseSuccess={closeModal}
          successModalTitle={`${successModalTitle} - Scheduled Pause`}
          successModalMsg={`Your action of Scheduled Pause - ${successModalTitle} Surrogate From ${moment(
            new Date(scheduledPauseStartDate)
          ).format('DD MMM YYYY, h:mm A')} To
            ${moment(new Date(scheduledPauseEndDate)).format(
              'DD MMM YYYY, h:mm A'
            )} is successfully sent to reviewer`}
          btn={' Close'}
        />
      )}
      {showResumeModal && (
        <CustomModal
          openSuccess={showResumeModal}
          handleCloseSuccess={closeModal}
          title={`${selectedCheckedItems} - RESUME`}
          handleSuccess={handleResumeSubmit} //{resumeSuccessModal}
          pause_content={
            'You will be able to resume your paused surrogate here.'
          }
          textarea_title={'Add Remarks'}
          dateRange_title={'Enter Date range'}
          maxLength={'Maximum of 500 words'}
          close={'Close'}
          submit={'Submit'}
          textareaonchangeFun={textareaonchangeFun}
          textAreaValue={remarks}
          buttonDisabled={buttonDisabled}
          maxWordsExists={maxWordsExists}
        />
      )}
      {editSchedulePause && (
        <CustomModal
          openSuccess={editSchedulePause}
          handleCloseSuccess={closeModal}
          handleSuccess={updateItemStatus}
          title={`${selectedCheckedItems} - EDIT PAUSE`}
          pause_content={'You can pause it or perform a scheduled pause.....'}
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
          startDatevalue={scheduledPauseStartDate}
          endDatevalue={scheduledPauseEndDate}
          dateErrorMessage={errorMessage}
          startTimeValue={new Date(scheduledPauseStartDate).getTime()}
          endTimeValue={new Date(scheduledPauseEndDate).getTime()}
          // editSchedule={editScheduleState}
          // updatedStartDate={selectedItems[0]?.pauseTime}
          // updatedEndDate={selectedItems[0]?.resumeTime}
          datePickerStartFun={datePickerStartFun}
          datePickerEndFun={datePickerEndFun}
          textareaonchangeFun={textareaonchangeFun}
          textAreaValue={remarks}
          buttonDisabled={buttonDisabled}
          maxWordsExists={maxWordsExists}
        />
      )}
      {successEditPause && (
        <CustomModal
          openSuccess={successEditPause}
          handleCloseSuccess={closeModal}
          successModalTitle={`Deactivated - Pause`}
          successModalMsg={`Your action of pausing - ${successModalTitle} Surrogate has been successully sent to the reviewer`}
          btn={' Close'}
        />
      )}
      {successEditSchedulePause && (
        <CustomModal
          openSuccess={successEditSchedulePause}
          handleCloseSuccess={closeModal}
          successModalTitle={`Deactivated- Scheduled Pause`}
          successModalMsg={`Your action of Scheduled Pause - ${successModalTitle} Surrogate From  DD/MM/YYYTo DD/MM/YYY is successfully sent to reviewer`}
          btn={' Close'}
        />
      )}
      {showResumeSuccessModal && (
        <CustomModal
          openSuccess={showResumeSuccessModal}
          handleCloseSuccess={closeModal}
          successModalTitle={`${successModalTitle} - Resume Now`}
          successModalMsg={`Your action of Resuming - ${successModalTitle} Surrogate has been successfully sent to the reviewer.`}
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
      {getPermission(
        actionAllowedItem,
        'PRODUCT_MANAGEMENT',
        'PROGRAM_MANAGEMENT',
        'VIEW_PROGRAM_MANAGEMENT'
      ) && (
        <Stack>
          {listView ? (
            <CardList
              data={surrogateData}
              onClickCallback={onChangeSelectItems}
              resumeitFun={updateResumeItNow}
              onSingleSelectCallback={onChangeSingleSelectedItems}
              modalFunResume={modalFunResume}
              modalFunPause={modalFunPause}
              modalScheduledPauseFun={modalScheduledPauseFun}
              selectedItems={selectedItems}
            />
          ) : (
            <ListView
              data={surrogateData}
              onClickCallback={onChangeSelectItems}
              modalFunResume={modalFunResume}
              modalFunPause={modalFunPause}
              modalScheduledPauseFun={modalScheduledPauseFun}
              onSingleSelectCallback={onChangeSingleSelectedItems}
              onMultiSelectCallback={onChangeAllItems}
              selectedItems={selectedItems}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};
