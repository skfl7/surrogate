import React, { useEffect, useState } from 'react';
import { Box, Stack, Grid, Button } from '@mui/material';
import './style.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderWithInfo from '../../../../components/commonComponent/HeaderWithInfo';
import FirstActiveStepperIcon from '../../../../assets/icons/first_stepper_icon.svg';
import SecondActiveStepperIcon from '../../../../assets/icons/second_active_stepper.svg';
import SecondDisabledStepperIcon from '../../../../assets/icons/second_disabled_stepper.svg';
import CompletedStepperIcon from '../../../../assets/icons/completed_stepper_icon.svg';
import { FooterButton } from '../../../../components/commonComponent/FooterButton/FooterButton';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import DetailsCard from '../../../../components/commonComponent/DetailsCard';
import { AccordianLayover } from '../../../../components/commonComponent/CustomAccordian/Accordian';
import ReviewerApproverTable from '../../../../components/commonComponent/ReviewerApproverTable';
import { ReactComponent as EditRole } from '../../../../assets/icons/edit_role.svg';
import {
  getReviewerApproverData,
  getUserCreationDetails,
} from '../../../../services/userCreationServices';
import ErrorMessage from '../../../../components/commonComponent/ErrorMessage';
import { formatDateTime } from '../../../../utils/DateTimeFormatter';

