import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localForage from 'localforage';

// MUI components
import {
  Box,
  Typography,
  Button,
  TextField,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';

// Styles
import './NewLogin.scss';

// Assets
import Yesbank from '../../../../assets/images/Yes_Bank_SVG_Logo 1.svg';
import wrong_info from '../../../../assets/images/wrong_Info.svg';
import Poweredby from '../../../../assets/images/Powered by.svg';

// Services
import { loginUser } from '../../../../services/loginServices';

// Utils
import { RegexValidation } from '../../../../utils/Regex';
import moment from 'moment';
interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

export const NewLogin = () => {
  const [email, setEmail] = useState(false);
  const [password, setPassword] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const [values, setValues] = React.useState<State>({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  // useEffect(() => {
  //   let checkPass = passwordValue.match(RegexValidation.loginPasswordPattern);
  //   if (checkPass) {
  //     setPasswordError(false);
  //   } else {
  //     if (passwordValue !== '') {
  //       setPasswordError(true);
  //     }
  //   }
  // }, [passwordValue]);

  const onhandlechangeFun = (e: any) => {
    setEmailValue(e.target.value);
  };
  const loginChange = () => {
    let payload = {
      email: emailValue,
      password: passwordValue,
    };
    loginUser(payload)
      .then((response) => {
        if (response.data.result) {
          const res = response.data.result;
          res.endTime = moment()
            .add(30, 'minutes')
            .format('DD/MM/YYYY HH:mm:ss');
          localStorage.setItem('isLoggedin', 'true');
          localForage
            .setItem('loggedinUser', res)
            .then((value: any) => {
              console.log('value', value);
              navigate('/portal');
            })
            .catch((error: any) => {
              console.log('error', error);
            });
        }
      })
      .catch((err) => {
        console.log('error', err);
        setInvalidMessage(err.response.data.exception.detailMessage);
      });
    // setEmail(true);
    // setPassword(true);
  };

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
      setPasswordValue(event.target.value);
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <Box sx={{ width: '60%', height: '62%' }}>
      <Box className="newlogin-container">
        <Box className="newlogin-header">
          <Box>
            <img src={Yesbank} alt="logo" />
            <Typography className="newlogin-logo-text">
              Surrogate Portal
            </Typography>
          </Box>

          <Box>
            <Typography className="newlogin-heading">
              Login to your account
            </Typography>
          </Box>

          <Box className="newlogin-content">
            <Box>
              <InputLabel className="newlogin-content-text" required>
                Email Id
              </InputLabel>
              <TextField
                required
                error={email ? true : false}
                size="small"
                className="newlogin-content-textfield"
                placeholder="Enter Email Id"
                sx={{ fontSize: '14px', fontWeight: 400, lineHeight: '16px' }}
                onChange={onhandlechangeFun}
              />
              {email && (
                <Box className="newlogin-error">
                  <img
                    className="newlogin-error-img"
                    // style={{ width: '0.9375rem', height: '0.9375rem' }}
                    src={wrong_info}
                    alt="error"
                  />
                  <Typography className="newlogin-error-msg">
                    Error Mismatch
                  </Typography>
                </Box>
              )}
            </Box>

            <Box className="newlogin-password">
              <InputLabel
                className="newlogin-password-text"
                required
                htmlFor="outlined-adornment-password"
              >
                Password
              </InputLabel>
              <OutlinedInput
                className="newlogin-password-field"
                id="outlined-adornment-password"
                placeholder="Enter Password"
                sx={{ fontSize: '14px', fontWeight: 400, lineHeight: '16px' }}
                type={values.showPassword ? 'text' : 'password'}
                // value={values.password}
                onChange={handleChange('password')}
                size="small"
                error={password ? true : false}
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

              {password && (
                <Box className="newlogin-password-error">
                  <img
                    className="newlogin-password-error-img"
                    // style={{ width: '0.9375rem', height: '0.9375rem' }}
                    src={wrong_info}
                    alt="error"
                  />
                  <Typography className="newlogin-password-error-msg">
                    Password Wrong
                  </Typography>
                </Box>
              )}
              {passwordError && (
                <Box className="newlogin-error">
                  <img
                    className="newlogin-error-img"
                    // style={{ width: '0.9375rem', height: '0.9375rem' }}
                    src={wrong_info}
                    alt="error"
                  />
                  <Typography className="newlogin-error-msg">
                    Should have at least 8 characters(1 caps, 1 small letter and
                    numeric number)
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    invalidMessage !== '' ? 'space-between' : 'flex-end',
                }}
              >
                {invalidMessage !== '' && (
                  <Box
                    sx={{
                      textAlign: 'left',
                      color: '#992d26',
                      marginTop: '5px',
                      // padding: '5px 0',
                      // fontSize: '0.625rem',
                    }}
                  >
                    {invalidMessage}
                  </Box>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '5px',
                    marginBottom: '10px',
                    // justifyContent: 'flex-end',
                  }}
                  className="newlogin-forgotpassword"
                  onClick={() => {
                    navigate('/portal/login/forgot');
                  }}
                >
                  Forgot Password?
                </Box>
              </Box>
            </Box>

            <Box className="footer">
              <Button
                className="footer-text"
                onClick={loginChange}
                fullWidth
                sx={{
                  '&:disabled': {
                    backgroundColor: '#82B1DB',
                    color: 'white',
                  },
                  height: '42px',
                  fontSize: '14px',
                }}
                variant="contained"
                color="secondary"
                disabled={
                  emailValue.match(RegexValidation.EmailPattern)
                    ? // passwordValue.match(RegexValidation.loginPasswordPattern)
                      false
                    : true
                }
              >
                Login
              </Button>
            </Box>
          </Box>
        </Box>
        <Box className="footer-img">
          <img src={Poweredby} alt="poweredd by m2p" />
        </Box>
      </Box>
    </Box>
  );
};
