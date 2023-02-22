import React, { useEffect, useState } from 'react';
import '../../../style/Style.scss';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { ReactComponent as MoreFilter } from '../../../assets/icons/moreFilter.svg';
import { ReactComponent as BlueCross } from '../../../assets/icons/blueCross.svg';
import { ReactComponent as DownArrowIcon } from '../../../assets/icons/dropdownarrow.svg';
import { colors } from '../../../style/Color';
import { ReactComponent as FilterDarkIcon } from '../../../assets/icons/filter_icon_dark.svg';
import DateRangePopUp from '../DateRangePopUp';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import Multiselector from '../MultiSelectNew';

type props = {
  openSuccess?: any;
  handleCloseSuccess?: Function;
  title?: string;
  product_label?: Array<any>;
  submit?: string;
  close?: string;
  handleSelectedItem?: (e: any) => void;
  showSearch?: boolean;
  day_filter_label?: Array<any>;
  dayFilterValue?: string;
  policies_label?: Array<any>;
  surrogates_label?: Array<any>;
  state_label: Array<object>;
  flag?: string;
  dayFilterChange?: (e: any) => void;
  getBadgeCount?: (mainBadge: number) => void;
  badge?: number
};

function MoreFilterRightModal({
  openSuccess,
  handleCloseSuccess,
  product_label,
  submit,
  close,
  dayFilterChange,
  handleSelectedItem,
  showSearch,
  day_filter_label,
  dayFilterValue,
  policies_label,
  surrogates_label,
  state_label,
  flag,
  getBadgeCount,
  badge
}: props) {
  const [categories, setCategories] = useState(product_label);
  const [openDayFilter, setOpenDayFilter] = useState(false);
  const [isSelectSurrogateOpen, setIsSelectSurrogateOpen] = useState(false);
  const [surrogateChecked, setSurrogateChecked] = useState(false);
  const [isSelectChannelOpen, setIsSelectChannelOpen] = useState(false);
  const [channelChecked, setChannelChecked] = useState(false);
  const [mainBadge, setMainBadge] = useState<number>(0);
  const [filterValue, setFilterValue] = useState(false);

  var count = 0;
  const handleSubmitSurrogate = () => {
    setIsSelectSurrogateOpen(false);
  };
  const handleResetSurrogate = () => {
    setParentChecked(false);
    setChildrenArr([]);
  };

  // const handleSurrogateChecked = () => {
  //   setSurrogateChecked(true);
  // };

  const handleSubmitChannel = () => {
    setIsSelectChannelOpen(false);
  };
  const handleResetChannel = () => {
    setParentChecked(false);
    setChildrenArr([]);
  };

  // const handleChannelChecked = () => {
  //   setChannelChecked(true);
  // };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue(event.target.value);
  //   if (value.length >= 3) {
  //     const filtered: React.SetStateAction<any[] | undefined> = [];
  //     categories?.map((str) => {
  //       if (str.label.toLowerCase().includes(value)) {
  //         filtered.push(str);
  //       }
  //     });

  //     setCategories(filtered);
  //   } else {
  //     setCategories(product_label);
  //   }
  // };

  // const handleCheckboxClick = (index: number, id: number, checked: boolean) => {
  //   let updatedList = categories?.map((item) => {
  //     if (item.id === id) {
  //       return { ...item, defaultChecked: !item.defaultChecked }; //gets everything that was already in item, and updates "done"
  //     }
  //     return item; // else return unmodified item
  //   });

  //   setCategories(updatedList);
  // };

  // const handleResetButton = () => {
  //   let updatedList = categories?.map((item) => {
  //     return { ...item, defaultChecked: false };
  //   });

  //   setCategories(updatedList);
  // };

  const error = categories?.filter((v) => {
    if (v.defaultChecked === true) {
      count++;
    }
  });
  const e = count >= 7;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  //channel
  const [parentChecked, setParentChecked] = React.useState<boolean>(false);
  const [childrenArr, setChildrenArr] = React.useState<string[]>([]);

  // surrogate
  const [surrogateParentChecked, setSurrogateParentChecked] =
    React.useState<boolean>(false);
  const [surrogateChildrenArr, setSurrogateChildrenArr] = React.useState<
    string[]
  >([]);
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );
  const [selectedValues, setSelectedValues] = useState<any>([]);

  const handleSurrogateResetChannel = () => {
    setSurrogateChildrenArr([]);
    setSurrogateParentChecked(false);
  };

  useEffect(() => {
    const childrenArrCopy: any = [...surrogateChildrenArr];

    if (childrenArrCopy.length === surrogates_label?.length) {
      setSurrogateParentChecked(true);
    } else {
      setSurrogateParentChecked(false);
    }
  }, [surrogateChildrenArr]);

  useEffect(() => {
    if(badge === 0){
    setMainBadge(0);
  }

  },[badge])

  const handleSurrogateParentOnChange = (event: any) => {
    setSurrogateParentChecked(!surrogateParentChecked);
    if (surrogateParentChecked === true) {
      setSurrogateChildrenArr([]);
    } else if (surrogates_label?.length) {
      setSurrogateChildrenArr(surrogates_label.map((item: any) => item?.label));
    }
  };

  const handleSurrogateChildOnChange = (event: any, item: any) => {
    const childrenArrCopy: any = [...surrogateChildrenArr];

    if (childrenArrCopy.includes(item.label)) {
      setSurrogateChildrenArr(
        childrenArrCopy.filter((itemObj: any) => itemObj !== item.label)
      );
    } else {
      setSurrogateChildrenArr((prev) => [...prev, item.label]);
    }
  };

  useEffect(() => {
    const childrenArrCopy: any = [...childrenArr];

    if (childrenArrCopy.length === policies_label?.length) {
      setParentChecked(true);
    } else {
      setParentChecked(false);
    }
  }, [childrenArr]);

  const handleParentOnChange = (event: any) => {
    setParentChecked(!parentChecked);
    if (parentChecked === true) {
      setChildrenArr([]);
    } else if (policies_label?.length) {
      setChildrenArr(policies_label.map((item: any) => item?.label));
    }
  };

  const handleChildOnChange = (event: any, item: any) => {
    const childrenArrCopy: any = [...childrenArr];

    if (childrenArrCopy.includes(item.label)) {
      setChildrenArr(
        childrenArrCopy.filter((itemObj: any) => itemObj !== item.label)
      );
    } else {
      setChildrenArr((prev) => [...prev, item.label]);
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-modal' : undefined;
  // var filterCheck;
  const [filterState, setFilterState] = useState(true);
  const handleClose = () => {
    setAnchorEl(null);
    setFilterState(
      selectedValues.includes('All') || selectedValues.length === 0
    );
    setMainBadge(4);
  };
  useEffect(() => {
    getBadgeCount && getBadgeCount(mainBadge);
  },[mainBadge])

  console.log("selectedValues.includes('All')", filterState);
  const closeFun = () => {
    setAnchorEl(null);
    setFilterState(false);
    setSelectedValues([]);
  };
  const handleCustomClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const openCustom = Boolean(anchorElement);
  const idCustom = openCustom ? 'simple-popover' : undefined;

  const handleCloseCustom = () => {
    setAnchorElement(null);
    setOpenDayFilter(false);
  };
  const badgeStyle = {
    '& .MuiBadge-badge': {
      // width: 8,
      // height: 13,
      // borderRadius: '50%',
      fontSize: '10px',
    },
  };
  // flag === 'main-dashboard' || flag === 'reTargeting' ||
  return (
    <Stack className="App" >
      <Badge
        badgeContent={mainBadge}
        color="error"
        sx={badgeStyle}
        overlap="circular"
      >
       <Button
        endIcon={filterState ? <MoreFilter /> :  <FilterDarkIcon /> 
      }
        sx={{
          fontSize: '14px',
          marginRight: '20px',
          fontWeight: '500',
          color: '#0662B7',
          textTransform: 'none',
        }}
        onClick={handleClick}
      >
        More Filters
      </Button>
      </Badge>
                        
      

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{
          mt: -4,
          mb: -4,
          '& .MuiDialog-container': {
            justifyContent: 'flex-end',
          },
        }}
        PaperProps={{ sx: { margin: '0', height: '100%' } }}
      >
        <Stack>
          <Stack
            sx={{
              marginBottom: '40px',
              // height: '90%',
              // overflowY: 'scroll',
            }}
          >
            <FormGroup
              sx={{
                overflow: 'hidden',
                // overflowY: 'scroll',  //Not needed in morefilters
              }}
            >
              <Grid sx={{ width: '450px' }}>
                <Box
                  sx={{
                    backgroundColor: '#F2F9FF',
                    height: '40px',
                    width: '450px',
                    justifyContent: 'space-between',
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '15px 12px',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
                    Filters
                  </Typography>
                  <Button onClick={handleClose} endIcon={<BlueCross />} />
                </Box>
                <Box
                  sx={{
                    height: '70px',
                    justifyContent: 'space-between',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '12px',
                  }}
                >
                  <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
                    Period
                  </Typography>
                  <FormControl sx={{ m: 1, width: 233 }}>
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
                      onChange={dayFilterChange}
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
                      input={
                        <OutlinedInput
                        // label={dayFilterValue}
                        // sx={{ paddingBottom: '10px' }}
                        />
                      }
                      renderValue={(selected: any) => {
                        return selected;
                      }}
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
                                <Box sx={{ marginRight: '60px' }}>
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
                </Box>
                {flag === 'main-dashboard' || flag === 'reTargeting' ? (
                  <Box
                    sx={{
                      height: '70px',
                      justifyContent: 'space-between',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '12px',
                    }}
                  >
                    <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
                      Channels
                    </Typography>
                    <FormControl sx={{ m: 1, width: 233 }}>
                      <Multiselector
                        options={[
                          {
                            value: 'All',
                            title: 'All',
                            children: [
                              { value: 'Bank', title: 'Bank' },
                              { value: 'DSA', title: 'DSA' },
                              {
                                value: 'Fintech Partners',
                                title: 'Fintech Partners',
                              },
                            ],
                          },
                        ]}
                      />
                    </FormControl>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: '70px',
                      justifyContent: 'space-between',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '12px',
                    }}
                  >
                    <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
                      Policy
                    </Typography>
                    <FormControl sx={{ m: 1, width: 233 }}>
                      <InputLabel id="demo-multiple-name-label">
                        All Policies
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        size="small"
                        // value={personName}
                        // onChange={handleChange}
                        input={
                          <OutlinedInput
                            label="All Policies"
                            sx={{ paddingBottom: '10px' }}
                          />
                        }
                      >
                        <Stack px={2}>
                          <FormGroup>
                            {policies_label?.map((item: any, index: number) => (
                              <Grid key={index}>
                                <FormControlLabel
                                  label={
                                    <Typography
                                      sx={{
                                        fontSize: '16px',
                                        fontWeight: '500',
                                      }}
                                    >
                                      {item.label}
                                    </Typography>
                                  }
                                  control={
                                    <Checkbox
                                      style={{
                                        transform: 'scale(1.2)',
                                      }}
                                      sx={{
                                        color: '#A8A8A9',
                                      }}
                                      //   onChange={(e) =>
                                      //     handleCheckboxClick(index,item.id, e.target.checked)
                                      //   }
                                      //   checked={item.defaultChecked === true}
                                      color="secondary"
                                    />
                                  }
                                />
                                {item.data?.map((item: any, index: any) => {
                                  return (
                                    <Grid item key={item.id}>
                                      {' '}
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          ml: 3,
                                        }}
                                      >
                                        <FormControlLabel
                                          label={
                                            <Typography
                                              sx={{
                                                fontSize: '16px',
                                                fontWeight: '500',
                                              }}
                                            >
                                              {item.label}
                                            </Typography>
                                          }
                                          control={
                                            <Checkbox
                                              style={{
                                                transform: 'scale(1.2)',
                                              }}
                                              sx={{
                                                color: '#A8A8A9',
                                              }}
                                              //   onChange={(e) =>
                                              //     handleCheckboxClick(index,item.id, e.target.checked)
                                              //   }
                                              //   checked={item.defaultChecked === true}
                                              color="secondary"
                                            />
                                          }
                                        />
                                      </Box>
                                    </Grid>
                                  );
                                })}
                              </Grid>
                            ))}
                          </FormGroup>
                        </Stack>
                      </Select>
                    </FormControl>
                  </Box>
                )}

                <Box
                  sx={{
                    height: '70px',
                    justifyContent: 'space-between',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '12px',
                  }}
                >
                  <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
                    Surrogates
                  </Typography>
                  <FormControl sx={{ m: 1, width: 233 }}>
                    <Multiselector
                      options={[
                        {
                          value: 'All',
                          title: 'All',
                          children: [
                            { value: 'Payroll', title: 'Payroll' },
                            { value: 'Card on Card', title: 'Card on Card' },
                            { value: 'CIBIL', title: 'CIBIL' },
                            { value: 'AQB', title: 'AQB' },
                            { value: 'RC', title: 'RC' },
                          ],
                        },
                      ]}
                    />
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    backgroundColor: '#F2F9FF',
                    height: '40px',
                    width: '450px',
                    justifyContent: 'space-between',
                    display: 'flex',
                    flexDirection: 'row',
                    padding: ' 15px 12px',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
                    More Filters
                  </Typography>
                </Box>
                {state_label.map((item: any, index: number) => {
                  return (
                    <Box
                      sx={{
                        height: '70px',
                        justifyContent: 'space-between',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '12px',
                      }}
                      key={index} // Change this while integration if something other than index can be used
                    >
                      <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
                        {item.name}
                      </Typography>
                      <FormControl sx={{ m: 1, width: 233}}>
                        <Multiselector
                          options={item.dataLabel}
                          filterValue={filterValue}
                          sendSelectedValues={(selectedValues: any) => {
                            setSelectedValues(selectedValues);
                          }}
                        />
                      </FormControl>
                    </Box>
                  );
                })}
              </Grid>
            </FormGroup>
          </Stack>
          <Stack
            className="modal_buttons"
            sx={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              // paddingRight: '16px',
              borderTop: `1px solid #36363624`,
              width: '100%',
              padding: '15px 20px',
              position: 'absolute',
              bottom: '-220px',
              right: '0',
              // height: '10%',
            }}
          >
            {submit && (
              <Button
                onClick={closeFun}
                variant="outlined"
                sx={{
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '8px 24px',
                  textTransform: 'capitalize',
                  border: `1px solid ${colors.Modalblue}`,
                  color: `${colors.Modalblue}`,
                  '&:hover': {
                    border: '1px solid #0662B7',
                  },
                }}
              >
                {close}
              </Button>
            )}
            {submit && (
              <Button
                variant="contained"
                sx={{
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '8px 24px',
                  marginLeft: '16px',
                  textTransform: 'capitalize',
                  backgroundColor: `${colors.Modalblue}`,
                  '&:hover': {
                    backgroundColor: '#0662B7',
                  },
                }}
                onClick={handleClose}
                // disabled={!e}
              >
                {submit}
              </Button>
            )}
          </Stack>
          {/* )} */}
        </Stack>
      </Dialog>
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

export default MoreFilterRightModal;
