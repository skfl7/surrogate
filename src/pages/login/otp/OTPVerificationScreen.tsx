import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import './otp.scss';
// import OTPInputContainer from '../../userManagement/orgStructure/screens/OrgReview/otpVerificationScreen/OTPInputContainer';
import OTPInputContainer from './OTPInputContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import TimerComponent from '../../../utils/Timer';
import Poweredby from '../../../assets/images/Powered by.svg';
import Yesbank from '../../../assets/images/Yes_Bank_SVG_Logo 1.svg';
import { verification } from '../../../utils/Constants';
import info_grey from '../../../assets/images/info_grey.svg';
import wrong_Info from '../../../assets/images/wrong_Info.svg';
import { resendOTP, verifyOTP } from '../../../services/loginServices';
interface State {
  amount: string;
  password: string;
  confirmPassword: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}
export default function OtpVerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [enableResendButton, setEnableResendButton] = useState<boolean>(false);
  const [mobileNo, setMobileNo] = useState<string>('+91 *******210');
  const [forgetEmail, setForgetEmail] = useState(true);
  const [emailText, setEmailText] = useState('');
  const [otp, setOtp] = useState<number>(0);
  // const
  const [showError, setShowError] = useState<boolean>(false);
  const [otpStatus, setOtpStatus] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validOtp, setValidOtp] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [sendOTPCount, setSendOTPCount] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(30);

  const updateTimer = (value: number) => {
    setTimerSeconds(value);
    setEnableResendButton(value === 0 ? true : false);
  };
  useEffect(() => {
    setEmailText(location?.state?.email ?? 'vigneshallu0@gmail.com');
  }, []);

  // console.log('enableResendButton', location.state.email);
  const [values, setValues] = useState<State>({
    amount: '',
    password: '',
    confirmPassword: '',
    weight: '',
    weightRange: '',
    showPassword: false,
    showConfirmPassword: false,
  });
  const handlePasswordChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };
  const handleConfirmPasswordChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleClickShowConfirmPassword = () => {
    setValues({
      ...values,
      showConfirmPassword: !values.showConfirmPassword,
    });
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseDownConfirmPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const submitPassword = () => {
    // setValidOtp(true);
    if (!showError) {
      setShowError(true);
    }
    if (showError) {
      setValidOtp(true);
    }
  };
  const submitButtonAction = () => {
    const content = location?.state?.content ?? verification.VERIFY;
    navigate('/verification', {
      state: { content: content },
    });
  };
  useEffect(() => {
    updateButtonStatus();
  }, [otp]);
  const updateButtonStatus = () => {
    setButtonDisabled(otp && String(otp).length === 4 ? false : true);
  };
  const onChangeOtp = (e: any) => {
    setOtp(e);
    setShowError(false);
  };
  const [resendVisible, setResendVisible] = useState(true);
  const onChangeVerify = () => {
    let payload = {
      email: emailText ?? 'vigneshallu0@gmail.com',
      otp: otp,
    };
    verifyOTP(payload)
      .then((response: any) => {
        let res = response?.data?.result?.userId;
        navigate('/portal/login/newpassword', { state: { id: res } });
      })
      .catch((err) => {
        setShowError(true);
      });
  };

  const onResendOtp = () => {
    let count = sendOTPCount + 1;

    if (count === 3) {
      //todo show alert
      setEnableResendButton(false);
    } else {
      setSendOTPCount(count);
      setTimerSeconds(30);
      let payload = {
        email: emailText,
      };

      resendOTP(payload)
        .then((response) => {
          console.log('verify res', response);
        })
        .catch((err) => {
          console.log('error', err);
        });
    }
  };

  return (
    <Box className="otp-container">

  <Box className="otp-head-container">
     <Box className="otp-logo-container">
       <Box>
         <img src={Yesbank} alt="logo" />
         <Typography className="otp-logo-text">Surrogate Portal</Typography>
       </Box>
       
         <Box className="otp-forgot-box">
           <Box className="otp-forgot-left">
             <Typography sx={{fontSize:'20px',fontWeight:500}}>Forgot Password</Typography>
           </Box>
           <Box>
            <Button
              onClick={() => navigate('/portal/login/forgot')}
              className="otp-forgot-right"
            >
              Back
            </Button>
          </Box>
        </Box>
        <Box sx={{width:'100%'}}>
          <Box
            className="otp-6-digit"
            style={{ backgroundColor: 'success.light' }}
          >
            <Typography className="otp-6-digit-text">
              Enter the 4-digit OTP sent to your email ID
            </Typography>
            <OTPInputContainer
              otpError={showError}
              otpValue={otp}
              onOTPChange={onChangeOtp}
            />
            <Box className="otp-timer">
              <Box>
                <TimerComponent
                  time={timerSeconds}
                  callBackFunction={updateTimer}
                />
              </Box>
              <Box>
                <Button
                  className="otp-resend"
                  disabled={!enableResendButton}
                  onClick={onResendOtp}
                  sx={{
                    fontSize: '14px',
                    color: !enableResendButton
                      ? ` #82B1DB !important`
                      : ' #0662B7 !important',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Resend OTP
                </Button>
              </Box>
            </Box>
          </Box>

          {showError ? (
            <Box className="otp-error-img">
              <img src={wrong_Info} />
              <Typography className="otp-error-text">
                Please enter the correct OTP sent to your registered Email
                ID
              </Typography>
            </Box>
          ) : (
            <Box className="otp-error-img"></Box>
          )}

         
        </Box>
        <Box className="otp-btn-box" >
            <Button
              className="otp-btn"
              // onClick={submitPassword}
              onClick={onChangeVerify}
              fullWidth
              variant="contained"
              color="secondary"
              disabled={buttonDisabled}
              sx={{
                '&:disabled': {
                  backgroundColor: '#82B1DB',
                },
              }}
            >
              Verify
            </Button>
            { }
            <Box className="otp-info">
              <img className="otp-info-img" src={info_grey} />
              <Typography className="otp-info-text">
                Please enter the correct OTP sent to your registered email
                ID
              </Typography>
            </Box>
          </Box>
    </Box>
    
  </Box>
  

  <Box className="footer-img">
    <img src={Poweredby} />
  </Box>
</Box>
    
  );
}