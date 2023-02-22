import React, { useState } from 'react';
import '../../../style/Style.scss';
import {
  Box,
  Button,
  Dialog,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { colors } from '../../../style/Color';

type props = {
  openSuccess?: any;
  handleClose: any;
  title?: string;
  btn?: string;
  handleCloseSuccess?: any;
  data: Array<any>;
};

function DuplicateRoleModal({
  openSuccess,
  handleClose,
  btn,
  handleCloseSuccess,
  data,
}: props) {
  const [value, setValue] = useState('');
  const [selectedData, setSelectedData] = useState({});
  return (
    <Stack className="App">
      <Dialog
        open={openSuccess}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        fullWidth={true}
      >
        <Stack
          sx={{
            borderBottom: `1.5px solid #F3F3F3`,
            marginBottom: '16px',
            mx: '24px',
          }}
        >
          <Box
            sx={{
              justifyContent: 'space-between',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '16px',
                color: '#656769',
                my: '20px',
                fontWeight: '500',
              }}
            >
              Duplicate Role
            </Typography>
            <Button onClick={handleClose}>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#0662B7',
                  textTransform: 'none',
                }}
              >
                Close
              </Typography>
            </Button>
          </Box>
        </Stack>

        <Stack
          sx={{
            mx: '24px',
          }}
        >
          <Typography sx={{ fontSize: '14px', marginBottom: '5px' }}>
            Select the Existing Role
          </Typography>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            displayEmpty
            name="answer"
            MenuProps={{ PaperProps: { sx: { maxHeight: 150 } } }}
            renderValue={(selected: any) => {
              if (!selected) {
                return (
                  <Stack
                    sx={{
                      color: '#B3B3B3',
                      fontWeight: '400',
                      fontSize: '14px',
                      letterSpacing: '0.0025em',
                    }}
                  >
                    Choose existing role for duplication
                  </Stack>
                );
              }
              return <Stack>{value}</Stack>;
            }}
          >
            {data?.map((item: any) => (
              <MenuItem
                value={item.id}
                onClick={() => {
                  setValue(item.name);
                  setSelectedData(item);
                }}
                key={item.id}
              >
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        {btn && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
            pb={0}
            px={4}
            py={2}
          >
            <Button
              variant="contained"
              onClick={() => handleCloseSuccess(value, selectedData)}
              style={{
                width: '30em',
                height: '3em',
                fontSize: '12px',
                backgroundColor:
                  value.length > 0
                    ? `${colors.Modalblue}`
                    : `${colors.lightGrey}`,
                textTransform: 'none',
              }}
              disabled={value.length > 0 ? false : true}
            >
              {btn}
            </Button>
          </Box>
        )}
      </Dialog>
    </Stack>
  );
}

export default DuplicateRoleModal;
