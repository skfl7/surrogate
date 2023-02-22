import * as React from 'react';
import { Typography } from '@mui/material';

const TypographySubTitle = (props: any) => {
  return (
    <Typography
      sx={{
        margin: 0,
        fontSize: {
          sm: '11px',
          lg: '12px',
        },
        lineHeight: '14px',
        fontWeight: '500',
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: '5px',
      }}
      style={props.style}
      variant="body1"
      color={props.color}
    >
      {props.title}
    </Typography>
  );
};
export default TypographySubTitle;
