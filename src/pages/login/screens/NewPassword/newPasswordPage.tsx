import React, { useEffect, useState } from 'react';
import './Newpassword.scss';
import {
  Box,
  Typography,
  Button,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import Yesbank from '../../../../assets/images/Yes_Bank_SVG_Logo 1.svg';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import { useLocation, useNavigate } from 'react-router-dom';
import info_grey from '../../../../assets/images/info_grey.svg';
import Poweredby from '../../../../assets/images/Powered by.svg';
import { RegexValidation } from '../../../../utils/Regex';
import { updatePassword } from '../../../../services/loginServices';
import wrong_info from '../../../../assets/images/wrong_Info.svg';

interface State {
  amount: string;
  password: string;
  confirmPassword: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export const NewPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [validOtp, setValidOtp] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [values, setValues] = useState<State>({
    amount: '',
    password: '',
    confirmPassword: '',
    weight: '',
    weightRange: '',
    showPassword: false,
    showConfirmPassword: false,
  });

  useEffect(() => {
    if (newPassword) {
      let newPassCheck = newPassword.match(
        RegexValidation.loginPasswordPattern
      );
      if (newPassCheck) {
        setNewPasswordError(false);
      } else {
        setNewPasswordError(true);
      }
    }
    if (confirmPassword) {
      let confirmPassCheck = confirmPassword === newPassword;
      if (confirmPassCheck) {
        setConfirmPasswordError(false);
      } else {
        setConfirmPasswordError(true);
      }
    }
  }, [newPassword, confirmPassword]);

  const handlePasswordChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
      setNewPassword(event.target.value);
    };
  const handleConfirmPasswordChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
      setConfirmPassword(event.target.value);
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
    console.log(newPassword, 'newPassword');
    console.log(confirmPassword, 'confirmPassword');
    console.log(
      'validateFields',
      newPassword.match(RegexValidation.loginPasswordPattern)
    );
    let payload = {
      userId: state.id ?? '636a04a14858000206804c50',
      password: newPassword,
    };
    updatePassword(payload)
      .then((response) => {
        console.log('update response', response);
        navigate('/portal/login');
      })
      .catch((err) => {
        console.log(' error', err);
      });
    // setValidOtp(true);
    // if (!showError) {
    //   setShowError(true);
    // }
    // if (showError) {
    //   setValidOtp(true);
    // }
  };

  const handleDisableBtn = () => {
    if (newPassword === confirmPassword) {
      setButtonDisabled(false);
    }
  };

  return (
    <Box className="newpassword-container">
      <Box className="newpassword-head">
        <Box>
          <img src={Yesbank} alt="logo" />
          <Typography className="logo-text">Surrogate Portal</Typography>
        </Box>

        <Box>
          <Box className="password-header">
            <Box className="head-left">
              <Typography sx={{fontSize:'20px',fontWeight:500}}>Enter New Password</Typography>
            </Box>
            <Box>
              <Button
                className="head-right"
                onClick={() => navigate('/portal/login/otp')}
              >
                Back
              </Button>
            </Box>
          </Box>
          <Box className="text-field">
            <Box className="text-new-password-container">
              <InputLabel
                sx={{marginTop:'30px'}}
                className="text-new-password"
                required
                htmlFor="outlined-adornment-password"
              >
                Enter New Password
              </InputLabel>
              <OutlinedInput
                className="input-new-password"
                id="outlined-adornment-password"
                placeholder="Enter New Password"
                sx={{
                  border: newPasswordError ? '#992d26 1px solid' : '',
                  fontSize:'14px', fontWeight:400,lineHeight: '16px'
                }}
                // sx={passwordBorder}
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handlePasswordChange('password')}
                size="small"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {newPasswordError && (
                <Box className="newlogin-error">
                  <img
                    className="newlogin-error-img"
                    // style={{ width: '0.9375rem', height: '0.9375rem' }}
                    src={wrong_info}
                  />
                  <Typography className="newlogin-error-msg">
                    Should 8 charactor(1 caps, 1 small letter and numeric number
                    )
                  </Typography>
                </Box>
              )}
            </Box>
            <Box className="text-confirm-password-container">
              <InputLabel
                className="text-confirm-password"
                sx={{ color: 'black' }}
                required
                htmlFor="outlined-adornment-confirm-password"
              >
                Confirm New Password
              </InputLabel>
              <OutlinedInput
                className="input-confirm-password"
                sx={{
                  width: '340px',
                  border: confirmPasswordError ? '#992d26 1px solid' : '',
                  fontSize:'14px', fontWeight:400,lineHeight: '16px'
                }}
                id="outlined-adornment-confirm-password"
                placeholder="Re-enter New Password"
                type={values.showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleConfirmPasswordChange('confirmPassword')}
                size="small"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                      edge="end"
                    >
                      {values.showConfirmPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {confirmPasswordError && (
                <Box className="newlogin-error">
                  <img
                    className="newlogin-error-img"
                    // style={{ width: '0.9375rem', height: '0.9375rem' }}
                    src={wrong_info}
                  />
                  <Typography className="newlogin-error-msg">
                    Password do not match
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          <Box className="footer">
            <Button
              disabled={
                !newPasswordError &&
                !confirmPasswordError &&
                newPassword === confirmPassword &&
                newPassword !== '' &&
                confirmPassword !== ''
                  ? false
                  : true
              }
              onClick={submitPassword}
              fullWidth
              variant="contained"
              color="secondary"
              // className="footer-button"
              className={`${newPasswordError ? "footer-error" : "footer-button"}`}
              sx={{
                '&:disabled': {
                  backgroundColor: '#82B1DB',
                },
                height:'42px'
              }}
            >
              Update
            </Button>
            {}
            <Box className="footer-info">
              <img src={info_grey} />
              <Typography className="footer-info-message">
                Password should be 8 characters, including 1 caps, 1 lowercase,
                1 numeral.
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
};
