import * as React from 'react';
import { Typography } from '@mui/material';

const TypographyInfo = (props: any) => {
  return (
    <Typography
      sx={{
        fontSize: {
          sm: '10px',
          md: '12px',
        },
        fontWeight: '400',
        alignItems: 'center',
        marginBottom: '2px',
      }}
      color="#9FACB8"
      paragraph
    >
      {props.title}
    </Typography>
  );
};
export default TypographyInfo;
