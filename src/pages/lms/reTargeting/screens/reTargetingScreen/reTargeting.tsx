/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, useEffect, useState } from 'react';
import './style.scss';
import {
  Typography,
  Stack,
  Box,
  Grid,
  Checkbox,
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  Menu,
  Popover,
  IconButton,
  Paper,
} from '@mui/material';
import BtnOutlined from '../../../../../components/commonComponent/CustomText/Button/Outlined';
import BtnContained from '../../../../../components/commonComponent/CustomText/Button/Contained';
import ChooseCategoryToViewData from '../../../../../components/commonComponent/ChooseCategoryToViewData';
import download_icon from '../../../../../assets/icons/download_icon.svg';
import mail_icon from '../../../../../assets/icons/mail_icon.svg';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { state_label } from '../../../../sales/dashboard/dashboard.const';
import { reTargetingDropdownFields } from './reTargeting.const';
// import MoreFilterRightModal from '../../../../../components/commonComponent/customModal/MoreFilterModal';
import ListLMSTable from '../../../../../components/commonComponent/RightColumnFixedTable';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../../../../components/commonComponent/customModal/CustomModal';
import DateRangePopUp from '../../../../../components/commonComponent/DateRangePopUp';
import MoreFilterRightModal from '../../../../../components/commonComponent/customModal/MoreFilterRightModal';
import Multiselector from '../../../../../components/commonComponent/MultiSelectNew';
import { ReactComponent as DownArrowIcon } from '../../../../../assets/icons/dropdownarrow.svg';
import { MenuProps } from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import ascending_icon from '../../../../../assets/icons/ascending.svg';
import descending_icon from '../../../../../assets/icons/descending.svg';
import localforage from 'localforage';
import { getPermission } from '../../../../../utils/ActionAllowed/UserActionAllowed';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(() => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    minWidth: '257px',
    border: '1px solid #f5f2f2',
    boxShadow:
      'rgba(2, 2, 2, 0.04) 0px 0px 1px 0px, rgba(0, 0, 0, 0.1) 0px 1px 1px 0px',
    '& .MuiMenu-list': {
      padding: '2px',
    },
    '& .MuiMenuItem-root': {
      padding: '13px 22px',
      fontSize: '14px',
      fontWeight: '400',
      fontFamily: 'Ilisarniq',
    },
  },
}));

export const retargetingData = [
  {
    id: '1',
    application: '#12345',
    customerName: 'Ashwin',
    mobileNumber: '1234567891',
    cibil: '123',
    lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
    income: '1500000',
    status: 'Approved',
    // more: <MoreVertIcon />,
  },
  {
    id: '2',
    application: '#12345',
    customerName: 'Narmatha',
    mobileNumber: '7654234567',
    cibil: '123',
    lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
    income: '1500000',
    status: 'Rejected',
    // more: <MoreVertIcon />,
  },
  {
    id: '3',
    application: '#12345',
    customerName: 'vinith',
    mobileNumber: '9876234567',
    cibil: '123',
    lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
    income: '1500000',
    status: 'Dropped',
    // more: <MoreVertIcon />,
  },
];

