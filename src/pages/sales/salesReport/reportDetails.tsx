import React, { useState } from 'react';
import './style.scss';
import DetailsCard from './../../../components/commonComponent/DetailsCard';
import { Stack, Box, Typography, Grid, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { FooterButton } from '../../../components/commonComponent/FooterButton/FooterButton';
import download_icon from '../../../assets/icons/download_icon.svg';
import mail_icon from '../../../assets/icons/mail_icon.svg';
import HeaderWithInfo from '../../../components/commonComponent/HeaderWithInfo';
function SalesReportDetails() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const goBack = () => {
    setActive(true);
    navigate(`/sales/salesReport`, {
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
    note: 'Lorem ipusm dolor sit amet, consectetur adipiscing elit. Euismod nulla cursus nascetur velit nisl sed',
    details: [
      {
        label: 'Channel',
        value: '1234567890',
      },
      {
        label: 'Channel Name',
        value: 'Ganesh.M',
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
        value: '10 May, 1990',
      },
      {
        label: 'DSA Lead',
        value: 'ACDJI2347J',
      },
      {
        label: 'DSA Exicutive',
        value: '1234567890',
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
    note: 'Lorem ipusm dolor sit amet, consectetur adipiscing elit. Euismod nulla cursus nascetur velit nisl sed',
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
        value: '10 May, 1990',
      },
      {
        label: 'KYC Status',
        value: 'ACDJI2347J',
      },
      {
        label: 'Visual Card Issuance',
        value: '1234567890',
      },
    ],
  };
  const remarkDetails = {
    title: 'Remarks',
    icon: true,
    note: 'Lorem ipusm dolor sit amet, consectetur adipiscing elit. Euismod nulla cursus nascetur velit nisl sed',
    details: [
      {
        label: 'Remarks',
        value:
          'CIBIL 500 unailedcLorem ipusm dolor sit amet, consectetur adipiscing elit',
      },
    ],
  };
  const remarkDetailss = {
    title: 'Remarks',
    icon: true,
    note: 'Lorem ipusm dolor sit amet, consectetur adipiscing elit. Euismod nulla cursus nascetur velit nisl sed',
    details: [
      {
        label: 'Remarks',
        value: [
          'CIBIL 500 unailedcLorem ipusm dolor sit amet, consectetur adipiscing elit',
          'DPD - 71 (Failed) ',
          'DPD - 71 (Failed) ',
          'DPD - 71 (Failed) ',
        ],
      },
    ],
  };
  return (
    <Stack className="sales-report-details-container">
      <Stack className="sales-report-header-container">
        <Stack className="sales-report-main-header">
          <Stack sx={{ cursor: 'pointer' }}>
            <ArrowBackIcon onClick={goBack} className="sales-report-headIcon" />
          </Stack>
          <Stack>
            <Typography>Customer Details</Typography>
            <Stack className="sales-report-info-label">
              From here you can create access presets to assign with users in
              Users Creation.
            </Stack>
          </Stack>
        </Stack>
        <Stack>
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
      <DetailsCard data={personalDetails} gridColumn={3} />
      <DetailsCard data={channelDetails} gridColumn={3} />
      <DetailsCard data={applicationDetails} gridColumn={3} />
      {/* <DetailsCard data={remarkDetails} gridColumn={4} /> */}
      <Stack className="details-card-container">
        <Stack className="details-card-inner-container">
          <HeaderWithInfo
            header={'Remarks'}
            isInfoEnabled={true}
            // info={
            //   record?.note ||
            //   'Lorem ipusm dolor sit amet, consectetur adipiscing elit.'
            // }
            info={
              'From here, you can select the channels which that user can access.'
            }
            isDownloadEnabled={false}
          />
          <Divider sx={{ marginY: 2 }} />
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            className="details-card"
          >
            {remarkDetailss?.details?.map((eachItem: any, index: number) => {
              return (
                <Grid item lg={12} key={index}>
                  <Stack className="each-info">
                    <Stack className="info-label">
                      {eachItem?.label ?? '--'}
                    </Stack>
                    <Stack
                      className="info-value"
                      style={{
                        color:
                          eachItem?.value === 'Rejected'
                            ? '#992D26'
                            : ' #151515',
                      }}
                    >
                      {eachItem?.value.map((item: any, index: any) => {
                        return (
                          <>
                            <Stack
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                              }}
                            >
                              <Stack>{`${index + 1}. `}</Stack>
                              <Stack>{item}</Stack>
                            </Stack>
                          </>
                        );
                      })}
                    </Stack>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Stack>
      <FooterButton disabled={true} submit="Close" handleSubmitClick={goBack} />
    </Stack>
  );
}
export default SalesReportDetails;
