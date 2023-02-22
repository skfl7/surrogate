import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkTagStatus } from '../../../../utils/tagBasedIndicator/tagStatus';
import { colors } from '../../../../style/Color';
import {
  formatDateTime,
  getMaxDate,
} from '../../../../utils/DateTimeFormatter';
import { ConCatArrNames } from '../../../../utils/JoinNames';
import BtnContained from '../../../../components/commonComponent/CustomText/Button/Contained';

export const DetailsHistoryLogDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isReason, setIsReason] = useState<any>('');
  const [hisLogDetailData, setHistoryLogDetailData] = useState([]);

  useEffect(() => {
    if (state) {
      setHistoryLogDetailData(state.newArrr);
    }
  }, [state]);

  useEffect(() => {
    let requestStatus;
    hisLogDetailData?.map((item: any) => {
      requestStatus = item.authorizationStatus;
    });
    setIsReason(requestStatus);
  }, []);

  return (
    <Stack sx={{ backgroundColor: colors.bgGrey }}>
      <Box
        className="org-historyLog-container"
        sx={{ margin: '30px 0px 60px 0' }}
      >
        <Stack
          sx={{
            backgroundColor: '#ffffff;',
            padding: '0 20px',
          }}
        >
          <Stack className="header">
            <Stack
              sx={{
                display: 'flex',
                flexDirection: ' row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Stack className="header-content">
                <Stack>
                  <Typography
                    className="back-arrow"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowBackIcon
                      sx={{ color: '#0662B7', marginTop: '10pxs' }}
                    />{' '}
                  </Typography>
                </Stack>

                <Stack sx={{ marginLeft: '10px' }}>
                  {hisLogDetailData?.map((value: any) => {
                    return (
                      <Typography className="heading">
                        {value.card?.cardName} - {value?.card?.cardStatus}{' '}
                        REQUEST
                      </Typography>
                    );
                  })}
                  <Typography className="history-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Commodo dolor.
                  </Typography>
                </Stack>
              </Stack>
              <Stack>
                {hisLogDetailData?.map((item: any) => {
                  return (
                    <Typography
                      sx={{
                        color: checkTagStatus(item?.authorizationStatus).color,
                        backgroundColor: checkTagStatus(
                          item?.authorizationStatus
                        ).bgColor,
                        padding: '5px 8px',
                        fontSize: '12px',
                        borderRadius: '4px',
                      }}
                    >
                      {item?.authorizationStatus}
                    </Typography>
                  );
                })}
              </Stack>
            </Stack>
          </Stack>

          <Stack
            sx={{
              backgroundColor: colors.white,
              margin: '20px 0',
              padding: '10px 0px',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {hisLogDetailData?.map((item: any, index: number) => {
              return (
                <Grid container>
                  <Grid xs={6} sm={3} className="each-info">
                    <Stack className="info-label">Card Name</Stack>
                    <Stack className="info-value">{item?.card?.cardName}</Stack>
                  </Grid>

                  <Grid xs={6} sm={3} className="each-info">
                    <Stack className="info-label">Version Number</Stack>
                    <Stack className="info-value">
                      {item?.versionName || '-'}
                    </Stack>
                  </Grid>
                </Grid>
              );
            })}
          </Stack>
        </Stack>

        <Divider />

        <Stack className="history-log-details">
          {hisLogDetailData?.map((eachItem: any, index: number) => {
            return (
              <Grid container key={index}>
                <Grid xs={6} sm={3} className="each-info">
                  <Stack className="info-label">Initiater</Stack>
                  <Stack className="info-value">
                    {eachItem?.actionPerson?.personalDetails?.employeeName}
                  </Stack>
                </Grid>

                <Grid xs={6} sm={3} className="each-info">
                  <Stack className="info-label">Date & Time</Stack>
                  <Stack className="info-value">
                    {formatDateTime(eachItem.onBoardDateTime) || '-'}
                  </Stack>
                </Grid>

                <Grid xs={6} sm={3} className="each-info">
                  <Stack className="info-label">Reviewer</Stack>

                  {eachItem?.reviewerList?.length > 0 ? (
                    <Stack className="info-value">
                      {ConCatArrNames(eachItem?.reviewerList)}
                    </Stack>
                  ) : (
                    <Stack>{'-'}</Stack>
                  )}
                </Grid>

                <Grid xs={6} sm={3} className="each-info">
                  <Stack className="info-label">Date & Time</Stack>

                  {eachItem?.reviewerList?.length > 0 ? (
                    <Stack className="info-value">
                      {getMaxDate(eachItem?.actionedTime) || '-'}
                    </Stack>
                  ) : (
                    <Stack>{'-'}</Stack>
                  )}
                </Grid>

                <Grid xs={6} sm={3} className="each-info" mt={2}>
                  <Stack className="info-label">Request</Stack>
                  {eachItem?.card?.cardStatus ?? '--'}
                </Grid>

                <Grid xs={6} sm={3} className="each-info" mt={2}>
                  <Stack className="info-label">Scheduled Period</Stack>
                  <Stack className="info-value">
                    {eachItem?.card?.cardStatus === 'PAUSE_SCHEDULED'
                      ? `${formatDateTime(
                          eachItem?.card?.pauseTime
                        )} - ${formatDateTime(eachItem?.card?.resumeTime)}`
                      : eachItem?.card?.cardStatus === 'PAUSED'
                      ? `${formatDateTime(eachItem?.card?.pauseTime)}`
                      : '-'}
                  </Stack>
                </Grid>

                <Grid xs={6} sm={3} className="each-info" mt={2}>
                  <Stack className="info-label">Approvar</Stack>

                  {eachItem?.approverList?.length > 0 ? (
                    <Stack className="info-value">
                      {ConCatArrNames(eachItem?.approverList) || '-'}
                    </Stack>
                  ) : (
                    <Stack>{'-'}</Stack>
                  )}
                </Grid>

                <Grid xs={6} sm={3} className="each-info" mt={2}>
                  <Stack className="info-label">Date & Time</Stack>

                  {eachItem?.approverList?.length > 0 ? (
                    <Stack className="info-value">
                      {getMaxDate(eachItem?.actionedTime) || '-'}
                    </Stack>
                  ) : (
                    <Stack>{'-'}</Stack>
                  )}
                </Grid>
              </Grid>
            );
          })}
        </Stack>

        <Stack
          sx={{
            backgroundColor: colors.white,
            margin: '30px 0 60px 0',
            padding: '15px 20px',
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
                      <Stack>{item?.card?.remarks || '-'}</Stack>
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
            padding: '25px',
          }}
        >
          <BtnContained onClick={() => navigate(-1)} title="Close" />
        </Box>
      </Box>
    </Stack>
  );
};
