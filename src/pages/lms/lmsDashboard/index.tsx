import {
  Typography,
  Button,
  Grid,
  Stack,
  Box,
  IconButton,
} from '@mui/material';
import CheckBoxPopOver from '../../../components/commonComponent/CheckBoxPopOver/SingleLabel';
import DateTimePopOver from '../../../components/commonComponent/DateTimePopOver';
import {
  product_label,
  state_label,
} from '../../sales/dashboard/dashboard.const';
import { ReactComponent as Reset } from '../../../assets/icons/reset.svg';
import ascending_icon from '../../../assets/icons/ascending.svg';
import descending_icon from '../../../assets/icons/descending.svg';
import { useEffect, useState } from 'react';
import './style.scss';
import Rejected from '../../../assets/icons/rejected_icon.svg';
import Dropped from '../../../assets/icons/dropped_icon.svg';
import ApprovedIcon from '../../../assets/icons/approved_icon.svg';
import InProgress from '../../../assets/icons/in_progress_icon.svg';
import RejectedIcon from '../../../assets/icons/rejectedApplication.svg';
import RetargetedInitiate from '../../../assets/icons/retargetedaInitiate.svg';
import RetargetedFailed from '../../../assets/icons/retargetedFailed.svg';
import RetargetedRate from '../../../assets/icons/retargetedRate.svg';
import DashboardCard from '../../../components/commonComponent/CommonCard/SalesDashbaordCard/DashboardCard';
import LMSDashboardCard from '../../../components/commonComponent/CommonCard/LMSDashboardCard';
import ReactApexChart from 'react-apexcharts';
import ListLMSTable from '../../../components/commonComponent/RightColumnFixedTable';
import DownloadIcon from '../../../assets/icons/download_icon.svg';
import MailIcon from '../../../assets/icons/mail_icon.svg';
import { useNavigate } from 'react-router-dom';
import MoreFilterRightModal from '../../../components/commonComponent/customModal/MoreFilterRightModal';
import localforage from 'localforage';
import { getPermission } from '../../../utils/ActionAllowed/UserActionAllowed';

export const lmsDashboardData = [
  {
    id: '1',
    application: 'abc',
    customerName: 'Ashwin',
    mobileNumber: '1234567891',
    lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
    cibil: '123',
    income: '1500000',
    status: 'Rejected',
    more: 'View',
  },
  {
    id: '2',
    application: 'def',
    customerName: 'Ashwin',
    mobileNumber: '1234567891',
    lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
    cibil: '123',
    income: '1500000',
    status: 'Rejected',
    more: 'View',
  },
  {
    id: '3',
    application: 'yrw',
    customerName: 'Ashwin',
    mobileNumber: '1234567891',
    lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
    cibil: '123',
    income: '1500000',
    status: 'Dropped',
    more: 'View',
  },
];

const donutGraphSeries: any = [12, 3, 14, 8, 17, 20, 6, 13];

const donutGraphSeries2: any = [20, 13, 17, 4, 3, 12, 13, 6];

const donutGraphOptions: {} = {
  series: [12, 3, 14, 8, 17, 20, 6, 13],
  labels: [
    'Office Pincode',
    'Resident Pincode',
    'C4C-Card Rejection',
    'HRMS Not Listed',
    'DPD',
    'KYC Rejection',
    'Low Income',
    'Low Salary',
  ],
  colors: [
    '#E697FF',
    '#F18F96',
    '#999B9C',
    '#8BCD9A',
    '#63ABFD',
    '#F8B481',
    '#F5DE99',
    '#A08BDA',
  ],
  chart: {
    type: 'donut',
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'left',
    offsetX: 30,
    itemMargin: {
      horizontal: 30,
      vertical: 10,
    },
    width: '100%',
  },
  plotOptions: {
    pie: {
      dataLabels: {
        offset: 50,
      },
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Rejected',
            color: '#999B9C',
          },
        },
      },
    },
  },
};

const donutGraphOptions2: {} = {
  series: [20, 13, 17, 4, 3, 12, 13, 6],
  labels: [
    'Initial Verification',
    'Surrogare Selection',
    'HRMS - Input',
    'Employment Details',
    'HRMS - Fetching Data',
    'C4C - Eligible',
    'C4C - Verification',
    'Card Selection',
  ],
  colors: [
    '#8BCD9A',
    '#F8B481',
    '#63ABFD',
    '#F18F96',
    '#E697FF',
    '#F5DE99',
    '#A08BDA',
    '#999B9C',
  ],
  chart: {
    type: 'donut',
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'left',

    offsetX: 30,
    itemMargin: {
      horizontal: 20,
      vertical: 10,
    },
  },
  plotOptions: {
    pie: {
      dataLabels: {
        offset: 50,
      },
      donut: {
        background: 'transparent',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Rejected',
            color: '#999B9C',
          },
        },
      },
    },
  },
};

