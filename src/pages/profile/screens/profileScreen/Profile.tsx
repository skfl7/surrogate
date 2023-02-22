import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI components
import { Box, IconButton, Stack, Typography, Button } from '@mui/material';

// Assets
import profile_icon from '../../../../assets/icons/profile_icon.svg';
import passwordShow from '../../../../assets/icons/passwordView.svg';

// Styles
import { colors } from '../../../../style/Color';
import './style.scss';

// Common component
import DetailsCard from '../../../../components/commonComponent/DetailsCard';
import CustomModal from '../../../../components/commonComponent/customModal/CustomModal';

// Utils
import { RegexValidation } from '../../../../utils/Regex';

// Services
import {
  emailCheck,
  resendOTP,
  updatePassword,
  verifyOTP,
} from '../../../../services/loginServices';
import localforage from 'localforage';
import { formatDateTime } from '../../../../utils/DateTimeFormatter';

export const personalDetails = {
  title: 'Profile Details',
  icon: true,
  note: 'Lorem ipusm dolor sit amet, consectetur adipiscing elit. Euismod nulla cursus nascetur velit nisl sed',
  details: [
    {
      label: 'Name',
      value: 'Ashwin Kumar',
    },
    {
      label: 'Employee ID',
      value: '231456789021',
    },
    {
      label: 'Designation',
      value: 'Surrogate Manager',
    },
    {
      label: 'User Role',
      value: 'Manager',
    },
    {
      label: 'Reporting Head',
      value: 'Jack',
    },
    {
      label: 'Channel',
      value: 'DSA',
    },
    {
      label: 'Role Access Type',
      value: 'Initiator',
    },
    {
      label: 'Date Of Joining',
      value: '10/05/2020',
    },
    {
      label: 'State',
      value: 'Tamil Nadu',
    },
    {
      label: 'Zone',
      value: 'South Zone',
    },
    {
      label: 'District',
      value: 'Thirchy',
    },
    {
      label: 'Branch',
      value: 'Thirchy',
    },
  ],
};
export const contactDetails = {
  title: 'Contact Details',
  icon: true,
  note: 'Lorem ipusm dolor sit amet, consectetur adipiscing elit. Euismod nulla cursus nascetur velit nisl sed',
  details: [
    {
      label: 'Email Id',
      value: 'Ashwin@abc.com',
    },
    {
      label: 'Mobile No',
      value: '9876543210',
    },
  ],
};
export const Profile = () => {
  const passWord = 'M2P@123';
  const navigate = useNavigate();
  const [passwordView, setPasswordView] = useState(passWord);
  const [changePassWord, setChangePassWord] = useState(false);
  const [changePassWordOtp, setChangePassWordOtp] = useState(false);
  const [createPassword, setCreatePassword] = useState(false);
  const [successModel, setSuccessModel] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpValue, setOtpValue] = useState(0);
  const [resendToggle, setResendToggle] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [emailValue, setEmailValue] = useState('');
  const [showEmailError, setShowEmailError] = useState('');
  const [showNewPassError, setShowNewPassError] = useState(false);
  const [showConfirmPassError, setShowConfirmPassError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<any>({});
  const [newPasswordButtonDisabled, setNewPasswordButtonDisabled] =
    useState<boolean>(true);
  const [showOtpError, setShowOtpError] = useState<boolean>(false);
  const [createValuePassword, setCreateValuePassword] = React.useState<any>({
    password: '',
    confirmPassword: '',
    showPassword: true,
    showConfirmPassword: true,
  });

  const onChangeOtp = (e: any) => {
    setOtpValue(e);
  };
  useEffect(() => {
    updateButtonStatus();
  }, [emailValue]);

  useEffect(() => {
    setResendTimer(30);
  }, [resendToggle]);

  // useEffect(() => {}, [changePassWordOtp]);

  useEffect(() => {
    getLocalStorageID();
  }, []);
  const getLocalStorageID = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      console.log('userrrrrrr', value);
      setUser(value);
    } catch (err) {
      console.log(err);
    }
  };

  const updateButtonStatus = () => {
    setButtonDisabled(
      emailValue.match(RegexValidation.EmailPattern) ? false : true
    );
  };
  const textareaonchangeFun = (e: any) => {
    setEmailValue(e.target.value);
  };

  const handleClickOpen = () => {
    setEmailValue('');
    setChangePassWord(true);
  };

  const closeFunction = () => {
    setChangePassWord(false);
    setChangePassWordOtp(false);
    setCreatePassword(false);
    setSuccessModel(false);
    setEmailValue('');
  };
  const backButtonVerify = () => {
    setChangePassWordOtp(false);
    setChangePassWord(true);
  };
  const backButtonCreatePassword = () => {
    setCreatePassword(false);
    setChangePassWordOtp(true);
  };

  const [sendOTPCount, setSendOTPCount] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [enableResendButton, setEnableResendButton] = useState<boolean>(false);

  const onResendOTP = () => {
    setResendToggle(!resendToggle);
    let payload = {
      email: emailValue,
    };

    let count = sendOTPCount + 1;

    if (count === 3) {
      //todo show alert
      setEnableResendButton(false);
    } else {
      setSendOTPCount(count);
      setTimerSeconds(30);

      resendOTP(payload)
        .then((response) => {
          console.log('verify res', response);
        })

        .catch((err) => {
          console.log('error', err);
        });
    }
  };

  const ChangePasswordHandleCloseSuccess = () => {
    setOtpValue(0);
    let payload = {
      email: emailValue,
    };
    emailCheck(payload)
      .then((response) => {
        setChangePassWord(false);
        setChangePassWordOtp(true);
        // setEmailValue('');
      })
      .catch((err) => {
        setShowEmailError(err.response.data.exception.detailMessage);
      });
  };
  const verifyModel = () => {
    let payload = {
      email: emailValue,
      otp: otpValue,
    };
    verifyOTP(payload)
      .then((response) => {
        let res = response?.data?.result?.userId;
        setUserId(res);
        setChangePassWordOtp(false);
        setCreatePassword(true);
      })
      .catch((err) => {
        setShowOtpError(true);
      });
  };
  const UpdatehandleCloseSuccess = () => {
    let payload = {
      userId: userId,
      password: createValuePassword.password,
    };
    updatePassword(payload)
      .then((response) => {
        setCreatePassword(false);
        setSuccessModel(true);
        setCreateValuePassword({
          password: '',
          confirmPassword: '',
        });
      })
      .catch((err) => {
        console.log(' error', err);
      });
  };
  const handleSuccessModel = () => {
    navigate('/portal/login');
    setSuccessModel(false);
  };
  const viewPassword = () => {
    setShowPassword(!showPassword);
    setCreateValuePassword({
      password: '',
      confirmPassword: '',
    });
  };

  // const onResendOtp = () => {
  //   let count = sendOTPCount + 1;

  //   if (count === 3) {
  //     //todo show alert
  //     setEnableResendButton(false);
  //   } else {
  //     setSendOTPCount(count);
  //     setTimerSeconds(30);
  //     let payload = {
  //       email: 'vigneshallu0@gmail.com',
  //     };

  //     resendOTP(payload)
  //       .then((response) => {
  //         console.log('verify res', response);
  //       })
  //       .catch((err) => {
  //         console.log('error', err);
  //       });
  //   }
  // };

  const renderPassWord = () => {
    if (!showPassword) {
      return passwordView.split('').map(() => <>*</>);
    }
    return passwordView;
  };

  useEffect(() => {
    setNewPasswordButtonDisabled(
      createValuePassword.password.match(
        RegexValidation.loginPasswordPattern
      ) && createValuePassword.confirmPassword === createValuePassword.password
        ? false
        : true
    );

    if (createValuePassword.password) {
      let check = createValuePassword.password.match(
        RegexValidation.loginPasswordPattern
      );
      if (!check) {
        setShowNewPassError(true);
      } else {
        setShowNewPassError(false);
      }
    }
    if (createValuePassword.confirmPassword) {
      let checkPass =
        createValuePassword.password === createValuePassword.confirmPassword;
      if (!checkPass) {
        setShowConfirmPassError(true);
      } else {
        setShowConfirmPassError(false);
      }
    }
  }, [createValuePassword.password, createValuePassword.confirmPassword]);

  const createNewPasswordOnchangeFun =
    (prop: keyof any) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCreateValuePassword({
        ...createValuePassword,
        [prop]: event.target.value,
      });
    };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setCreateValuePassword({
      ...createValuePassword,
      showPassword: !createValuePassword.showPassword,
    });
  };

  const handleClickShowConfirmPassword = () => {
    setCreateValuePassword({
      ...createValuePassword,
      showConfirmPassword: !createValuePassword.showConfirmPassword,
    });
  };

  return (
    <Stack sx={{ backgroundColor: colors.bgGrey }} className="profileContainer">
      <Stack>
        <Box
          className="headerContainer"
          sx={{
            backgroundColor: colors.white,
          }}
        >
          <Stack>
            <img src={profile_icon} alt="Profile" />
          </Stack>
          <Stack className="headerContent">
            <Typography className="userName">
              {user?.personalDetails?.employeeName || '-'}
            </Typography>
            <Typography
              className="userRole"
              sx={{ color: colors.textGreyHeader }}
            >
              {user?.employeeDetails?.designation || '-'}
              <span style={{ color: 'black' }}>{`, Employee ID: `}</span>
              {user?.personalDetails?.employeeId || '-'}
            </Typography>
          </Stack>
        </Box>

        <Stack className="section-details">
          <Stack>
            <Typography className="section-header">Profile Details</Typography>
          </Stack>
          <Box
            sx={{
              marginBottom: '10px',
            }}
          >
            <Box mt={1} className="details-container">
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">Name</Typography>
                  <Typography className="item-value">
                    {user?.personalDetails?.employeeName || '-'}
                  </Typography>
                </Box>
              </Box>
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">Employee ID</Typography>
                  <Typography className="item-value">
                    {user?.personalDetails?.employeeId || '-'}
                  </Typography>
                </Box>
              </Box>
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">Designation</Typography>
                  <Typography className="item-value">
                    {user?.employeeDetails?.designation || '-'}
                  </Typography>
                </Box>
              </Box>
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">User Role</Typography>
                  <Typography className="item-value">
                    {user?.roleType || '-'}
                  </Typography>
                </Box>
              </Box>
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">Reporting Head</Typography>
                  <Typography className="item-value">
                    {user?.reportingTo?.personalDetails?.employeeName || '-'}
                  </Typography>
                </Box>
              </Box>
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">Channel</Typography>
                  <Typography className="item-value">
                    {user?.channelAccessible?.toString() || '-'}
                  </Typography>
                </Box>
              </Box>
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">
                    Role Access Type
                  </Typography>
                  <Typography className="item-value">
                    {user?.roleAccessType || '-'}
                  </Typography>
                </Box>
              </Box>
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">
                    Date Of Joining
                  </Typography>
                  <Typography className="item-value">
                    {user?.employeeDetails?.dateOfJoining
                      ? formatDateTime(user?.employeeDetails?.dateOfJoining)
                      : '-'}
                  </Typography>
                </Box>
              </Box>
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">State</Typography>
                  <Typography className="item-value">
                    {user?.state?.map((st: any) => st.stateName)?.toString() ||
                      '-'}
                  </Typography>
                </Box>
              </Box>
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">Zone</Typography>
                  <Typography className="item-value">
                    {user?.zone?.toString() || '-'}
                  </Typography>
                </Box>
              </Box>
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">District</Typography>
                  <Typography className="item-value">
                    {user?.city?.map((ct: any) => ct.cityName)?.toString() ||
                      '-'}
                  </Typography>
                </Box>
              </Box>
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">Branch</Typography>
                  <Typography className="item-value">
                    {user?.branch?.toString() || '-'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Stack>
        {/* <DetailsCard data={contactDetails} gridColumn={2} /> */}
        <Stack className="section-details">
          <Stack>
            <Typography className="section-header">Contact Details</Typography>
          </Stack>
          <Box
            sx={{
              marginBottom: '10px',
            }}
          >
            <Box mt={1} className="details-container">
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">Name</Typography>
                  <Typography className="item-value">
                    {user?.personalDetails?.employeeName || '-'}
                  </Typography>
                </Box>
              </Box>
              <Box className="detail-item">
                <Box>
                  <Typography className="item-label">Employee ID</Typography>
                  <Typography className="item-value">
                    {user?.personalDetails?.employeeId || '-'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Stack>

        <Stack
          sx={{
            backgroundColor: colors.white,
            margin: '30px 0',
          }}
        >
          <Stack className="profile-accountHeader">
            <Stack className="profile-header">Account Password</Stack>
            <Stack>
              <Stack className="profile-password">Password</Stack>

              <Stack className="ProfilepasswordStyle">
                <Stack className="passwordDetailsStyle">
                  <Stack className="profile-info-value" sx={{ width: '100px' }}>
                    <Typography>{renderPassWord()}</Typography>
                  </Stack>
                  <Stack>
                    <IconButton
                      sx={{ padding: '0', marginLeft: '20px' }}
                      onClick={viewPassword}
                    >
                      <img src={passwordShow} alt="password" />
                    </IconButton>
                  </Stack>
                </Stack>
                <Stack>
                  <Button
                    className="profile-changePassword"
                    variant="text"
                    size="small"
                    onClick={handleClickOpen}
                    // sx={{ color: '#0662B7' }}
                  >
                    Change Password
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      {changePassWord && (
        <CustomModal
          openSuccess={changePassWord}
          handleCloseSuccess={ChangePasswordHandleCloseSuccess}
          changePasswordTitle={'Change Password'}
          changePasswordTitleMsg={
            'Enter registered mobile number/email ID to receive OTP)'
          }
          ProceedBtn={'Proceed'}
          closeButtonMsg={'Close'}
          closeFunction={closeFunction}
          buttonDisabled={buttonDisabled}
          textareaonchangeFun={textareaonchangeFun}
          invalidMessage={showEmailError}
          emailValue={emailValue}
        />
      )}
      {changePassWordOtp && (
        <CustomModal
          openSuccess={changePassWordOtp}
          handleCloseSuccess={verifyModel}
          changePasswordTitle={'Change Password'}
          changePasswordTitleMsg={'Enter the 4-digit OTP sent to your email ID'}
          ProceedBtn={'Verify'}
          handleResend={onResendOTP}
          resendTime={resendTimer}
          resentOTP={'Resent OTP'}
          timerSeconds={timerSeconds}
          enableResendButton={enableResendButton}
          setTimerSeconds={setTimerSeconds}
          setEnableResendButton={setEnableResendButton}
          resentOTPmsg={
            'Please enter the correct OTP sent to your registered email ID'
          }
          showOTPError={showOtpError}
          closeButtonMsg={'Back'}
          closeFunction={backButtonVerify}
          otpValue={otpValue}
          handleOtpChange={onChangeOtp}
        />
      )}

      {createPassword && (
        <CustomModal
          openSuccess={createPassword}
          handleCloseSuccess={UpdatehandleCloseSuccess}
          changePasswordTitle={'Create New Password'}
          ProceedBtn={'Update'}
          resentOTPmsg={
            ' Password should be 8 characters, including 1 Caps, 1 lowercase, 1 numeral, 1 Special character'
          }
          enterNewPassword={'Enter New Password'}
          confirmNewPassword={'Confirm New Password'}
          forgotPassword={'Forgot Password?'}
          closeButtonMsg={'Back'}
          showNewPasswordError={showNewPassError}
          showConfirmPasswordError={showConfirmPassError}
          closeFunction={backButtonCreatePassword}
          textareaonchangeFun={createNewPasswordOnchangeFun}
          handleMouseDownPassword={handleMouseDownPassword}
          handleClickShowPassword={handleClickShowPassword}
          handleClickShowConfirmPassword={handleClickShowConfirmPassword}
          buttonDisabled={newPasswordButtonDisabled}
          createValuePassword={createValuePassword}
        />
      )}
      {successModel && (
        <CustomModal
          openSuccess={successModel}
          handleCloseSuccess={handleSuccessModel}
          successModalTitle={'Password Changed'}
          successModalMsg={'Please log in with new password'}
          btn={' Login'}
          closeFunction={closeFunction}
        />
      )}
    </Stack>
  );
};
