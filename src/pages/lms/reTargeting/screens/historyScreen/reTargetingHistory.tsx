/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import '../../screens/reTargetingScreen/style.scss';
import {
  Typography,
  Stack,
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Popover,
  IconButton,
  Paper,
} from '@mui/material';
import BtnOutlined from '../../../../../components/commonComponent/CustomText/Button/Outlined';
import BtnContained from '../../../../../components/commonComponent/CustomText/Button/Contained';
import ChooseCategoryToViewData from '../../../../../components/commonComponent/ChooseCategoryToViewData';
import download_icon from '../../../../../assets/icons/download_icon.svg';
import mail_icon from '../../../../../assets/icons/mail_icon.svg';
import { state_label } from '../../../../sales/dashboard/dashboard.const';
import MoreFilterRightModal from '../../../../../components/commonComponent/customModal/MoreFilterRightModal';
import ListLMSTable from '../../../../../components/commonComponent/RightColumnFixedTable';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../../../../components/commonComponent/customModal/CustomModal';
import { reTargetingDropdownFields } from '../reTargetingScreen/reTargeting.const';
import dayjs, { Dayjs } from 'dayjs';
import './style.scss';
import Multiselector from '../../../../../components/commonComponent/MultiSelectNew';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { ReactComponent as DownArrowIcon } from '../../../../../assets/icons/dropdownarrow.svg';
import DateRangePopUp from '../../../../../components/commonComponent/DateRangePopUp';
import ascending_icon from '../../../../../assets/icons/ascending.svg';
import descending_icon from '../../../../../assets/icons/descending.svg';
export const retargetingData = [
  {
    id: '1',
    application: '123',
    customerName: 'Ashwin',
    mobileNumber: '1234567891',
    lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
    cibil: '123',
    income: '1500000',
    status: 'Approved',
    view: 'View',
  },
  {
    id: '2',
    application: '456',
    customerName: 'Ashwin',
    mobileNumber: '1234567891',
    cibil: '123',
    lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
    income: '1500000',
    status: 'Rejected',
    view: 'View',
    // more: <MoreVertIcon />,
  },
  {
    id: '3',
    application: '789',
    customerName: 'Ashwin',
    mobileNumber: '1234567891',
    cibil: '123',
    lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
    income: '1500000',
    status: 'Dropped',
    view: 'View',
    // more: <MoreVertIcon />,
  },
];