function ReTargeting() {
  const navigate = useNavigate();
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [openModel, setOpenModel] = useState(false);
  const [communicationModel, setCommunicationModel] = useState(false);
  const [successModel, setSuccesModel] = useState(false);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);
  const [selected, setSelected] = useState<number[]>([]);
  const [openDayFilter, setOpenDayFilter] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

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

  useEffect(() => {
    const showTable = localStorage.getItem('reTargetingTable');

    if (showTable === 'true') {
      setIsFiltered(true);
    } else setIsFiltered(false);
  }, [localStorage.getItem('reTargetingTable')]);

  const searchFun = () => {
    setIsFiltered(true);
    localStorage.setItem('reTargetingTable', JSON.stringify(true));
  };

  const resetFun = () => {
    setIsFiltered(false);
    localStorage.setItem('reTargetingTable', JSON.stringify(false));
  };

  const handleCloseSuccess = () => {
    setOpenModel(false);
    setCommunicationModel(false);
    setSuccesModel(false);
  };
  const [dayFilterValue, setDayFilter] = useState<string>('Current Day');
  const handleChange = (e: any) => {
    setDayFilter(e.target.value);
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

  const openPopup = Boolean(anchorEl);
  const openId = openPopup ? 'simple-popover' : undefined;

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
    // const { value, secondValue, threeValue, ascending } = filterState[0];
    console.log('filterState', filterState);
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
    console.log('filterState checking', filterState);

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

  const modelOpenNavigate = () => {
    setOpenModel(true);
    setTimeout(() => {
      setOpenModel(false);
      setCommunicationModel(true);
    }, 2000);
  };
  const reTargetingModel = () => {
    setCommunicationModel(false);
    setSuccesModel(true);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLTableCellElement>) => {
    setAnchorElement(event.currentTarget);
  };

  // Table checkbox methods
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = retargetingData?.map((n: any) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const isSelected = (id: string) => {
    const res = selected.find((sel: any) => sel === id);
    return res ? true : false;
  };

  const handleClickCheckbox = (event: any, row: any) => {
    let selectedRecords = [...selected];
    console.log('handleClickCheckbox:', event, row);
    if (event?.target?.checked) {
      !selectedRecords.find((record: any) => record === row.id) &&
        selectedRecords.push(row.id);
    } else
      selectedRecords = selectedRecords.filter(
        (record: any) => record !== row.id
      );
    setSelected(selectedRecords);
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
  console.log('filterState checking 2', filterState);

  const column1: any = [
    {
      title: '',
      dataIndex: 'id',
      key: 'checkBox',
      width: '70px',
      headerRender: () => {
        return getPermission(
          actionAllowedItem,
          'LMS',
          'LMS_RULE_RE_TARGET',
          'CRATE_LMS_RULE'
        ) ? (
          <Checkbox
            style={{
              transform: 'scale(1.2)',
            }}
            sx={{
              color: '#A8A8A9',
            }}
            color={'secondary'}
            indeterminate={
              selected.length > 0 && selected.length < retargetingData.length
            }
            checked={
              retargetingData.length > 0 &&
              selected.length === retargetingData.length
            }
            onChange={handleSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        ) : (
          ''
        );
      },
      render: (_: string, row: any, index: number) => {
        const isItemSelected = isSelected(row.id);
        const labelId = `enhanced-table-checkbox-${index}`;
        return getPermission(
          actionAllowedItem,
          'LMS',
          'LMS_RULE_RE_TARGET',
          'LMS_RE_TARGET_RULE'
        ) ? (
          <Checkbox
            style={{
              transform: 'scale(1.2)',
            }}
            sx={{
              color: '#A8A8A9',
            }}
            color={'primary'}
            checked={isItemSelected}
            inputProps={{
              'aria-labelledby': labelId,
            }}
            onChange={(event) => handleClickCheckbox(event, row)}
          />
        ) : (
          ''
        );
      },
    },
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
      title: 'Actions',
      dataIndex: 'id',
      key: 'action',
      render: (_: string, row: any, index: number) => {
        return (
          <>
            <Stack
              id="more-button"
              onClick={handleClick}
              aria-controls={open ? 'more-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{ padding: '5px', borderBottom: 'none' }}
            >
              <MoreVertIcon />
            </Stack>
            <StyledMenu
              id="more-menu"
              anchorEl={anchorElement}
              open={open}
              MenuListProps={{
                'aria-labelledby': 'more-button',
              }}
              onClose={handleClose}
            >
              <MenuItem
                // onClick={() => handleClose()}
                onClick={() => {
                  handleClose();
                  navigate('/lms/retargeting/reTargetingDetails');
                }}
                style={{ padding: '10px 20px', textAlign: 'left' }}
              >
                View Application
              </MenuItem>
              {getPermission(
                actionAllowedItem,
                'LMS',
                'LMS_RULE_RE_TARGET',
                'CRATE_LMS_RULE'
              ) && (
                <MenuItem
                  // onClick={handleClose}

                  onClick={() => {
                    handleClose();
                    modelOpenNavigate();
                  }}
                  style={{ padding: '10px 20px', textAlign: 'left' }}
                >
                  Retarget Application
                </MenuItem>
              )}
            </StyledMenu>
          </>
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
    // { title: 'Approved' },
    // { title: 'In-Progress' },
    { title: 'Rejected' },
    { title: 'Dropped' },
  ];
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
                            >
                              {value.label}
                            </MenuItem>
                          )}
                          {value.label === 'Custom Period' && (
                            <MenuItem
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
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
            flag="retargeting"
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

export default ReTargeting;
