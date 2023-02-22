import {
  FormGroup,
  AccordionSummary,
  Grid,
  Box,
  FormControlLabel,
  Typography,
  Checkbox,
  AccordionDetails,
  Accordion,
  styled,
  Switch,
  Divider,
} from '@mui/material';
import './style.scss';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';

const CustomAccordion = styled(Accordion)(({ theme }) => {
  return {
    boxShadow: 'none', // this styles directly apply to accordion
    border: 'none',
    padding: '0',
    margin: '0',
    '.MuiAccordionDetails-root': {},
    '.MuiAccordionSummary-root': {}, // this apply to Summary
    '.MuiAccordionSummary-content': {
      margin: '0',
      height: '40px',
      alignItems: 'center',
      paddingLeft: '10px',
    },
    '.css-1my56n0-MuiButtonBase-root-MuiAccordionSummary-root': {
      backgroundColor: '#F3F3F4',
    },
    '.css-19imdaq-MuiButtonBase-root-MuiAccordionSummary-root': {
      minHeight: '40px !important',
    },
  };
});

type props = {
  data: Array<any>;
  isViewPage: boolean;
  handleCallBack?: any;
};

export const AccordianLayover = ({
  data,
  isViewPage,
  handleCallBack,
}: props) => {
  const [categories, setCategories] = useState(data);

  useEffect(() => {
    let updatedList = data?.map((item) => {
      if (item.roleAccess === 'YES') {
        return { ...item, isExpanded: true };
      }
      return { ...item, isExpanded: false };
    });
    setCategories(updatedList);
  }, [isViewPage, data]);

  const handleCheckboxClick = (
    index: number,
    code: string,
    checked: boolean
  ) => {
    let updatedList = categories?.map((item) => {
      if (item.code === code) {
        if (item.roleAccess?.toUpperCase() === 'NO') {
          return {
            ...item,
            // roleAccess: item.roleAccess === 'YES' ? 'NO' : 'YES',
            isExpanded: true,
          }; //gets everything that was already in item, and updates "done"
        } else if (item.roleAccess === 'YES' && item.isExpanded === true) {
          return { ...item, isExpanded: false };
        } else if (item.roleAccess === 'YES' && item.isExpanded === false) {
          return { ...item, isExpanded: true };
        }
      }
      return item; // else return unmodified item
    });
    setCategories(updatedList);
    handleCallBack(updatedList);
  };

  const handleOuterAreaClick = (
    index: number,
    code: string,
    checked: boolean
  ) => {
    let updatedList = categories?.map((item) => {
      if (item.code === code) {
        if (item.roleAccess === 'NO') {
          return {
            ...item,
            roleAccess: item.roleAccess === 'YES' ? 'NO' : 'YES',
            isExpanded: true,
          }; //gets everything that was already in item, and updates "done"
        }
        if (item.roleAccess === 'YES') {
          let dataLists = item.subAction.map((item2: any) => {
            var UpdatedItems = item2.secondSubActions.map((item3: any) => {
              return { ...item3, roleAccess: 'NO' };
            });
            return {
              ...item2,
              secondSubActions: UpdatedItems,
              roleAccess: 'NO',
            };
          });
          return {
            ...item,
            subAction: dataLists,
            roleAccess: 'NO',
            isExpanded: false,
          };
        }
      }
      return item; // else return unmodified item
    });
    setCategories(updatedList);
    handleCallBack(updatedList);
  };

  const handleSubModuleSwitch = (
    index: number,
    code: string,
    checked: boolean,
    index2: number,
    code2: string
  ) => {
    let updatedList = categories.map((item: any) => {
      if (item.code === code) {
        let dataList = item.subAction.map((item2: any) => {
          if (item2.code === code2) {
            if (item2.roleAccess === 'NO') {
              var items = item2.secondSubActions.map((item3: any) => {
                return {
                  ...item3,
                  roleAccess: item3.defaultEnable === 'YES' ? 'YES' : 'NO',
                }; //roleAccess: item3.defaultEnable === 'YES' ? item3.roleAccess : 'NO'
              });
              return { ...item2, secondSubActions: items, roleAccess: 'YES' };
            } else if (item2.roleAccess === 'YES') {
              var itemsList = item2.secondSubActions.map((item3: any) => {
                return { ...item3, roleAccess: 'NO' }; //roleAccess: item3.defaultEnable === 'YES' ? item3.roleAccess : 'NO'
              });
              return {
                ...item2,
                secondSubActions: itemsList, //check once name itemsList
                roleAccess: item2.roleAccess === 'YES' ? 'NO' : 'YES',
              };
            }
            return {
              ...item2,
              roleAccess: item2.roleAccess === 'YES' ? 'NO' : 'YES',
            }; //gets everything that was already in item, and updates "done"
          }
          return item2;
        });
        return { ...item, subAction: dataList };
      }
      return item; // else return unmodified item
    });
    setCategories(updatedList);
    handleCallBack(updatedList);
  };

  const handleSubModuleCheckbox = (
    index: number,
    code: string,
    checked: boolean,
    code2: string,
    code3: string
  ) => {
    let updatedList = categories.map((item: any) => {
      if (item.code === code) {
        let dataUpdatedList = item.subAction.map((item2: any) => {
          if (item2.code === code2 && item2.roleAccess === 'YES') {
            let items = item2.secondSubActions.map((item3: any) => {
              if (item3.code === code3) {
                return {
                  ...item3,
                  roleAccess: item3.roleAccess === 'YES' ? 'NO' : 'YES',
                }; //gets everything that was already in item, and updates "done"
              }
              return item3;
            });
            return { ...item2, secondSubActions: items }; //gets everything that was already in item, and updates "done"
          }
          return item2;
        });
        return { ...item, subAction: dataUpdatedList };
      }
      return item; // else return unmodified item
    });
    setCategories(updatedList);
    handleCallBack(updatedList);
  };
  const CustomToggle = styled(Switch)(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '600ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: '#0662B7',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));
  return (
    <FormGroup>
      {categories?.map((item: any, index) => {
        return (
          <>
            {item.subAction.length <= 0 ? (
              <Grid container item key={item.name} className="grid-style">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '40px',
                    justifyContent: 'center',
                    backgroundColor:
                      item.roleAccess === 'YES' ? '#F3F3F4' : 'white',
                  }}
                >
                  <FormControlLabel
                    sx={{
                      paddingLeft: '18px',
                      color: isViewPage ? '#AFAEAF' : 'black',
                    }}
                    disabled={isViewPage}
                    label={
                      <Typography sx={{ fontSize: '14px' }}>
                        {item.name}
                      </Typography>
                    }
                    control={
                      <Checkbox
                        style={{
                          transform: 'scale(1.2)',
                        }}
                        onChange={(e) =>
                          handleCheckboxClick(
                            index,
                            item.code,
                            e.target.checked
                          )
                        }
                        checked={item.roleAccess === 'YES'}
                        sx={{
                          '&.Mui-checked': {
                            color: isViewPage ? '#82B1DB' : '#0662B7',
                          },
                          color: '#A8A8A9',
                        }}
                        // checkedIcon={
                        //   <img src={checkedIcon} alt={checkedIcon} />
                        // }
                      />
                    }
                  />
                  <Divider
                    sx={{
                      border:
                        item.roleAccess === 'YES'
                          ? '1px solid white'
                          : '1px solid #F3F3F4',
                      marginTop: '3px',
                    }}
                  />
                </Box>
              </Grid>
            ) : (
              <CustomAccordion
                sx={{
                  '&:before': {
                    border: 'none',
                    backgroundColor:
                      item.roleAccess === 'YES' ? '#F3F3F4' : 'white',
                    borderBottom:
                      item.roleAccess === 'YES'
                        ? '1px solid white'
                        : '1px solid #F3F3F4',
                  },
                }}
                expanded={item.isExpanded === true}
              >
                <AccordionSummary
                  sx={{
                    '.css-o4b71y-MuiAccordionSummary-content': {
                      margin: '0',
                      backgroundColor:
                        item.roleAccess === 'YES' ? '#F3F3F4' : 'white',
                      // borderBottom:
                      //   item.roleAccess === 'YES'
                      //     ? '1px solid white'
                      //     : '1px solid #F3F3F4',
                    },
                    padding: '0',
                    '.css-1kua6lf-MuiPaper-root-MuiAccordion-root': {
                      backgroundColor:
                        item.roleAccess === 'YES' ? '#F3F3F4' : 'white',
                    },
                    backgroundColor:
                      item.roleAccess === 'YES' ? '#F3F3F4' : 'white',
                    borderBottom:
                      item.roleAccess === 'YES'
                        ? '1px solid white'
                        : '1px solid #F3F3F4',
                    '.css-o4b71y-MuiAccordionSummary-content.Mui-expanded': {
                      border: 'none',
                      margin: '10px',
                    },
                  }}
                  expandIcon={
                    item.subAction.length > 0 && (
                      <ExpandMoreIcon
                        sx={{
                          color: '#0662B7',
                          // borderBottom: '1px solid #F0F2F5',
                          // height: '40px',
                        }}
                        onClick={(e) =>
                          handleCheckboxClick(index, item.code, false)
                        }
                      />
                    )
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Grid container item key={item.name} className="grid-style">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        // padding: '8px',
                        width: '30%',
                      }}
                    >
                      <FormControlLabel
                        disabled={isViewPage}
                        sx={{
                          color: isViewPage ? '#AFAEAF' : 'black',
                        }}
                        label={
                          <Typography sx={{ fontSize: '14px' }}>
                            {item.name}
                          </Typography>
                        }
                        control={
                          <Checkbox
                            style={{
                              transform: 'scale(1.2)',
                            }}
                            onChange={(e) =>
                              handleOuterAreaClick(
                                index,
                                item.code,
                                e.target.checked
                              )
                            }
                            // checkedIcon={
                            //   <img src={checkedIcon} alt={checkedIcon} />
                            // }
                            checked={item.roleAccess === 'YES'}
                            sx={{
                              '&.Mui-checked': {
                                color: isViewPage ? '#82B1DB' : '#0662B7',
                              },
                              color: '#A8A8A9',
                            }}
                          />
                        }
                      />
                    </Box>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        // padding: '8px',
                        width: '70%',
                        pointerEvents: isViewPage ? 'none' : 'auto',
                        // backgroundColor: 'red',
                      }}
                      onClick={() =>
                        handleCheckboxClick(index, item.code, false)
                      }
                    />
                  </Grid>
                </AccordionSummary>
                {item.subAction.length > 0 && (
                  <AccordionDetails sx={{ paddingTop: '20px' }}>
                    <Grid container spacing={4}>
                      {item?.subAction?.map((item2: any, index2: any) => {
                        return (
                          <Grid xs={4} item key={item2.name}>
                            <Box
                              sx={{
                                boxShadow:
                                  '0px 1px 2px 1px rgba(21, 21, 21, 0.1)',
                                borderRadius: '8px',
                                paddingY: '14px',
                                height: '100%',
                              }}
                            >
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <CustomToggle
                                      checked={item2.roleAccess === 'YES'}
                                      disabled={isViewPage}
                                      color="secondary"
                                      sx={{
                                        marginLeft: '26px',
                                        marginRight: '10px',
                                      }}
                                      onChange={(e) =>
                                        handleSubModuleSwitch(
                                          index,
                                          item.code,
                                          e.target.checked,
                                          index2,
                                          item2.code
                                        )
                                      }
                                    />
                                  }
                                  label={item2.name}
                                />
                                <Divider
                                  sx={{
                                    marginTop: '17px',
                                    borderColor: '#F0F2F5',
                                  }}
                                />

                                {item2?.secondSubActions?.map(
                                  (item3: any, indexValue: any) => {
                                    return (
                                      <Grid item key={item3.name}>
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            ml: 3.5,
                                          }}
                                        >
                                          <FormControlLabel
                                            sx={{ marginBottom: '5px' }}
                                            label={
                                              <Typography
                                                sx={{
                                                  fontSize: '12px',
                                                  color:
                                                    isViewPage ||
                                                    (item3.defaultEnable ===
                                                      'YES' &&
                                                      item3.roleAccess ===
                                                        'YES')
                                                      ? '#AFAEAF'
                                                      : 'black',
                                                }}
                                              >
                                                {item3.name}
                                              </Typography>
                                            }
                                            control={
                                              <Checkbox
                                                style={{
                                                  transform: 'scale(1.2)',
                                                }}
                                                onChange={(e) =>
                                                  handleSubModuleCheckbox(
                                                    indexValue,
                                                    item.code,
                                                    e.target.checked,
                                                    item2.code,
                                                    item3.code
                                                  )
                                                }
                                                disabled={
                                                  isViewPage ||
                                                  (item3.defaultEnable ===
                                                    'YES' &&
                                                    item3.roleAccess === 'YES')
                                                }
                                                checked={
                                                  item3.roleAccess === 'YES'
                                                }
                                                sx={{
                                                  '&.Mui-checked': {
                                                    color:
                                                      isViewPage ||
                                                      (item3.defaultEnable ===
                                                        'YES' &&
                                                        item3.roleAccess ===
                                                          'YES')
                                                        ? '#82B1DB'
                                                        : '#0662B7',
                                                  },
                                                  color: '#A8A8A9',
                                                }}
                                              />
                                            }
                                          />
                                        </Box>
                                      </Grid>
                                    );
                                  }
                                )}
                              </FormGroup>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </AccordionDetails>
                )}
              </CustomAccordion>
            )}
          </>
        );
      })}
    </FormGroup>
  );
};
