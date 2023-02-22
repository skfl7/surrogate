import React, { useEffect, useState } from 'react';
import moment from 'moment';

// MUI components
import { Button, Stack, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Dialog from '@mui/material/Dialog';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

// Assets
import checkedIcon from '../../../../assets/icons/check_box_square_icon.svg';

// Styles
import '../CustomModal.scss';

type Props = {
  isOpen: boolean;
  header: string;
  description: string;
  // Radio props
  hasRadio?: boolean;
  radioOptions?: Array<any>;
  defaultRadio?: any;
  // Textbox props
  hasTextbox?: boolean;
  textboxHeader?: string;
  maxWords?: number;
  // CTA props
  hasPrimaryCta: boolean;
  primaryCtaText: string;
  handlePrimaryCtaClick: Function;
  hasOutlinedCta: boolean;
  outlinedCtaText: string;
  handleOutlinedCtaClick: Function;
  // checkbox props
  hasCheckbox?: boolean;
  checkboxOptions?: Array<any>;
  // date props
  hasDate?: boolean;
  dateDescription?: string;
  // handle change in radio which will lead to change in primary cta text/ show or hide date
  handleChange?: Function;
};

function CustomModal({
  isOpen,
  handleOutlinedCtaClick,
  header,
  description,
  hasRadio,
  radioOptions,
  defaultRadio,
  hasDate,
  dateDescription,
  hasTextbox,
  textboxHeader,
  maxWords,
  hasCheckbox,
  checkboxOptions,
  hasPrimaryCta,
  primaryCtaText,
  handlePrimaryCtaClick,
  hasOutlinedCta,
  outlinedCtaText,
  handleChange,
}: Props) {
  const [checkedItems, setCheckedItems] = React.useState<string[]>([]);
  const [remarksText, setRemarksText] = React.useState('');
  const [startDate, setStartDate] = React.useState(moment());
  const [endDate, setEndDate] = React.useState(moment());
  const [selectedRadio, setSelectedRadio] = React.useState(defaultRadio || '');
  const [primaryCtaDisabled, setPrimaryCtaDisabled] = useState<boolean>(false);
  const [maxWordsExists, setMaxWordsExists] = useState<boolean>(false);

  // Use effect calls
  useEffect(() => {
    if (
      (hasCheckbox && checkedItems.length === 0) ||
      (hasTextbox && maxWords && remarksText.length < 5)
    ) {
      setPrimaryCtaDisabled(true);
    } else if (remarksText.length > 550) {
      setMaxWordsExists(true);
      setPrimaryCtaDisabled(true);
    } else {
      setPrimaryCtaDisabled(false);
      setMaxWordsExists(false);
    }
  }, [checkedItems, hasCheckbox, hasTextbox, remarksText]);

  // Checkbox change

  const handleChecboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: any
  ) => {
    let checkedOptions = [...checkedItems];
    if (event.target.checked) {
      if (!checkedOptions.some((option: string) => option === item.value))
        checkedOptions.push(item.value);
    } else
      checkedOptions = checkedOptions.filter(
        (option: string) => option !== item.value
      );
    setCheckedItems(checkedOptions);
  };

  // Radio button change

  const handleRadioChange = (event: any) => {
    const val = event.target.value;
    if (val) {
      setSelectedRadio(val);
      handleChange && handleChange({ radio: val });
    }
  };

  return (
    <Stack className="Modal">
      <Dialog
        open={isOpen}
        onClose={() => handleOutlinedCtaClick()}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{ maxWidth: 'unset' }}
        className="custom-modal"
      >
        <Stack py={3} className="request_Activation_modal" px={3}>
          {header && (
            <Typography className="modal-title" component="h1">
              {header}
            </Typography>
          )}

          {description && (
            <Typography
              className="pause_content"
              pb={1}
              pt={2}
              fontSize={13}
              color={'#171717'}
              fontWeight={500}
            >
              {description}
            </Typography>
          )}

          {hasRadio && (
            <FormControl className="radio-btnlabel">
              <Stack pb={1}>
                <RadioGroup
                  color=""
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={selectedRadio}
                  name="radio-buttons-group"
                  onChange={(e) => handleRadioChange(e)}
                  defaultValue={defaultRadio}
                >
                  {radioOptions?.map((radio: any) => (
                    <FormControlLabel
                      value={radio.value}
                      control={<Radio color="secondary" />}
                      label={radio.label}
                      key={radio.value}
                    />
                  ))}
                </RadioGroup>
              </Stack>
            </FormControl>
          )}

          {hasDate && (
            <Stack>
              <Typography
                className="pause_content"
                pb={1}
                pt={3}
                fontSize={13}
                color={'#171717'}
                fontWeight={500}
                style={{ borderTop: `1px solid #36363624` }}
              >
                {dateDescription}
              </Typography>
              <Typography
                className="textarea_title"
                fontWeight={600}
                fontSize={12}
                pt={1}
                pb={1}
              >
                Enter Date Range
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack
                  className="Modal_datepicker"
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: '16px',
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item sm={6} className="datepicker_icon">
                      <DateTimePicker
                        renderInput={(props: any) => (
                          <TextField
                            sx={{ fontSize: 1, fontWeight: 400 }}
                            size="small"
                            {...props}
                            fullWidth
                            inputProps={{
                              ...props.inputProps,
                              placeholder: 'Start Date and time',
                            }}
                            InputLabelProps={{ style: { fontSize: 14 } }}
                          />
                        )}
                        inputFormat="DD MMM YYYY, hh:mm A"
                        disablePast={true}
                        // minTime={moment()}
                        value={startDate}
                        onChange={(value: any) => {
                          setStartDate(value);
                        }}
                        reduceAnimations={false}
                        components={{
                          OpenPickerIcon: CalendarTodayOutlinedIcon,
                        }}
                        OpenPickerButtonProps={{
                          style: {
                            color: startDate ? '#0662b7' : '#D2D2D3',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item sm={6} className="datepicker_icon">
                      <DateTimePicker
                        renderInput={(props: any) => (
                          <TextField
                            sx={{ fontSize: '10px' }}
                            size="small"
                            {...props}
                            fullWidth
                            inputProps={{
                              ...props.inputProps,
                              placeholder: 'End Date and time',
                            }}
                            InputLabelProps={{ style: { fontSize: 14 } }}
                          />
                        )}
                        inputFormat="DD MMM YYYY, hh:mm A"
                        disablePast={true}
                        // minTime={moment()}
                        value={endDate}
                        onChange={(value: any) => {
                          setEndDate(value);
                        }}
                        reduceAnimations={typeof navigator !== 'undefined'}
                        components={{
                          OpenPickerIcon: CalendarTodayOutlinedIcon,
                        }}
                        OpenPickerButtonProps={{
                          style: {
                            color: endDate ? '#0662b7' : '#D2D2D3',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </LocalizationProvider>
            </Stack>
          )}

          {hasTextbox && (
            <Stack className="modal-textarea">
              <Typography className="textarea_title">
                {textboxHeader}
              </Typography>
              <Grid container>
                <Grid container xs={12}>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={8}
                    style={{
                      width: 538,
                      border: `1px solid #36363624`,
                      height: '160px',
                      resize: 'none',
                      padding: '5px',
                    }}
                    value={remarksText}
                    onChange={(event) => {
                      setRemarksText(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>
              <Stack className="textarea-alertMsg-container">
                <Typography className="textarea-alertMsg">
                  Maximum of {maxWords} words
                </Typography>
                {maxWordsExists && (
                  <Typography
                    sx={{ color: 'red' }}
                    className=" textarea-exist-alertMsg "
                  >
                    Please enter maximum of {maxWords} words
                  </Typography>
                )}
              </Stack>
            </Stack>
          )}

          {hasCheckbox && (
            <Stack
              sx={{
                borderTop: `1px solid #36363624`,
                borderBottom: `1px solid #36363624`,
                marginBottom: '20px',
              }}
              className={'radio-btnlabel'}
            >
              <FormGroup sx={{ paddingTop: '10px' }}>
                <Grid container>
                  {checkboxOptions?.map((item: any) => {
                    return (
                      item.value !== 'All' && (
                        <Grid
                          item
                          xs={6}
                          // sm={checkboxOptions?.length > 4 ? 4 : 4}
                          sm={4}
                          key={item.value}
                          sx={{
                            padding: '8px 0',
                            fontSize: '6.09px',
                            // whiteSpace: 'nowrap',
                            textTransform: 'capitalize',
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                style={{
                                  transform: 'scale(1.2)',
                                }}
                                sx={{
                                  color: '#A8A8A9',
                                }}
                                checkedIcon={
                                  <img src={checkedIcon} alt={checkedIcon} />
                                }
                                onChange={(event) => {
                                  handleChecboxChange(event, item);
                                }}
                              />
                            }
                            label={item.title}
                          />
                        </Grid>
                      )
                    );
                  })}
                </Grid>
              </FormGroup>
            </Stack>
          )}

          <Stack className="modal_buttons">
            {hasOutlinedCta && (
              <Button
                onClick={() => handleOutlinedCtaClick()}
                variant="outlined"
                className="close-button"
              >
                {outlinedCtaText}
              </Button>
            )}
            {hasPrimaryCta && (
              <Button
                variant="contained"
                className="submit-button"
                sx={
                  primaryCtaDisabled
                    ? {
                        backgroundColor: '#82B1DB !important',
                        color: '#FFFFFF !important',
                      }
                    : {
                        backgroundColor: ' #0662B7',
                        color: '#FFFFFF',
                        '&:hover': {
                          backgroundColor: '#0662B7',
                        },
                      }
                }
                onClick={() =>
                  handlePrimaryCtaClick(
                    remarksText,
                    startDate,
                    endDate,
                    checkedItems
                  )
                }
                disabled={primaryCtaDisabled}
              >
                {primaryCtaText}
              </Button>
            )}
          </Stack>
        </Stack>
      </Dialog>
    </Stack>
  );
}
export default CustomModal;
