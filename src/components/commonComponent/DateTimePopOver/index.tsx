import React, { useState } from 'react';
import '../../../style/Style.scss';
import { Box, Button, Popover, Stack } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import { ReactComponent as DownArrow } from '../../../assets/icons/downArrow.svg';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DateRangePopUp from '../DateRangePopUp';

type props = {
  day_filter_label?: Array<any>;
  dayFilterValue?: string;
};

function DateTimePopOver({ day_filter_label, dayFilterValue }: props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCustomClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openCustom = Boolean(anchorElement);
  const idCustom = open ? 'simple-popover' : undefined;

  const handleCloseCustom = () => {
    setAnchorElement(null);
  };

  return (
    <Stack className="App">
      <Button
        endIcon={<DownArrow />}
        sx={{
          fontSize: '14.08px',
          marginRight: '20px',
          fontWeight: '500',
          color: '#0662B7',
          textTransform: 'none',
        }}
        onClick={handleClick}
      >
        {dayFilterValue}
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack sx={{ width: '220px' }}>
          {day_filter_label && (
            <Stack>
              <FormGroup>
                <Grid>
                  {day_filter_label?.map((item: any, index) => {
                    return (
                      <Grid item key={item.id}>
                        {' '}
                        {item.label !== 'Custom Period' && (
                          <Button
                            onClick={() => {
                              item.onclick();
                              handleClose();
                            }}
                            sx={{
                              fontSize: '16px',
                              fontWeight: '400',
                              textTransform: 'none',
                              width: '100%',
                              justifyContent: 'flex-start',
                              paddingTop: '10px',
                              paddingBottom: '10px',
                              paddingLeft: '12px',
                            }}
                          >
                            {item.label}
                          </Button>
                        )}
                        {item.label === 'Custom Period' && (
                          <Button
                            onClick={(e) => {
                              handleCustomClick(e);
                            }}
                            sx={{
                              fontSize: '16px',
                              fontWeight: '400',
                              textTransform: 'none',
                              width: '100%',
                              justifyContent: 'flex-start',
                              paddingTop: '12px',
                              paddingBottom: '12px',
                              paddingLeft: '12px',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Box>{item.label}</Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <CalendarTodayOutlinedIcon />
                              </Box>
                            </Box>
                          </Button>
                        )}
                      </Grid>
                    );
                  })}
                </Grid>
              </FormGroup>
            </Stack>
          )}
        </Stack>
      </Popover>
      <Popover
        id={idCustom}
        open={openCustom}
        anchorEl={anchorElement}
        onClose={handleCloseCustom}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disableEnforceFocus={true}
      >
        <DateRangePopUp
          open={openCustom}
          onCloseCustomPeriod={() => handleCloseCustom()}
          onDoneCustomPeriod={() => {
            handleCloseCustom();
            handleClose();
          }}
        />
      </Popover>
    </Stack>
  );
}

export default DateTimePopOver;
