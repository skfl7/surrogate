import { Stack, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import SearchDropdown from './../SearchDropdown';

import './style.scss';

function ApproverReviewerTable(props: {
  data: Array<Object>;
  mode: string;
  options?: any;
  handleResponseData?: Function;
}) {
  let obj = {} as any;
  const [requestResponsiblePeopleData, setRequestResponsiblePeople] =
    useState<any>([]);

  useEffect(() => {
    props?.handleResponseData &&
      props?.handleResponseData(requestResponsiblePeopleData);
  }, [props?.data]);

  useEffect(() => {
    if (props.mode === 'edit' && requestResponsiblePeopleData.length === 0) {
      let obj = {} as any;
      props?.data?.map((item: any) => {
        obj = {
          modules: item?.code,
        };
        let sub = [] as any;
        let sub2 = [] as any;
        let subData = item?.subModules?.map((item2: any) => {
          item2?.reviewerData?.map((item3: any) => {
            let subModules = {
              roleAccessType: 'REVIEWER',
              userId: item3.userId,
              userName: item3.userName,
              subModules: item2.code,
            };
            sub.push(subModules);
          });
          item2?.approverData?.map((item3: any) => {
            let subModules = {
              roleAccessType: 'APPROVER',
              userId: item3.userId,
              userName: item3.userName,
              subModules: item2.code,
            };
            sub.push(subModules);
          });
          sub2 = sub;
          return sub;
        });
        obj = { ...obj, subModules: [...sub2] };
        requestResponsiblePeopleData.push(obj);
    });
      props?.handleResponseData &&
        props?.handleResponseData(requestResponsiblePeopleData);
    }
  }, [props?.data]);

  return (
    <Stack className="approver-reviewer-container">
      {props?.data?.map((eachItem: any) => {
        return (
          <>
            {props?.mode === 'view' ? (
              <>
                <Stack className="header" style={{ paddingLeft: '9px' }}>
                  {eachItem?.name}
                </Stack>
                <Stack className="sub-modules-headers">
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Stack style={{ marginLeft: '9px' }}>Sub-modules</Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack style={{ marginLeft: '10px' }}>Reviewer</Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack style={{ marginLeft: '11px' }}>Approver</Stack>
                    </Grid>
                  </Grid>
                </Stack>
                {eachItem?.subModules?.map((eachModule: any, index: number) => {
                  return (
                    <>
                      <Stack className="each-sub-module">
                        <Grid container spacing={2} key={index}>
                          <Grid item xs={4}>
                            {eachModule?.subModuleName}
                          </Grid>
                          <Grid item xs={4} className="each-dropdown"  >
                            {eachModule?.reviewerData?.map((item: any) => {
                              return (
                                <Stack sx={{ m: 1, minWidth: 120}}>
                                  <Stack
                                    style={{
                                      height: '45px',
                                    }}
                                  >
                                    <Stack
                                      className="search-dropdown-text-field"
                                      sx={{
                                        width: '90%',
                                        padding: '15px 0px',
                                        height: '46px',
                                      }}
                                    >
                                      {item.userName}
                                    </Stack>
                                  </Stack>
                                </Stack>
                              );
                            })}
                          </Grid>
                          <Grid item xs={4} className="each-dropdown">
                            {eachModule?.approverData?.map((item: any) => {
                              return (
                                <Stack sx={{ m: 1, minWidth: 120 }}>
                                  <Stack
                                    style={{
                                      height: '45px',
                                    }}
                                  >
                                    <Stack
                                      className="search-dropdown-text-field"
                                      sx={{
                                        width: '90%',
                                        padding: '15px 0px',
                                        height: '46px',
                                      }}
                                    >
                                      {item.userName}
                                    </Stack>
                                  </Stack>
                                </Stack>
                              );
                            })}
                          </Grid>
                        </Grid>
                      </Stack>
                    </>
                  );
                })}
              </>
            ) : (
              <>
                {props?.mode === 'edit' ? (
                  <>
                  {eachItem?.isVisible && (
                    <>
                    <Stack className="header" style={{ paddingLeft: '9px' }}>
                      {eachItem?.name}
                    </Stack> 
                    <Stack className="sub-modules-headers">
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Stack style={{ marginLeft: '9px' }}>
                            Sub-modules
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack style={{ marginLeft: '10px' }}>Reviewer</Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack style={{ marginLeft: '11px' }}>Approver</Stack>
                        </Grid>
                      </Grid>
                    </Stack> </> )}
                    {eachItem?.subModules?.map(
                      (eachModule: any, index: number) => {
                        return (
                          <>
                          {eachModule?.isVisible &&
                            <Stack className="each-sub-module">
                              <Grid container spacing={2} key={index}>
                                <Grid item xs={4}>
                                  {eachModule?.name}
                                </Grid>
                                <Grid item xs={4} className="each-dropdown">
                                  {eachModule.reviewerData.map((item: any) => {
                                    return (
                                      <Grid item xs={12}>
                                        <SearchDropdown
                                          parentValue={
                                            item?.userID
                                          }
                                          data={props.options}
                                          onHandleChange={(value: any) => {
                                            let count = 0;
                                            requestResponsiblePeopleData?.map(
                                              (item: any) => {
                                                if (
                                                  item.modules ===
                                                  eachItem?.code
                                                ) {
                                                  let countVal = 0;
                                                  //if 2 boxes then causing issue
                                                  let respo =
                                                    item.subModules.map(
                                                      (item2: any) => {
                                                        if (
                                                          item2.subModules ===
                                                            eachModule.code &&
                                                          item2.roleAccessType ===
                                                            'REVIEWER'
                                                        ) {
                                                          item2 = {
                                                            ...item2,
                                                            userId:
                                                              value.userId,
                                                            userName:
                                                              value.name,
                                                          };
                                                          countVal++;
                                                          return item2;
                                                        } else {
                                                          return item2;
                                                        }
                                                      }
                                                    );
                                                  item.subModules = respo;
                                                  if (countVal === 0) {
                                                    let obj1 = {
                                                      roleAccessType:
                                                        'REVIEWER',
                                                      userId: value.userId,
                                                      userName: value.name,
                                                      subModules:
                                                        eachModule.code,
                                                    };
                                                    item.subModules = [
                                                      ...item.subModules,
                                                      obj1,
                                                    ];
                                                  }
                                                  count++;
                                                  countVal = 0;
                                                }
                                              }
                                            );
                                            if (count === 0) {
                                              obj = {
                                                modules: eachItem?.code,
                                                subModules: [
                                                  {
                                                    roleAccessType: 'REVIEWER',
                                                    userId: value.userId,
                                                    userName: value.name,
                                                    subModules: eachModule.code,
                                                  },
                                                ],
                                              };
                                              requestResponsiblePeopleData.push(
                                                obj
                                              );
                                            }
                                            count = 0;
                                            props?.handleResponseData &&
                                              props?.handleResponseData(
                                                requestResponsiblePeopleData
                                              );
                                          }}
                                        />
                                      </Grid>
                                    );
                                  })}
                                </Grid>
                                <Grid item xs={4} className="each-dropdown">
                                  {eachModule.approverData.map((item: any) => {
                                    return (
                                      <Grid item xs={12}>
                                        <SearchDropdown
                                          parentValue={
                                            item?.userID
                                          }
                                          data={props.options}
                                          onHandleChange={(value: any) => {
                                            let count = 0;
                                            requestResponsiblePeopleData?.map(
                                              (item: any) => {
                                                if (
                                                  item.modules ===
                                                  eachItem?.code
                                                ) {
                                                  let countVal = 0;
                                                  //if 2 boxes then causing issue
                                                  let respo =
                                                    item.subModules.map(
                                                      (item2: any) => {
                                                        if (
                                                          item2.subModules ===
                                                            eachModule.code &&
                                                          item2.roleAccessType ===
                                                            'APPROVER'
                                                        ) {
                                                          item2 = {
                                                            ...item2,
                                                            userId:
                                                              value.userId,
                                                            userName:
                                                              value.name,
                                                          };
                                                          countVal++;
                                                          return item2;
                                                        } else {
                                                          return item2;
                                                        }
                                                      }
                                                    );
                                                  item.subModules = respo;
                                                  if (countVal === 0) {
                                                    let obj1 = {
                                                      roleAccessType:
                                                        'APPROVER',
                                                      userId: value.userId,
                                                      userName: value.name,
                                                      subModules:
                                                        eachModule.code,
                                                    };
                                                    item.subModules = [
                                                      ...item.subModules,
                                                      obj1,
                                                    ];
                                                  }
                                                  count++;
                                                  countVal = 0;
                                                }
                                              }
                                            );
                                            if (count === 0) {
                                              obj = {
                                                modules: eachItem?.code,
                                                subModules: [
                                                  {
                                                    roleAccessType: 'APPROVER',
                                                    userId: value.userId,
                                                    userName: value.name,
                                                    subModules: eachModule.code,
                                                  },
                                                ],
                                              };
                                              requestResponsiblePeopleData.push(
                                                obj
                                              );
                                            }
                                            count = 0;
                                            props?.handleResponseData &&
                                              props.handleResponseData(
                                                requestResponsiblePeopleData
                                              );
                                          }}
                                        />
                                      </Grid>
                                    );
                                  })}
                                </Grid>
                              </Grid>
                            </Stack> }
                          </>
                        );
                      }
                    )}
                  </>
                ) : (
                  <>
                    {eachItem?.isVisible && (
                      <>
                        <Stack
                          className="header"
                          style={{ paddingLeft: '9px' }}
                        >
                          {eachItem?.name}
                        </Stack>
                        <Stack className="sub-modules-headers">
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Stack style={{ marginLeft: '9px' }}>
                                Sub-modules
                              </Stack>
                            </Grid>
                            <Grid item xs={4}>
                              <Stack style={{ marginLeft: '10px' }}>
                                Reviewer
                              </Stack>
                            </Grid>
                            <Grid item xs={4}>
                              <Stack style={{ marginLeft: '11px' }}>
                                Approver
                              </Stack>
                            </Grid>
                          </Grid>
                        </Stack>
                      </>
                    )}
                    {eachItem?.subModules?.map(
                      (eachModule: any, index: number) => {
                        return (
                          <>
                            {eachModule?.isVisible &&
                              (eachModule?.reviewer > 0 ||
                                eachModule?.approver > 0) && (
                                <Stack className="each-sub-module">
                                  <Grid container spacing={2} key={index}>
                                    <Grid item xs={4}>
                                      {eachModule?.name}
                                    </Grid>
                                    <Grid item xs={4} className="each-dropdown">
                                      {Array(eachModule.reviewer).fill(
                                        <Grid item xs={12}>
                                          <SearchDropdown
                                            data={props.options}
                                            onHandleChange={(value: any) => {
                                              let count = 0;
                                              requestResponsiblePeopleData?.map(
                                                (item: any) => {
                                                  if (
                                                    item.modules ===
                                                    eachItem?.code
                                                  ) {
                                                    let countVal = 0;
                                                    //if 2 boxes then causing issue
                                                    let respo =
                                                      item.subModules.map(
                                                        (item2: any) => {
                                                          if (
                                                            item2.subModules ===
                                                              eachModule.code &&
                                                            item2.roleAccessType ===
                                                              'REVIEWER' &&
                                                            eachModule.reviewer ===
                                                              1
                                                          ) {
                                                            item2 = {
                                                              ...item2,
                                                              userId:
                                                                value.userId,
                                                              userName:
                                                                value.name,
                                                            };
                                                            countVal++;
                                                            return item2;
                                                          } else {
                                                            return item2;
                                                          }
                                                        }
                                                      );
                                                    item.subModules = respo;
                                                    if (countVal === 0) {
                                                      let obj1 = {
                                                        roleAccessType:
                                                          'REVIEWER',
                                                        userId: value.userId,
                                                        userName: value.name,
                                                        subModules:
                                                          eachModule.code,
                                                      };
                                                      item.subModules = [
                                                        ...item.subModules,
                                                        obj1,
                                                      ];
                                                    }
                                                    count++;
                                                    countVal = 0;
                                                  }
                                                }
                                              );
                                              if (count === 0) {
                                                obj = {
                                                  modules: eachItem?.code,
                                                  subModules: [
                                                    {
                                                      roleAccessType:
                                                        'REVIEWER',
                                                      userId: value.userId,
                                                      userName: value.name,
                                                      subModules:
                                                        eachModule.code,
                                                    },
                                                  ],
                                                };
                                                requestResponsiblePeopleData.push(
                                                  obj
                                                );
                                              }
                                              count = 0;
                                              props?.handleResponseData &&
                                                props?.handleResponseData(
                                                  requestResponsiblePeopleData
                                                );
                                            }}
                                          />
                                        </Grid>
                                      )}
                                    </Grid>
                                    <Grid item xs={4} className="each-dropdown">
                                      {Array(eachModule.approver).fill(
                                        <Grid item xs={12}>
                                          <SearchDropdown
                                            data={props.options}
                                            onHandleChange={(value: any) => {
                                              let count = 0;
                                              requestResponsiblePeopleData?.map(
                                                (item: any) => {
                                                  if (
                                                    item.modules ===
                                                    eachItem?.code
                                                  ) {
                                                    let countVal = 0;
                                                    //if 2 boxes then causing issue
                                                    let respo =
                                                      item.subModules.map(
                                                        (item2: any) => {
                                                          if (
                                                            item2.subModules ===
                                                              eachModule.code &&
                                                            item2.roleAccessType ===
                                                              'APPROVER' &&
                                                            eachModule.approver ===
                                                              1
                                                          ) {
                                                            item2 = {
                                                              ...item2,
                                                              userId:
                                                                value.userId,
                                                              userName:
                                                                value.name,
                                                            };
                                                            countVal++;
                                                            return item2;
                                                          } else {
                                                            return item2;
                                                          }
                                                        }
                                                      );
                                                    item.subModules = respo;
                                                    if (countVal === 0) {
                                                      let obj1 = {
                                                        roleAccessType:
                                                          'APPROVER',
                                                        userId: value.userId,
                                                        userName: value.name,
                                                        subModules:
                                                          eachModule.code,
                                                      };
                                                      item.subModules = [
                                                        ...item.subModules,
                                                        obj1,
                                                      ];
                                                    }
                                                    count++;
                                                    countVal = 0;
                                                  }
                                                }
                                              );
                                              if (count === 0) {
                                                obj = {
                                                  modules: eachItem?.code,
                                                  subModules: [
                                                    {
                                                      roleAccessType:
                                                        'APPROVER',
                                                      userId: value.userId,
                                                      userName: value.name,
                                                      subModules:
                                                        eachModule.code,
                                                    },
                                                  ],
                                                };
                                                requestResponsiblePeopleData.push(
                                                  obj
                                                );
                                              }
                                              count = 0;
                                              props?.handleResponseData &&
                                                props.handleResponseData(
                                                  requestResponsiblePeopleData
                                                );
                                            }}
                                          />
                                        </Grid>
                                      )}
                                    </Grid>
                                  </Grid>
                                </Stack>
                              )}{' '}
                          </>
                        );
                      }
                    )}
                  </>
                )}
              </>
            )}
          </>
        );
      })}
    </Stack>
  );
}

export default ApproverReviewerTable;