function ViewUser() {
  const { state } = useLocation();
  const [isPermission, setIsPermission] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [displayCategories, setDisplayCategories] = useState<any>({});
  const [reviewerData, setReviewerApprpverViewData] = useState<any>([]);
  const [userIdValue, setUserIdValue] = useState(
    state?.userId ? state?.userId : state?.filteredData?.state?.userId
  );
  const [stateData, setStateData] = useState<any>('-');
  const [zoneData, setZoneData] = useState<any>('-');
  const [districtData, setDistrictData] = useState<any>('-');
  const [branchData, setBranchData] = useState<any>('-');
  const [channelData, setChannelData] = useState<any>('-');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    handleViewClose();
    console.log('state?.userId', state);
  }, []);

  const handleReviewerApproverScreen = async () => {
    const payload = {
      id: displayCategories?.id,
    } as any;
    const result = await getReviewerData(payload);
    let data = result?.result?.map((item: any) => {
      let data2 = item?.subModules?.map((item2: any) => {
        let approverData = item2.approver;
        let reviewerData = item2.reviewer;
        delete item2.approver;
        delete item2.reviewer;
        return {
          ...item2,
          approverData: approverData,
          reviewerData: reviewerData,
        };
      });
      return { ...item, subModules: data2 };
    });
    setReviewerApprpverViewData(data);
  };

  const getReviewerData = async (payload: any) => {
    let res = {} as any;
    await getReviewerApproverData(payload)
      .then((response) => {
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const handleViewClose = async () => {
    const payload = {
      userId: userIdValue,
    } as any;
    const result = await getDetailofUserItem(payload);
    setDisplayCategories(result?.result);
    let stateDataValue = result?.result?.state?.map((val: any) => {
      return val.stateName;
    });
    if (stateDataValue.length > 0) setStateData(stateDataValue.join(','));
    let cityDataValue = result?.result?.city?.map((val: any) => {
      return val.cityName;
    });
    if (cityDataValue.length > 0) setDistrictData(cityDataValue.join(','));
    let zoneDataValue = result?.result?.zone?.map((val: any) => {
      return val.zoneName;
    });
    if (zoneDataValue.length > 0) setZoneData(zoneDataValue.join(','));
    let branchDataValue = result?.result?.branch?.map((val: any) => {
      return val.branchName;
    });
    if (branchDataValue.length > 0) setBranchData(branchDataValue.join(','));
    if (result?.result?.channelAccessible?.length > 0)
      setChannelData(result?.result?.channelAccessible.join(','));
  };

  useEffect(() => {
    if (displayCategories?.id?.length > 0) handleReviewerApproverScreen();
  }, [displayCategories]);

  const getDetailofUserItem = async (payload: any) => {
    let res = {} as any;
    await getUserCreationDetails(payload)
      .then((response) => {
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
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
    } else if (err?.exception?.shortMessage)
      setApiError(err?.exception?.shortMessage);
    else if (err?.error) setApiError(err?.error + ' ' + err?.path);
    else setApiError('Something went wrong!');
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const handleSubmitClick = () => {
    isPermission ? setIsUserCreated(true) : setIsPermission(true);
  };

  const personalDetails = {
    title: 'Personal Details',
    icon: true,
    note: 'Lorem ipusm dolor sit amet, consectetur adipiscing elit. Euismod nulla cursus nascetur velit nisl sed',
    details: [
      {
        label: 'Employee Id',
        value: displayCategories?.personalDetails?.employeeId,
      },
      {
        label: 'Employee Name',
        value: displayCategories?.personalDetails?.employeeName,
      },
      {
        label: 'Email Id',
        value: displayCategories?.personalDetails?.email,
      },
      {
        label: 'Mobile Number',
        value: displayCategories?.personalDetails?.mobileNumber,
      },
    ],
  };

  const employementDetails = {
    title: 'Employement Details',
    icon: true,
    note: 'Lorem ipusm dolor sit amet, consectetur adipiscing elit. Euismod nulla cursus nascetur velit nisl sed',
    details: [
      {
        label: 'Date Of Joining',
        value: formatDateTime(
          displayCategories?.employeeDetails?.dateOfJoining
        ),
      },
      {
        label: 'Designation',
        value: displayCategories?.employeeDetails?.designation,
      },
      {
        label: 'Reporting Head',
        value: displayCategories?.reportingTo?.personalDetails?.employeeName,
      },
      {
        label: 'Optional Reporting Head (Optional)',
        value:
          displayCategories?.reportingToSecondary?.personalDetails
            ?.employeeName,
      },
    ],
  };

  const channelAccessibleDetails = {
    title: 'Channel Accessible Details',
    icon: true,
    note: 'Lorem ipusm dolor sit amet, consectetur adipiscing elit. Euismod nulla cursus nascetur velit nisl sed',
    details: [
      {
        label: 'Select Channel',
        value: channelData,
      },
    ],
  };

  const locationDetails = {
    title: 'State, Zonal, District, Branch',
    icon: true,
    note: 'Lorem ipusm dolor sit amet, consectetur adipiscing elit. Euismod nulla cursus nascetur velit nisl sed',
    details: [
      {
        label: 'State',
        value: stateData,
      },
      {
        label: 'Zone',
        value: zoneData,
      },
      {
        label: 'District',
        value: districtData,
      },
      {
        label: 'Branch',
        value: branchData,
      },
    ],
  };

  const roleDetails = {
    title: 'Role Details',
    icon: true,
    note: 'Lorem ipusm dolor sit amet, consectetur adipiscing elit. Euismod nulla cursus nascetur velit nisl sed',
    details: [
      {
        label: 'Role Access Type',
        value: displayCategories?.roleAccessType,
      },
    ],
  };

  const gobackFun = () => {
    navigate('/userManagement/userCreation', {
      state: true,
    });
  };
  return (
    <Stack className="create-user-main-container">
      <Box className="create-user-container">
        <Box style={{ display: 'flex' }}>
          <ScreenHeader
            title={`View User details - ${displayCategories?.personalDetails?.employeeName} (#${displayCategories?.personalDetails?.employeeId})`}
            info="From here you can create access presets to assign with users in Users Creation."
            showBackButton={true}
            gobackFun={gobackFun}
          />
          <Box style={{ marginLeft: 'auto' }}>
            <Button
              sx={{ textTransform: 'capitalize' }}
              color="secondary"
              startIcon={<EditRole />}
              aria-haspopup="true"
              onClick={() =>
                navigate('/userManagement/userCreation/createUser', {
                  state: {
                    userData: displayCategories,
                    isEdit: true,
                    selectedUserID: userIdValue,
                  },
                })
              }
              id="basic-button"
            >
              Edit User Details
            </Button>
          </Box>
        </Box>
        <Stack className="underline"></Stack>
        <Stack className="stepper-container">
          <Stack className="steppers">
            <Stack onClick={() => setIsPermission(false)}>
              <img
                src={
                  isPermission ? CompletedStepperIcon : FirstActiveStepperIcon
                }
                alt=""
                className="stepper-icons"
              />
            </Stack>
            <Stack
              className={
                isPermission ? 'enabled-stepper-line' : 'disabled-stepper-line'
              }
            ></Stack>
            <Stack onClick={() => setIsPermission(true)}>
              <img
                src={
                  isPermission
                    ? SecondActiveStepperIcon
                    : SecondDisabledStepperIcon
                }
                alt=""
                className="stepper-icons"
              />
            </Stack>
          </Stack>

          <Stack className="steppers-label-container">
            <Stack
              className="stepper-label enabled"
              onClick={() => setIsPermission(false)}
            >
              Personal Details
            </Stack>
            <Stack
              onClick={() => setIsPermission(true)}
              className={
                isPermission
                  ? 'stepper-label enabled'
                  : 'stepper-label disabled'
              }
            >
              Permissions
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {isPermission ? (
        <>
          <Stack className="container">
            <HeaderWithInfo
              header="Permission allocation"
              isInfoEnabled={true}
              info="From here, you can add the user’s personal details"
              isDownloadEnabled={false}
            />
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={3}>
                <Stack className="each-info">
                  <Stack className="info-label">Copy Role Access from</Stack>
                  <Stack className="info-value">
                    {displayCategories?.roleSelection}
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack className="each-info">
                  <Stack className="info-label">User Role</Stack>
                  <Stack className="info-value">
                    {displayCategories?.roleCopiedFrom?.name ??
                      displayCategories?.userRoleCopiedFrom?.name}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            <Stack className="underline"></Stack>
            <AccordianLayover
              data={
                displayCategories?.actionsAllowedResponse ??
                displayCategories?.actionsAllowed
              }
              isViewPage={true}
            />
          </Stack>

          <Stack className="container">
            <HeaderWithInfo
              header="Reviewer & Approver allocation"
              isInfoEnabled={true}
              info="From here, you can add the user’s personal details"
              isDownloadEnabled={false}
            />
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={3}>
                <Stack className="each-info">
                  <Stack className="info-label">
                    Reviewer & Approver allocation
                  </Stack>
                  <Stack className="info-value">
                    {reviewerData?.length > 0
                      ? 'Yes, I will assign'
                      : 'User will assign in their end '}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            <Stack className="underline" style={{ margin: '0px' }}></Stack>

            {reviewerData?.length > 0 && (
              <Stack>
                <ReviewerApproverTable data={reviewerData} mode="view" />
              </Stack>
            )}
          </Stack>
        </>
      ) : (
        <Stack>
          <DetailsCard data={personalDetails} gridColumn={3} />
          <DetailsCard data={employementDetails} gridColumn={3} />
          <DetailsCard data={channelAccessibleDetails} gridColumn={3} />
          <DetailsCard data={locationDetails} gridColumn={3} />
          <DetailsCard data={roleDetails} gridColumn={3} />
        </Stack>
      )}
      {isPermission ? (
        <FooterButton
          cancel="Close"
          handleCancelClick={goBack}
          disabled={true}
          // handleSaveasDraftClick={handleSaveasDraftClick}
        />
      ) : (
        <FooterButton
          cancel="Close"
          submit="Next"
          handleSubmitClick={handleSubmitClick}
          handleCancelClick={goBack}
          disabled={true}
          // handleSaveasDraftClick={handleSaveasDraftClick}
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
  );
}

export default ViewUser;
