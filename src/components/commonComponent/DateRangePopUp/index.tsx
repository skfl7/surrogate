import { Box, Button } from '@mui/material';
import './index.scss';
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';

const DateRangePopUp = (props: any) => {
  const { RangePicker } = DatePicker;

  return (
    <Box className="date-range-popup" my={2} mx={2}>
      <RangePicker showTime />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: ' 16px',
          padding: '10px 18px 0',
          backgroundColor: 'white',
          width: '100%',
        }}
      >
        <Button
          color="secondary"
          variant="outlined"
          sx={{ textTransform: 'none' }}
          onClick={props.onCloseCustomPeriod}
        >
          Cancel
        </Button>

        <Button
          color="secondary"
          variant="contained"
          sx={{ textTransform: 'none' }}
          onClick={() => {
            props.onDoneCustomPeriod();
          }}
        >
          Done
        </Button>
      </Box>
    </Box>
  );
};

export default DateRangePopUp;
