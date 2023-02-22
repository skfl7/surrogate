/* eslint-disable @typescript-eslint/no-unused-vars */
import DashboardCard from '../../components/commonComponent/CommonCard/SalesDashbaordCard/DashboardCard';
import {
  listRowHeading,
  product_label,
  salesDashboardList,
  state_label,
  statusRowHeading,
} from '../sales/dashboard/dashboard.const';
import './style.scss';
import ApprovedIcon from '../../assets/icons/approved_icon.svg';
import InProgress from '../../assets/icons/in_progress_icon.svg';
import Rejected from '../../assets/icons/rejected_icon.svg';
import ApprovedRate from '../../assets/icons/dashboard_rate.svg';
import FintechIcon from '../../assets/icons/fintech-partner-icon.svg';
import dsaIcon from '../../assets/icons/totaldsa_icon.svg';
import UserIcon from '../../assets/icons/users_icon.svg';
import { useState } from 'react';
import TableComp from '../../components/commonComponent/ListTable/ListTable';
import BarGraph from '../../components/commonComponent/BarGraph/BarGraph';
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import CheckBoxPopOver from '../../components/commonComponent/CheckBoxPopOver/SingleLabel';
import DateTimePopOver from '../../components/commonComponent/DateTimePopOver';
import { ReactComponent as Reset } from '../../assets/icons/reset.svg';
import MoreFilterRightModal from '../../components/commonComponent/customModal/MoreFilterRightModal';
import download_icon from '../../assets/icons/download_icon.svg';
import banking_icon from '../../assets/icons/banking_icon.svg';
import mail_icon from '../../assets/icons/mail_icon.svg';
import { colors } from '../../style/Color';
import GroupButton from '../../components/commonComponent/GroupButton/GroupButton';
const currencies = [
  {
    value: 1,
    label: 'All Status',
  },
  {
    value: 2,
    label: 'Approved',
  },
  {
    value: 3,
    label: 'In-Progress',
  },
  {
    value: 4,
    label: 'Rejected',
  },
  {
    value: 5,
    label: 'Dropped',
  },
];
const spineGraphStatus = [
  {
    value: 1,
    label: 'All Surrogates',
  },
  {
    value: 2,
    label: 'Card For Card',
  },
  {
    value: 3,
    label: 'Payroll',
  },
];
const dashboardVal = [
  {
    index: 1,
    title: 'Approved Applications',
    value: 3500,
    more: true,
    image: ApprovedIcon,
    boxstyles: 'approval-icon-box',
  },
  {
    index: 2,
    title: 'Approval Rate(%)',
    value: '98.6%',
    more: false,
    image: ApprovedRate,
    boxstyles: 'progress-icon-box',
  },
  {
    index: 3,
    title: 'In-Progress Applications',
    value: 26,
    more: true,
    image: InProgress,
    boxstyles: 'dropped-icon-box',
  },
  {
    index: 4,
    title: 'Rejected Applications',
    value: 345,
    more: true,
    image: Rejected,
    boxstyles: 'rejected-icon-box',
  },
];
const options: {} = {
  colors: ['#4FB366', '#E9BD36', '#EA5560', '#992D26'],
  chart: {
    background: colors.graphBg,
    type: 'bar',
    height: 350,
    toolbar: {
      show: true,
      tools: {
        download: false,
      },
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
      borderRadius: 2,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['transparent'],
  },
  grid: {
    borderColor: '#9AC1E5',
    strokeDashArray: 2,
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  xaxis: {
    range: 12,
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    axisBorder: {
      show: true,
      color: '#2d67b4',
      offsetX: 0,
      offsetY: 0,
    },
  },
  yaxis: {
    labels: {
      formatter: function (val: any) {
        return val + 'L';
      },
    },
    axisBorder: {
      show: true,
      color: '#2d67b4',
      offsetX: 0,
      offsetY: 0,
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    horizontalAlign: 'left',
    markers: {
      radius: 20,
    },
  },
};
const series = [
  {
    name: 'Approved',
    data: [5, 10, 17, 0, 12, 17, 13, 0, 18, 14, 20, 0],
  },
  {
    name: 'In-Progress',
    data: [5, 0, 2, 5, 0, 10, 3, 5, 0, 7, 10, 13],
  },
  {
    name: 'Rejected Applications',
    data: [0, 10, 10, 15, 3, 0, 6, 8, 2, 0, 12, 16],
  },
  {
    name: 'Rejected Dropped',
    data: [5, 10, 0, 15, 7, 18, 0, 20, 4, 8, 0, 17],
  },
];
const spineGraphSeries = [
  {
    name: 'Card For Card',
    data: [31, 40, 28, 51, 42, 109, 100],
  },
  {
    name: 'Payroll',
    data: [11, 32, 45, 32, 34, 52, 41],
  },
];
const spineGraphOptions: {} = {
  colors: ['#5D3BBD', '#F37B21'],
  chart: {
    background: colors.graphBg,
    height: 350,
    type: 'area',
    toolbar: {
      show: true,
      tools: {
        download: false,
      },
    },
    zoom: {
      enabled: false,
    },
  },
  grid: {
    borderColor: '#9AC1E5',
    strokeDashArray: 2,
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  legend: {
    horizontalAlign: 'left',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  fill: {
    type: 'solid',
    opacity: 1,
    colors: ['transparent'],
  },
  xaxis: {
    type: 'datetime',
    categories: [
      '2018-09-19T00:00:00.000Z',
      '2018-09-19T01:30:00.000Z',
      '2018-09-19T02:30:00.000Z',
      '2018-09-19T03:30:00.000Z',
      '2018-09-19T04:30:00.000Z',
      '2018-09-19T05:30:00.000Z',
      '2018-09-19T06:30:00.000Z',
    ],
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm',
    },
  },
};
const channelUserData = [
  {
    index: 1,
    title: 'Total DSAs',
    value: 26,
    more: false,
    image: dsaIcon,
    viewAll: true,
  },
  {
    index: 2,
    title: 'Total Banking Divisions',
    value: 26,
    more: false,
    image: banking_icon,
    viewAll: true,
  },
  {
    index: 3,
    title: 'Total Fintech Partner',
    value: 26,
    more: false,
    image: FintechIcon,
    viewAll: true,
  },
  {
    index: 4,
    title: 'Total Users',
    value: 345,
    more: false,
    image: UserIcon,
    viewAll: false,
  },
];
export default function Dashboard() {
  const [graphView, setGraphView] = useState<number>(1);
  const [currency, setCurrency] = useState<number>(1);
  const [spineGraphValue, setSpineGraph] = useState<number>(1);
  const [disable, setDisable] = useState<boolean>(true);
  const [badge, setBadge] = useState<number>(0);
  const [dayFilterValue, setDayFilter] = useState<string>('Current Day');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [toggleOption, setToggleOption] = useState('All');
  const handleChange = (event: any) => {
    setCurrency(event.target.value);
  };
  const handleDayFilterChange = (event: any) => {
    setDayFilter(event.target.value);
  };
  const handleSpineChange = (event: any) => {
    setSpineGraph(event.target.value);
  };
  const toggleOptionHandleChange = (value: any) => {
    setToggleOption(value.title);
  };
  const toggleOptions = [
    { title: 'All' },
    { title: 'Approved' },
    { title: 'In-Progress' },
    { title: 'Rejected' },
    { title: 'Dropped' },
  ];
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
  const channel_data = [
    { code: 'All Channels', name: 'All Channels' },
    { code: 'Bank', name: 'Bank' },
    { code: 'DSA', name: 'DSA' },
    { code: 'Fintech Partners', name: 'Fintech Partners' },
  ];
  const surrogate_data = [
    { code: 'All Surrogates', name: 'All Surrogates' },
    { code: 'Payroll', name: 'Payroll' },
    { code: 'Card on Card', name: 'Card on Card' },
    { code: 'CIBIL', name: 'CIBIL' },
    { code: 'AQB', name: 'AQB' },
    { code: 'RC', name: 'RC' },
  ];
  const channels_label = [
    {
      id: 1,
      label: 'Bank',
      defaultChecked: true,
    },
    {
      id: 2,
      label: 'DSA',
      defaultChecked: true,
    },
    {
      id: 3,
      label: 'Fintech Partners',
      defaultChecked: true,
    },
  ];
  const [salesDataAlignment, setSalesDataAlignment] = useState('Bank');
  const [surrogateDataAlignment, setSurrogateDataAlignment] = useState('Bank');
  const salesDataHandleChange = (value: string) => {
    setSalesDataAlignment(value);
  };
  const surrogateDataHandleChange = (value: string) => {
    setSurrogateDataAlignment(value);
  };
  const salesDataToggleOptions = [
    { title: 'Hour' },
    { title: 'Day' },
    { title: 'Week' },
    { title: 'Month' },
  ];
  const surrogateToggleOptions = [
    { title: 'Hour' },
    { title: 'Day' },
    { title: 'Week' },
    { title: 'Month' },
  ];

  const getBadgeCount = (count: number) =>{
    setBadge(count);
  }

  const setBadgeEmpty = () =>{
    setBadge(0)
  }

  return (
    <div className="App">
      <div className="main-dashboard">
        <div className="dashboard-container">
          <div className="filter-header">
            <div className="filter-data">
              <Typography
                sx={{
                  fontSize: '14.08px',
                  marginRight: '24px',
                  color: '#000',
                  fontWeight: 'bold',
                }}
              >
                Overview
              </Typography>
              <DateTimePopOver
                day_filter_label={day_filter_label}
                dayFilterValue={dayFilterValue}
              />
              <CheckBoxPopOver
                options={channel_data}
                displayText={'All Channels'}
              />
              <CheckBoxPopOver
                options={surrogate_data}
                displayText={'All Surrogates'}
              />
              {/* <CheckBoxPopOver
                surrogates_label={channels_label}
                displayText={'All Channels'}
                showSearch={true}
                submit={'Select'}
                close={'Reset'}
              /> */}
              {/* <CheckBoxPopOver
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
                dayFilterChange={handleDayFilterChange}
                submit={'Apply'}
                close={'Reset'}
                policies_label={channels_label}
                surrogates_label={surrogates_label}
                state_label={state_label}
                flag="main-dashboard"
                getBadgeCount = {getBadgeCount}
                badge={badge}
              />
            </div>
            <div className="reset-data">
              <Button
                startIcon={<Reset />}
                disabled={badge > 0 ? false : true}
                onClick={setBadgeEmpty}
                sx={{
                  fontSize: '14px',
                  marginRight: '10px',
                  color: '#82B1DB',
                  fontWeight: '500',
                  backgroundColor: '#EEF7FF',
                  textTransform: 'none',
                  padding: '3px 15px',
                  marginTop: '3px',
                  '&:hover': {
                    backgroundColor: '#EEF7FF',
                  },
                }}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="divider-line" />
          <div className="horizontal-cards">
            <Grid container spacing={0}>
              {dashboardVal.map((value) => (
                <Grid xs={3} item>
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
              <BarGraph
                currencies={currencies}
                handleChange={handleChange}
                currency={currency}
                options={options}
                series={series}
                graphView={graphView}
                handleGraphView={(value: number) => setGraphView(value)}
                salesDataToggleOptions={salesDataToggleOptions}
                salesDataHandleChange={salesDataHandleChange}
              />
            </div>
            <div className="graph-card">
              <div className="graph-div">
                <div className="dashboard-graph">
                  <div>
                    <text className="overview-text">Surrogate Wise Data </text>
                    <text className="overview-text2">- Current Day</text>
                  </div>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      gap: 1,
                      cursor: 'pointer',
                    }}
                  >
                    <Stack className="btnIcon">
                      <img src={download_icon} alt="d" />
                    </Stack>
                    <Stack className="btnIcon">
                      <img src={mail_icon} alt="email" />
                    </Stack>
                  </Box>
                </div>
                <div className="line-div" />
                <div className="filter-graph-box">
                  <div>
                    <TextField
                      id="outlined-select-spine-native"
                      select
                      value={spineGraphValue}
                      onChange={handleSpineChange}
                      SelectProps={{
                        native: true,
                      }}
                      sx={{ width: '10vw' }}
                      variant="filled"
                      inputProps={{
                        style: {
                          fontSize: '12px',
                          height: '20px',
                          backgroundColor: '#F3F3F3',
                          paddingLeft: '10px',
                          paddingTop: '8px',
                          paddingBottom: '10px',
                          borderRadius:'4px'
                        },
                      }}
                    >
                      {spineGraphStatus.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </div>
                  <GroupButton
                    data={surrogateToggleOptions}
                    onChange={(arg1: any) => surrogateDataHandleChange(arg1)}
                  />
                </div>
                <div className="line-div" id="chart">
                  <ReactApexChart
                    options={spineGraphOptions}
                    series={spineGraphSeries}
                    type="area"
                    height={220}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-container">
          <div className="heading-text">
            <Typography sx={{ color: 'black', fontSize: '16px' }}>
              Channel - User
            </Typography>
          </div>
          <div className="divider-line" />
          <div className="horizontal-cards2">
            <Grid container spacing={0}>
              {channelUserData.map((value) => (
                <Grid xs={3} item>
                  <DashboardCard
                    title={value.title}
                    value={value.value}
                    more={value.more}
                    image={value.image}
                    viewAll={value.viewAll}
                    navPath=""
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
        <div className="diff-area" />
        <div className="list-data-box">
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              margin: '20px',
            }}
          >
            <Typography sx={{ color: 'black', fontSize: '16px' }}>
              Recent Data
            </Typography>
          </div>
          <div
            style={{
              border: '1px solid #e6e7e8',
              marginLeft: '22px',
              marginRight: '33px',
            }}
            className="divider-line"
          />
          <div>
            <TableComp
              rows={salesDashboardList}
              statusRowsHeading={statusRowHeading}
              listRowHeading={listRowHeading}
              flag="dashboard"
              viewPath="/sales/salesReport/salesReportDetails"
              toggleOptions={toggleOptions}
              toggleOptionHandleChange={toggleOptionHandleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
