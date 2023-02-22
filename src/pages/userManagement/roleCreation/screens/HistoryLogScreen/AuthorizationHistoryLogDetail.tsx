import {
  Box,
  Divider,
  Grid,
  List,
  Stack,
  Typography,
  ListItem,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../../../../../style/Color';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './style.scss';
import BtnContained from '../../../../../components/commonComponent/CustomText/Button/Contained';
import { checkTagStatus } from '../../../../../utils/tagBasedIndicator/tagStatus';
import {
  formatDateTime,
  getMaxDate,
} from '../../../../../utils/DateTimeFormatter';
import { ConCatArrNames } from '../../../../../utils/JoinNames';

export const AuthorizationLevelHistoryLog = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [hisLogDetailData, setHistoryLogDetailData] = useState([]);
  const [isReason, setIsReason] = useState<any>('');

  useEffect(() => {
    if (state) {
      setHistoryLogDetailData(state.newArrr);
    }
  }, [state]);

  useEffect(() => {
    let requestStatus;
    hisLogDetailData.map((item: any) => {
      requestStatus = item?.history?.authorizationStatus;
    });
    setIsReason(requestStatus);
  }, []);

  return (
    <Stack sx={{ backgroundColor: colors.bgGrey }}>
      <Box className="historyLog-container">
        <Stack
          sx={{
            backgroundColor: '#ffffff;',
            padding: '0 20px',
          }}
        >
          <Stack className="header">
            <Stack className="header-content">
              <Stack>
                <Typography className="back-arrow" onClick={() => navigate(-1)}>
                  <ArrowBackIcon
                    sx={{ color: '#0662B7', marginTop: '10pxs' }}
                  />{' '}
                </Typography>
              </Stack>
              {hisLogDetailData.map((item: any) => {
                return (
                  <Stack sx={{ marginLeft: '10px' }}>
                    <Typography className="heading">
                      Authorization Level - History Log
                    </Typography>
                    <Typography className="history-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit.Commodo dolor.
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
            <Stack>
              {hisLogDetailData.map((item: any) => {
                return (
                  <Typography
                    sx={{
                      color: checkTagStatus(item?.history?.authorizationStatus)
                        .color,
                      backgroundColor: checkTagStatus(
                        item?.history?.authorizationStatus
                      ).bgColor,
                      padding: '5px 8px',
                      fontSize: '12px',
                      borderRadius: '4px',
                    }}
                  >
                    {item?.history?.authorizationStatus}
                  </Typography>
                );
              })}
            </Stack>
          </Stack>

          <Stack
            sx={{
              backgroundColor: colors.white,
              margin: '20px 0',
              padding: '10px 0px',
            }}
          >
            {hisLogDetailData.map((value: any) => {
              console.log('value', value);
              return (
                <Grid
                  container
                  rowSpacing={4}
                  columnSpacing={{ xs: 3, sm: 3, md: 3 }}
                >
                  <Grid item xs={3} sm={3} md={3} lg={3}>
                    <div className="each-info">
                      <div className="info-label">Version Number</div>
                      <div className="info-value">
                        {value?.history?.versionName || '-'}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              );
            })}
          </Stack>
        </Stack>

        <Divider />

        <Stack className="history-log-details">
          {hisLogDetailData.map((value: any, index: number) => {
            return (
              <Grid
                container
                rowSpacing={4}
                columnSpacing={{ xs: 3, sm: 3, md: 3 }}
              >
                <Grid item xs={3} sm={3} md={3} lg={3} key={index}>
                  <div className="each-info">
                    <div className="info-label">Initiater</div>
                    <div className="info-value">
                      {value?.history?.actionPerson.personalDetails
                        .employeeName || '--'}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={3} sm={3} md={3} lg={3} key={index}>
                  <div className="each-info">
                    <div className="info-label">Initiated Date & Time</div>
                    <div className="info-value">
                      {formatDateTime(value?.history?.onBoardDateTime)}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={3} sm={3} md={3} lg={3} key={index}>
                  <div className="each-info">
                    <div className="info-label">Reviewer</div>

                    {value?.reviewerList?.length > 0 ? (
                      <Stack className="info-value">
                        {ConCatArrNames(value?.history?.reviewerList) || '-'}
                      </Stack>
                    ) : (
                      <Stack>{'-'}</Stack>
                    )}
                  </div>
                </Grid>

                <Grid item xs={3} sm={3} md={3} lg={3} key={index}>
                  <div className="each-info">
                    <div className="info-label">Reviewd Date & Time</div>
                    {value?.reviewerList?.length > 0 ? (
                      <Stack className="info-value">
                        {getMaxDate(value?.history?.reviewerList || [])}
                      </Stack>
                    ) : (
                      <Stack>{'-'}</Stack>
                    )}
                  </div>
                </Grid>

                <Grid item xs={3} sm={3} md={3} lg={3} key={index}>
                  <div className="each-info">
                    <div className="info-label">Approver</div>
                    {value?.approverList?.length > 0 ? (
                      <Stack className="info-value">
                        {ConCatArrNames(value?.history?.approverList) || '-'}
                      </Stack>
                    ) : (
                      <Stack>{'-'}</Stack>
                    )}
                  </div>
                </Grid>

                <Grid item xs={3} sm={3} md={3} lg={3} key={index}>
                  <div className="each-info">
                    <div className="info-label">Approved Date & Time</div>
                    {value?.approverList?.length > 0 ? (
                      <Stack className="info-value">
                        {getMaxDate(value?.history?.approverList || [])}
                      </Stack>
                    ) : (
                      <Stack>{'-'}</Stack>
                    )}
                  </div>
                </Grid>
              </Grid>
            );
          })}
        </Stack>

        <Stack
          sx={{
            backgroundColor: colors.white,
            marginTop: '30px',
            padding: '15px 20px',
            marginBottom: '100px',
          }}
        >
          <Typography className="reasonStyle">
            {isReason === 'REJECTED' ? 'Reason For Rejection' : 'Changes'}
          </Typography>
          <List>
            {hisLogDetailData?.map((item: any, index: number) => {
              return (
                <>
                  <ListItem
                    className="changes-listitem"
                    sx={{ padding: '8px 0' }}
                  >
                    <Stack
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '0',
                      }}
                    >
                      <Stack>{item?.history?.remarks || '-'}</Stack>
                    </Stack>
                  </ListItem>
                </>
              );
            })}
          </List>
        </Stack>
      </Box>

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
            padding: '15px',
          }}
        >
          <BtnContained onClick={() => navigate(-1)} title="Close" />
        </Box>
      </Box>
    </Stack>
  );
};
