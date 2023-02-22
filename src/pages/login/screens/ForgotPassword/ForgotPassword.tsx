import React, { useState } from 'react';
import './ForgotPassword.scss';
import { Box, Typography, Button, TextField } from '@mui/material';
import { verification } from '../../../../utils/Constants';
import { useLocation, useNavigate } from 'react-router-dom';
import Yesbank from '../../../../assets/images/Yes_Bank_SVG_Logo 1.svg';
import Poweredby from '../../../../assets/images/Powered by.svg';
import { emailCheck } from '../../../../services/loginServices';
import { RegexValidation } from '../../../../utils/Regex';

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

export const ForgotPassword = () => {
  const [forgetPassword, setForgetPassword] = useState<boolean>(false);
  const [emailText, setEmailText] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  const submitButtonAction = () => {
    let payload = {
      email: emailText,
    };
    emailCheck(payload)
      .then((response) => {
        const content = location?.state?.content ?? verification.VERIFY;
        navigate('/portal/login/otp', {
          state: { content: content, email: emailText },
        });
      })
      .catch((err) => {
        setErrorMsg(err.response.data.exception.detailMessage);
      });
  };
  const onChangeEmail = (e: any) => {
    const value = e?.target?.value ?? '';
    if (RegexValidation.EmailPattern.test(value)) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
    setEmailText(value);
    setShowError(false);
  };
  return (
    <Box sx={{width:'60%',height:'62%'}} > 
      <Box className="forgotpassword-container">
        <Box className="forgotpassword-heading">
          <Box>
            <img src={Yesbank} alt="logo" />
            <Typography className="forgotpassword-heading-text">
              Surrogate Portal
            </Typography>
          </Box>

          <Box className="forgot-head">
            <Box className="forgot-head-left">
              <Typography sx={{fontSize:'20px',fontWeight:500}}>Forgot Password</Typography>
            </Box>   
            <Box>
              <Button
                className="forgot-head-right"
                onClick={() => navigate('/portal/login')}
              >
                Back
              </Button>
            </Box>
          </Box>

          <Box>
            <Typography className="forgot-text">
              Enter registered mobile number/email ID to receive OTP
              <span style={{ color: '#D02127' }}>*</span>
            </Typography>
            <TextField
              onChange={onChangeEmail}
              size="small"
              fullWidth
              placeholder="Enter Email Id"
              sx={{paddingBottom:'0.4rem',width:'21.25rem',fontSize:'14px', fontWeight:400,lineHeight: '16px'}}
            />
          </Box>
          {errorMsg !== '' && (
            <Box className="otp-error-img">
              <Typography className="forgot-error-text">{errorMsg}</Typography>
            </Box>
          )}
          <Box className={`${errorMsg === '' ? 'footer' : 'invalidMsg'}`}>
            <Button
              onClick={submitButtonAction}
              fullWidth
              variant="contained"
              color="secondary"
              disabled={buttonDisabled}
              className="footer-button"
              sx={{
                '&:disabled': {
                  backgroundColor: '#82B1DB',
                },
                height: '42px',
                fontSize:'14px'
              }}
            >
              Proceed
            </Button>
          </Box>
        </Box>

        <Box
          className="footer_img"
          sx={{ position: 'absolute', bottom: 20, right: 20 }}
        >
          <img src={Poweredby} />
        </Box>
      </Box>

    </Box>
    
  );
};
