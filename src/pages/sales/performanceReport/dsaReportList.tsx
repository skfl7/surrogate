import React, { useState, useEffect } from 'react';
import {
  Stack,
  Grid,
  Box,
  Typography,
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  Popover,
  Paper,
  Divider,
} from '@mui/material';
import Dropdown from '../../../components/commonComponent/Dropdown';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HeaderWithInfo from '../../../components/commonComponent/HeaderWithInfo';
import ChooseCategoryToViewData from '../../../components/commonComponent/ChooseCategoryToViewData';
import BtnContained from '../../../components/commonComponent/CustomText/Button/Contained';
import PerformanceReportTable from '../../../components/commonComponent/LeftColumnFixedTable';
import {
  DSAOrBranchWiseFilterDropdown,
  StateOrZoneWiseFilterDropdown,
  DistrictWiseFilterDropdown,
  ExecutiveWiseFilterDropdown,
  LeadWiseFilterDropdown,
  DSAWiseReportListFirstColumn,
  DSAWiseReportListSecondColumn,
  PerformanceReportListData,
  StateWiseReportListSecondColumn,
  ZonalWiseReportListSecondColumn,
  DistrictWiseReportListSecondColumn,
  BranchWiseReportListSecondColumn,
  LeadWiseReportListSecondColumn,
  ExecutiveWiseReportListSecondColumn,
  CategoryList,
} from './performanceReport.const';
import BtnOutlined from '../../../components/commonComponent/CustomText/Button/Outlined';
import './style.scss';
import DateRangePopUp from '../../../components/commonComponent/DateRangePopUp';
import Multiselector from '../../../components/commonComponent/MultiSelectNew';
import { ReactComponent as DownArrowIcon } from '../../../assets/icons/dropdownarrow.svg';
import ascending_icon from '../../../assets/icons/ascending.svg';
import descending_icon from '../../../assets/icons/descending.svg';
import localforage from 'localforage';
import { getPermission } from '../../../utils/ActionAllowed/UserActionAllowed';

function DSAPerformanceReport() {
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('DSA Wise');
  const [dayFilterValue, setDayFilter] = useState<string>('Current Day');
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );
  const [openDayFilter, setOpenDayFilter] = useState(false);

  //sorting
  const [dataList, setDataList] = useState<any>([...PerformanceReportListData]);
  const [filterState, setFilterState] = useState<any>([
    {
      value: '',
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

  console.log('filterState', filterState);
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
  const firstColumn = DSAWiseReportListFirstColumn;
  const secondColumn =
    selectedCategory === 'State Wise'
      ? StateWiseReportListSecondColumn
      : selectedCategory === 'Zonal Wise'
      ? ZonalWiseReportListSecondColumn
      : selectedCategory === 'District Wise'
      ? DistrictWiseReportListSecondColumn
      : selectedCategory === 'Branch Wise'
      ? BranchWiseReportListSecondColumn
      : selectedCategory === 'Lead Wise'
      ? LeadWiseReportListSecondColumn
      : selectedCategory === 'Executive Wise'
      ? ExecutiveWiseReportListSecondColumn
      : DSAWiseReportListSecondColumn;
  const DropdownOptions =
    selectedCategory === 'State Wise' || selectedCategory === 'Zonal Wise'
      ? StateOrZoneWiseFilterDropdown
      : selectedCategory === 'District Wise'
      ? DistrictWiseFilterDropdown
      : selectedCategory === 'Lead Wise'
      ? LeadWiseFilterDropdown
      : selectedCategory === 'Executive Wise'
      ? ExecutiveWiseFilterDropdown
      : DSAOrBranchWiseFilterDropdown;
  useEffect(() => {
    const showTable = localStorage.getItem('dsaReportListTable');
    if (showTable === 'true') {
      setIsFiltered(true);
    } else setIsFiltered(false);
  }, [localStorage.getItem('dsaReportListTable')]);
  const searchFun = () => {
    setIsFiltered(true);
    localStorage.setItem('dsaReportListTable', JSON.stringify(true));
  };
  const resetFun = () => {
    setIsFiltered(false);
    localStorage.setItem('dsaReportListTable', JSON.stringify(false));
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
  return (
    <Stack>
      <Stack className="choose-category-container each-container">
        <FormControl fullWidth>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography className="each-field-label">
                Choose category
              </Typography>
              <Dropdown
                selectedValue={selectedCategory}
                data={CategoryList}
                onSelect={(event: any) => {
                  setSelectedCategory(event.target.value);
                  setIsFiltered(false);
                }}
                label={'Select Report Type'}
              />
            </Grid>
          </Grid>
          <Stack className="underline"></Stack>
          <Grid container spacing={2}>
            {DropdownOptions?.map((eachItem: any, index: number) => {
              return eachItem?.label !== 'Period' ? (
                <Grid item xs={3} key={index}>
                  <Typography className="each-field-label">
                    {eachItem?.label}
                  </Typography>
                  <Multiselector options={eachItem?.option} />
                </Grid>
              ) : (
                <Grid item xs={3} key={index}>
                  <Typography className="each-field-label">
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
                      onClose={() => setOpenDayFilter(false)}
                    >
                      <Paper variant="outlined" elevation={2}>
                        {day_filter_label?.map((value) =>
                          value.label !== 'Custom Period' ? (
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
                              <Box sx={{ display: 'flex' }}>
                                <Box sx={{ marginRight: '40px' }}>
                                  {value.label}
                                </Box>
                                <Box>
                                  <CalendarTodayOutlinedIcon />
                                </Box>
                              </Box>
                            </MenuItem>
                          )
                        )}
                      </Paper>
                    </Select>
                  </FormControl>
                </Grid>
              );
            })}
          </Grid>
          <Box className="button-container">
            <BtnOutlined title="Reset" onClick={resetFun} />
            <BtnContained title="Search" onClick={searchFun} />
          </Box>
        </FormControl>
      </Stack>
      {isFiltered ? (
        <Stack
          className="each-container"
          style={{ margin: '0px', paddingBottom: '0px' }}
        >
          <HeaderWithInfo
            header={`DSA Data - ${selectedCategory} Performance Report`}
            isInfoEnabled={false}
            info=""
            isDownloadEnabled={getPermission(
              actionAllowedItem,
              'SALES',
              'PERFORMANCE_REPORT',
              'DOWNLOAD_EMAIL_PERFORMANCE_REPORT'
            )}
          />
          <Divider sx={{ marginY: 2 }} />
          <PerformanceReportTable
            data={[...dataList]}
            listColumn={firstColumn}
            statusColumn={secondColumn}
            flag="performance-report"
          />
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
export default DSAPerformanceReport;
