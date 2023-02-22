/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Stack,
  Checkbox,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ScreenHeader } from '../../../components/commonComponent/ScreenHeader/ScreenHeader';
import HeaderWithInfo from '../../../components/commonComponent/HeaderWithInfo';
import { product_label, LMSListData } from './lmsRule.const';
import CustomModal from '../../../components/commonComponent/customModal/CustomModal';
import resumeIcon from '../../../assets/images/resume_surrogate_icon.svg';
import ascending_icon from '../../../assets/icons/ascending.svg';
import descending_icon from '../../../assets/icons/descending.svg';
import ScheduleEditIcon from '../../../assets/images/edit_scheduled_pause_icon.svg';
import pauseIcon from '../../../assets/images/pause_surrogate_icon.svg';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import ListLMSTable from '../../../components/commonComponent/RightColumnFixedTable';
import Popover from '../../../components/commonComponent/Popover';
import './style.scss';
import { MenuProps } from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import localforage from 'localforage';
import { getPermission } from '../../../utils/ActionAllowed/UserActionAllowed';

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

function LMSRuleTab() {
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);
  const [showPauseSuccessModal, setShowPauseSuccessModal] =
    useState<boolean>(false);
  const [showScheduledPauseSuccessModal, setShowScheduledPauseSuccessModal] =
    useState<boolean>(false);
  const [showResumeModal, setShowResumeModal] = useState<boolean>(false);
  const [showResumeSuccessModal, setShowResumeSuccessModal] =
    useState<boolean>(false);
  const [editSchedulePause, setEditSchedulePause] = useState(false);
  const [successEditSchedulePause, setSuccessEditSchedulePause] =
    useState(false);
  const [pauseMethod, setPauseMethod] = useState('Pause Now');
  const [isAddRulePopoverOpen, setIsAddRulePopoverOpen] =
    React.useState<HTMLButtonElement | null>(null);
  const [isDuplicateRule, setIsDuplicateRule] = useState(false);

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [startDatevalue, setStartDateValue] = useState(null);
  const [endDatevalue, setEndDateValue] = useState(null);
  const [textAreaValue, setTextAreaValue] = useState('');

  const openAddRulePopover = Boolean(isAddRulePopoverOpen);
  const addNewRuleId = openAddRulePopover ? 'simple-popover' : undefined;
  const [selected, setSelected] = useState<number[]>([]);
  const open = Boolean(anchorElement);
  // const openId = openPopup ? 'simple-popover' : undefined;
  const navigate = useNavigate();

  //sorting
  const [dataList, setDataList] = useState<any>([...LMSListData]);
  const [filterState, setFilterState] = useState<any>([
    {
      value: 'lastModifiedDateTime',
      secondValue: null,
      threeValue: null,
      ascending: true,
    },
  ]);

  const [actionAllowedItem, setActionAllowedItem] = useState([]);

  useEffect(() => {
    getLocalStorageValue();
  }, []);

  const getLocalStorageValue = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');

      setActionAllowedItem(value?.actionsAllowed);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    filterData();
  }, [filterState]);

  const filterData = () => {
    console.log('filterState', filterState);
    // const { value, secondValue, threeValue, ascending } = filterState[0];
    const filter = filterState[0];
    const sort = dataList.sort((a: any, b: any) => {
      if (filter.ascending) {
        if (filter.threeValue) {
          const first =
            a?.[filter.value]?.[filter.secondValue]?.[filter.threeValue] ?? '';
          const second =
            b?.[filter.value]?.[filter.secondValue]?.[filter.threeValue] ?? '';
          return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
        }
        if (filter.secondValue) {
          const first = a?.[filter.value]?.[filter.secondValue] ?? '';
          const second = b?.[filter.value]?.[filter.secondValue] ?? '';
          return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
        }
        const first = a?.[filter.value] ?? '';
        const second = b?.[filter.value] ?? '';
        return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
      }
      if (filter.threeValue) {
        const first =
          a?.[filter.value]?.[filter.secondValue]?.[filter.threeValue] ?? '';
        const second =
          b?.[filter.value]?.[filter.secondValue]?.[filter.threeValue] ?? '';
        return first.toLowerCase() > second.toLowerCase() ? -1 : 1;
      }
      if (filter.secondValue) {
        const first = a?.[filter.value]?.[filter.secondValue] ?? '';
        const second = b?.[filter.value]?.[filter.secondValue] ?? '';
        return first.toLowerCase() > second.toLowerCase() ? -1 : 1;
      }
      const first = a?.[filter.value] ?? '';
      const second = b?.[filter.value] ?? '';
      return first.toLowerCase() > second.toLowerCase() ? -1 : 1;
    });
    const result = [...sort];
    setDataList([...result]);
  };

  const handleSortByName = (
    name: string,
    secondItem: string,
    threeItem: string
  ) => {
    console.log('filterState', filterState);
    let filter = filterState[0];
    const secondState = secondItem === '' ? null : secondItem;
    const threeState = threeItem === '' ? null : threeItem;

    if (
      filter.value !== name ||
      filter.secondValue !== secondState ||
      filter.threeValue !== threeState
    ) {
      filter.ascending = true;
    } else {
      filter.ascending = !filter.ascending;
    }

    filter.value = name;
    filter.secondValue = secondState;
    filter.threeValue = threeState;
    const result = [{ ...filter }];
    setFilterState([...result]);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = dataList.map((n: any) => n.id);
      setSelected(newSelected);
      return;
    }
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
  const handleClickCheckbox = (id: number) => {
    const result = isSelected(id);
    let selectedData = selected;
    if (result) {
      const index = selected.indexOf(id);
      selectedData.splice(index, 1);
      setSelected([...selectedData]);
    } else {
      setSelected([...selectedData, id]);
    }
  };

  const column1: any = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: '70px',
      headerRender: () => {
        return (
          <Checkbox
            style={{
              transform: 'scale(1.2)',
            }}
            sx={{
              color: '#A8A8A9',
            }}
            color={'secondary'}
            indeterminate={
              selected.length > 0 && selected.length < dataList.length
            }
            checked={dataList.length > 0 && selected.length === dataList.length}
            onChange={handleSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        );
      },
      render: (_: string, row: any, index: number) => {
        const isItemSelected = isSelected(row.id);
        // console.log('isItemSelected', isItemSelected);
        const labelId = `enhanced-table-checkbox-${index}`;
        return (
          <Checkbox
            style={{
              transform: 'scale(1.2)',
            }}
            sx={{
              color: '#A8A8A9',
            }}
            color={'secondary'}
            checked={isItemSelected}
            inputProps={{
              'aria-labelledby': labelId,
            }}
            onChange={() => handleClickCheckbox(row.id)}
          />
        );
      },
    },
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '70px',
      render: (_: string, row: any, index: number) => {
        return <Stack>{index + 1}</Stack>;
      },
    },
    {
      title: 'Rule Name',
      dataIndex: 'rulename',
      key: 'rulename',
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
            onClick={() => handleSortByName('rulename', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'rulename' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
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
      title: 'Starts at',
      dataIndex: 'startsAt',
      key: 'startsAt',
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
            onClick={() => handleSortByName('startsAt', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'startsAt' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
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
      title: 'Ended at',
      dataIndex: 'endedAt',
      key: 'endedAt',
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
            onClick={() => handleSortByName('endedAt', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'endedAt' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
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
            {filterState[0].value === 'lastModifiedDateTime' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
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
      title: 'Initiated By',
      dataIndex: 'initiatedBy',
      key: 'initiatedBy',
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
            onClick={() => handleSortByName('initiatedBy', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'initiatedBy' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
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
      title: 'Re-targeted',
      dataIndex: 'reTargeted',
      key: 'reTargeted',
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
            onClick={() => handleSortByName('reTargeted', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'reTargeted' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
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
      title: 'Initiated',
      dataIndex: 'initiated',
      key: 'initiated',
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
            onClick={() => handleSortByName('initiated', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'initiated' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
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
      title: 'Failed',
      dataIndex: 'failed',
      key: 'failed',
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
            onClick={() => handleSortByName('failed', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'failed' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
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
      title: 'Again Dropped',
      dataIndex: 'againDropped',
      key: 'againDropped',
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
            onClick={() => handleSortByName('againDropped', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'againDropped' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
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
      title: 'Again Rejected',
      dataIndex: 'againRejected',
      key: 'againRejected',
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
            onClick={() => handleSortByName('againRejected', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'againRejected' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
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
    // {
    //   title: 'Approved',
    //   dataIndex: 'approved',
    //   key: 'approved',
    // },
  ];

  const column2: any = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
            onClick={() => handleSortByName('status', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'status' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
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
      dataIndex: 'more',
      key: 'more',
      render: (text: string) => {
        return (
          <>
            <Stack
              id="more-button"
              onClick={handleClick}
              aria-controls={open ? 'more-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{ padding: '5px', borderBottom: 'none' }}
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
              <MenuItem
                // onClick={() => handleClose()}
                onClick={() => {
                  handleClose();
                  navigate('/lms/lmsRule/viewRule');
                }}
                // style={{ padding: '10px 20px', textAlign: 'left' }}
              >
                View Rule
              </MenuItem>
              <MenuItem
                // onClick={handleClose}

                onClick={() => {
                  handleClose();
                  navigate('/lms/lmsRule/editRule');
                }}
                // style={{ padding: '10px 20px', textAlign: 'left' }}
              >
                Edit Rule
              </MenuItem>
            </StyledMenu>
          </>
          // <Stack className="more-btn">
          //   <MoreVertIcon
          //     onClick={(event: any) => {
          //       handleClick(event);
          //     }}
          //   />
          //   <Popover
          //     id={id}
          //     open={open}
          //     anchorEl={anchorEl}
          //     handleClose={handleClose}
          //     options={userListMoreMenu}
          //     // openActionModal={() => openActionModal(row)}
          //   />
          // </Stack>
        );
      },
    },
  ];

  const customIconBtns = [
    {
      label: 'Resume Rule',
      icon: resumeIcon,
      isDisabled: true,
    },
    {
      label: 'Pause Rule',
      icon: pauseIcon,
      isDisabled: true,
    },
    {
      label: 'Edit Scheduled Pause',
      icon: ScheduleEditIcon,
      isDisabled: true,
    },
  ];

  const createRuleMenu = [
    {
      label: 'Create New LMS Rule',
      routePath: '/lms/lmsRule/addNewRule',
      isPermission: getPermission(
        actionAllowedItem,
        'LMS',
        'LMS_RULE_RE_TARGET',
        'CRATE_LMS_RULE'
      ),
    },
    {
      label: 'Duplicate LMS Rule',
      routePath: '',
      isPermission: true,
    },
  ];

  const existingLMSRuleItem = [
    'Main Config_R_C4C_Incomplete',
    'Main config_D_FBI',
  ];

  const handleClick = (event: React.MouseEvent<HTMLTableCellElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const NORMAL_PAUSE = 'Pause Now';
  const SCHEDULED_PAUSE = 'Schedule Pause';

  const handleOpenAddRulePopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setIsAddRulePopoverOpen(event.currentTarget);
  };

  const closeAddRulePopover = () => {
    setIsAddRulePopoverOpen(null);
  };

  const onClickButton = (eachBtn: any) => {
    if (eachBtn?.label === 'Resume Rule') {
      setShowResumeModal(true);
    } else if (eachBtn?.label === 'Pause Rule') {
      setShowPauseModal(true);
    } else if (eachBtn?.label === 'Edit Scheduled Pause') {
      setEditSchedulePause(true);
    }
  };

  const openActionModal = () => {
    setIsDuplicateRule(true);
  };

  const toggleOptions = [
    { title: 'All' },
    { title: 'Active' },
    { title: 'Saved' },
    { title: 'Closed' },
  ];

  const resumeSuccessModal = () => {
    setShowResumeSuccessModal(true);
    setShowResumeModal(false);
  };

  const successModal = () => {
    if (pauseMethod === NORMAL_PAUSE) {
      setShowPauseModal(false);
      setEditSchedulePause(false);
      setShowPauseSuccessModal(true);
    }
    if (pauseMethod === SCHEDULED_PAUSE) {
      setShowPauseModal(false);
      setShowScheduledPauseSuccessModal(true);
      setEditSchedulePause(false);
    }
  };

  const pauseMethodChange = (value: any) => {
    setPauseMethod(value);
  };

  const reRouteToCreateRule = () => {
    setIsDuplicateRule(false);
  };

  const datePickerStartFun = (e: any) => {
    setStartDateValue(e);
  };
  const datePickerEndFun = (e: any) => {
    setEndDateValue(e);
  };

  const textareaonchangeFun = (e: any) => {
    setTextAreaValue(e.target.value);
  };

  const nextHandleSuccessFun = () => {
    setIsDuplicateRule(false);
    navigate('/lms/lmsRule/addNewRule');
  };

  return (
    <Stack>
      <Box className="lms-header-container">
        <ScreenHeader
          title="LMS Rule"
          info="From here you can configure policies for rejected and dropped funnel users."
          showBackButton={false}
        />

        <Button
          sx={{ textTransform: 'capitalize' }}
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          id="basic-button"
          onClick={handleOpenAddRulePopover}
        >
          Add New
        </Button>
        {openAddRulePopover && (
          <Popover
            openActionModal={openActionModal}
            id={addNewRuleId}
            open={openAddRulePopover}
            anchorEl={isAddRulePopoverOpen}
            handleClose={closeAddRulePopover}
            options={createRuleMenu}
          />
        )}
      </Box>
      <Stack className="lms-container">
        <HeaderWithInfo
          header="Branch Details"
          isInfoEnabled={false}
          info=""
          isDownloadEnabled={true}
        />
        <Divider sx={{ marginY: 2 }} />
        {/* <Box style={{ marginTop: '20px', display: 'flex' }}>
          {customIconBtns?.map((eachBtn: any) => {
            return (
              <CustomIconButton
                data={eachBtn}
                onClick={() => onClickButton(eachBtn)}
              />
            );
          })}
        </Box> */}
        <ListLMSTable
          customIconBtns={customIconBtns}
          onClickButton={onClickButton}
          data={[...dataList]}
          listColumn={column1}
          statusColumn={column2}
          flag="lms-rule"
          label={product_label}
          toggleOptions={toggleOptions}
        />
      </Stack>
      {isDuplicateRule && (
        <CustomModal
          openSuccess={isDuplicateRule}
          handleCloseSuccess={reRouteToCreateRule}
          title={'Duplicate LMS Rule'}
          duplicate_role_content={'Select the LMS Rule'}
          duplicateRoleCloseBtn={' Close'}
          existingRoleItem={existingLMSRuleItem}
          duplicate_modal_label={'Choose LMS rule for duplication'}
          NextBtn={'Next'}
          nextHandleSuccessFun={nextHandleSuccessFun}
        />
      )}
      {showPauseModal && (
        <CustomModal
          openSuccess={showPauseModal}
          handleCloseSuccess={() => setShowPauseModal(false)}
          handleSuccess={successModal}
          title={'Main Config_R_CIBIL - Pause Rule'}
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
          pauseStatusKey={'Pause Now'}
          endDatevalue={endDatevalue}
          startDatevalue={startDatevalue}
          datePickerStartFun={datePickerStartFun}
          datePickerEndFun={datePickerEndFun}
          textareaonchangeFun={textareaonchangeFun}
          textAreaValue={textAreaValue}
        />
      )}

      {showPauseSuccessModal && (
        <CustomModal
          openSuccess={showPauseSuccessModal}
          handleCloseSuccess={() => setShowPauseSuccessModal(false)}
          successModalTitle={'Main Config_R_CIBIL - Pause Rule'}
          successModalMsg={
            'Your action of pausing - Main Config_R_CIBIL has been successfully sent to the reviewer.'
          }
          btn={' Close'}
        />
      )}
      {showScheduledPauseSuccessModal && (
        <CustomModal
          openSuccess={showScheduledPauseSuccessModal}
          handleCloseSuccess={() => {
            setShowScheduledPauseSuccessModal(false);
          }}
          successModalTitle={'Main Config_R_CIBIL - Scheduled Pause'}
          successModalMsg={
            'Your action of pausing - Main Config_R_CIBIL has been successfully sent to the reviewer.'
          }
          btn={' Close'}
        />
      )}
      {showResumeModal && (
        <CustomModal
          openSuccess={showResumeModal}
          handleCloseSuccess={() => setShowResumeModal(false)}
          title={'Main Config_R_CIBIL - Resume Now'}
          handleSuccess={resumeSuccessModal}
          pause_content={'You will be able to resume your paused rule here.'}
          textarea_title={'Add Remarks'}
          dateRange_title={'Enter Date range'}
          maxLength={'Maximum of 500 words'}
          close={'Close'}
          submit={'Submit'}
        />
      )}
      {showResumeSuccessModal && (
        <CustomModal
          openSuccess={showResumeSuccessModal}
          handleCloseSuccess={() => setShowResumeSuccessModal(false)}
          successModalTitle={'Main Config_R_CIBIL - Resume Now'}
          successModalMsg={
            'Your action of Resuming - Main Config_R_CIBIL has been successfully sent to the reviewer.'
          }
          btn={' Close'}
        />
      )}
      {editSchedulePause && (
        <CustomModal
          openSuccess={editSchedulePause}
          handleCloseSuccess={() => setEditSchedulePause(false)}
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
          endDatevalue={endDatevalue}
          startDatevalue={startDatevalue}
          datePickerStartFun={datePickerStartFun}
          datePickerEndFun={datePickerEndFun}
          textareaonchangeFun={textareaonchangeFun}
          textAreaValue={textAreaValue}
        />
      )}
      {successEditSchedulePause && (
        <CustomModal
          openSuccess={successEditSchedulePause}
          handleCloseSuccess={() => setSuccessEditSchedulePause(false)}
          successModalTitle={`Deactivated- Scheduled Pause`}
          successModalMsg={
            'Your action of Scheduled Pause - Card For Card Surrogate From  DD/MM/YYYTo DD/MM/YYY is successfully sent to reviewer'
          }
          btn={' Close'}
        />
      )}
    </Stack>
  );
}

export default LMSRuleTab;
