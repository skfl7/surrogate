import * as React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const TypoText = (props: {
  handleChange?: Function;
  id?: string;
  value?: string | number | null;
  fontSize?: number;
  title?: string;
  color?: string;
  placeholder?: string;
  className?: any;
  style?: any;
  required?: boolean;
  fullWidth?: boolean;
  type?: string;
  disable?: boolean;
  textError?: boolean;
  errorMessage?: string;
  inputProps?: any;
}) => {
  const {
    handleChange,
    id,
    value,
    required,
    type,
    disable,
    textError,
    errorMessage,
    inputProps,
  } = props;
  return (
    <Box>
      {props.title && (
        <Typography
          sx={{
            marginBottom: '5px',
            fontFamily: 'Ilisarniq',
            fontSize: {
              sm: '12px',
              md: '13px',
              lg: '16px',
            },
            fontWeight: 500,
            lineHeight: '20px',
            display: 'flex',
            justifyContent: 'flex-start',
            color: props.color,
            letterSpacing: '0.0015em',
          }}
          style={props.style}
          variant="body1"
          // color="textPrimary"
        >
          {props.title}
        </Typography>
      )}

      {props.placeholder && (
        <TextField
          fullWidth
          hiddenLabel
          placeholder={props.placeholder}
          variant="outlined"
          size="small"
          onChange={(e) => handleChange && handleChange(e, id)}
          value={value}
          sx={{ fontSize: '14px', fontWeight: '400' }}
          id={id || 'text-id'}
          required={required}
          type={type}
          disabled={disable}
          error={textError}
          helperText={errorMessage || ''}
          InputProps={inputProps}
        />
      )}
    </Box>
  );
};
export default TypoText;
