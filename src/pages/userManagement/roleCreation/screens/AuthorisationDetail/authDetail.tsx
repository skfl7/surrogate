import {
  Stack,
  Box,
  Button,
  IconButton,
  Typography,
  Grid,
} from '@mui/material';
import './authDetailStyle.scss';
import React, { useEffect, useState } from 'react';
import { ScreenHeader } from '../../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import '../AuthorisationDetail/authDetailStyle.scss';
import Edit_icon from '../../../../../assets/icons/edit_scheduled_pause_icon.svg';
import { ListTagStatus } from '../../../../../utils/tagBasedIndicator/listTagStatus';
import active_icon from '../../../../../assets/icons/active_icon.svg';
import question_icon from '../../../../../assets/icons/questionMark_icon.svg';
import close_icon from '../../../../../assets/icons/close_icon.svg';
import { tagBasedIndicator } from '../../../../../utils/Constants';
import BtnContained from '../../../../../components/commonComponent/CustomText/Button/Contained';
import { useLocation, useNavigate } from 'react-router-dom';
import CardAndDropDown from '../../../../../components/commonComponent/cardAndDropDown/cardAndDropDown';
import BtnOutlined from '../../../../../components/commonComponent/CustomText/Button/Outlined';
import CustomModal from '../../../../../components/commonComponent/customModal/CustomModal';
import {
  createAuthorization,
  getAuthorizationDetail,
  updateAuthorizationDetail,
} from '../../../../../services/roleCreationServices';
import { formatDateTime } from '../../../../../utils/DateTimeFormatter';
import localforage from 'localforage';
import { historyLogDetailsListItem } from '../../../../../services/programmeManagementServices';

const authDetailHeader = [
  {
    title: 'Initiated By',
    details: 'Parithi',
  },
  {
    title: 'Initiated Date',
    details: '12 Jul,22 09:40 Am',
  },
  {
    title: 'Approved By',
    details: 'Ganesh',
  },
  {
    title: 'Approved Date',
    details: '12 Jul,22 09:40 Am',
  },
];