export const LMSDashboard = () => {
  const [dayFilterValue, setDayFilter] = useState<string>('Current Day');
  const navigate = useNavigate();

  // sorting
  const [lmsData, setLmsData] = useState<any>([...lmsDashboardData]);
  const [filterState, setFilterState] = useState<any>([
    {
      value: 'lastModifiedDateTime',
      secondValue: null,
      threeValue: null,
      ascending: true,
    },
  ]);
  const [actionAllowedItem, setActionAllowedItem] = useState([]);

  useEffect(() => {
    getLocalStorageValue();
  }, []);

  const getLocalStorageValue = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setActionAllowedItem(value?.actionsAllowed);
    } catch (err) {
      console.log(err);
    }
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

  const dashboardVal = [
    {
      index: 1,
      title: 'Rejected Application(s)',
      value: 3500,
      more: true,
      image: Rejected,
      boxstyles: 'rejected-icon-box',
    },
    {
      index: 2,
      title: 'Dropped Application(s)',
      value: 3500,
      more: true,
      image: Dropped,
      boxstyles: 'dropped-icon-box',
    },
  ];
  const dummy = [
    { code: 'All Channels', name: 'All Channels' },
    { code: 'Bank', name: 'Bank' },
    { code: 'DSA', name: 'DSA' },
    { code: 'Fintech Partners', name: 'Fintech Partners' },
  ];
  const dummy1 = [
    { code: 'All Surrogates', name: 'All Surrogates' },
    { code: 'Bank', name: 'Bank' },
    { code: 'DSA', name: 'DSA' },
    { code: 'Fintech Partners', name: 'Fintech Partners' },
  ];
  const channelUserData = [
    {
      index: 1,
      title: 'Rejected Application',
      value: 3500,
      more: false,
      image: RejectedIcon,
      viewAll: false,
    },
    {
      index: 2,
      title: 'Re-Target Initiated',
      value: 3500,
      more: false,
      image: RetargetedInitiate,
      viewAll: false,
      lastPeriodValue: 2500,
      lastYearValue: 2500,
    },
    {
      index: 3,
      title: 'Re-Target - Failed',
      value: 3500,
      more: false,
      image: RetargetedFailed,
      viewAll: false,
      lastPeriodValue: 2500,
      lastYearValue: 2500,
    },
    {
      index: 4,
      title: 'Re-Target - Approval Rate (%)',
      value: '95.09%',
      more: false,
      image: RetargetedRate,
      viewAll: false,
      lastPeriodValue: 2500,
      lastYearValue: 2500,
    },
    {
      index: 5,
      title: 'Re-Target - In Progress',
      value: 3500,
      more: true,
      image: InProgress,
      viewAll: false,
      boxstyles: 'progress-icon-box',
    },
    {
      index: 6,
      title: 'Re-Target - Approved',
      value: 3500,
      more: true,
      image: ApprovedIcon,
      viewAll: false,
      lastPeriodValue: 2500,
      lastYearValue: 2500,
      boxstyles: 'approval-icon-box',
    },
    {
      index: 7,
      title: 'Re-Target - Dropped',
      value: 3500,
      more: true,
      image: Dropped,
      viewAll: false,
      lastPeriodValue: 2500,
      lastYearValue: 2500,
      boxstyles: 'dropped-icon-box',
    },
    {
      index: 8,
      title: 'Re-Target - Rejected #',
      value: 3500,
      more: true,
      image: Rejected,
      viewAll: false,
      lastPeriodValue: 2500,
      lastYearValue: 2500,
      boxstyles: 'rejected-icon-box',
    },
  ];
  const filterData = () => {
    // const { value, secondValue, threeValue, ascending } = filterState[0];
    const filter = filterState[0];
    const sort = lmsData.sort((a: any, b: any) => {
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
    setLmsData([...result]);
  };
  useEffect(() => {
    filterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const column1: any = [
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
      title: 'Actions',
      sortIcon: false,
      dataIndex: 'more',
      key: 'more',
      headerRender: () => {
        return <text>View</text>;
      },
      render: (_: string, row: any, index: number) => {
        return (
          <Stack
            sx={{
              cursor: 'pointer',
              color: '#0662B7',
              // textAlign: 'center',
            }}
            className="viewTextLms"
            onClick={() => navigate('/lms/retargeting/reTargetingDetails')}
          >
            View
          </Stack>
        );
      },
    },
  ];

  const toggleOptions = [
    { title: 'All' },
    { title: 'Rejected' },
    { title: 'Dropped' },
  ];

  return (
    <>
      <div className="lms-dashboard-container">
        <>
          <div className="filter-header">
            <div className="filter-data">
              <Typography
                sx={{
                  fontSize: '16px',
                  marginRight: '24px',
                  color: '#151515',
                  fontWeight: '500',
                }}
              >
                Overview
              </Typography>
              <DateTimePopOver
                day_filter_label={day_filter_label}
                dayFilterValue={dayFilterValue}
              />
              <CheckBoxPopOver options={dummy} displayText={'All Channels'} />
              <CheckBoxPopOver
                options={dummy1}
                displayText={'All Surrogates'}
              />
              {/* <CheckBoxPopOver
                surrogates_label={channels_label}
                displayText={'All Channels'}
                showSearch={true}
                submit={'Select'}
                close={'Reset'}
              />
              <CheckBoxPopOver
                surrogates_label={surrogates_label}
                displayText={'All Surrogates'}
                showSearch={true}
                submit={'Select'}
                close={'Reset'}
              /> */}
              <MoreFilterRightModal
                product_label={product_label}
                day_filter_label={day_filter_label}
                dayFilterValue={dayFilterValue}
                submit={'Select'}
                close={'Reset'}
                policies_label={channels_label}
                surrogates_label={surrogates_label}
                state_label={state_label}
                flag="main-dashboard"
              />
            </div>
            <div className="reset-data">
              <Button
                startIcon={<Reset />}
                sx={{
                  fontSize: '11.52px',
                  marginRight: '10px',
                  color: '#0662B7',
                  backgroundColor: '#EEF7FF',
                  textTransform: 'none',
                }}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="divider-line" />
          <div className="horizontal-cards">
            <Grid container spacing={2}>
              {dashboardVal?.map((value) => (
                <Grid xs={6} item key={value.index}>
                  <DashboardCard
                    title={value.title}
                    value={value.value}
                    more={value.more}
                    image={value.image}
                    boxStyles={value.boxstyles}
                    navPath="/sales/salesReport"
                  />
                </Grid>
              ))}
            </Grid>
          </div>
          <div className="report-cards">
            <div className="graph-card">
              <div className="graph-div">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    height: '27px',
                    cursor: 'pointer',
                  }}
                >
                  <span className="overview-text">Rejected data </span>
                  <Stack>
                    <Box
                      sx={{
                        display: 'flex',
                      }}
                    >
                      {getPermission(
                        actionAllowedItem,
                        'LMS',
                        'LMS_DASHBOARD',
                        'DOWNLOAD_LMS_EMAIL_CUSTOMER_DATA'
                      ) && (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
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
                            <img src={DownloadIcon} alt="download_icon" />
                          </Stack>
                          <Stack
                            className="btnIcon"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <img src={MailIcon} alt="mail_icon" />
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </div>
                <div className="line-div" />
                <div className="donut-chart-div" id="chart">
                  <ReactApexChart
                    options={donutGraphOptions}
                    series={donutGraphSeries}
                    type="donut"
                    height={500}
                  />
                </div>
              </div>
            </div>

            <div className="graph-card">
              <div className="graph-div">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    height: '27px',
                  }}
                >
                  <span className="overview-text">Dropped data </span>
                  <Stack>
                    {getPermission(
                      actionAllowedItem,
                      'LMS',
                      'LMS_DASHBOARD',
                      'DOWNLOAD_LMS_EMAIL_CUSTOMER_DATA'
                    ) && (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
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
                          <img src={DownloadIcon} alt="download_icon" />
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
                          <img src={MailIcon} alt="mail_icon" />
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </div>

                <div className="line-div" />
                <div className="donut-chart-div" id="chart">
                  <ReactApexChart
                    options={donutGraphOptions2}
                    series={donutGraphSeries2}
                    type="donut"
                    height={500}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
      <div className="diff-area" />
      <div className="lms-dashboard-container">
        <div className="heading-text">
          <Typography sx={{ color: 'black', fontSize: '16px' }}>
            Re-target Insights
          </Typography>
        </div>
        <div className="divider-line" />
        <div className="horizontal-cards2">
          <Grid container spacing={2}>
            {channelUserData.map((value) => (
              <Grid xs={3} item key={value.index}>
                <LMSDashboardCard
                  title={value.title}
                  value={value.value}
                  more={value.more}
                  image={value.image}
                  viewAll={value.viewAll}
                  navPath="/lms/retargeting"
                  lastPeriodValue={value.lastPeriodValue}
                  lastYearValue={value.lastYearValue}
                  boxStyles={value.boxstyles}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      <div className="diff-area" />
      <Stack sx={{ backgroundColor: 'white', margin: '30px 0px' }}>
        <Stack
          sx={{
            margin: '20px 30px 0px 30px',
            borderBottom: '2px solid #eceff2',
          }}
        >
          <Typography sx={{ marginBottom: '20px' }}>
            Recent {lmsDashboardData.length} Data
          </Typography>
        </Stack>
        <div style={{ margin: '0 30px' }}>
          <ListLMSTable
            data={[...lmsData]}
            listColumn={column1}
            statusColumn={column2}
            flag="lmsdashboard"
            label={product_label}
            toggleOptions={toggleOptions}
          />
        </div>
      </Stack>
    </>
  );
};
