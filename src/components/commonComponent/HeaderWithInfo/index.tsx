import { Box, Typography, Stack } from '@mui/material';
import info_icon from '../../../assets/images/info_icon.svg';
import DownloadIcon from '../../../assets/icons/download_icon.svg';
import MailIcon from '../../../assets/icons/mail_icon.svg';
import './style.scss';

function HeaderWithInfo(props: {
  header: string;
  info?: string;
  isInfoEnabled: boolean;
  isDownloadEnabled: boolean;
  underline?: boolean;
}) {
  return (
    <Stack>
      <Stack className="header-with-info-container">
        <Box
          className="header"
          sx={{
            alignItems: { sm: 'flex-start', md: 'center', lg: 'center' },
            flexDirection: { sm: 'column', md: 'row', lg: 'row' },
          }}
        >
          <div className="header-name">{props?.header || '--'}</div>
          {props?.isInfoEnabled && (
            <div className="info-section">
              <img src={info_icon} className="info-icon" alt="info_icon" />
              <Stack className="info-label margins">
                {props?.info ??
                  'From here, you can select the channels which that user can access'}
              </Stack>
            </div>
          )}
        </Box>
        <Box>
          {props?.isDownloadEnabled && (
            <Box className="icons-container">
              <Stack className="each-icon">
                <img src={DownloadIcon} alt="" />
              </Stack>
              <Stack className="each-icon">
                <img src={MailIcon} alt="" />
              </Stack>
            </Box>
          )}
        </Box>
      </Stack>
      {props?.underline ? (
        <Typography
          sx={{ marginTop: '10px' }}
          className="underline"
        ></Typography>
      ) : (
        ''
      )}
    </Stack>
  );
}

export default HeaderWithInfo;
