import * as React from 'react';
import { Snackbar, Alert, SnackbarCloseReason } from '@mui/material';

type Props = {
  message: string;
  handleClose: (
    event: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void;
  severity: any;
  duration: number;
};

const ErrorMessage = ({ message, handleClose, severity, duration }: Props) => {
  return (
    <Snackbar
      open={true}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
export default ErrorMessage;