function ReTargetingHistory() {
  const navigate = useNavigate();
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [dayFilterValue, setDayFilter] = useState<string>('Current Day');
  const [openModel, setOpenModel] = useState(false);
  const [communicationModel, setCommunicationModel] = useState(false);
  const [successModel, setSuccesModel] = useState(false);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
  const [value, setValue] = React.useState('10');
  const [openDayFilter, setOpenDayFilter] = useState(false);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  //sorting
  const [dataList, setDataList] = useState<any>([...retargetingData]);
  const [filterState, setFilterState] = useState<any>([
    {
      value: 'lastModifiedDateTime',
      secondValue: null,
      threeValue: null,
      ascending: true,
    },
  ]);
  const filterData = () => {
    const filter = filterState[0];
    const sort = dataList.sort((a: any, b: any) => {
      if (filter.ascending) {
        if (filter.threeValue) {
          const first =
            a?.[filter.value]?.[filter.secondValue]?.[filter.threeValue] ?? '';
          const second =
            b?.[filter.value]?.[filter.secondValue]?.[filter.threeValue] ?? '';
          return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
        }
        if (filter.secondValue) {
          const first = a?.[filter.value]?.[filter.secondValue] ?? '';
          const second = b?.[filter.value]?.[filter.secondValue] ?? '';
          return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
        }
        const first = a?.[filter.value] ?? '';
        const second = b?.[filter.value] ?? '';
        return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
      }
      if (filter.threeValue) {
        const first =
          a?.[filter.value]?.[filter.secondValue]?.[filter.threeValue] ?? '';
        const second =
          b?.[filter.value]?.[filter.secondValue]?.[filter.threeValue] ?? '';
        return first.toLowerCase() > second.toLowerCase() ? -1 : 1;
      }
      if (filter.secondValue) {
        const first = a?.[filter.value]?.[filter.secondValue] ?? '';
        const second = b?.[filter.value]?.[filter.secondValue] ?? '';
        return first.toLowerCase() > second.toLowerCase() ? -1 : 1;
      }
      const first = a?.[filter.value] ?? '';
      const second = b?.[filter.value] ?? '';
      return first.toLowerCase() > second.toLowerCase() ? -1 : 1;
    });
    const result = [...sort];
    setDataList([...result]);
  };
  useEffect(() => {
    filterData();
  }, [filterState]);
  const handleSortByName = (
    name: string,
    secondItem: string,
    threeItem: string
  ) => {
    let filter = filterState[0];
    const secondState = secondItem === '' ? null : secondItem;
    const threeState = threeItem === '' ? null : threeItem;

    if (
      filter.value !== name ||
      filter.secondValue !== secondState ||
      filter.threeValue !== threeState
    ) {
      filter.ascending = true;
    } else {
      filter.ascending = !filter.ascending;
    }

    filter.value = name;
    filter.secondValue = secondState;
    filter.threeValue = threeState;
    const result = [{ ...filter }];
    setFilterState([...result]);
  };

  const openPopup = Boolean(anchorEl);
  const openId = openPopup ? 'simple-popover' : undefined;
  const handleCloseSuccess = () => {
    setOpenModel(false);
    setCommunicationModel(false);
    setSuccesModel(false);
  };

  const reTargetingModel = () => {
    setCommunicationModel(false);
    setSuccesModel(true);
  };

  useEffect(() => {
    const showTable = localStorage.getItem('reTargetingHistoryTable');
    if (showTable === 'true') {
      setIsFiltered(true);
    } else setIsFiltered(false);
  }, [localStorage.getItem('reTargetingHistoryTable')]);

  const searchFun = () => {
    setIsFiltered(true);
    localStorage.setItem('reTargetingHistoryTable', JSON.stringify(true));
  };

  const resetFun = () => {
    setIsFiltered(false);
    localStorage.setItem('reTargetingHistoryTable', JSON.stringify(false));
  };

  const day_filter_label = [
    {
      id: 1,
      label: 'Current Day',
      onclick: () => {
        setDayFilter('Current Day');
      },
    },
    {
      id: 2,
      label: 'Current Week',
      onclick: () => {
        setDayFilter('Current Week');
      },
    },
    {
      id: 3,
      label: 'Current Month',
      onclick: () => {
        setDayFilter('Current Month');
      },
    },
    {
      id: 4,
      label: 'Current Quarter',
      onclick: () => {
        setDayFilter('Current Quarter');
      },
    },
    {
      id: 5,
      label: 'Current Year',
      onclick: () => {
        setDayFilter('Current Year');
      },
    },
    {
      id: 6,
      label: 'Custom Period',
      onclick: () => {
        setDayFilter('Custom Period');
      },
    },
  ];

  const surrogates_label = [
    {
      id: 1,
      label: 'Payroll',
      // onclick: (() => {setDayFilter("Current Day");})
    },
    {
      id: 2,
      label: 'Card on Card',
      // onclick: (() => {setDayFilter("Current Week");})
    },
    {
      id: 3,
      label: 'CIBIL',
      // onclick: (() => {setDayFilter("Current Month");})
    },
    {
      id: 4,
      label: 'AQB',
      // onclick: (() => {setDayFilter("Current Quarter");})
    },
    {
      id: 5,
      label: 'RC',
      // onclick: (() => {setDayFilter("Current Year");})
    },
  ];
  const channels_label = [
    {
      id: 1,
      label: 'Bank',
    },
    {
      id: 2,
      label: 'DSA',
    },
    {
      id: 3,
      label: 'Fintech Partners',
    },
  ];

  const column1: any = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '80px',
      render: (_: string, row: any, index: number) => {
        return <Stack>{index + 1}</Stack>;
      },
    },
    {
      title: 'Application#',
      dataIndex: 'application',
      key: 'application',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('application', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'application' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('customerName', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'customerName' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('mobileNumber', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'mobileNumber' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'CIBIL',
      dataIndex: 'cibil',
      key: 'cibil',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('cibil', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'cibil' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Date & Time',
      dataIndex: 'lastModifiedDateTime',
      key: 'lastModifiedDateTime',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('lastModifiedDateTime', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'lastModifiedDateTime' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Income',
      dataIndex: 'income',
      key: 'income',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('income', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'income' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
  ];
  const column2: any = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('status', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'status' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {filterState[0].ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'View',
      dataIndex: 'view',
      key: 'view',
      render: (text: string) => {
        return (
          <Stack
            sx={{ color: '#0662B7', cursor: 'pointer' }}
            onClick={() => navigate('/lms/retargeting/reTargetingDetails')}
          >
            {text}
          </Stack>
        );
      },
    },
  ];
  const product_label = [
    {
      id: 1,
      title: 'SMS',
      defaultChecked: false,
    },
    {
      id: 2,
      title: 'Whatsapp',
      defaultChecked: false,
    },
    {
      id: 3,
      title: 'Mail',
      defaultChecked: false,
    },
    {
      id: 4,
      title: 'Call',
      defaultChecked: false,
    },
  ];

  const toggleOptions = [
    { title: 'All' },
    { title: 'Approved' },
    { title: 'In-Progress' },
    { title: 'Rejected' },
    { title: 'Dropped' },
  ];
  const handleChangeDate = (newValue: Dayjs | null) => {
    setStartDate(newValue);
  };
  const handleChange = (event: any) => {
    setValue(event.target.value as string);
  };
  const handleCustomClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const handleCloseCustom = () => {
    console.log('checking custom period');
    setAnchorEl(null);
    setAnchorElement(null);
    setOpenDayFilter(false);
    setDayFilter('Custom Period');
  };
  return (
    <Stack className="retargetingMainContainer">
      <Stack className="retargetingcontainer">
        <Grid container spacing={2} className="retargeting-filters-container">
          {reTargetingDropdownFields?.map((eachItem: any, index: number) => {
            return (
              <Grid item xs={3} key={index}>
                <Typography className="retargeting-dropdown-label">
                  {eachItem?.label}
                </Typography>

                <Multiselector options={eachItem?.option} />
              </Grid>
            );
          })}
        </Grid>

        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '20px 0',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={3} lg={3}>
              <Stack>
                <Typography className="retargeting-dropdown-label-period">
                  Period
                </Typography>
                <FormControl sx={{ width: '100%' }}>
                  {/* <Input value={dayFilterValue} /> */}
                  {/* <InputLabel id="demo-multiple-name-label">
                          {dayFilterValue}
                        </InputLabel> */}
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    size="small"
                    open={openDayFilter}
                    onOpen={() => setOpenDayFilter(true)}
                    onClose={() => setOpenDayFilter(false)}
                    value={dayFilterValue}
                    onChange={handleChange}
                    IconComponent={(props) => (
                      <DownArrowIcon
                        {...props}
                        style={{
                          marginTop: '2px',
                          marginRight: '4px',
                          padding: '1px',
                        }}
                      />
                    )}
                    sx={{
                      '& legend': { display: 'none' },
                      '& fieldset': { top: 0 },
                    }}
                    renderValue={(selected: any) => {
                      return selected;
                    }}
                    style={{ height: 46 }}
                    input={
                      <OutlinedInput
                        // value={dayFilterValue}
                        sx={{ paddingBottom: '10px' }}
                      />
                    }
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <Paper variant="outlined" elevation={2}>
                      {day_filter_label?.map((value) => (
                        <>
                          {value.label !== 'Custom Period' && (
                            <MenuItem
                              key={value.id}
                              // value={value.label}
                              onClick={value.onclick}
                              // sx={{
                              //   borderLeft: '1px solid #e0e0de',
                              //   borderRight: '1px solid #e0e0de',
                              // }}
                            >
                              {value.label}
                            </MenuItem>
                          )}
                          {value.label === 'Custom Period' && (
                            <MenuItem
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                // borderLeft: '1px solid #e0e0de',
                                // borderRight: '1px solid #e0e0de',
                                // borderBottom: '1px solid #e0e0de',
                              }}
                              key={value.id}
                              // value={value.label}
                              onClick={(e: any) => {
                                handleCustomClick(e);
                              }}
                            >
                              {value.label}
                              <CalendarTodayOutlinedIcon />
                            </MenuItem>
                          )}
                        </>
                      ))}
                    </Paper>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={2} lg={2}>
              <Stack
                sx={{
                  // width: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginTop: '30px',
                }}
              >
                <Stack
                  sx={{
                    textTransform: 'capitalize',
                  }}
                >
                  <MoreFilterRightModal
                    product_label={product_label}
                    day_filter_label={day_filter_label}
                    dayFilterValue={dayFilterValue}
                    submit={'Apply'}
                    close={'Reset'}
                    policies_label={channels_label}
                    surrogates_label={surrogates_label}
                    state_label={state_label}
                    // zonal_label={zonal_label}
                    flag="reTargeting"
                  />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        <Box className="retargeting-button-container">
          <BtnOutlined title="Reset" onClick={resetFun} />
          <BtnContained title="Search" onClick={searchFun} />
        </Box>
      </Stack>

      {isFiltered ? (
        <Stack sx={{ marginBottom: '30px' }}>
          <Stack
            className="retargetingOrgDetails"
            sx={{
              padding: '0 30px',
            }}
          >
            <Stack className="retargetingOrgDetailsHeaderTable">
              <Stack>
                <Typography>Organisation Details</Typography>
              </Stack>
              <Stack>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                  }}
                >
                  <Stack
                    className="btnIcon"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img src={download_icon} alt="download_icon" />
                  </Stack>
                  <Stack
                    className="btnIcon"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img src={mail_icon} alt="mail_icon" />
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Stack>

          <ListLMSTable
            data={[...dataList]}
            listColumn={column1}
            statusColumn={column2}
            flag="retargeting-history"
            label={product_label}
            toggleOptions={toggleOptions}
          />
        </Stack>
      ) : (
        <ChooseCategoryToViewData />
      )}
      {openModel && (
        <CustomModal
          openSuccess={openModel}
          handleCloseSuccess={handleCloseSuccess}
          // successModalTitle={'Activation Organisation'}
          // successModalMsg={
          //   'Your request for Activating Org is successfully sent to the Reviewer.'
          // }
          // btn={' Close'}
          LoadingMsg={'Loading selected application(s) for Re-Targeting'}
        />
      )}
      {communicationModel && (
        <CustomModal
          openSuccess={communicationModel}
          handleCloseSuccess={handleCloseSuccess}
          title={'Choose the mode of communication'}
          close={'Cancel'}
          submit={'Re-Target'}
          product_label={product_label}
          handleSuccess={reTargetingModel}
        />
      )}
      {successModel && (
        <CustomModal
          openSuccess={successModel}
          handleCloseSuccess={handleCloseSuccess}
          successMsg={
            'Selected applications are being processed. They will be notified of eligible customers to resume or process.'
          }
        />
      )}
      <Popover
        id={openId}
        open={openPopup}
        anchorEl={anchorEl}
        onClose={handleCloseCustom}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        disableEnforceFocus={true}
      >
        <DateRangePopUp
          open={openPopup}
          onCloseCustomPeriod={() => handleCloseCustom()}
          onDoneCustomPeriod={() => {
            handleCloseCustom();
          }}
        />
      </Popover>
    </Stack>
  );
}

export default ReTargetingHistory;
