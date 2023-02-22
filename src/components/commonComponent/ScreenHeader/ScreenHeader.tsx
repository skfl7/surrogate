import { Box, Typography } from '@mui/material';
import TypographyInfo from '../CustomText/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import './style.scss';

export const ScreenHeader = (props: {
  title: string;
  info?: string;
  showBackButton: boolean;
  gobackFun?: any;
}) => {
  const navigate = useNavigate();
  const goBack = () => {
    if (props.gobackFun) {
      props.gobackFun();
    } else {
      navigate(-1);
    }
  };
  return (
    <Box className="header-container">
      <Box className="main-header">
        {props.showBackButton && (
          <ArrowBackIcon onClick={goBack} className="go-back-icon" />
        )}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ letterSpacing: 0.5 }}
            className="screen-header-title"
          >
            {props.title}
          </Typography>
        </Box>
      </Box>
      <TypographyInfo title={props.info} />
    </Box>
  );
};
