import React, { useState } from 'react';
import {
  Stack,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  Switch,
  Box,
} from '@mui/material';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import { FooterButton } from '../../../../components/commonComponent/FooterButton/FooterButton';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import RemoveIcon from '../../../../assets/icons/remove_icon.svg';
import AddMoreDataIcon from '../../../../assets/icons/plus_square.svg';
import {
  Configuration,
  FrequencyPeriod,
  SurrogateCheckboxList,
  RejectionTypeCheckboxList,
  DroppedTypeCheckboxList,
  CommunicationMode,
  DSAList,
  DivisionList,
  FintechPartnerList,
  ShowMoreModalData,
  ApplicableOrNOT,
  EveryDays,
  EveryOrder,
  WeekDays,
} from './../lmsRule.const';
import HeaderWithInfo from '../../../../components/commonComponent/HeaderWithInfo';
import CustomModal from '../../../../components/commonComponent/customModal/CustomModal';
import Dropdown from '../../../../components/commonComponent/Dropdown';
import PlusCircleIcon from '../../../../assets/icons/plus_circle.svg';
import './style.scss';
import Multiselector from '../../../../components/commonComponent/MultiSelectNew';
function EditLMSRule() {
  const [isDSAListModalOpen, setIsDSAListModalOpen] = useState(false);
  const [isDivisionListModalOpen, setIsDivisionListModalOpen] = useState(false);
  const [isFintechPartnerListModalOpen, setIsFintechPartnerListModalOpen] =
    useState(false);
  const [isSelectedDates, setIsSelectedDates] = useState(false);
  const [selectedTypeConfiguration, setSelectedTypeConfiguration] =
    useState('rejected');
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
  const [frequencyPeriodValue, setFrequencyPeriodValue] = useState('EnterDays');
  const [selectedOccurence, setSelectedOccurence] = useState('daily');
  const [isNewRuleCreated, setIsNewRuleCreated] = useState(false);
  const [datesList, setDatesList] = useState([
    {
      title: 'Frequency Schedule',
    },
  ]);
  const [daysList, setDaysList] = useState([
    {
      title: 'Frequency Schedule',
    },
  ]);
  const [monthlyYearlyPeriodValue, setMonthlyYearlyPeriodValue] =
    useState('date');
  const navigate = useNavigate();
  const goBack = () => {
    navigate('/lms/lmsRule', { state: { activeTab: '1' } });
  };
  const handleSubmitClick = () => {
    setIsNewRuleCreated(true);
  };
  const handleSubmit = () => {
    setIsNewRuleCreated(false);
    navigate('/lms/lmsRule', { state: { activeTab: '1' } });
  };
  const handleChange = (newValue: Dayjs | null) => {
    setStartDate(newValue);
  };
  const periodOptions = [
    { label: 'Date', value: 'date' },
    { label: 'For day', value: 'forday' },
  ];
  const changeFrequencyPeriod = (event: any) => {
    setFrequencyPeriodValue(event.target.value);
    if (event.target.value === 'SelectedDates') setIsSelectedDates(true);
    else setIsSelectedDates(false);
    setDatesList([
      {
        title: 'Frequency Schedule',
      },
    ]);
    setDaysList([
      {
        title: 'Frequency Schedule',
      },
    ]);
  };
  const changeMonthlyYearlyPeriod = (event: any) => {
    setMonthlyYearlyPeriodValue(event.target.value);
  };
  const changeTypeConfiguration = (event: any) => {
    setSelectedTypeConfiguration(event.target.value);
  };
  const switchHandleChange = (flag: string) => {
    setSelectedOccurence(flag);
  };
  const addMoreDates = () => {
    let array = [];
    array.push(...datesList, {
      title: 'Frequency Schedule',
    });
    setDatesList(array);
  };
  const removeDates = (itemIndex: number) => {
    setDatesList((current) =>
      current.filter((each: any, index: number) => index !== itemIndex)
    );
  };
  const removeDays = (itemIndex: number) => {
    setDaysList((current) =>
      current.filter((each: any, index: number) => index !== itemIndex)
    );
  };
  const addMoreDays = () => {
    let array = [];
    array.push(...daysList, {
      title: 'Frequency Schedule',
    });
    setDaysList(array);
  };
  const [endDateCheckBox, setendDateCheckBox] = useState(true);
  const [endDatechecked, setendDatechecked] = React.useState(true);
  const handleChangeEndDateCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setendDatechecked(event.target.checked);
  };
  const [state, setState] = useState(false);
  const [surrogateData, setSurrogateData] = useState(false);
  const handleChangeggg = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setState(event.target.checked);
    let res: any = SurrogateCheckboxList.find((item) => item.value === value);
    res.isChecked = event.target.checked;
    let count = SurrogateCheckboxList.filter(
      (item) => item.isChecked === false
    );
    if (count.length > 0) {
      setSurrogateData(false);
    } else {
      setSurrogateData(true);
    }
  };
  const location = useLocation();
  console.log('location', location);
  return (
    <Stack className="create-lms-rule-container">
      <Stack className="create-lms-rule-header margin-top">
        <ScreenHeader
          title="Rule Name: C4CNORCKYC (Auto Populate)"
          info="From here you can create access presets to assign with users in Users Creation."
          showBackButton={false}
        />
      </Stack>
      <Stack className="lms-rule-container">
        <HeaderWithInfo
          header="Role Details"
          isInfoEnabled={true}
          info="From here, you can add the user’s personal details"
          isDownloadEnabled={false}
        />
        <Stack className="lms-rule-form-container">
          <Grid container spacing={2}>
            <RadioGroup
              value={selectedTypeConfiguration}
              name="radio-buttons-group"
              className="radio-group-container"
              onChange={changeTypeConfiguration}
            >
              {Configuration?.map((eachItem: any, index: number) => {
                return (
                  <Grid item xs={2} key={index} className="checkbox-name">
                    <FormControlLabel
                      value={eachItem?.value}
                      control={<Radio color="secondary" />}
                      label={eachItem?.label}
                    />
                  </Grid>
                );
              })}
            </RadioGroup>
          </Grid>
        </Stack>
      </Stack>
      <Stack className="lms-rule-container">
        <HeaderWithInfo
          header="Rejected"
          isInfoEnabled={true}
          info="From here, you can add the user’s personal details"
          isDownloadEnabled={false}
        />
        <Stack className="lms-rule-form-container">
          <Typography className="checkbox-main-label">
            Select Surrogate
          </Typography>
          <Grid container spacing={2}>
            {SurrogateCheckboxList?.map((eachItem: any, index: number) => {
              return (
                <Grid item xs={2} key={index} className="checkbox-name">
                  <FormControlLabel
                    control={
                      <Checkbox
                        style={{
                          transform: 'scale(1.2)',
                        }}
                        sx={{
                          color: '#A8A8A9',
                        }}
                      />
                    }
                    label={eachItem?.label}
                    onChange={(e: any) => handleChangeggg(e, eachItem.value)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Stack>
        <Stack className="lms-rule-form-container">
          <Typography className="checkbox-main-label">Dedube</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4} className="checkbox-name">
              <FormControlLabel
                control={
                  <Checkbox
                    style={{
                      transform: 'scale(1.2)',
                    }}
                    sx={{
                      color: '#A8A8A9',
                    }}
                  />
                }
                label={'Enable Dedube Configuration'}
              />
            </Grid>
            {selectedTypeConfiguration === 'rejected' && (
              <Grid item xs={4} className="checkbox-name">
                <FormControlLabel
                  control={
                    <Checkbox
                      style={{
                        transform: 'scale(1.2)',
                      }}
                      sx={{
                        color: '#A8A8A9',
                      }}
                    />
                  }
                  label={'No need Dedube Check'}
                />
              </Grid>
            )}
          </Grid>
        </Stack>
        {selectedTypeConfiguration === 'dropped' ? (
          <Stack className="lms-rule-form-container">
            <Typography className="checkbox-main-label">
              Dropped Type
            </Typography>
            <Grid container spacing={2}>
              {DroppedTypeCheckboxList?.map((eachItem: any, index: number) => {
                return (
                  <Grid item xs={2} key={index} className="checkbox-name">
                    <FormControlLabel
                      control={
                        <Checkbox
                          style={{
                            transform: 'scale(1.2)',
                          }}
                          sx={{
                            color: '#A8A8A9',
                          }}
                        />
                      }
                      label={eachItem?.label}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        ) : (
          <Stack className="lms-rule-form-container">
            <Typography className="checkbox-main-label">
              Rejection Type
            </Typography>
            <Grid container spacing={2}>
              {RejectionTypeCheckboxList?.map(
                (eachItem: any, index: number) => {
                  return (
                    <Grid item xs={2} key={index} className="checkbox-name">
                      <FormControlLabel
                        control={
                          <Checkbox
                            style={{
                              transform: 'scale(1.2)',
                            }}
                            sx={{
                              color: '#A8A8A9',
                            }}
                          />
                        }
                        label={eachItem?.label}
                      />
                    </Grid>
                  );
                }
              )}
            </Grid>
          </Stack>
        )}
        <Stack className="lms-rule-form-container">
          <Typography className="checkbox-main-label">
            Mode Of Communication
          </Typography>
          <Grid container spacing={2}>
            {CommunicationMode?.map((eachItem: any, index: number) => {
              return (
                <Grid item xs={2} key={index} className="checkbox-name">
                  <FormControlLabel
                    control={
                      <Checkbox
                        style={{
                          transform: 'scale(1.2)',
                        }}
                        sx={{
                          color: '#A8A8A9',
                        }}
                      />
                    }
                    label={eachItem?.label}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Stack>
      <Stack className="lms-rule-container">
        <HeaderWithInfo
          header="Channel"
          isInfoEnabled={true}
          info="From here, you can add the user’s personal details"
          isDownloadEnabled={false}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <Grid
              item
              xs={3.9}
              style={{ margin: '5px 12px 0px 0px', paddingRight: '12px' }}
            >
              <Typography className="each-field-label">DSA</Typography>
              <Dropdown data={ApplicableOrNOT} label="Applicable" />
            </Grid>
            <Grid item xs={4.1} style={{ margin: '8px 4px 0' }}>
              <Typography className="each-field-label">Choose DSAs</Typography>
              <Multiselector options={DSAList} />
              <Stack className="each-field-label display-flex">
                <Stack>Selected DSAs: DSA1,DSA2,...</Stack>
                <Stack
                  className="show-more"
                  onClick={() => setIsDSAListModalOpen(true)}
                >
                  Show More
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <Grid
              item
              xs={3.9}
              style={{ margin: '5px 12px 0px 0px', paddingRight: '12px' }}
            >
              <Typography className="each-field-label">
                Bank Divisions
              </Typography>
              <Dropdown data={ApplicableOrNOT} label="Applicable" />
            </Grid>
            <Grid item xs={4.1} style={{ margin: '8px 4px 0' }}>
              <Typography className="each-field-label">
                Choose Divisions
              </Typography>
              <Multiselector options={DivisionList} />
              <Stack className="each-field-label display-flex">
                <Stack>Selected Divisions: Div1, Div2,...</Stack>
                <Stack
                  className="show-more"
                  onClick={() => setIsDivisionListModalOpen(true)}
                >
                  Show More
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <Grid
              item
              xs={3.9}
              style={{ margin: '5px 12px 0px 0px', paddingRight: '12px' }}
            >
              <Typography className="each-field-label">
                Fintech Partner
              </Typography>
              <Dropdown data={ApplicableOrNOT} label="Applicable" />
            </Grid>
            <Grid item xs={4.1} style={{ margin: '8px 4px 0' }}>
              <Typography className="each-field-label">
                Choose Fintech Partner
              </Typography>
              <Multiselector options={FintechPartnerList} />
              <Stack className="each-field-label display-flex">
                <Stack> Selected Fintech Partners: Part,...</Stack>
                <Stack
                  className="show-more"
                  onClick={() => setIsFintechPartnerListModalOpen(true)}
                >
                  Show More
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
      <Stack className="lms-rule-container" style={{ marginBottom: '80px' }}>
        <>
          <HeaderWithInfo
            header="Frequency"
            isInfoEnabled={true}
            info="From here, you can add the user’s personal details"
            isDownloadEnabled={false}
          />
          <Stack
            className="lms-rule-form-container"
            style={{ marginTop: '25px' }}
          >
            <Typography className="each-field-label">
              Frequency Period
            </Typography>
            <Grid container spacing={2}>
              <RadioGroup
                name="radio-buttons-group"
                className="radio-group-container"
                onChange={changeFrequencyPeriod}
                value={frequencyPeriodValue}
              >
                {FrequencyPeriod?.map((eachItem: any, index: number) => {
                  return (
                    <Grid item xs={2} key={index} className="checkbox-name">
                      <FormControlLabel
                        value={eachItem?.value}
                        control={<Radio color="secondary" />}
                        label={eachItem?.label}
                      />
                    </Grid>
                  );
                })}
              </RadioGroup>
            </Grid>
            <Stack className="frequency-period-form">
              {isSelectedDates ? (
                <>
                  {datesList?.map((eachItem: any, index: number) => {
                    return (
                      <Grid
                        container
                        spacing={2}
                        className="select-date-container"
                        key={index}
                      >
                        <Box className="frequency-header-container">
                          <Grid item xs={6}>
                            <Typography className="frequency-header">
                              {eachItem?.title
                                ? `${eachItem?.title} - ${index + 1}`
                                : '--'}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            className={
                              datesList?.length > 1
                                ? 'enabled remove-container'
                                : 'disabled remove-container'
                            }
                          >
                            {datesList?.length > 1 && (
                              <Box
                                className={
                                  datesList?.length > 1
                                    ? 'enabled remove-container'
                                    : 'disabled remove-container'
                                }
                                onClick={() =>
                                  datesList?.length > 1 && removeDates(index)
                                }
                              >
                                <img
                                  src={RemoveIcon}
                                  alt=""
                                  className="remove-icon"
                                />
                                <Stack className="remove-label">Remove</Stack>
                              </Box>
                            )}
                          </Grid>
                        </Box>
                        <Stack className="frequency-header-underline"></Stack>
                        <Grid item xs={12} className="frequency-textfield">
                          <Grid item xs={12} style={{ display: 'flex' }}>
                            <Grid item xs={4} style={{ margin: '0px 10px' }}>
                              <Typography className="each-field-label">
                                Start Date
                              </Typography>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                  toolbarPlaceholder="DD/MM/YYYY"
                                  openTo="year"
                                  views={['year', 'month', 'day']}
                                  inputFormat="DD/MM/YYYY"
                                  value={startDate}
                                  onChange={handleChange}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                />
                              </LocalizationProvider>
                              <Stack className="repeat-conatiner">
                                <Typography className="each-field-label">
                                  Repeat
                                </Typography>
                                <Box className="swicth-container">
                                  <Stack className="swicth-label">Daily</Stack>
                                  <Switch
                                    onChange={() => switchHandleChange('daily')}
                                    checked={
                                      selectedOccurence === 'daily'
                                        ? true
                                        : false
                                    }
                                  />
                                </Box>
                                <Box className="swicth-container">
                                  <Stack className="swicth-label">Weekly</Stack>
                                  <Switch
                                    onChange={() =>
                                      switchHandleChange('weekly')
                                    }
                                    checked={
                                      selectedOccurence === 'weekly'
                                        ? true
                                        : false
                                    }
                                  />
                                </Box>
                                <Box className="swicth-container">
                                  <Stack className="swicth-label">
                                    Monthly
                                  </Stack>
                                  <Switch
                                    onChange={() =>
                                      switchHandleChange('monthly')
                                    }
                                    checked={
                                      selectedOccurence === 'monthly'
                                        ? true
                                        : false
                                    }
                                  />
                                </Box>
                                <Box className="swicth-container">
                                  <Stack className="swicth-label">Yearly</Stack>
                                  <Switch
                                    onChange={() =>
                                      switchHandleChange('yearly')
                                    }
                                    checked={
                                      selectedOccurence === 'yearly'
                                        ? true
                                        : false
                                    }
                                  />
                                </Box>
                              </Stack>
                              <Stack>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      style={{
                                        transform: 'scale(1.2)',
                                      }}
                                      sx={{
                                        color: '#A8A8A9',
                                      }}
                                      onChange={handleChangeEndDateCheckbox}
                                      checked={endDatechecked}
                                    />
                                  }
                                  label={'End Date'}
                                />
                                {endDatechecked && (
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DesktopDatePicker
                                      toolbarPlaceholder="DD/MM/YYYY"
                                      openTo="year"
                                      views={['year', 'month', 'day']}
                                      value={startDate}
                                      onChange={handleChange}
                                      renderInput={(params) => (
                                        <TextField {...params} />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                                {endDatechecked && (
                                  <Stack className="each-field-label">
                                    Every 12 days the process runs, and it
                                    starting on 10 Aug, 2022
                                  </Stack>
                                )}
                              </Stack>
                            </Grid>
                            <Grid item xs={4} style={{ margin: '0px 10px' }}>
                              {selectedOccurence === 'daily' && (
                                <>
                                  <Typography className="each-field-label">
                                    Every
                                  </Typography>
                                  <Dropdown
                                    label="1 Week once"
                                    data={EveryDays}
                                  />
                                </>
                              )}
                              {selectedOccurence === 'weekly' && (
                                <>
                                  <Typography className="each-field-label">
                                    Every
                                  </Typography>
                                  <Dropdown
                                    data={EveryDays}
                                    label="1 Week once"
                                  />
                                  <Stack className="radio-buttons-conatiner">
                                    <Typography className="each-field-label">
                                      On
                                    </Typography>
                                  </Stack>
                                  <Dropdown data={WeekDays} label="Monday" />
                                </>
                              )}
                              {(selectedOccurence === 'monthly' ||
                                selectedOccurence === 'yearly') && (
                                <>
                                  <Typography className="each-field-label">
                                    Every
                                  </Typography>
                                  <Dropdown
                                    data={EveryDays}
                                    label="1 Week once"
                                  />
                                  <Stack className="radio-buttons-conatiner">
                                    <Typography className="each-field-label">
                                      On
                                    </Typography>
                                    <Grid container spacing={2} key={index}>
                                      <RadioGroup
                                        name="radio-buttons-group"
                                        className="radio-group-container"
                                        value={monthlyYearlyPeriodValue}
                                        onChange={changeMonthlyYearlyPeriod}
                                      >
                                        {periodOptions?.map(
                                          (eachItem: any, index: number) => {
                                            return (
                                              <Grid
                                                item
                                                xs={4}
                                                key={index}
                                                className="checkbox-name"
                                              >
                                                <FormControlLabel
                                                  value={eachItem?.value}
                                                  control={
                                                    <Radio color="secondary" />
                                                  }
                                                  label={eachItem?.label}
                                                />
                                              </Grid>
                                            );
                                          }
                                        )}
                                      </RadioGroup>
                                    </Grid>
                                    <Grid container spacing={2} key={index}>
                                      {monthlyYearlyPeriodValue === 'date' ? (
                                        <Grid
                                          item
                                          xs={8}
                                          key={index}
                                          className="checkbox-name"
                                        >
                                          <Dropdown
                                            data={EveryDays}
                                            label="12 days once"
                                          />
                                        </Grid>
                                      ) : (
                                        <>
                                          <Grid
                                            item
                                            xs={4}
                                            key={index}
                                            className="checkbox-name"
                                          >
                                            <Dropdown
                                              data={EveryOrder}
                                              label="First"
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            xs={4}
                                            key={index}
                                            className="checkbox-name"
                                          >
                                            <Dropdown
                                              data={WeekDays}
                                              label="Monthly"
                                            />
                                          </Grid>
                                        </>
                                      )}
                                    </Grid>
                                  </Stack>
                                </>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
                  <Grid container spacing={2}>
                    <Grid item xs={12} className="plus-icon-container">
                      <Box
                        className="plus-icon-container"
                        onClick={addMoreDates}
                      >
                        <img
                          src={AddMoreDataIcon}
                          alt=""
                          className="plus-icon"
                        />
                        <Stack className="add-more-days">Add More Date</Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  {daysList?.map((eachItem: any, index: number) => {
                    return (
                      <Grid
                        key={index}
                        container
                        spacing={2}
                        className="select-date-container"
                      >
                        <Box className="frequency-header-container">
                          <Grid item xs={6}>
                            <Typography className="frequency-header">
                              {eachItem?.title
                                ? `${eachItem?.title} - ${index + 1}`
                                : '--'}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            className={
                              daysList?.length > 1
                                ? 'enabled remove-container'
                                : 'disabled remove-container'
                            }
                          >
                            {daysList?.length > 1 && (
                              <Box
                                className={
                                  daysList?.length > 1
                                    ? 'enabled remove-container'
                                    : 'disabled remove-container'
                                }
                                onClick={() =>
                                  daysList?.length > 1 && removeDays(index)
                                }
                              >
                                <img
                                  src={RemoveIcon}
                                  alt=""
                                  className="remove-icon"
                                />
                                <Stack className="remove-label">Remove</Stack>
                              </Box>
                            )}
                          </Grid>
                        </Box>
                        <Stack className="frequency-header-underline"></Stack>
                        <Grid item xs={12} className="frequency-textfield">
                          <Typography className="each-field-label">
                            Enter Days
                          </Typography>
                          <TextField
                            placeholder={'Enter days count (ie., 15)'}
                          />
                        </Grid>
                      </Grid>
                    );
                  })}
                  <Grid container spacing={2}>
                    <Grid item xs={12} className="plus-icon-container">
                      <Box className="plus-icon-container">
                        <img
                          src={PlusCircleIcon}
                          alt=""
                          className="plus-icon"
                          onClick={addMoreDays}
                        />
                        <Stack className="add-more-days" onClick={addMoreDays}>
                          Add More Days
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              )}
            </Stack>
          </Stack>
          <FooterButton
            cancel="Cancel"
            submit="Submit"
            saveAsDraft="Save as draft"
            handleSubmitClick={handleSubmitClick}
            handleCancelClick={goBack}
            disabled={surrogateData}
          />
          {isNewRuleCreated && (
            <CustomModal
              openSuccess={isNewRuleCreated}
              handleCloseSuccess={handleSubmit}
              successModalTitle={'LMS Rule Edited Successfully'}
              successModalMsg={
                'Your request for editing new rule is successfully sent to the Reviewer.'
              }
              btn={'Close'}
            />
          )}
          {isDSAListModalOpen && (
            <CustomModal
              openSuccess={isDSAListModalOpen}
              handleCloseSuccess={() => setIsDSAListModalOpen(false)}
              title={`Selected DSA's`}
              duplicateRoleCloseBtn={'Close'}
              tableDataLMSRule={ShowMoreModalData}
            />
          )}
          {isDivisionListModalOpen && (
            <CustomModal
              openSuccess={isDivisionListModalOpen}
              handleCloseSuccess={() => setIsDivisionListModalOpen(false)}
              title={`Selected Division's`}
              duplicateRoleCloseBtn={'Close'}
              tableDataLMSRule={ShowMoreModalData}
            />
          )}
          {isFintechPartnerListModalOpen && (
            <CustomModal
              openSuccess={isFintechPartnerListModalOpen}
              handleCloseSuccess={() => setIsFintechPartnerListModalOpen(false)}
              title={`Selected Fintech Partner's`}
              duplicateRoleCloseBtn={'Close'}
              tableDataLMSRule={ShowMoreModalData}
            />
          )}
        </>
      </Stack>
    </Stack>
  );
}
export default EditLMSRule;
