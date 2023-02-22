import { Box, Button } from '@mui/material';
import './style.scss';

export const FooterButton = (props: {
  saveAsDraft?: string;
  cancel?: string;
  submit?: string;
  handleSubmitClick?: any;
  handleCancelClick?: any;
  handleSaveasDraftClick?: any;
  varient?: any;
  disabled?: any;
}) => {
  return (
    <Box
      className="boxBtn"
      sx={{
        marginTop: '20px',
        backgroundColor: 'white',
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '100%',
        borderTop: '1px solid #e9edf5',
      }}
    >
      {props.cancel && (
        <Button
          color="secondary"
          variant={props.varient ? 'contained' : 'outlined'}
          sx={{ textTransform: 'none' }}
          onClick={props.handleCancelClick}
        >
          {props.cancel}
        </Button>
      )}
      {props.saveAsDraft && (
        <Button
          color="secondary"
          variant="outlined"
          style={{ backgroundColor: '#EEF7FF', border: 'none' }}
          sx={{ textTransform: 'none' }}
          onClick={props.handleSaveasDraftClick}
        >
          {props.saveAsDraft}
        </Button>
      )}
      {props.submit && (
        <Button
          color="secondary"
          variant="contained"
          style={{ textTransform: 'none' }}
          onClick={props.handleSubmitClick}
          disabled={!props.disabled}
          sx={
            !props.disabled
              ? {
                  backgroundColor: '#82B1DB !important',
                  color: '#FFFFFF !important',
                }
              : {}
          }
        >
          {props.submit}
        </Button>
      )}
    </Box>
  );
};
