import { Button, Divider, Grid, TextField, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import './createRole.scss';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import { AccordianLayover } from '../../../../components/commonComponent/CustomAccordian/Accordian';
import { FooterButton } from '../../../../components/commonComponent/FooterButton/FooterButton';
import { useEffect, useState } from 'react';
import CustomModal from '../../../../components/commonComponent/customModal/CustomModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as EditRole } from '../../../../assets/icons/edit_role.svg';
import {
  createNewRoleApi,
  editExistingRoleApi,
} from '../../../../services/roleCreationServices';
import moment from 'moment';
import localforage from 'localforage';
import ErrorMessage from '../../../../components/commonComponent/ErrorMessage';
import { validateInputFields } from '../../../../utils/validations/input';
import { RegexValidation } from '../../../../utils/Regex';
export const CreateRole = () => {
  const { state } = useLocation();
  const [createRoleSelection, setCreateRoleSelection] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
  const [enabled, isEnabled] = useState(false);
  const [displayCategories, setDisplayCategories] = useState<any>(
    state.roleName.length > 0 ? state?.data : state?.data
  );
  const [updatedList, setUpdatedList] = useState<any>({});
  const [newRole, setNewRoleSelected] = useState(
    state?.newRole ? state?.newRole : false
  );
  const [apiError, setApiError] = useState('');
  const [userID, setUserId] = useState<string>();
  const navigate = useNavigate();
  let checkCount = 0;
  let switchCount = 0;
  let calCount = 0;
  useEffect(() => {
    getLocalStorageID();
  }, []);
  const getLocalStorageID = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      const id = value.id;
      setUserId(id);
    } catch (err) {
      console.log(err);
    }
  };
  const goBack = () => {
    navigate(-1);
  };
  const handleSubmitClick = async () => {
    if (updatedList?.actionsAllowed?.length > 0) {
      console.log(updatedList, 'updatedList');
      let newData1 = updatedList.actionsAllowed;
      const newArr = newData1.map((rest: any) => {
        const newData = rest.subAction.map((rest2: any) => {
          console.log('rest3', rest2);
          const subData = rest2.secondSubActions.map((rest3: any) => {
            let newName = rest3.code;
            let obj = {
              name: newName,
              roleAccess: rest3.roleAccess,
            };
            console.log('newNamexyz', rest3);
            // delete rest3.code;
            // delete rest3.defaultEnable;
            console.log('------- newName', newName);
            return obj;
            // return { ...rest3, name: newName };
          });
          let newName = rest2.code;
          return {
            name: newName,
            secondSubActions: subData,
            roleAccess: rest2.roleAccess,
          };
        });
        let newName = rest.code;
        return {
          name: newName,
          subAction: newData,
          roleAccess: rest.roleAccess,
        };
      });
      if (roleName.length > 0) {
        if (newRole) {
          let payload = {
            name: roleName,
            actionsAllowed: newArr,
            actionUserId: userID,
          };
          console.log('1', payload, newArr, newData1, updatedList);
          const result = await createNewRole(payload);
        } else {
          let payload = {
            roleId: displayCategories.id,
            name: roleName,
            actionsAllowed: newArr,
            actionUserId: userID,
          };
          console.log('2', roleName, payload);
          const result = await updateExistingRole(payload);
        }
      }
    } else {
      if (roleName.length > 0) {
        if (newRole) {
          let payload = {
            name: roleName,
            actionsAllowed: displayCategories.actionsAllowed,
          };
          console.log('3', roleName, payload);
          const result = await createNewRole(payload);
        } else {
          let payload = {
            roleId: displayCategories.id,
            name: roleName,
            actionsAllowed: displayCategories.actionsAllowed,
          };
          console.log('4', roleName, payload);
          const result = await updateExistingRole(payload);
        }
      }
    }
  };
  const createNewRole = async (payload: any) => {
    let res = {} as any;
    await createNewRoleApi(payload)
      .then((response) => {
        console.log('----', response);

        // if(response.)
        if (response.data.result) {
          setCreateRoleSelection(true);
        } else {
          handleError(response?.data ?? '');
        }
        // if (response.status === 200) {
        //   setCreateRoleSelection(true);
        // }
      })
      .catch((err) => {
        console.log('******', err);
        console.log(err);
        handleError(err?.response?.data ?? '');
      });
    return res;
  };
  const updateExistingRole = async (payload: any) => {
    let res = {} as any;
    await editExistingRoleApi(payload)
      .then((response) => {
        console.log('response', response.status);

        if (response.data.result) {
          setCreateRoleSelection(true);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        console.log(err);
        handleError(err?.response?.data ?? '');
      });
    return res;
  };
  const handleError = (err: any) => {
    if (err?.exception?.fieldErrors) {
      const missingFields = err?.exception.fieldErrors?.map(
        (field: string) => `${field}, `
      );
      setApiError(missingFields);
    } else if (err?.exception?.detailMessage)
      setApiError(err?.exception?.detailMessage);
    else if (err?.error) setApiError(err?.error + ' ' + err?.path);
    else setApiError('Something went wrong!');
  };
  const handleEditRoleClick = () => {
    isEnabled(false);
    setRoleName(displayCategories?.name);
    const newArr = displayCategories?.actionsAllowed.map((rest: any) => {
      const newData = rest.subAction.map((rest2: any) => {
        if (rest2.roleAccess === 'YES') switchCount++;
      });
      if (switchCount > 0) calCount++;
      switchCount = 0;
      if (rest.roleAccess === 'YES') checkCount++;
    });
    if (
      checkCount === calCount &&
      checkCount != 0 &&
      calCount != 0 &&
      displayCategories?.name?.length > 0 &&
      RegexValidation.onlycharectorNumberAndSpace.test(roleName)
    )
      setSubmitDisabled(true);
    else setSubmitDisabled(false);
  };
  useEffect(() => {
    if (state) {
      setRoleName(state.roleName);
      isEnabled(state.isView);
      let updatedList = {
        ...displayCategories,
        actionsAllowed: displayCategories?.actionsAllowed,
        roleId: displayCategories.id,
        name: state.roleName,
      };
      const newArr = displayCategories?.actionsAllowed.map((rest: any) => {
        const newData = rest.subAction.map((rest2: any) => {
          if (rest2.roleAccess === 'YES') switchCount++;
        });
        if (switchCount > 0) calCount++;
        switchCount = 0;
        if (rest.roleAccess === 'YES') checkCount++;
      });
      if (
        checkCount === calCount &&
        checkCount != 0 &&
        calCount != 0 &&
        state?.roleName?.length > 0 &&
        RegexValidation.onlycharectorNumberAndSpace.test(roleName)
      )
        setSubmitDisabled(true);
      else setSubmitDisabled(false);
      setUpdatedList(updatedList);
    }
  }, [state]);
  return (
    <Stack>
      <Stack>
        {enabled ? (
          <Box className="upper-head-container">
            <Box className="create-header-container">
              <ScreenHeader
                title={`View Role - ${displayCategories?.name}`}
                info="From here you can create access presets to assign with users in Users creation."
                showBackButton={true}
              />
              <Box>
                <Button
                  sx={{ textTransform: 'capitalize' }}
                  color="secondary"
                  startIcon={<EditRole />}
                  aria-haspopup="true"
                  onClick={handleEditRoleClick}
                  id="basic-button"
                >
                  Edit Role
                </Button>
              </Box>
            </Box>
            <div className="viewpage-detail">
              <div className="underline"></div>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={3} md={3}>
                  <div className="each-info">
                    <div className="info-label">{'Initater'}</div>
                    <div className="info-value">
                      {displayCategories?.initiatedBy ?? '--'}
                    </div>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div className="each-info">
                    <div className="info-label">{'Initiated Date'}</div>
                    <div className="info-value">
                      {' '}
                      {displayCategories?.onBoardDateTime
                        ? moment(
                            new Date(displayCategories?.onBoardDateTime)
                          ).format('DD MMM,YY h:mm A')
                        : '--'}
                    </div>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div className="each-info">
                    <div className="info-label">{'Approver'}</div>
                    <div className="info-value">
                      {displayCategories?.approvedBy ?? '--'}
                    </div>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div className="each-info">
                    <div className="info-label">{'Approved Date'}</div>
                    <div className="info-value">
                      {' '}
                      {displayCategories?.approvedDateTime
                        ? moment(
                            new Date(displayCategories?.approvedDateTime)
                          ).format('DD MMM,YY h:mm A')
                        : '--'}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Box>
        ) : (
          <Stack>
            <Box className="create-header-container " mt="32px">
              <ScreenHeader
                title="Create Role"
                info="From here you can create access presets to assign with users in Users creation."
                showBackButton={true}
              />
            </Box>
            <Box className="second-header-container">
              <Typography>Role Detail</Typography>
              <Divider className="divider-style" />
              <Box>
                <Typography
                  className="textfield-text-style"
                  variant="body1"
                  color="textPrimary"
                >
                  Role Name
                </Typography>
                <TextField
                  hiddenLabel
                  id="roleName"
                  placeholder="Enter Role Name"
                  variant="outlined"
                  inputProps={{
                    style: {
                      fontSize: '14px',
                      color: 'black',
                      width: '240px',
                      padding: '15px',
                    },
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRoleName(value);
                    const newArr = updatedList?.actionsAllowed.map(
                      (rest: any) => {
                        const newData = rest.subAction.map((rest2: any) => {
                          if (rest2.roleAccess === 'YES') switchCount++;
                        });
                        if (switchCount > 0) calCount++;
                        switchCount = 0;
                        if (rest.roleAccess === 'YES') checkCount++;
                      }
                    );
                    if (
                      checkCount === calCount &&
                      checkCount != 0 &&
                      calCount != 0 &&
                      e?.target?.value?.length > 0 &&
                      RegexValidation.onlycharectorNumberAndSpace.test(value)
                    )
                      setSubmitDisabled(true);
                    else setSubmitDisabled(false);
                  }}
                  value={roleName}
                  error={
                    validateInputFields({
                      textId: 'roleName',
                      value: roleName,
                    }).showError
                  }
                  helperText={
                    validateInputFields({
                      textId: 'roleName',
                      value: roleName,
                    }).message || ''
                  }
                >
                  {roleName}
                </TextField>
              </Box>
            </Box>
          </Stack>
        )}
        <Box className="second-header-container">
          <Typography>Module Access Control</Typography>
          <Divider className="checkbox-divider-style" />
          <AccordianLayover
            data={displayCategories?.actionsAllowed}
            isViewPage={enabled}
            handleCallBack={async (data: any) => {
              //todo need to check
              const result = await data.map(({ isExpanded, ...rest }: any) => ({
                ...rest,
              }));
              const newArr = result.map((rest: any) => {
                const newData = rest.subAction.map((rest2: any) => {
                  if (rest2.roleAccess === 'YES') switchCount++;
                });
                if (switchCount > 0) calCount++;
                switchCount = 0;
                if (rest.roleAccess === 'YES') checkCount++;
              });
              if (
                checkCount === calCount &&
                checkCount != 0 &&
                calCount != 0 &&
                RegexValidation.onlycharectorNumberAndSpace.test(roleName)
              )
                setSubmitDisabled(true);
              else setSubmitDisabled(false);
              if (newRole) {
                let updatedList = {
                  ...displayCategories,
                  actionsAllowed: result,
                  name: roleName,
                };
                setUpdatedList(updatedList);
              } else {
                let updatedList = {
                  ...displayCategories,
                  actionsAllowed: result,
                  roleId: displayCategories.id,
                  name: roleName,
                };
                setUpdatedList(updatedList);
              }
            }}
          />
        </Box>
        {/* <Box className="divide"></Box> */}
        <Box sx={{ marginTop: '100px' }}>
          {enabled ? (
            <FooterButton
              submit="Close"
              handleSubmitClick={goBack}
              disabled={true}
            />
          ) : (
            <FooterButton
              cancel="Cancel"
              submit="Submit"
              handleSubmitClick={handleSubmitClick}
              handleCancelClick={goBack}
              disabled={isSubmitDisabled}
            />
          )}
        </Box>
        {createRoleSelection && !enabled && (
          <CustomModal
            openSuccess={createRoleSelection}
            handleCloseSuccess={goBack}
            successModalTitle={'Role Created Successfully'}
            successModalMsg={
              'Your request for creating new role is successfully sent to the Reviewer.'
            }
            btn={'Close'}
          />
        )}
        {apiError.length !== 0 && (
          <ErrorMessage
            message={apiError}
            handleClose={() => setApiError('')}
            severity="error"
            duration={3000}
          />
        )}
      </Stack>
    </Stack>
  );
};