const initial_data_template = [
  {
    module_id: 1,
    name: 'Product Management',
    code: 'PRODUCT_MANAGEMENT',

    reviewer: 'Reviewer',
    approver: 'Approver',
    subModules: [
      {
        sub_module_id: 1,
        name: 'Program Management',
        code: 'PROGRAM_MANAGEMENT',
        initiator_data: 1,
        reviewer: 0,
        approver: 0,
      },

      {
        sub_module_id: 2,
        name: ' Card Catelog',
        code: 'CARD_CATALOGUE',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
      {
        sub_module_id: 3,
        name: 'credit Rule ',
        code: 'CREDIT_RULE',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
    ],
  },
  {
    module_id: 2,
    name: 'User Management',
    code: 'USER_MANAGEMENT',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    subModules: [
      {
        sub_module_id: 4,
        name: 'Org.Structure',
        code: 'ORGANIZATION_STRUCTURE',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
      {
        sub_module_id: 5,
        name: 'Branch Details',
        code: 'BRANCH_DETAILS',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
      {
        sub_module_id: 6,
        name: 'Role Creation',
        code: 'ROLE_CREATION',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
      {
        sub_module_id: 7,
        name: 'User Creation',
        code: 'USER_CREATION',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
    ],
  },
  {
    module_id: 3,
    name: 'LMS',
    code: 'LMS',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    subModules: [
      {
        sub_module_id: 8,
        name: 'LMS',
        code: 'LMS_RULE_RE_TARGET',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
    ],
  },
  {
    module_id: 4,
    name: 'Risk Management',
    code: 'RISK_MANAGEMENT',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    subModules: [
      {
        sub_module_id: 9,
        name: 'Customer Report',
        code: 'ACCESS_LIBRARY',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
    ],
  },
];
const original_data_template = [
  {
    module_id: 1,
    name: 'Product Management',
    code: 'PRODUCT_MANAGEMENT',

    reviewer: 'Reviewer',
    approver: 'Approver',
    subModules: [
      {
        sub_module_id: 1,
        name: 'Program Management',
        code: 'PROGRAM_MANAGEMENT',
        initiator_data: 1,
        reviewer: 0,
        approver: 0,
      },

      {
        sub_module_id: 2,
        name: ' Card Catelog',
        code: 'CARD_CATALOGUE',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
      {
        sub_module_id: 3,
        name: 'credit Rule ',
        code: 'CREDIT_RULE',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
    ],
  },
  {
    module_id: 2,
    name: 'User Management',
    code: 'USER_MANAGEMENT',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    subModules: [
      {
        sub_module_id: 4,
        name: 'Org.Structure',
        code: 'ORGANIZATION_STRUCTURE',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
      {
        sub_module_id: 5,
        name: 'Branch Details',
        code: 'BRANCH_DETAILS',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
      {
        sub_module_id: 6,
        name: 'Role Creation',
        code: 'ROLE_CREATION',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
      {
        sub_module_id: 7,
        name: 'User Creation',
        code: 'USER_CREATION',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
    ],
  },
  {
    module_id: 3,
    name: 'LMS',
    code: 'LMS',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    subModules: [
      {
        sub_module_id: 8,
        name: 'LMS',
        code: 'LMS_RULE_RE_TARGET',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
    ],
  },
  {
    module_id: 4,
    name: 'Risk Management',
    code: 'RISK_MANAGEMENT',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    subModules: [
      {
        sub_module_id: 9,
        name: 'Customer Report',
        code: 'ACCESS_LIBRARY',
        initiator_data: '',
        reviewer: 0,
        approver: 0,
      },
    ],
  },
];

export const AuthDetail = () => {
  const location = useLocation();
  const { state } = location;
  const { id, status, mode, screen, history, user_id } = state;
  const [createRoleSelection, setCreateRoleSelection] = useState(false);
  const [edit, setEdit] = useState(false);
  const [authData, setAuthData] = useState<any>();
  const [headerData, setHeaderData] = useState<any>();
  const [reviewerValue, setReviewerValue] = useState(0);
  const [userID, setUserId] = useState<string>();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    getLocalStorageID();
  }, []);
  const getLocalStorageID = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setUserId(value.id);
    } catch (err) {
      console.log(err);
    }
  };

  const getValue = (array = [], name: string, key: string) => {
    console.log('name--- >', name);
    let res: any = '';
    array.forEach((item: any) => {
      console.log('item.subModules', item.subModules);
      const response = item.subModules.find(
        (subItems: any) => subItems.code === name
      );
      if (response) {
        res = response;
      }
    });
    console.log('res reviewer', res);
    return res[key] ?? 0;
  };
  const handleError = (err: any) => {
    if (err?.exception?.fieldErrors) {
      const missingFields = err?.exception.fieldErrors?.map(
        (field: string) => `${field}, `
      );
      setApiError(missingFields);
    } else if (err?.exception?.shortMessage)
      setApiError(err?.exception?.shortMessage);
    else if (err?.error) setApiError(err?.error + ' ' + err?.path);
    else setApiError('Something went wrong!');
  };
  const historyLogDetails = () => {
    let payload = {
      id: id,
      userId: user_id,
      authorizationModule: 'AUTHORIZATION_LEVEL',
      page: 0,
      size: 5,
    };
    historyLogDetailsListItem(payload)
      .then((response: any) => {
        const result = response.data?.result;
        if (result) {
          const res =
            response?.data?.result?.content[0]?.authorizationLevelRes
              ?.authorizationModules;
          setAuthData(res);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err: any) => {
        console.log('history fail');
        setAuthData([]);
        handleError(err?.response?.data ?? '');
      });
  };

  const getAuthorizationItemDetails = () => {
    let payload = {
      authorizationId: id,
    };

    getAuthorizationDetail(payload)
      .then((response) => {
        if (response.data?.result) {
          const res = response?.data?.result?.authorizationModules;
          const result = [
            {
              module_id: 1,
              module_name: 'Product Management',
              code: 'PRODUCT',
              sub_modules: 'Sub-modules',
              reviewer: 'Reviewer',
              approver: 'Approver',
              sub_module: [
                {
                  sub_module_id: 1,
                  sub_module_name: 'Programme Management',
                  code: 'PROGRAM',
                  initiator_data: 1,
                  reviewer_data: getValue(res, 'PROGRAM', 'reviewer'),
                  approver_data: getValue(res, 'PROGRAM', 'approver'),
                },
                {
                  sub_module_id: 2,
                  sub_module_name: 'Credit Rule',
                  code: 'POLICY',
                  initiator_data: '',
                  reviewer_data: getValue(res, 'POLICY', 'reviewer'),
                  approver_data: getValue(res, 'POLICY', 'approver'),
                },
                {
                  sub_module_id: 3,
                  sub_module_name: 'Card Catalog',
                  code: 'CARD',
                  initiator_data: '',
                  reviewer_data: getValue(res, 'CARD', 'reviewer'),
                  approver_data: getValue(res, 'CARD', 'approver'),
                },
              ],
            },
            {
              module_id: 2,
              module_name: 'User Management',
              code: 'USER_MANAGEMENT',
              sub_modules: 'Sub-modules',
              reviewer: 'Reviewer',
              approver: 'Approver',
              sub_module: [
                {
                  sub_module_id: 4,
                  sub_module_name: 'Org.Structure',
                  code: 'ORGANIZATION',
                  initiator_data: '',
                  reviewer_data: getValue(res, 'ORGANIZATION', 'reviewer'),
                  approver_data: getValue(res, 'ORGANIZATION', 'approver'),
                },
                {
                  sub_module_id: 5,
                  sub_module_name: 'Branch Details',
                  code: 'BRANCH',
                  initiator_data: '',
                  reviewer_data: getValue(res, 'BRANCH', 'reviewer'),
                  approver_data: getValue(res, 'BRANCH', 'approver'),
                },
                {
                  sub_module_id: 6,
                  sub_module_name: 'Role Creation',
                  code: 'ROLE',
                  initiator_data: '',
                  reviewer_data: getValue(res, 'ROLE', 'reviewer'),
                  approver_data: getValue(res, 'ROLE', 'approver'),
                },
                {
                  sub_module_id: 7,
                  sub_module_name: 'User Creation',
                  code: 'USER',
                  initiator_data: '',
                  reviewer_data: getValue(res, 'USER', 'reviewer'),
                  approver_data: getValue(res, 'USER', 'approver'),
                },
              ],
            },
            {
              module_id: 3,
              module_name: 'LMS',
              code: 'LMS',
              sub_modules: 'Sub-modules',
              reviewer: 'Reviewer',
              approver: 'Approver',
              sub_module: [
                {
                  sub_module_id: 8,
                  sub_module_name: 'LMS Rule',
                  code: 'LMS',
                  initiator_data: '',
                  reviewer_data: getValue(res, 'LMS', 'reviewer'),
                  approver_data: getValue(res, 'LMS', 'approver'),
                },
              ],
            },
            {
              module_id: 4,
              module_name: 'Risk Management',
              code: 'RISK_MANAGEMENT',
              sub_modules: 'Sub-modules',
              reviewer: 'Reviewer',
              approver: 'Approver',
              sub_module: [
                {
                  sub_module_id: 9,
                  sub_module_name: 'Customer Support',
                  code: 'CUSTOMER_SUPPORT',
                  initiator_data: '',
                  reviewer_data: getValue(res, 'CUSTOMER_SUPPORT', 'approver'),
                  approver_data: getValue(res, 'CUSTOMER_SUPPORT', 'approver'),
                },
              ],
            },
          ];
          setAuthData(res);
          setHeaderData(response.data.result);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        setAuthData([]);
        handleError(err?.response?.data ?? '');
      });
  };

  useEffect(() => {
    if (mode === 'editMode') {
      setEdit(!edit);
      console.log('edit page checking');
    }
    // console.log('data in auth', data);
    // setAuthData(data);
    // if (screen === 'view') {
    //   getAuthorizationItemDetails();
    //   console.log('view page checking');
    // } else {
    //   console.log('create page checking');
    // if (screen === 'create') {
    // getAuthorizationItemDetails();
    // let temp = [];
    // temp = [...initial_data_template];
    // console.log('temp', temp);
    // setAuthData(temp);
    // }
    if (history) {
      historyLogDetails();
    } else {
      getAuthorizationItemDetails();
    }
  }, []);

  const getpayloadValue = (
    module: string,
    subModule: string,
    isApprover: boolean
  ) => {
    let value: any;

    let arr = [...authData];

    arr?.map((item: any) => {
      if (item?.code === module) {
        item?.subModules?.map((subItem: any) => {
          if (subItem?.code === subModule) {
            value = subItem;
          }
        });
      }
    });

    return isApprover ? value?.approver : value?.reviewer;
  };

  const handleSubmitClick = () => {
    console.log('authData', authData);

    const payload_data = {
      productManagement: {
        programManagement: {
          reviewer: getpayloadValue(
            'PRODUCT_MANAGEMENT',
            'PROGRAM_MANAGEMENT',
            false
          ), //authData[0].subModules[0].reviewer,
          approver: getpayloadValue(
            'PRODUCT_MANAGEMENT',
            'PROGRAM_MANAGEMENT',
            true
          ), //authData[0].subModules[0].approver,
        },
        creditRule: {
          reviewer: getpayloadValue('PRODUCT_MANAGEMENT', 'CREDIT_RULE', false), //authData[0].subModules[1].reviewer,
          approver: getpayloadValue('PRODUCT_MANAGEMENT', 'CREDIT_RULE', true), //authData[0].subModules[1].approver,
        },
        cardCatalog: {
          reviewer: getpayloadValue(
            'PRODUCT_MANAGEMENT',
            'CARD_CATALOGUE',
            false
          ), //authData[0].subModules[2].reviewer,
          approver: getpayloadValue(
            'PRODUCT_MANAGEMENT',
            'CARD_CATALOGUE',
            true
          ), //authData[0].subModules[2].approver,
        },
      },
      userManagement: {
        organizationStructure: {
          reviewer: getpayloadValue(
            'USER_MANAGEMENT',
            'ORGANIZATION_STRUCTURE',
            false
          ), //authData[1].subModules[0].reviewer,
          approver: getpayloadValue(
            'USER_MANAGEMENT',
            'ORGANIZATION_STRUCTURE',
            true
          ), //authData[1].subModules[0].approver,
        },
        branchDetails: {
          reviewer: getpayloadValue('USER_MANAGEMENT', 'BRANCH_DETAILS', false), //authData[1].subModules[1].reviewer,
          approver: getpayloadValue('USER_MANAGEMENT', 'BRANCH_DETAILS', true), //authData[1].subModules[1].approver,
        },
        roleCreation: {
          reviewer: getpayloadValue('USER_MANAGEMENT', 'ROLE_CREATION', false), //authData[1].subModules[2].reviewer,
          approver: getpayloadValue('USER_MANAGEMENT', 'ROLE_CREATION', true), //authData[1].subModules[2].approver,
        },
        userCreation: {
          reviewer: getpayloadValue('USER_MANAGEMENT', 'USER_CREATION', false), //authData[1].subModules[3].reviewer,
          approver: getpayloadValue('USER_MANAGEMENT', 'USER_CREATION', true), //authData[1].subModules[3].approver,
        },
      },
      lms: {
        lmsRule: {
          reviewer: getpayloadValue('LMS', 'LMS_RULE_RE_TARGET', false), //authData[2].subModules[0].reviewer,
          approver: getpayloadValue('LMS', 'LMS_RULE_RE_TARGET', true), //authData[2].subModules[0].approver,
        },
      },
      riskManagement: {
        customerSupport: {
          reviewer: getpayloadValue(
            'RISK_MANAGEMENT',
            'RISK_MANAGEMENT_CUSTOMER_REPORT',
            false
          ), //authData[3].subModules[0].reviewer,
          approver: getpayloadValue(
            'RISK_MANAGEMENT',
            'RISK_MANAGEMENT_CUSTOMER_REPORT',
            true
          ), //authData[3].subModules[0].approver,
        },
      },
      actionUserId: userID,
    };
    const edit_payload = {
      authorizationId: id,
      ...payload_data,
    };

    console.log('edit_payload', edit_payload);

    if (edit || screen === 'view') {
      updateAuthorizationDetail(edit_payload)
        .then((response) => {
          const result = response.data?.result;
          if (result) {
            setCreateRoleSelection(true);
          } else {
            handleError(response?.data ?? '');
          }
        })
        .catch((err) => {
          console.log('err', err);
          handleError(err?.response?.data ?? '');
        });
    } else {
      createAuthorization(payload_data)
        .then((response) => {
          const result = response.data?.result;
          if (result) {
            setCreateRoleSelection(true);
          } else {
            handleError(response?.data ?? '');
          }
          // setAuthData([...initial_data_template]);
        })
        .catch((err) => {
          console.log('err', err);
          handleError(err?.response?.data ?? '');
        });
    }
    // if (screen === 'view') {
    //   updateAuthorizationDetail(edit_payload)
    //     .then((response) => {
    //       setCreateRoleSelection(true);
    //     })
    //     .catch((err) => {
    //       console.log('err', err);
    //     });
    // }
    // if (screen === 'create') {
    //   createAuthorization(payload_data)
    //     .then((response) => {
    //       setCreateRoleSelection(true);
    //       // setAuthData([...initial_data_template]);
    //     })
    //     .catch((err) => {
    //       console.log('err', err);
    //     });
    // }
  };
  const goBack = () => {
    navigate(-1);
  };

  const onChangeValue = (
    index: number,
    subIndex: number,
    key: string,
    event: any
  ) => {
    let currentData = authData;
    const value = event?.target?.value;
    if (currentData?.length > 0) {
      currentData[index].subModules[subIndex][key] = value;
      setAuthData([...currentData]);
    }
  };
  return (
    <Stack className="authDetailContainer">
      <Stack className="authDetailContainerHeaderMain">
        <Stack className="authDetailHeaderContainer">
          {edit ? (
            <>
              <Stack className="authDetailHeaderSubContainer">
                <Stack className="authDetailHeaderTitle">
                  <ScreenHeader
                    title="Edit Authorization level/ V 0.01"
                    info="From here you can create access presets to assign with users in Users creation."
                    showBackButton={true}
                  />
                </Stack>
              </Stack>
            </>
          ) : (
            <>
              <Stack
                className="authDetailHeaderSubContainer"
                sx={{
                  borderBottom: '2px solid #f0f2f5',
                  paddingBottom: '24px',
                }}
              >
                <Stack className="authDetailHeaderTitle">
                  <ScreenHeader
                    title={`View Authorization level/ ${
                      headerData?.versionName
                        ? headerData.versionName
                        : 'V 0.09'
                    }`}
                    info="From here you can create access presets to assign with users in Users creation."
                    showBackButton={true}
                  />
                </Stack>

                <Stack className="authDetailHeaderStatus">
                  <Box>
                    <Typography
                      sx={{
                        color: ListTagStatus(status).color,
                        backgroundColor: ListTagStatus(status).bgColor,
                        fontSize: '12px',
                        fontWeight: 400,
                        padding: '3px 10px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: 'max-content',
                      }}
                    >
                      {status === tagBasedIndicator.ACTIVE && (
                        <img
                          src={active_icon}
                          alt="active"
                          style={{ marginRight: '8px' }}
                        />
                      )}
                      {status === tagBasedIndicator.WAITING_FOR_APPROVAL && (
                        <img
                          src={question_icon}
                          alt="active"
                          style={{ marginRight: '8px' }}
                        />
                      )}
                      {status === tagBasedIndicator.CLOSED && (
                        <img
                          src={close_icon}
                          alt="active"
                          style={{ marginRight: '8px' }}
                        />
                      )}
                      {status}
                    </Typography>
                  </Box>
                  {status === tagBasedIndicator.ACTIVE && (
                    <Button
                      variant="text"
                      className="authDetailHeaderButton"
                      sx={{ color: '#0662B7', fontSize: '14px' }}
                      onClick={() => setEdit(true)}
                    >
                      <IconButton>
                        <img
                          src={Edit_icon}
                          alt=""
                          style={{
                            filter:
                              'invert(26%) sepia(97%) saturate(1278%) hue-rotate(190deg) brightness(92%) contrast(101%)',
                          }}
                        />
                      </IconButton>
                      Edit Authorization Level
                    </Button>
                  )}
                </Stack>
              </Stack>
              <Grid container className="authorization_level_header">
                <Grid item xs={12} sm={6} md={3}>
                  <Typography
                    sx={{ color: '#AFAEAF' }}
                    className="authDetailHeaderSubContainerDetailsTitle"
                  >
                    {'Initiated By'}
                  </Typography>
                  <Typography className="authDetailHeaderSubContainerDetailsPara">
                    {headerData?.initiatedBy
                      ? headerData?.initiatedBy
                      : 'Ganesh'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography
                    // sx={{ color: '#AFAEAF',fontSize:'12px',fontWeight:500  }}
                    className="authDetailHeaderSubContainerDetailsTitle"
                  >
                    {'Initiated Date'}
                  </Typography>
                  <Typography className="authDetailHeaderSubContainerDetailsPara">
                    {headerData?.initiatedDateTime
                      ? formatDateTime(headerData?.initiatedDateTime)
                      : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography
                    // sx={{ color: '#AFAEAF',fontSize:'12px',fontWeight:500  }}
                    className="authDetailHeaderSubContainerDetailsTitle"
                  >
                    {'Approved By'}
                  </Typography>
                  <Typography className="authDetailHeaderSubContainerDetailsPara">
                    {headerData?.approvedBy
                      ? headerData?.approvedBy
                      : 'vignesh'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography
                    // sx={{ color: '#AFAEAF',fontSize:'12px',fontWeight:500  }}
                    className="authDetailHeaderSubContainerDetailsTitle"
                  >
                    {'Approved Date'}
                  </Typography>
                  <Typography className="authDetailHeaderSubContainerDetailsPara">
                    {headerData?.approvedDateTime
                      ? formatDateTime(headerData?.approvedDateTime)
                      : '-'}
                  </Typography>
                </Grid>
              </Grid>

              {/* <Stack>
                <Stack className="authDetailHeaderSubContainerDetails">
                  <Stack>
                    <Typography className="authDetailHeaderSubContainerDetailsTitle">
                      {'Initiated By'}
                    </Typography>
                    <Typography className="authDetailHeaderSubContainerDetailsPara">
                      {headerData?.initiatedBy
                        ? headerData?.initiatedBy
                        : 'Ganesh'}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography className="authDetailHeaderSubContainerDetailsTitle">
                      {'Initiated Date'}
                    </Typography>
                    <Typography className="authDetailHeaderSubContainerDetailsPara">
                      {headerData?.initiatedDateTime
                        ? headerData?.initiatedDateTime
                        : '12 Jul,22 09:40 Am'}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography className="authDetailHeaderSubContainerDetailsTitle">
                      {'Approved By'}
                    </Typography>
                    <Typography className="authDetailHeaderSubContainerDetailsPara">
                      {headerData?.approvedBy
                        ? headerData?.approvedBy
                        : 'vignesh'}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography className="authDetailHeaderSubContainerDetailsTitle">
                      {'Approved Date'}
                    </Typography>
                    <Typography className="authDetailHeaderSubContainerDetailsPara">
                      {headerData?.approvedDateTime
                        ? headerData?.approvedDateTime
                        : '12 Jul,22 09:40 Am'}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack> */}
            </>
          )}
        </Stack>
      </Stack>
      <Stack
        className="modelAccessControlContainer"
        sx={{ margin: edit ? '30px 0 90px 0' : '30px 0' }}
      >
        <Stack className="modelAccessControlSubContainer">
          <Stack>
            <Typography className="modelAccessControlContainerTitle">
              Module Access Control
            </Typography>
          </Stack>
          {authData?.length > 0 &&
            authData?.map((items: any, index: number) => {
              return (
                <Stack key={index}>
                  <Stack className="modelAccessControlContainerTable">
                    <Stack className="modelAccessControlContainerTableHeader">
                      <Stack sx={{ width: '50%' }}>
                        <Typography className="modelAccessControlModuleName">
                          {items?.name}
                        </Typography>
                      </Stack>
                      <Stack
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: '50%',
                        }}
                      >
                        <Typography
                          sx={{ width: '48%' }}
                          className="modelAccessControlModuleName"
                        >
                          {'Reviewer'}
                        </Typography>
                        <Typography
                          sx={{ width: '48%' }}
                          className="modelAccessControlModuleName"
                        >
                          {'Approver'}
                        </Typography>
                      </Stack>
                    </Stack>
                    {items?.subModules?.map(
                      (subItem: any, subIndex: number) => {
                        console.log('subItem', subItem);
                        return (
                          <Stack className="modelAccessControlContainerTableData">
                            <Stack sx={{ width: '50%' }}>
                              <Typography
                                className="modelAccessControlModelName"
                                sx={
                                  subItem.reviewer >= 1 || subItem.approver >= 1
                                    ? { cursor: 'pointer' }
                                    : { cursor: 'context-menu' }
                                }
                                onClick={() => {
                                  localStorage.setItem(
                                    items.name.toLowerCase(),
                                    subItem.code
                                  );
                                  localStorage.setItem(
                                    'checkTab',
                                    (index + 1).toString()
                                  );

                                  if (
                                    subItem.reviewer >= 1 ||
                                    subItem.approver >= 1
                                  ) {
                                    navigate(
                                      '/userManagement/roleCreation/userdetails/productManagement',
                                      {
                                        state: {
                                          activeTabStatus: index + 1,
                                          subActiveTabStatus: index,
                                          subIndex,
                                          authData,
                                        },
                                      }
                                    );
                                  }
                                }}
                              >
                                {subItem.name}
                              </Typography>
                            </Stack>
                            <Stack
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: '50%',
                              }}
                            >
                              <Stack className="modelAccessControlModelCount">
                                <CardAndDropDown
                                  value={subItem.reviewer}
                                  onChange={(value: any) =>
                                    onChangeValue(
                                      index,
                                      subIndex,
                                      'reviewer',
                                      value
                                    )
                                  }
                                  // value={reviewerValue}
                                  showDropDown={edit}
                                  moduleCode={items?.code}
                                  subModuleCode={subItem?.code}
                                  moduleName={items?.module_name}
                                  subModuleName={subItem?.sub_module_name}
                                />
                              </Stack>
                              <Stack className="modelAccessControlModelCount">
                                <CardAndDropDown
                                  value={subItem.approver}
                                  onChange={(value: any) =>
                                    onChangeValue(
                                      index,
                                      subIndex,
                                      'approver',
                                      value
                                    )
                                  }
                                  showDropDown={edit}
                                  moduleCode={items?.code}
                                  subModuleCode={subItem?.code}
                                  moduleName={items?.module_name}
                                  subModuleName={subItem?.sub_module_name}
                                />
                              </Stack>
                            </Stack>
                          </Stack>
                        );
                      }
                    )}
                  </Stack>
                </Stack>
              );
            })}
        </Stack>
      </Stack>
      {edit ? (
        <>
          <Box
            sx={{
              marginTop: '10px',
              backgroundColor: 'white',
              position: 'fixed',
              bottom: 0,
              right: 0,
              width: '100%',
              borderTop: '2px solid #f3f3f3 ',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                padding: '10px 30px',
              }}
            >
              <BtnOutlined title="Cancel" onClick={() => navigate(-1)} />
              <BtnContained title="Submit" onClick={handleSubmitClick} />
            </Box>
          </Box>
        </>
      ) : (
        <></>
      )}
      {createRoleSelection && (
        <CustomModal
          openSuccess={createRoleSelection}
          handleCloseSuccess={goBack}
          successModalTitle={'Authorization level Created Successfully'}
          successModalMsg={
            'Your request for creating new authorization level is successfully sent to the Reviewer.'
          }
          btn={'Close'}
        />
      )}
    </Stack>
  );
};
