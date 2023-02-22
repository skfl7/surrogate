import React from 'react';
import { Button, Stack, Typography } from '@mui/material';

import Dialog from '@mui/material/Dialog';

import Box from '@mui/material/Box';

import Error_msg from '../../../assets/images/error_img.svg';
import './HistoryModal.scss';

type props = {
  openSuccess?: any;
  handleCloseSuccess?: () => void;
  ErrorMessage?: string;
  ErrorMsgButton?: string;
  ErrorMessageTitle?: string;
};
function ErrorModal({
  openSuccess,
  handleCloseSuccess,
  ErrorMsgButton,
  ErrorMessage,
  ErrorMessageTitle,
}: props) {
  return (
    <Stack className="Modal">
      <Dialog
        open={openSuccess}
        onClose={handleCloseSuccess}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{ maxWidth: 'unset' }}
        className="custom-modal"
      >
        <Stack py={3} className={`${'modal_container1'}`}>
          <Stack
            sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}
          >
            <Box
              component="img"
              color={'#AFAEAF'}
              src={Error_msg}
              width="45%"
            ></Box>
          </Stack>

          {ErrorMessageTitle && (
            <Typography className="error-modal-title">
              {ErrorMessageTitle}
            </Typography>
          )}

          {ErrorMessage && (
            <Typography className="error-modal-msg">{ErrorMessage}</Typography>
          )}

          {ErrorMsgButton && (
            <Stack
              style={{
                display: 'flex',
                flexDirection: 'row',
                margin: '0px  20px 0 20px',
                justifyContent: 'center',
              }}
            >
              <Stack sx={{ margin: '10px' }}>
                <Button
                  className="error-try-angai-btn"
                  variant="outlined"
                  onClick={handleCloseSuccess}
                >
                  Try Again
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Dialog>
    </Stack>
  );
}
export default ErrorModal;
