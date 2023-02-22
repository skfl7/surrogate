import React, { useEffect, useState } from 'react';
import './style.scss';
import TableComp from '../../../components/commonComponent/ListTable/ListTable';
import {
  listRowHeading,
  salesDashboardList,
  statusRowHeading,
} from './../dashboard/dashboard.const';
import BtnContained from '../../../components/commonComponent/CustomText/Button/Contained';
import BtnOutlined from '../../../components/commonComponent/CustomText/Button/Outlined';
import ChooseCategoryToViewData from '../../../components/commonComponent/ChooseCategoryToViewData';
import { ScreenHeader } from '../../../components/commonComponent/ScreenHeader/ScreenHeader';
import HeaderWithInfo from '../../../components/commonComponent/HeaderWithInfo';
import { SalesReportFilterDropdown } from './salesReport.const';
import {
  Typography,
  Stack,
  Box,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  FormControl,
  Popover,
  Paper,
  Divider,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import DateRangePopUp from '../../../components/commonComponent/DateRangePopUp';
import Multiselector from '../../../components/commonComponent/MultiSelectNew';
import { ReactComponent as DownArrowIcon } from '../../../assets/icons/dropdownarrow.svg';
import { getPermission } from '../../../utils/ActionAllowed/UserActionAllowed';
import localforage from 'localforage';
function SalesReportList() {
  const [isFiltered, setIsFiltered] = useState(false);
  const location = useLocation();
  const [dayFilterValue, setDayFilter] = useState<string>('Current Day');
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );
  const [openDayFilter, setOpenDayFilter] = useState(false);
  const [toggleOption, setToggleOption] = useState('All');
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

  const handleChange = (e: any) => {
    setDayFilter(e.target.value);
  };
  const { state } = location;
  useEffect(() => {
    const showTable = localStorage.getItem('salesReportTable');
    if (showTable === 'true') {
      setIsFiltered(true);
    } else setIsFiltered(false);
  }, [localStorage.getItem('salesReportTable')]);
  const searchFun = () => {
    setIsFiltered(true);
    localStorage.setItem('salesReportTable', JSON.stringify(true));
  };
  const resetFun = () => {
    setIsFiltered(false);
    localStorage.setItem('salesReportTable', JSON.stringify(false));
  };
  const day_filter_label = [
    {
      id: 1,
      label: 'Current Day',
      onclick: () => {
        setDayFilter('Current Day');
        setAnchorElement(null);
        setOpenDayFilter(false);
      },
    },
    {
      id: 2,
      label: 'Current Week',
      onclick: () => {
        setDayFilter('Current Week');
        setAnchorElement(null);
        setOpenDayFilter(false);
      },
    },
    {
      id: 3,
      label: 'Current Month',
      onclick: () => {
        setDayFilter('Current Month');
        setAnchorElement(null);
        setOpenDayFilter(false);
      },
    },
    {
      id: 4,
      label: 'Current Quarter',
      onclick: () => {
        setDayFilter('Current Quarter');
        setAnchorElement(null);
        setOpenDayFilter(false);
      },
    },
    {
      id: 5,
      label: 'Current Year',
      onclick: () => {
        setDayFilter('Current Year');
        setAnchorElement(null);
        setOpenDayFilter(false);
      },
    },
    {
      id: 6,
      label: 'Custom Period',
      onclick: () => {
        setDayFilter('Custom Period');
        setAnchorElement(null);
        setOpenDayFilter(false);
      },
    },
  ];
  useEffect(() => {
    if (state) {
      setIsFiltered(state);
    }
  }, [state]);
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

  const toggleOptionHandleChange = (value: any) => {
    setToggleOption(value.title);
    console.log('value', value);
  };
  const toggleOptions = [
    { title: 'All' },
    { title: 'Approved' },
    { title: 'In-Progress' },
    { title: 'Rejected' },
    { title: 'Dropped' },
  ];
  return (
    <Stack className="sales-report-list">
      <Stack className="container">
        <ScreenHeader
          title="Sales Report"
          info="From here you can create access presets to assign with users in Users Creation."
          showBackButton={false}
        />
        <Stack className="underline"></Stack>
        <Grid container spacing={2}>
          {SalesReportFilterDropdown?.map((eachItem: any, index: number) => {
            return (
              <React.Fragment key={index}>
                {eachItem?.label !== 'Period' && (
                  <Grid item xs={3} key={index}>
                    <Typography className="dropdown-label">
                      {eachItem?.label}
                    </Typography>
                    <Multiselector options={eachItem?.option} />
                  </Grid>
                )}
                {eachItem?.label === 'Period' && (
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
                        value={dayFilterValue}
                        onChange={handleChange}
                        onClose={() => setOpenDayFilter(false)}
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
                      >
                        <Paper variant="outlined" elevation={2}>
                          {day_filter_label?.map((value) => {
                            return value.label !== 'Custom Period' ? (
                              <MenuItem
                                key={value.id}
                                // value={value.label}
                                onClick={value.onclick}
                              >
                                {value.label}
                              </MenuItem>
                            ) : (
                              <MenuItem
                                key={value.id}
                                // value={value.label}
                                onClick={(e: any) => {
                                  handleCustomClick(e);
                                }}
                              >
                                {value.label}
                              </MenuItem>
                            );
                          })}
                        </Paper>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </React.Fragment>
            );
          })}
        </Grid>
        <Box className="button-container">
          <BtnOutlined title="Reset" onClick={resetFun} />
          <BtnContained title="Search" onClick={searchFun} />
        </Box>
      </Stack>
      {isFiltered ? (
        <Stack className="container">
          <HeaderWithInfo
            header="Sales Data"
            isInfoEnabled={false}
            info=""
            isDownloadEnabled={getPermission(
              actionAllowedItem,
              'SALES',
              'CUSTOMER_REPORT',
              'DOWNLOAD_EMAIL_USER_REPORT'
            )}
          />
          <Divider sx={{ marginY: 2 }} />
          <Stack>
            <TableComp
              viewPath="/sales/salesReport/salesReportDetails"
              rows={salesDashboardList}
              statusRowsHeading={statusRowHeading}
              listRowHeading={listRowHeading}
              flag="sales-report"
              toggleOptions={toggleOptions}
              toggleOptionHandleChange={toggleOptionHandleChange}
            />
          </Stack>
        </Stack>
      ) : (
        <ChooseCategoryToViewData />
      )}
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
export default SalesReportList;
