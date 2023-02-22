import * as React from 'react';
import { Button, Typography } from '@mui/material';

const BtnOutlined = (props: any) => {
  return (
    <Button
      onClick={props.onClick}
      sx={{
        height: props?.BtnHeight ?? 38,
        minWidth: {
          sm: 70,
          md: 95,
          lg: props?.BtnWidth ?? 100,
        },
        width: { sm: '47.5%', md: 'unset' },
        border: '1px solid #0662B7',
        '&:hover': {
          border: '1px solid #0662B7',
        },
        padding: { sm: '8px 10px' },
        color: '#0662B7',
        textTransform: 'capitalize',
        fontSize: { sm: '12px', md: '14px' },
        lineHeight: '16px',
        letterSpacing: '0.0125em',
      }}
      variant="outlined"
    >
      <Typography
        sx={{
          color: '#0662B7',
          textTransform: 'capitalize',
          fontSize: { sm: '12px', md: '14px' },
        }}
      >
        {props.title}
      </Typography>
    </Button>
  );
};
export default BtnOutlined;
