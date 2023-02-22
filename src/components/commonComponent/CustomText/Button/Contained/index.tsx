import * as React from 'react';
import { Button } from '@mui/material';

const BtnContained = (props: any) => {
  return (
    <Button
      type={props?.type ?? ''}
      sx={{
        height: props?.BtnHeight ?? 40,
        minWidth: {
          sm: 70,
          md: 95,
          lg: props?.BtnWidth ?? 120,
        },
        '&:disabled': {
          backgroundColor: '#82B1DB',
          color: 'white',
        },
        width: { sm: '47.5%', md: 'unset' },
        padding: { sm: '8px 10px' },
        textTransform: 'capitalize',
        fontSize: { sm: '12px', md: '14px' },
        lineHeight: '16px',
        letterSpacing: '0.0125em',
      }}
      variant="contained"
      color="secondary"
      onClick={props.onClick}
      disabled={props?.disabled ?? false}
    >
      {props.title}
    </Button>
  );
};
export default BtnContained;
