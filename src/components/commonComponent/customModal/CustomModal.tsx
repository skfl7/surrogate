import React, { useEffect, useState } from 'react';
import {
  Button,
  Stack,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  InputBase,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import wrong_Info from '../../../assets/images/wrong_Info.svg';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import card_catalogue_sucess_icon from '../../../assets/icons/card_catalogue_sucess_icon.svg';
import card_catalogue_rejecte_icon from '../../../assets/icons/modal_rejected_icon.svg';
import checkedIcon from '../../../assets/icons/check_box_square_icon.svg';
import { ReactComponent as DownArrowIcon } from '../../../assets/icons/dropdownarrow.svg';
import discard_icon from '../../../assets/icons/Vector1.svg';
import close_icon from '../../../assets/icons/cancel.png';
import reject_icon from '../../../assets/icons/Rejection-icon.svg';
import info_icon from '../../../assets/images/info_icon.svg';
import './CustomModal.scss';
import OTPInputContainer from './otpInput/OtpInputContainer';
import TimerComponent from '../../../utils/Timer';
import { ReactComponent as ApprovedIcon } from '../../../assets/icons/approved_risk_mngm_icon.svg';
import moment from 'moment';
import dayjs from 'dayjs';
type Props = {
  openSuccess?: any;
  handleCloseSuccess?: () => void;
  radioValuOne?: string;
  title?: string;
  successModalTitle?: string;
  rejectedModaltitle?: string;
  successModalMsg?: string;
  rejectedModalMsg?: string;
  pause_content?: string;
  radioValuTwo?: string;
  datepickerLabelStart?: string;
  datepickerLabelEnd?: string;
  scheduledPause_content?: string;
  dateRange_title?: string;
  textarea_title?: string;
  maxLength?: string;
  product_label?: Array<any>;
  btn?: string;
  submit?: string;
  close?: string;
  pauseMethodChecking?: any;
  handleSuccess?: any;
  accessLibraryMsg?: string;
  org_ID?: string;
  org_Name?: string;
  channel_type?: string;
  accessLibraryModaBtn?: string;
  changePasswordTitle?: string;
  changePasswordTitleMsg?: string;
  accessLibraryCopyLinkBtn?: string;
  ProceedBtn?: string;
  resentOTP?: string;
  resentOTPmsg?: string;
  enterNewPassword?: string;
  confirmNewPassword?: string;
  forgotPassword?: string;
  accessLibraryLink?: string;
  yesContinueBtn?: string;
  closeBtn?: string;
  discardModalTitle?: string;
  discardModalMsg?: string;
  duplicateRoleCloseBtn?: string;
  duplicate_role_content?: string;
  existingRoleItem?: Array<string>;
  employeeDetailsRowOne?: any;
  employeeDetailsRowTwo?: any;
  addressDetails?: any;
  employeeDetailsRowThree?: any;
  radioValueThree?: string;
  radioValueFour?: string;
  LoadingMsg?: string;
  successMsg?: string;
  tableDataLMSRule?: any;
  pauseStatusKey?: string;
  textAreaHeight?: any;
  modalType?: string;
  duplicate_modal_label?: string;
  closeFunction?: () => void;
  textAreaValue?: any;
  buttonDisabled?: any;
  textareaonchangeFun?: any;
  emailValue?: any;
  handleMouseDownPassword?: any;
  handleClickShowPassword?: any;
  handleClickShowConfirmPassword?: any;
  createValuePassword?: any;
  closeButtonMsg?: string;
  modalContent?: string;
  startDatevalue?: any;
  endDatevalue?: any;
  datePickerStartFun?: any;
  datePickerEndFun?: any;
  NextBtn?: string;
  nextHandleSuccessFun?: any;
  defaultRadio?: string;
  otpValue?: any;
  handleOtpChange?: any;
  handleResend?: any;
  resendTime?: any;
  invalidMessage?: string;
  showOTPError?: boolean;
  showNewPasswordError?: boolean;
  showConfirmPasswordError?: boolean;
  timerSeconds?: any;
  enableResendButton?: boolean;
  setTimerSeconds?: any;
  setEnableResendButton?: any;
  maxWordsExists?: boolean;
  editSchedule?: boolean;
  updatedStartDate?: any;
  updatedEndDate?: any;
  startTimeValue?: any;
  endTimeValue?: any;
  dateErrorMessage?: boolean;
};
export function CustomModal({
  openSuccess,
  handleCloseSuccess,
  radioValuOne,
  title,
  successModalTitle,
  rejectedModaltitle,
  successModalMsg,
  rejectedModalMsg,
  pause_content,
  radioValuTwo,
  datepickerLabelStart,
  datepickerLabelEnd,
  scheduledPause_content,
  dateRange_title,
  textarea_title,
  maxLength,
  product_label,
  btn,
  submit,
  close,
  pauseMethodChecking,
  handleSuccess,
  accessLibraryMsg,
  org_ID,
  org_Name,
  channel_type,
  accessLibraryModaBtn,
  accessLibraryCopyLinkBtn,
  changePasswordTitle,
  changePasswordTitleMsg,
  ProceedBtn,
  resentOTP,
  resentOTPmsg,
  enterNewPassword,
  confirmNewPassword,
  forgotPassword,
  accessLibraryLink,
  yesContinueBtn,
  closeBtn,
  discardModalTitle,
  discardModalMsg,
  duplicateRoleCloseBtn,
  duplicate_role_content,
  existingRoleItem,
  employeeDetailsRowOne,
  addressDetails,
  employeeDetailsRowTwo,
  employeeDetailsRowThree,
  radioValueThree,
  radioValueFour,
  LoadingMsg,
  successMsg,
  tableDataLMSRule,
  pauseStatusKey,
  textAreaHeight,
  modalType,
  duplicate_modal_label,
  closeFunction,
  textAreaValue,
  buttonDisabled,
  textareaonchangeFun,
  emailValue,
  handleMouseDownPassword,
  handleClickShowPassword,
  handleClickShowConfirmPassword,
  createValuePassword,
  closeButtonMsg,
  modalContent,
  startDatevalue,
  endDatevalue,
  datePickerStartFun,
  datePickerEndFun,
  NextBtn,
  nextHandleSuccessFun,
  defaultRadio,
  otpValue,
  handleOtpChange,
  handleResend,
  resendTime,
  invalidMessage,
  showOTPError,
  showNewPasswordError,
  showConfirmPasswordError,
  timerSeconds,
  enableResendButton,
  setTimerSeconds,
  setEnableResendButton,
  maxWordsExists,
  editSchedule,
  updatedStartDate,
  updatedEndDate,
  startTimeValue,
  endTimeValue,
  dateErrorMessage,
}: Props) {
  const [pauseStatus, setPauseStatus] = useState(pauseStatusKey);
  const [existingRole, setexistingRole] = React.useState('');
  const [checkedItems, setCheckedItems] = React.useState<string[]>([]);
  const [otp, setOtp] = useState<number>(0);
  const [showError, setShowError] = useState<boolean>(false);
  const [resentOTPDisabled, setResentOTPDisabled] = useState<boolean>(false);
  const [remarksText, setRemarksText] = React.useState('');
  const [startDate, setStartDate] = React.useState<any>(moment());
  const [endDate, setEndDate] = React.useState<any>(moment());
  const [existingRoleItemValue, setExistingRoleItemValue] = useState('');
  const [error, setError] = useState<string>('');
  const updateTimer = (value: number) => {
    setTimerSeconds(value);
    setEnableResendButton(value === 0 ? true : false);
  };
  useEffect(() => {
    console.log('resendTime', resendTime);
  }, [resendTime]);
  const onChangeOtp = (e: any) => {
    setOtp(e);
    setShowError(false);
  };
  useEffect(() => {
    if (pauseStatus) {
      pauseMethodChecking(pauseStatus);
    }
  }, [pauseStatus]);

  useEffect(() => {
    console.log('dateErrorMessage---out', dateErrorMessage);
    if (dateErrorMessage) {
      setError('Start date and time must be smaller than end date and time!');
      console.log('dateErrorMessage', dateErrorMessage);
    } else {
      setError('');
    }
  }, [dateErrorMessage]);

  const pauseValue = (value: any) => {
    setPauseStatus(value);
  };
  const handleChange = (event: SelectChangeEvent) => {
    setexistingRole(event.target.value);
  };
  const handleChecboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: any
  ) => {
    let checkedOptions = [...checkedItems];
    if (event.target.checked) {
      if (!checkedOptions.some((option: string) => option === item.value))
        checkedOptions.push(item.value);
    } else
      checkedOptions = checkedOptions.filter(
        (option: string) => option !== item.value
      );
    setCheckedItems(checkedOptions);
  };
  const copyToClipboard = (link: any) => {
    navigator.clipboard.writeText(link);
  };
  const handleDateError = (reason: any, value: any) => {
    console.log('handleDateError:', reason, value);
    // if (reason !== null)
    //   setError('Entered date must be greater than current date and time!');
    // if (startDatevalue > endDatevalue) {
    //   setError('Entered date must be greater than current date and time!');
    // } else setError('');
    if (startDatevalue > endDatevalue) {
      if (startTimeValue > endTimeValue) {
        setError('Start date and time must be smaller than end date and time!');
      }
    } else {
      setError('');
    }
  };

  return (
    <Stack className="Modal">
      <Dialog
        open={openSuccess}
        onClose={handleCloseSuccess}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{ maxWidth: 'unset' }}
        fullWidth={
          title == 'Request for Activation' ||
          title == 'Request for Deactivation' ||
          title == 'Add Organisation' ||
          title == 'Duplicate Role' ||
          title == 'Duplicate LMS Rule' ||
          title == 'Employee Details' ||
          title == 'Choose the mode of communication' ||
          title == 'User Traceability - Address Details' ||
          LoadingMsg ||
          tableDataLMSRule
            ? true
            : false
        }
        className="custom-modal"
      >
        <Stack
          py={3}
          className={`${
            successModalMsg || discardModalMsg || rejectedModalMsg
              ? 'modal_container1'
              : ProceedBtn == 'Update' || ProceedBtn === 'Verify'
              ? 'create_newpassword'
              : 'request_Activation_modal'
          }`}
          px={title ? 3 : 0}
        >
          {title && (
            <Typography className="modal-title" component="h1">
              {title}
            </Typography>
          )}
          {(successModalTitle || rejectedModaltitle || discardModalMsg) && (
            <Box
              className="success-reject-title"
              component="img"
              src={
                discardModalMsg
                  ? discard_icon
                  : successModalMsg || accessLibraryModaBtn == 'Link to share'
                  ? card_catalogue_sucess_icon
                  : modalType
                  ? reject_icon
                  : card_catalogue_rejecte_icon
              }
              pb={0}
              width={45}
            ></Box>
          )}
          {duplicateRoleCloseBtn && (
            <Button
              variant="text"
              color="secondary"
              className="duplicateRoleCloseBtn"
              onClick={handleCloseSuccess}
            >
              {duplicateRoleCloseBtn}
            </Button>
          )}
          {duplicate_role_content && (
            <Typography
              className="duplicate_role_content"
              color={'#171717'}
              fontWeight={500}
              sx={{
                paddingTop: '14px',
                fontSize: '12px',
                paddingBottom: '5px',
              }}
            >
              {duplicate_role_content}
            </Typography>
          )}
          {existingRoleItem && (
            <FormControl
              sx={{ minWidth: 120, marginBottom: '20px' }}
              size="small"
            >
              {/* <InputLabel id="demo-select-small">                {existingRole == '' ? duplicate_modal_label : ''}
              </InputLabel> */}
              <Select
                id="demo-select-small"
                value={existingRole}
                onChange={handleChange}
                displayEmpty
                renderValue={(selected: any) => {
                  if (!selected) {
                    return (
                      <Stack
                        sx={{
                          color: '#B3B3B3',
                          fontWeight: '400',
                          fontSize: '14px',
                          letterSpacing: '0.0025em',
                        }}
                      >
                        Choose existing role for duplication
                      </Stack>
                    );
                  }
                  return <Stack>{existingRoleItemValue}</Stack>;
                }}
                IconComponent={(props) => (
                  <DownArrowIcon
                    {...props}
                    style={{
                      marginTop: '2px',
                      marginRight: '4px',
                      padding: '1px',
                    }}
                  />
                )}
              >
                {existingRoleItem.map((value: any) => (
                  <MenuItem
                    style={{
                      border: '1px solid #F0F2F5',
                      paddingTop: '2px',
                      fontSize: '14px',
                    }}
                    value={value}
                    onClick={() => setExistingRoleItemValue(value)}
                  >
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {(employeeDetailsRowOne ||
            employeeDetailsRowTwo ||
            employeeDetailsRowThree) && (
            <Stack className="employee-details-modal">
              {employeeDetailsRowOne && (
                <Box sx={{ marginBottom: '10px' }}>
                  <Grid container spacing={2} mt={1}>
                    {employeeDetailsRowOne.map((item: any) => (
                      <Grid md={4} item>
                        <Typography className="employee-details-key">
                          {item.Key}
                        </Typography>
                        <Typography className="employee-details-value">
                          {item.value}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              {employeeDetailsRowTwo && (
                <Box
                  sx={{
                    borderTop: '2px solid #E9EAEB',
                    borderBottom: '2px solid #E9EAEB',
                    marginTop: '8px',
                    paddingBottom: '12px',
                  }}
                >
                  <Grid container spacing={2} mt={1}>
                    {employeeDetailsRowTwo.map((item: any) => (
                      <Grid md={4} item>
                        <Typography className="employee-details-key">
                          {item.Key}
                        </Typography>
                        <Typography className="employee-details-value">
                          {item.value}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              {employeeDetailsRowThree && (
                <Box>
                  <Grid container spacing={2} mt={1}>
                    {employeeDetailsRowThree.map((item: any) => (
                      <Grid md={4} item>
                        <Typography className="employee-details-key">
                          {item.Key}
                        </Typography>
                        <Typography className="employee-details-value">
                          {item.value}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Stack>
          )}
          {addressDetails && (
            <Box
              sx={{
                marginTop: '8px',
                paddingBottom: '12px',
              }}
            >
              {addressDetails.map((item: any) => (
                <div className="modalContainer">
                  <div className="one">
                    <Typography sx={{ color: '#AFAEAF', fontSize: '12px' }}>
                      {item.Key}
                    </Typography>
                    <Typography
                      sx={{
                        color: ' #151515',
                        fontSize: '14px',
                        fontWeight: '400',
                        marginRight: '8rem',
                      }}
                    >
                      {item.value}
                    </Typography>
                  </div>
                  <div className="one">
                    <Typography
                      className="employee-details-key"
                      sx={{ color: '#AFAEAF', fontSize: '12px' }}
                    >
                      {item.addressSource}
                    </Typography>
                    <Typography
                      sx={{
                        color: ' #151515',
                        fontSize: '14px',
                        fontWeight: '400',
                      }}
                    >
                      {item.billMethod}
                    </Typography>
                    {item.selectedAddress && (
                      <Button
                        startIcon={<ApprovedIcon />}
                        sx={{
                          fontSize: '12px',
                          color: ' #1C592A',
                          backgroundColor: '#E3F3E6',
                          textTransform: 'none',
                          height: '24px',
                          marginTop: '16px',
                        }}
                      >
                        Selected Address
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </Box>
          )}
          {successModalTitle && (
            <DialogContent className="successs-modal-content">
              <DialogContentText
                id="alert-dialog-slide-description"
                className="successs-modal-title"
                align={'center'}
                sx={{
                  padding: {
                    xs: '0 13px',
                  },
                  marginBottom: '18px',
                }}
              >
                {successModalTitle}
              </DialogContentText>
            </DialogContent>
          )}
          {rejectedModaltitle && (
            <DialogContent className="successs-modal-content">
              <DialogContentText
                id="alert-dialog-slide-description"
                className="successs-modal-title"
                align={'center'}
                sx={{
                  padding: {
                    xs: '0 13px',
                  },
                  marginBottom: '5px',
                }}
              >
                {rejectedModaltitle}
              </DialogContentText>
            </DialogContent>
          )}
          {discardModalTitle && (
            <DialogContent sx={{ paddingTop: '18px', paddingBottom: '5px' }}>
              <DialogContentText
                id="alert-dialog-slide-description"
                align={'center'}
                fontSize={16}
                fontWeight={600}
                color="#1d1d1d"
                sx={{
                  padding: {
                    xs: '0 13px',
                  },
                }}
              >
                {discardModalTitle}
              </DialogContentText>
            </DialogContent>
          )}
          {changePasswordTitle && (
            <Stack
              sx={{
                margin: `${
                  ProceedBtn === 'Proceed' ? '20px 60px' : '0px 60px'
                }`,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{ fontSize: '18px', fontWeight: '500', color: '#151515' }}
              >
                {changePasswordTitle}
              </Typography>
              <Button
                variant="text"
                color="secondary"
                sx={{ fontSize: '14px', textTransform: 'capitalize' }}
                onClick={closeFunction}
              >
                {closeButtonMsg}
              </Button>
            </Stack>
          )}
          {changePasswordTitleMsg && (
            <Stack sx={{ margin: '0 60px', textAlign: 'start' }}>
              <InputLabel
                htmlFor="outlined-adornment-amount"
                required={
                  changePasswordTitleMsg ==
                  'Enter the 6-digit OTP sent to your email ID'
                    ? false
                    : true
                }
                className="change_password_titleMsg"
              >
                {changePasswordTitleMsg}
              </InputLabel>
            </Stack>
          )}
          {enterNewPassword && (
            <Stack sx={{ margin: '0 60px' }}>
              <InputLabel
                htmlFor="outlined-adornment-amount"
                required
                className="enter_new_password"
              >
                {enterNewPassword}
              </InputLabel>
              <FormControl sx={{ width: '100%' }} variant="outlined">
                <OutlinedInput
                  size="small"
                  sx={{ height: '45px', fontSize: '14px' }}
                  id="outlined-adornment-password"
                  type={createValuePassword.showPassword ? 'password' : 'text '}
                  value={createValuePassword.password}
                  onChange={textareaonchangeFun('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {createValuePassword.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {showNewPasswordError && (
                <Box className="newlogin-error">
                  <img
                    className="newlogin-error-img"
                    // style={{ width: '0.9375rem', height: '0.9375rem' }}
                    src={wrong_Info}
                    alt="wrong info"
                  />
                  <Typography className="newlogin-error-msg">
                    Should 8 charactor(1 caps, 1 small letter and numeric number
                    )
                  </Typography>
                </Box>
              )}
              <InputLabel
                htmlFor="outlined-adornment-amount"
                required={confirmNewPassword !== '' ? true : false}
                className="confirm_New_Password"
              >
                {confirmNewPassword}
              </InputLabel>
              <FormControl sx={{ width: '100%' }} variant="outlined">
                <OutlinedInput
                  size="small"
                  sx={{ height: '45px', fontSize: '14px' }}
                  id="outlined-adornment-password"
                  type={
                    createValuePassword.showConfirmPassword
                      ? 'password'
                      : 'text '
                  }
                  value={createValuePassword.confirmPassword}
                  onChange={textareaonchangeFun('confirmPassword')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {createValuePassword.showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {showConfirmPasswordError && (
                <Box className="newlogin-error">
                  <img
                    className="newlogin-error-img"
                    // style={{ width: '0.9375rem', height: '0.9375rem' }}
                    src={wrong_Info}
                    alt="wrong info"
                  />
                  <Typography className="newlogin-error-msg">
                    Password do not match
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
          {resentOTP && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '20px 60px 0px 60px',
              }}
            >
              <OTPInputContainer
                otpError={showOTPError}
                otpValue={otpValue}
                onOTPChange={handleOtpChange}
              />
            </Box>
          )}
          {resentOTP && (
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: '10px 60px',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ color: '#D02127', fontSize: '13px' }}>
                <TimerComponent
                  time={timerSeconds}
                  callBackFunction={updateTimer}
                />
              </Typography>
              <Button
                sx={{
                  color: !enableResendButton
                    ? ` #82B1DB !important`
                    : ' #0662B7 !important',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
                disabled={!enableResendButton}
                // onClick={() =>                //   resentOTPDisabled ? console.log('resend otp clicked') : null
                // }
                onClick={handleResend}
              >
                {resentOTP}
              </Button>
            </Stack>
          )}
          {ProceedBtn === 'Proceed' && (
            <Stack sx={{ margin: '0 60px' }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                sx={{ height: '40px', fontSize: '14px' }}
                placeholder={'Ashwin@yesbank.com'}
                onChange={textareaonchangeFun}
                value={emailValue}
              ></TextField>
              {invalidMessage !== '' && (
                <Box
                  sx={{
                    textAlign: 'left',
                    color: '#992d26',
                    padding: '1rem 0',
                    // fontSize: '0.625rem',
                  }}
                >
                  {invalidMessage}
                </Box>
              )}
            </Stack>
          )}
          {showOTPError ? (
            <Box className="otp-error-img">
              <img src={wrong_Info} alt="wrong info" />
              <Typography className="otp-error-text">
                Please enter the correct OTP sent to your registered Email ID
              </Typography>
            </Box>
          ) : (
            ''
          )}
          {(ProceedBtn === 'Verify' ||
            ProceedBtn === 'Proceed' ||
            ProceedBtn === 'Update') && (
            <Stack sx={{ margin: '0 60px' }}>
              <Button
                variant="contained"
                onClick={handleCloseSuccess}
                disabled={
                  ProceedBtn === 'Verify'
                    ? String(otpValue).length === 4
                      ? false
                      : true
                    : buttonDisabled
                }
                style={
                  ProceedBtn == 'Verify' || ProceedBtn === 'Update'
                    ? { marginBottom: '10px' }
                    : { marginBottom: '40px' }
                }
                className="Proceed_button"
                sx={
                  buttonDisabled
                    ? {
                        backgroundColor: '#82B1DB !important',
                        color: '#FFFFFF !important',
                      }
                    : (
                        ProceedBtn === 'Verify'
                          ? String(otpValue).length != 4
                          : ''
                      )
                    ? {
                        backgroundColor: '#82B1DB !important',
                        color: '#FFFFFF !important',
                      }
                    : {
                        backgroundColor: ' #0662B7',
                        color: '#FFFFFF',
                        '&:hover': {
                          backgroundColor: '#0662B7',
                        },
                      }
                }
              >
                {ProceedBtn}
              </Button>
            </Stack>
          )}
          {resentOTPmsg && (
            <Stack sx={{ flexDirection: 'row', margin: '0 60px' }}>
              <Box
                component="img"
                color={'#AFAEAF'}
                src={info_icon}
                width={16}
              ></Box>
              <Typography
                sx={{ fontSize: '10px', color: '#AFAEAF', marginLeft: '6px' }}
              >
                {resentOTPmsg}
              </Typography>
            </Stack>
          )}
          {successModalMsg && (
            <Typography pb={0} className="success_modal_msg">
              {successModalMsg}
            </Typography>
          )}
          {modalContent && (
            <Typography
              fontWeight={400}
              sx={{
                padding: '16px 10px 0 10px',
                color: '#656769',
                fontSize: '13px',
              }}
            >
              {modalContent}
            </Typography>
          )}
          {rejectedModalMsg && (
            <Typography
              fontWeight={400}
              align={'center'}
              pb={0}
              fontSize={12}
              sx={{
                padding: {
                  xs: '0 13px',
                  sm: '0 70px',
                },
                marginBottom: '10px',
                color: '#656769',
                hyphens: 'initial',
              }}
            >
              {rejectedModalMsg}
            </Typography>
          )}
          <Box className="successMsg">
            {successMsg && (
              <Box
                className="successMsg-icon"
                component="img"
                src={card_catalogue_sucess_icon}
                pb={0}
                width={45}
              ></Box>
            )}
            {successMsg && (
              <Box
                className="successicon-closeIcon"
                onClick={handleCloseSuccess}
                component="img"
                src={close_icon}
                width={13}
              ></Box>
            )}
            {successMsg && (
              <Typography
                align={'center'}
                pb={0}
                fontSize={14}
                sx={{
                  padding: {
                    xs: '0 13px',
                    sm: '0 70px',
                  },
                  marginBottom: '10px',
                  color: '#656769',
                  hyphens: 'initial',
                  fontWeight: '500',
                }}
              >
                {successMsg}
              </Typography>
            )}
          </Box>
          {discardModalMsg && (
            <Typography
              fontWeight={400}
              align={'center'}
              pb={0}
              fontSize={12}
              sx={{
                padding: {
                  xs: '0 13px',
                  sm: '0 30px',
                  md: '0 60px',
                },
                hyphens: 'initial',
                color: '#656769',
              }}
            >
              {discardModalMsg}
            </Typography>
          )}
          {LoadingMsg && (
            <>
              <div className="bouncing-loader">
                <div></div> <div></div> <div></div> <div></div>
              </div>
              <Typography align="center" className="loading-msg">
                {LoadingMsg}
              </Typography>
            </>
          )}
          {accessLibraryMsg && (
            <Typography
              align="center"
              sx={{ fontSize: ' 14px', fontWeight: '400', color: '#AFAEAF' }}
            >
              {accessLibraryMsg}
            </Typography>
          )}
          {tableDataLMSRule && (
            <>
              {(title === `Selected DSA's` ||
                title === `Selected Division's` ||
                title === `Selected Fintech Partner's`) && (
                <Box className="search-container-rejection">
                  <Box className="search-box">
                    <SearchIcon className="search-icon" />
                    <InputBase placeholder="Search" fullWidth={true} />
                  </Box>
                </Box>
              )}
              <Table aria-label="collapsible table" className="lmsRule-table">
                <TableHead className="lmsRule-table-header">
                  <TableRow className="lmsRule-tableRow">
                    <TableCell className="lmsRule-table-head">S.No</TableCell>
                    <TableCell className="lmsRule-table-head">
                      {title}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="lmsRule-TableBody">
                  {tableDataLMSRule.map((data: any) => {
                    return (
                      <TableRow sx={{ border: 'none' }}>
                        <TableCell className="lmsRule-tableData">
                          {data.sNo}
                        </TableCell>
                        <TableCell className="lmsRule-tableData">
                          {data.typeAndDSA}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </>
          )}
          {org_ID && org_Name && channel_type && (
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'center',
                fontSize: '14px',
                border: '2px solid #F0F2F5',
                padding: '15px 5px',
                margin: '20px 30px',
                fontWeight: '400',
                width: '550px',
              }}
            >
              <Box sx={{ borderRight: '1px solid #151515', padding: '0 18px' }}>
                Org.ID : {org_ID}
              </Box>
              <Box sx={{ borderRight: '1px solid #151515', padding: '0 18px' }}>
                Org.Name : {org_Name}
              </Box>
              <Box sx={{ padding: '0 16px' }}>
                Channel Type : {channel_type}
              </Box>
            </Stack>
          )}

          {pause_content && (
            <Typography
              className="pause_content"
              sx={{ padding: '16px 0' }}
              fontSize={13}
              color={'#171717'}
              fontWeight={500}
            >
              {pause_content}
            </Typography>
          )}
          {(radioValuOne || radioValuTwo) && (
            <FormControl
              className={`${
                radioValuOne === 'DSA' ? 'modal_form_label' : 'radio-btnlabel'
              }`}
            >
              <Stack pb={1} className="modal-radio-btn">
                <RadioGroup
                  color=""
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={pauseStatus ? pauseStatus : radioValuOne}
                  name="radio-buttons-group"
                  onChange={(e) => pauseValue(e.target.value)}
                  defaultValue={defaultRadio}
                >
                  <FormControlLabel
                    value={radioValuOne}
                    control={<Radio color="secondary" />}
                    label={radioValuOne}
                  />
                  <FormControlLabel
                    value={radioValuTwo}
                    control={<Radio color="secondary" />}
                    label={radioValuTwo}
                  />
                  {radioValueThree && (
                    <>
                      <FormControlLabel
                        value={radioValueThree}
                        control={<Radio color="secondary" />}
                        label={radioValueThree}
                      />
                      <FormControlLabel
                        value={radioValueFour}
                        control={<Radio color="secondary" />}
                        label={radioValueFour}
                      />
                    </>
                  )}
                </RadioGroup>
              </Stack>
            </FormControl>
          )}
          {pauseStatus === radioValuTwo &&
            datepickerLabelStart &&
            datepickerLabelEnd && (
              <Stack>
                <Typography
                  className="pause_content"
                  pb={1}
                  pt={3}
                  fontSize={13}
                  color={'#171717'}
                  fontWeight={500}
                  style={{ borderTop: `1px solid #36363624` }}
                >
                  {scheduledPause_content}
                </Typography>
                <Typography
                  className="textarea_title"
                  fontWeight={600}
                  fontSize={12}
                  pt={1}
                  pb={1}
                >
                  {dateRange_title}
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack
                    className="Modal_datepicker"
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingBottom: '16px',
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item sm={6} className="datepicker_icon">
                        <DateTimePicker
                          renderInput={(props: any) => (
                            <TextField
                              sx={{ fontSize: 1, fontWeight: 400 }}
                              size="small"
                              {...props}
                              fullWidth
                              inputProps={{
                                ...props.inputProps,
                                placeholder: 'Start Date and time',
                              }}
                              InputLabelProps={{ style: { fontSize: 14 } }}
                              readOnly={true}
                              error={false}
                            />
                          )}
                          inputFormat="DD MMM YYYY, hh:mm A"
                          minDateTime={dayjs()}
                          value={startDate}
                          onChange={(value: any) => {
                            setStartDate(value);
                            datePickerStartFun && datePickerStartFun(value);
                          }}
                          reduceAnimations={false}
                          components={{
                            OpenPickerIcon: CalendarTodayOutlinedIcon,
                          }}
                          OpenPickerButtonProps={{
                            style: {
                              color: startDate ? '#0662b7' : '#D2D2D3',
                            },
                          }}
                          onError={handleDateError}
                        />
                      </Grid>
                      <Grid item sm={6} className="datepicker_icon">
                        <DateTimePicker
                          renderInput={(props: any) => (
                            <TextField
                              sx={{ fontSize: '10px' }}
                              size="small"
                              {...props}
                              fullWidth
                              inputProps={{
                                ...props.inputProps,
                                placeholder: 'End Date and time',
                              }}
                              InputLabelProps={{ style: { fontSize: 14 } }}
                              error={false}
                            />
                          )}
                          inputFormat="DD MMM YYYY, hh:mm A"
                          minDateTime={dayjs(startDate)}
                          minTime={dayjs(startDate)}
                          value={endDate}
                          onChange={(value: any) => {
                            setEndDate(value);
                            datePickerStartFun && datePickerEndFun(value);
                          }}
                          reduceAnimations={typeof navigator !== 'undefined'}
                          components={{
                            OpenPickerIcon: CalendarTodayOutlinedIcon,
                          }}
                          OpenPickerButtonProps={{
                            style: {
                              color: endDate ? '#0662b7' : '#D2D2D3',
                            },
                          }}
                          onError={handleDateError}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </LocalizationProvider>
              </Stack>
            )}
          {textarea_title && (
            <Stack
              className="modal-textarea"
              style={textAreaHeight && { marginTop: '20px' }}
            >
              <Typography className="textarea_title">
                {textarea_title}
              </Typography>
              <Grid container>
                <Grid container xs={12}>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={8}
                    style={{
                      width: 538,
                      border: `1px solid #36363624`,
                      height: `${textAreaHeight ? textAreaHeight : '160px'}`,
                      resize: 'none',
                      padding: '5px',
                    }}
                    value={textAreaValue}
                    onChange={(event) => {
                      setRemarksText(event.target.value);
                      textareaonchangeFun(event);
                    }}
                  />
                </Grid>
              </Grid>
              <Stack className="textarea-alertMsg-container">
                <Typography className="textarea-alertMsg">
                  {maxLength}
                </Typography>
                {maxWordsExists && (
                  <Typography className=" textarea-exist-alertMsg ">
                    Please enter maximum of 500 words
                  </Typography>
                )}
                {error.length > 0 && (
                  <Typography className=" textarea-exist-alertMsg ">
                    {error}
                  </Typography>
                )}
              </Stack>
            </Stack>
          )}
          {product_label && (
            <Stack
              sx={{
                borderTop: `1px solid #36363624`,
                borderBottom: `1px solid #36363624`,
                marginBottom: '20px',
              }}
              className={'radio-btnlabel'}
            >
              <FormGroup sx={{ padding: '10px 0' }}>
                <Grid container>
                  {product_label.map((item: any) => {
                    return (
                      item.value !== 'All' && (
                        <Grid
                          item
                          xs={6}
                          sm={product_label.length > 4 ? 4 : 3}
                          key={item.value}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                style={{
                                  transform: 'scale(1.2)',
                                }}
                                sx={{
                                  color: '#A8A8A9',
                                }}
                                // value={checkedItems}
                                checkedIcon={
                                  <img src={checkedIcon} alt={checkedIcon} />
                                }
                                onChange={(event) =>
                                  handleChecboxChange(event, item)
                                }
                              />
                            }
                            label={item.title}
                          />
                        </Grid>
                      )
                    );
                  })}
                </Grid>
              </FormGroup>
            </Stack>
          )}
          <Stack className="modal_buttons">
            {submit && (
              <Button
                onClick={handleCloseSuccess}
                variant="outlined"
                className="close-button"
              >
                {close}
              </Button>
            )}
            {submit && (
              <Button
                variant="contained"
                className="submit-button"
                sx={
                  buttonDisabled
                    ? {
                        backgroundColor: '#82B1DB !important',
                        color: '#FFFFFF !important',
                      }
                    : {
                        backgroundColor: ' #0662B7',
                        color: '#FFFFFF',
                        '&:hover': {
                          backgroundColor: '#0662B7',
                        },
                      }
                }
                onClick={() => {
                  handleSuccess(remarksText, startDate, endDate, checkedItems);
                }}
                disabled={buttonDisabled || error.length > 0}
              >
                {pauseStatus === 'Remove Surrogate' ? 'Remove' : submit}
              </Button>
            )}
          </Stack>
          {btn && (
            <Box className="success-closeBtn-container">
              <Button
                variant="contained"
                className="success-closeBtn"
                onClick={handleCloseSuccess}
              >
                {btn}
              </Button>
            </Box>
          )}
          {NextBtn && (
            <Box className="success-closeBtn-container">
              <Button
                variant="contained"
                className="success-closeBtn"
                onClick={nextHandleSuccessFun}
              >
                {NextBtn}
              </Button>
            </Box>
          )}
          {yesContinueBtn && (
            <Stack className="yes-continue-cta">
              <Stack sx={{ margin: '10px' }}>
                <Button
                  className="close-Cta"
                  variant="outlined"
                  onClick={handleCloseSuccess}
                >
                  {closeBtn}
                </Button>
              </Stack>
              <Stack sx={{ margin: '10px' }}>
                <Button
                  className="succes-cta"
                  variant="contained"
                  onClick={handleSuccess}
                >
                  {yesContinueBtn}
                </Button>
              </Stack>
            </Stack>
          )}
          {accessLibraryModaBtn && (
            <Stack
              className="access-library-container"
              sx={{ margin: '0 30px' }}
            >
              <Typography className="access-library-header">
                {accessLibraryModaBtn}
              </Typography>
              <Grid container sx={{ alignItems: 'center' }}>
                <Grid sm={9}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ height: '40px' }}
                    value={accessLibraryLink}
                    inputProps={{
                      style: {
                        fontSize: '14px',
                        padding: '12.5px 14px',
                        color: '#151515',
                        fontWeight: '400',
                      },
                    }}
                  ></TextField>
                </Grid>
                <Grid sm={3}>
                  <Button
                    variant="contained"
                    className="accessLibraryCopyLinkBtn"
                    onClick={() => copyToClipboard(accessLibraryLink)}
                  >
                    {accessLibraryCopyLinkBtn}
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          )}
        </Stack>
      </Dialog>
    </Stack>
  );
}
export default CustomModal;
