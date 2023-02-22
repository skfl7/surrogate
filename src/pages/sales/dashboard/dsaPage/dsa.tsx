import ProgressCard from '../../../../components/commonComponent/CommonCard/ProgressCard/ProgressCard';
import DashboardCard from '../../../../components/commonComponent/CommonCard/SalesDashbaordCard/DashboardCard';
import ApprovalRate from '../../../../assets/icons/approval_rate_icon.svg';
import TotalApplications from '../../../../assets/icons/total_application_icon.svg';
import Comparisions from '../../../../assets/icons/comparision_icon.svg';
import VirtualCard from '../../../../assets/icons/virtual_card_icon.svg';
import ApprovedIcon from '../../../../assets/icons/approved_icon.svg';
import Dropped from '../../../../assets/icons/dropped_icon.svg';
import InProgress from '../../../../assets/icons/in_progress_icon.svg';
import Rejected from '../../../../assets/icons/rejected_icon.svg';
import '../dashboard.scss';
import { useState } from 'react';
import TableComp from '../../../../components/commonComponent/ListTable/ListTable';
import {
  listRowHeading,
  product_label,
  salesDashboardList,
  state_label,
  statusRowHeading,
} from '../dashboard.const';
import BarGraph from '../../../../components/commonComponent/BarGraph/BarGraph';
import { Button, Grid, Typography } from '@mui/material';
import { ReactComponent as Reset } from '../../../../assets/icons/reset.svg';
import DateTimePopOver from '../../../../components/commonComponent/DateTimePopOver';
import CheckBoxPopOver from '../../../../components/commonComponent/CheckBoxPopOver/SingleLabel';
import MuliLabelPopOver from '../../../../components/commonComponent/CheckBoxPopOver/MultipleLabel';
import MoreFilterRightModal from '../../../../components/commonComponent/customModal/MoreFilterRightModal';
interface IStatus {
  label: string;
  value: number;
}
export default function DsaPage() {
  const currencies: IStatus[] = [
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
  const dashboardVal = [
    {
      index: 1,
      title: 'Total Applications',
      value: 3500,
      more: true,
      image: TotalApplications,
    },
    {
      index: 2,
      title: 'Approval Rate (%)',
      value: '98.6 %',
      more: false,
      image: ApprovalRate,
    },
    {
      index: 3,
      title: 'Comparision %(With Previous periods)',
      value: 26,
      more: false,
      image: Comparisions,
    },
    {
      index: 4,
      title: 'Virtual Card Issued',
      value: 345,
      more: true,
      image: VirtualCard,
    },
  ];
  const progressValue = [
    {
      index: 1,
      title: 'In Progress #',
      value: 3500,
      lastPeriodValue: 0,
      lastYearValue: 0,
      image: InProgress,
      navPath: '/sales/salesReport',
    },
    {
      index: 2,
      title: 'Approval #',
      value: 3500,
      lastPeriodValue: 2500,
      lastYearValue: 2500,
      image: ApprovedIcon,
      navPath: '/sales/salesReport',
    },
    {
      index: 3,
      title: 'Dropped #',
      value: 3500,
      lastPeriodValue: 2500,
      lastYearValue: 2500,
      image: Dropped,
      navPath: '/sales/salesReport',
    },
    {
      index: 4,
      title: 'Rejected #',
      value: 3500,
      lastPeriodValue: 2500,
      lastYearValue: 2500,
      image: Rejected,
      navPath: '/sales/salesReport',
    },
  ];
  const [graphView, setGraphView] = useState<number>(1);
  const [currency, setCurrency] = useState<number>(1);
  const [toggleOptionVal, setToggleOptionVal] = useState('All');
  const handleChange = (event: any) => {
    setCurrency(event.target.value);
  };
  const options: {} = {
    colors: ['#63a567', '#e3bc52', '#d95f63', '#8d3529'],
    chart: {
      type: 'bar',
      height: 350,
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        borderRadius: 2,
      },
    },
    legend: {
      horizontalAlign: 'left',
      markers: {
        radius: 20,
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
      borderColor: '#2d67b4',
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
  const [dayFilterValue, setDayFilter] = useState<string>('Current Day');
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
  const policies_label = [
    {
      label: 'All Main Policies',
      data: [
        {
          id: 1,
          label: 'M_Payroll_Policy',
        },
      ],
    },
    {
      label: 'All Overwrite Policies',
      data: [
        {
          id: 2,
          label: 'OW_Pongal_21_Payroll',
        },
      ],
    },
  ];
  const dummy1 = [
    { code: 'All Surrogates', name: 'All Surrogates' },
    { code: 'Bank', name: 'Bank' },
    { code: 'DSA', name: 'DSA' },
    { code: 'Fintech Partners', name: 'Fintech Partners' },
  ];
  const toggleOptions = [
    { title: 'All' },
    { title: 'Approved' },
    { title: 'In-Progress' },
    { title: 'Rejected' },
    { title: 'Dropped' },
  ];
  const togggleOptionValueFun = (value: any) => {
    setToggleOptionVal(value);
  };

  const [salesDataValue, setSalesDataValue] = useState('Hour');
  const setSalesDataValueChange = (value: string) => {
    setSalesDataValue(value);
  };
  const salesDataToggleOptions = [
    { title: 'Hour' },
    { title: 'Day' },
    { title: 'Week' },
    { title: 'Month' },
  ];

  return (
    <>
      <div className="dsa-data-container">
        <>
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
              <MuliLabelPopOver
                surrogates_label={policies_label}
                displayText={'All Policies'}
                showSearch={true}
                submit={'Select'}
                close={'Reset'}
              />
              <CheckBoxPopOver
                options={dummy1}
                displayText={'All Surrogates'}
              />
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
                submit={'Select'}
                close={'Reset'}
                policies_label={policies_label}
                surrogates_label={surrogates_label}
                state_label={state_label}
                flag="main-dashboard"
              />
            </div>
            <div className="reset-data">
              <Button
                startIcon={<Reset />}
                sx={{
                  fontSize: '14px',
                  marginRight: '10px',
                  color: '#82B1DB',
                  fontWeight: '500',
                  backgroundColor: '#EEF7FF',
                  textTransform: 'none',
                  padding: '3px 15px',
                  marginTop: '3px',
                }}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="divider-line" />
          <div className="horizontal-cards">
            <Grid container spacing={0}>
              {dashboardVal?.map((value) => (
                <Grid xs={3} item>
                  <DashboardCard
                    title={value.title}
                    value={value.value}
                    more={value.more}
                    image={value.image}
                    navPath="/sales/salesReport"
                  />
                </Grid>
              ))}
            </Grid>
          </div>
          <div className="report-cards">
            <div className="progress-card">
              {progressValue?.map((value) => (
                <ProgressCard
                  index={value.index}
                  title={value.title}
                  value={value.value}
                  lastPeriodValue={value.lastPeriodValue}
                  lastYearValue={value.lastYearValue}
                  image={value.image}
                  navPath={value.navPath}
                />
              ))}
            </div>
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
                salesDataHandleChange={setSalesDataValueChange}
              />
            </div>
          </div>
        </>
      </div>
      <div className="diff-area" />
      <div className="list-data-box">
        <div className="recent-data">
          <text className="recent-data-text">
            Recent {salesDashboardList.length} Data{' '}
          </text>
        </div>
        <div className="line3-div" />
        <TableComp
          rows={salesDashboardList}
          statusRowsHeading={statusRowHeading}
          listRowHeading={listRowHeading}
          flag="dashboard"
          viewPath="/sales/salesReport/salesReportDetails"
          toggleOptions={toggleOptions}
          toggleOptionHandleChange={togggleOptionValueFun}
        />
      </div>
    </>
  );
}
