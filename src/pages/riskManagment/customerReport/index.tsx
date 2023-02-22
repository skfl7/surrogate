/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './style.scss';
import Email_Icon from '../../../assets/images/emailIcon.svg';
import ascending_icon from '../../../assets/icons/ascending.svg';
import descending_icon from '../../../assets/icons/descending.svg';
import Download_Icon from '../../../assets/images/downloadIcon.svg';
import BtnContained from '../../../components/commonComponent/CustomText/Button/Contained';
import BtnOutlined from '../../../components/commonComponent/CustomText/Button/Outlined';
import { ReactComponent as DownArrowIcon } from '../../../assets/icons/dropdownarrow.svg';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import {
  Typography,
  Stack,
  Box,
  Grid,
  Link,
  FormControl,
  MenuItem,
  Select,
  OutlinedInput,
  Popover,
  IconButton,
} from '@mui/material';
import {
  approvedCustomerDetailData,
  customerDetailsRiskManagment,
  CustomerReportFilterDropdown,
  referCustomerDetailData,
  rejectedCustomerDetailData,
  rejectedriskMngmtViewData,
  riskDashboardData,
  riskMngmtViewData,
} from '../riskManagement.const';
import EmptyTableView from '../../../components/commonComponent/EmptyTableView';
import ListLMSTable from '../../../components/commonComponent/RightColumnFixedTable';
import { useNavigate, useLocation } from 'react-router-dom';
import DateRangePopUp from '../../../components/commonComponent/DateRangePopUp';
import Multiselector from '../../../components/commonComponent/MultiSelectNew';

