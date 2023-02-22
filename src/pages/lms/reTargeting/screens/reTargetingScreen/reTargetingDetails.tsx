import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography, Button, ListItem, List } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import download_icon from '../../../../../assets/icons/download_icon.svg';
import mail_icon from '../../../../../assets/icons/mail_icon.svg';
import Info_Icon from '../../../../../assets/images/info_icon.svg';
import DetailsCard from '../../../../../components/commonComponent/DetailsCard';
import './style.scss';
import { colors } from '../../../../../style/Color';
import BtnOutlined from '../../../../../components/commonComponent/CustomText/Button/Outlined';
import BtnContained from '../../../../../components/commonComponent/CustomText/Button/Contained';
import CustomModal from '../../../../../components/commonComponent/customModal/CustomModal';
import HeaderWithInfo from '../../../../../components/commonComponent/HeaderWithInfo';
import localforage from 'localforage';
import { getPermission } from '../../../../../utils/ActionAllowed/UserActionAllowed';
function ReTargetingDetails() {
  const navigate = useNavigate();
  const [openModel, setOpenModel] = useState(false);
  const [communicationModel, setCommunicationModel] = useState(false);
  const [successModel, setSuccesModel] = useState(false);
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

  const goBack = () => {
    navigate('/lms/retargeting', {
      state: true,
    });
  };

  const personalDetails = {
    title: 'Personal Details',
    icon: true,
    note: 'Lorem ipusm dolor sit amet, consectetur adipiscing elit. Euismod nulla cursus nascetur velit nisl sed',
    details: [
      {
        label: 'Application ID',
        value: '1234567890',
      },
      {
        label: 'Name',
        value: 'Ganesh.M',
      },
      {
        label: 'Phone Number',
        value: '987654321',
      },
      {
        label: '',
        value: '',
      },
      {
        label: 'Date Of Birth',
        value: '10 May, 1990',
      },
      {
        label: 'PAN Details',
        value: 'ACDJI2347J',
      },
      {
        label: 'Aadhar Details',
        value: '1234567890',
      },
      {
        label: '',
        value: '',
      },
    ],
  };
  const channelDetails = {
    title: 'Channel Details',
    icon: true,
    note: 'View channel details here.',
    details: [
      {
        label: 'Channel',
        value: 'DSA',
      },
      {
        label: 'Channel Name',
        value: 'DSA 1',
      },
      {
        label: 'DSA ID',
        value: '987654321',
      },
      {
        label: '',
        value: '',
      },
      {
        label: 'DSA Branch',
        value: 'Chennai',
      },
      {
        label: 'DSA Lead',
        value: 'Antony Jack',
      },
      {
        label: 'DSA Exicutive',
        value: 'Rajesh Kumar',
      },
      {
        label: '',
        value: '',
      },
    ],
  };
  const applicationDetails = {
    title: 'Application Details',
    icon: true,
    note: 'View important information of your application here.',
    details: [
      {
        label: 'Applied DAte & Time',
        value: '1234567890',
      },
      {
        label: 'Surrogate',
        value: 'Ganesh.M',
      },
      {
        label: 'Overall status',
        value: 'Rejected',
      },
      {
        label: 'Status Description',
        value: 'Low CIBIL (590)',
      },
      {
        label: 'KYC Status',
        value: 'Not-Applicable',
      },
      {
        label: 'Visual Card Issuance',
        value: 'Not-Applicable',
      },
    ],
  };
  const remarkDetails = [
    {
      value:
        'CIBIL - 500 (Failed)Lorem ipusm dolor sit amet, consectetur adipiscing elit.',
    },
    {
      value: 'DPD - 71 (Failed) ',
    },
    {
      value: 'DPD - 71 (Failed) ',
    },
    {
      value: 'DPD - 71 (Failed) ',
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
  const handleCloseSuccess = () => {
    setOpenModel(false);
    setCommunicationModel(false);
    setSuccesModel(false);
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
  return (
    <Stack className="reTargeting-container">
      <Stack sx={{ margin: ' 10px 0 60px 0' }}>
        <Stack className="reTargeting-header-container">
          <Stack className="reTargeting-main-header">
            <Stack>
              <ArrowBackIcon
                onClick={goBack}
                className="reTargeting-headIcon"
              />
            </Stack>
            <Stack>
              <Typography>Customer Details</Typography>
              <Stack className="reTargeting-info-label">
                Lorem ipusm dolor sit amet, consectetur adipiscing elit.integer
                senectus mattis
              </Stack>
            </Stack>
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
        <DetailsCard data={personalDetails} gridColumn={3} />
        <DetailsCard data={channelDetails} gridColumn={3} />
        <DetailsCard data={applicationDetails} gridColumn={3} />
        <Stack className="reTargeting-ListHeader">
          <Box className="reTargeting-List">
            <Box
              className="reTargeting-Content"
              sx={{
                borderBottom: `2px solid ${colors.lightGrey}`,
                paddingBottom: '12px',
              }}
            >
              <Typography>Remarks</Typography>
              <img className="reTargeting-Info-Icon" src={Info_Icon} alt="" />
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: '400',
                }}
                color="textSecondary"
              >
                View information pertaining to a rejection/approval here.
              </Typography>
            </Box>
            <Stack sx={{ padding: '15px 0' }}>
              <Typography className="reTargeting-remarksStyle">
                Remarks
              </Typography>
              <List>
                {remarkDetails.map((item: any, index: number) => {
                  return (
                    <>
                      <ListItem
                        className="reTargeting-changes-listitem"
                        sx={{ padding: '2px 0' }}
                      >
                        <Stack
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '0',
                          }}
                        >
                          <Stack className="reTargeting-changes">{`${
                            index + 1
                          }. `}</Stack>
                          <Stack className="reTargeting-changes">
                            {item.value}
                          </Stack>
                        </Stack>
                      </ListItem>
                    </>
                  );
                })}
              </List>
            </Stack>
          </Box>
        </Stack>
      </Stack>
      <Stack>
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
              gap: 4,
              justifyContent: 'flex-end',
              padding: '15px 30px',
            }}
          >
            <BtnOutlined title="Close" onClick={() => navigate(-1)} />
            {getPermission(
              actionAllowedItem,
              'LMS',
              'LMS_DASHBOARD',
              'LMS_RE_TARGET_APPLICATION'
            ) && (
              <BtnContained
                title="Re-Target"
                onClick={() => {
                  modelOpenNavigate();
                }}
              />
            )}
          </Box>
        </Box>
      </Stack>
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
    </Stack>
  );
}
export default ReTargetingDetails;
