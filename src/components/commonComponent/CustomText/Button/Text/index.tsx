import * as React from 'react';
import { Button, Typography } from '@mui/material';

const BtnText = (props: any) => {
  return (
    <Button
      sx={{
        height: 40,
        width: { sm: '70%', md: '16%', lg: 'unset' },
        backgroundColor: '#EEF7FF',
      }}
      variant="text"
      color="secondary"
      onClick={props.onClick}
      disabled={props.disabled || false}
    >
      <Typography
        sx={{ textTransform: 'capitalize', fontSize: 14, fontWeight: '500' }}
      >
        {props.title}
      </Typography>
    </Button>
  );
};
export default BtnText;