const toggleOptions = [
  { title: 'All' },
  { title: 'Refer' },
  { title: 'Approved' },
  { title: 'Rejected' },
];
export const column1: any = [
  {
    title: '#',
    width: '70px',
    render: (text: string) => {
      return <Stack>{text}</Stack>;
    },
  },
  {
    title: 'Application',
  },
  {
    title: 'Customer Name',
  },
  { title: 'Mobile Number' },
  { title: 'Surrogate Name' },
  { title: 'KYC Status' },
  { title: 'Status' },
  { title: 'View' },
];
function CustomerReport() {
  const location = useLocation();
  const [isFiltered, setIsFiltered] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const navigate = useNavigate();
  // const [value, setValue] = React.useState('10');

  const [dayFilterValue, setDayFilter] = useState<string>('Current Day');
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );
  const [openDayFilter, setOpenDayFilter] = useState(false);
  const [dropdownReset, setDropDownReset] = useState(false);

  const handleChange = (e: any) => {
    setDayFilter(e.target.value);
  };

  const handleCustomClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const openCustom = Boolean(anchorElement);
  const idCustom = openCustom ? 'simple-popover' : undefined;

  const handleCloseCustom = () => {
    setAnchorElement(null);
    setOpenDayFilter(false);
    setDayFilter('Custom Period');
  };

  const { state } = location;

  useEffect(() => {
    if (state) {
      setIsFiltered(state);
    }
  }, [state]);
  //sorting
  const [dataList, setDataList] = useState<any>([...riskDashboardData]);
  const [filterState, setFilterState] = useState<any>([
    {
      value: 'dateAndTime',
      secondValue: null,
      threeValue: null,
      ascending: true,
    },
  ]);
  const filterData = () => {
    // const { value, secondValue, threeValue, ascending } = filterState[0];
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
    console.log('sort', sort);
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
  const risklistHeaderData: any = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '70px',
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
      title: 'Surrogate Name',
      dataIndex: 'surrogateName',
      key: 'surrogateName',
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
            onClick={() => handleSortByName('surrogateName', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'surrogateName' && (
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
      dataIndex: 'dateAndTime',
      key: 'dateAndTime',
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
            onClick={() => handleSortByName('dateAndTime', '', '')}
          >
            <>{text}</>
            {filterState[0].value === 'dateAndTime' && (
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
      title: 'Actions',
      dataIndex: 'more',
      key: 'more',
      headerRender: () => {
        return <span>Actions</span>;
      },
      render: (_: string, row: any, index: number) => {
        var modalTxt = '';
        var userData = {};
        var riskDetailData: any = [];
        if (row.status === 'Rejected') {
          modalTxt = 'Forced Approve';
          userData = { ...rejectedCustomerDetailData };
          riskDetailData = rejectedriskMngmtViewData;
        } else if (row.status === 'Approved') {
          modalTxt = 'Forced Reject';
          userData = { ...approvedCustomerDetailData };
          riskDetailData = riskMngmtViewData;
        } else if (row.status === 'Refer') {
          modalTxt = '';
          userData = { ...referCustomerDetailData };
          riskDetailData = rejectedriskMngmtViewData;
        }
        return (
          <Link
            sx={{ cursor: 'pointer', color: '#0662B7', textDecoration: 'none' }}
            onClick={() =>
              navigate('/riskManagement/customerDetails', {
                state: {
                  scoreData: { ...customerDetailsRiskManagment },
                  statusText: row.status,
                  modalText: modalTxt,
                  cashFlowData: { ...userData },
                  riskMngmtViewContent: riskDetailData,
                },
              })
            }
          >
            View
          </Link>
        );
      },
    },
  ];

  const dropdownResetFun = () => {
    setToggleState(!toggleState);
    setDropDownReset(true);
    setIsFiltered(false);
    resetFun();
  };

  useEffect(() => {
    const showTable = localStorage.getItem('riskManagementTable');

    if (showTable === 'true') {
      setIsFiltered(true);
    } else setIsFiltered(false);
  }, [localStorage.getItem('riskManagementTable')]);

  const searchFun = () => {
    setIsFiltered(true);
    localStorage.setItem('riskManagementTable', JSON.stringify(true));
  };

  const resetFun = () => {
    localStorage.setItem('riskManagementTable', JSON.stringify(false));
  };

  return (
    <Stack className="risk-customer-report-list">
      <Stack className="container">
        <Stack className="padding-container">
          <Stack className="underline">
            <Stack>
              <Typography
                variant="subtitle1"
                sx={{ letterSpacing: 0.5, fontWeight: 600, fontSize: '16px' }}
              >
                Customer Report
              </Typography>
              <Typography variant="subtitle2" className="sub-label">
                Lorem ipsum dolor sit amet consectetur. Sit.
              </Typography>
            </Stack>
          </Stack>
          <Grid container spacing={2} className="filters-container">
            {CustomerReportFilterDropdown?.map(
              (eachItem: any, index: number) => {
                return eachItem?.label === 'Period' ? (
                  <Grid item xs={3} key={index}>
                    <Typography className="dropdown-label">
                      {eachItem?.label}
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
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        {day_filter_label?.map((value) =>
                          value.label !== 'Custom Period' ? (
                            <MenuItem
                              key={value.id}
                              // value={value.label}
                              onClick={value.onclick}
                              sx={{
                                borderLeft: '1px solid #e0e0de',
                                borderRight: '1px solid #e0e0de',
                              }}
                            >
                              {value.label}
                            </MenuItem>
                          ) : (
                            <MenuItem
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderLeft: '1px solid #e0e0de',
                                borderRight: '1px solid #e0e0de',
                                borderBottom: '1px solid #e0e0de',
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
                          )
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                ) : (
                  <Grid item xs={3} key={index}>
                    <Typography className="dropdown-label">
                      {eachItem?.label}
                    </Typography>
                    <Multiselector
                      options={eachItem?.option}
                      dropdownReset={dropdownReset}
                      toggle={toggleState}
                    />
                  </Grid>
                );
              }
            )}
          </Grid>
          <Box className="button-container">
            <BtnOutlined title="Reset" onClick={dropdownResetFun} />
            <BtnContained title="Search" onClick={searchFun} />
          </Box>
        </Stack>
      </Stack>

      <Stack className="container">
        <Box
          sx={{
            paddingX: 4,
            backgroundColor: 'white',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 0',
              borderBottom: `2px solid #F0F2F5`,
            }}
          >
            <Box>
              <Typography
                sx={{ fontSize: '14px', fontWeight: 600, lineHeight: '16px' }}
              >
                Application Data
              </Typography>
            </Box>
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
                  cursor: 'pointer',
                }}
              >
                <img src={Download_Icon} alt="download_icon" />
              </Stack>
              <Stack
                className="btnIcon"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <img src={Email_Icon} alt="mail_icon" />
              </Stack>
            </Box>
          </Box>
        </Box>
        <Typography variant="subtitle2" className="sub-label"></Typography>

        {isFiltered ? (
          <Stack sx={{ paddingX: '30px' }}>
            <ListLMSTable
              data={[...dataList]}
              listColumn={risklistHeaderData}
              statusColumn={column2}
              flag="riskMngmt"
              toggleOptions={toggleOptions}
            />
          </Stack>
        ) : (
          <Stack className="padding-container">
            <EmptyTableView
              toggleOptions={toggleOptions}
              headerData={column1}
            />
          </Stack>
        )}
      </Stack>
      <Popover
        id={idCustom}
        open={openCustom}
        anchorEl={anchorElement}
        onClose={handleCloseCustom}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        disableEnforceFocus={true}
      >
        <DateRangePopUp
          open={openCustom}
          onCloseCustomPeriod={() => handleCloseCustom()}
          onDoneCustomPeriod={() => {
            handleCloseCustom();
          }}
        />
      </Popover>
    </Stack>
  );
}

export default CustomerReport;
