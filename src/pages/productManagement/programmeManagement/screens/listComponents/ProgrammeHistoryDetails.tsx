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
import { colors } from '../../../../../style/Color';
import { useLocation, useNavigate } from 'react-router-dom';
import './style.scss';
import { checkTagStatus } from '../../../../../utils/tagBasedIndicator/tagStatus';
import {
  formatDateTime,
  getMaxDate,
} from '../../../../../utils/DateTimeFormatter';
import { ConCatArrNames } from '../../../../../utils/JoinNames';
import BtnContained from '../../../../../components/commonComponent/CustomText/Button/Contained';
import { ScreenHeader } from '../../../../../components/commonComponent/ScreenHeader/ScreenHeader';

export const ProgrammeHistoryDetails = () => {
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
    hisLogDetailData.map((item: any) => {
      requestStatus = item.authorizationStatus;
    });

    setIsReason(requestStatus);
  }, []);

  return (
    <Stack sx={{ backgroundColor: colors.bgGrey }}>
      <Box className="org-historyLog-container" sx={{ paddingBottom: '40px' }}>
        <Stack
          sx={{
            backgroundColor: '#ffffff;',
            padding: '0 20px',
          }}
        >
          <Stack className="header">
            <Stack className="header-content">
              {hisLogDetailData.map((item: any) => {
                return (
                  <Stack>
                    <ScreenHeader
                      title={`${item.program.programType || '-'} ${
                        item?.program?.programStatus || '-'
                      }- REQUEST`}
                      info="Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.Commodo dolor."
                      showBackButton={true}
                    />
                  </Stack>
                );
              })}
            </Stack>
            <Stack>
              <Stack>
                {hisLogDetailData.map((item: any) => {
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
            {hisLogDetailData.map((item: any) => {
              console.log('program?.versionName', item);
              return (
                <Grid container>
                  <Grid xs={6} sm={3} className="each-info">
                    <Stack className="info-label">Surrogate Name</Stack>
                    <Stack className="info-value">
                      {item.program.programType || '-'}
                    </Stack>
                  </Grid>
                  <Grid xs={6} sm={3} className="each-info">
                    <Stack className="info-label">Version Number</Stack>
                    <Stack className="info-value">
                      {item?.versionName || '-'}
                    </Stack>
                  </Grid>

                  <Grid xs={6} sm={3} className="each-info">
                    <Stack className="info-label">Rejected By</Stack>

                    {item?.reviewerList?.length > 0 ||
                    item?.approverList?.length > 0 ? (
                      <Stack className="info-value">
                        {ConCatArrNames(item?.reviewerList)}
                        {item?.reviewerList !== ''
                          ? ConCatArrNames(item?.reviewerList)
                          : '-'}
                      </Stack>
                    ) : (
                      <Stack>{'-'}</Stack>
                    )}
                  </Grid>
                </Grid>
              );
            })}
          </Stack>
        </Stack>
        <Divider />
        <Stack className="history-log-details">
          <Stack className="history-log-details-containerText">
            {hisLogDetailData?.map((eachItem: any, index: number) => {
              return (
                <Grid container key={index}>
                  <Grid xs={6} sm={3} className="each-info">
                    <Stack className="info-label">Request</Stack>
                    <Stack className="info-value">
                      {eachItem?.program?.programStatus ?? '--'}
                    </Stack>
                  </Grid>

                  <Grid xs={6} sm={4} className="each-info">
                    <Stack className="info-label">Scheduled Period</Stack>
                    <Stack className="info-value">
                      {eachItem?.program?.programStatus === 'PAUSE_SCHEDULED'
                        ? `${formatDateTime(
                            eachItem?.program.pauseTime
                          )} - ${formatDateTime(eachItem?.program.resumeTime)}`
                        : eachItem?.program?.programStatus === 'PAUSED'
                        ? `${formatDateTime(eachItem?.program.pauseTime)}`
                        : '-'}
                    </Stack>
                  </Grid>
                </Grid>
              );
            })}
          </Stack>
          {state.newArrr?.map((eachItem: any, index: number) => {
            return (
              <Grid container marginTop="15px">
                <Grid xs={6} sm={3} className="each-info">
                  <Stack className="info-label">Initiater</Stack>
                  <Stack className="info-value">
                    {eachItem.actionPerson.personalDetails.employeeName}
                  </Stack>
                </Grid>
                <Grid xs={6} sm={3} className="each-info">
                  <Stack className="info-label">Date & Time</Stack>
                  <Stack className="info-value">
                    {eachItem?.onBoardDateTime !== null
                      ? formatDateTime(eachItem?.onBoardDateTime)
                      : '-'}
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
                  <>
                    <Stack className="info-label">Date & Time</Stack>

                    {eachItem?.reviewerList?.length > 0 ? (
                      eachItem?.reviewerList.map((item: any) => {
                        return (
                          <Stack className="info-value">
                            {getMaxDate(item.actionedTime || [])}
                          </Stack>
                        );
                      })
                    ) : (
                      <Stack>{'-'}</Stack>
                    )}
                  </>
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
            {state?.newArrr?.map((item: any, index: number) => {
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
                      <Stack className="changes">
                        {item?.program?.remarks || '-'}
                      </Stack>
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
          borderRadius: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            padding: '20px 30px',
          }}
        >
          <BtnContained onClick={() => navigate(-1)} title="Close" />{' '}
        </Box>
      </Box>
    </Stack>
  );
};
