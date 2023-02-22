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
import { colors } from '../../../../style/Color';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkTagStatus } from '../../../../utils/tagBasedIndicator/tagStatus';
import {
  formatDateTime,
  getMaxDate,
} from '../../../../utils/DateTimeFormatter';
import BtnContained from '../../../../components/commonComponent/CustomText/Button/Contained';
import { ConCatArrNames } from '../../../../utils/JoinNames';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';

export const UerHistorytLogDetails = () => {
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
      requestStatus = item.authorizationStatus;
    });
    setIsReason(requestStatus);
  }, []);

  return (
    <Stack sx={{ backgroundColor: colors.bgGrey }}>
      <Box className="org-historyLog-container">
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
                      title={`${
                        item?.user?.personalDetails?.employeeName || '-'
                      }- User
                      Details`}
                      info="Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.Commodo dolor."
                      showBackButton={true}
                    />
                  </Stack>
                );
              })}
            </Stack>
            <Stack>
              {hisLogDetailData.map((item: any) => {
                return (
                  <Typography
                    sx={{
                      color: checkTagStatus(item?.authorizationStatus).color,
                      backgroundColor: checkTagStatus(item?.authorizationStatus)
                        .bgColor,
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

          <Stack
            sx={{
              backgroundColor: colors.white,
              margin: '20px 0',
              padding: '10px 0px',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {hisLogDetailData.map((item: any, index: number) => {
              console.log('item', item);
              return (
                <Grid
                  container
                  rowSpacing={4}
                  columnSpacing={{ xs: 3, sm: 3, md: 3 }}
                >
                  <Grid item xs={3} sm={3} md={3} lg={3} className="each-info">
                    <Stack className="info-label">User. Name</Stack>
                    <Stack className="info-value">
                      {item?.user?.personalDetails?.employeeName || '-'}
                    </Stack>
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} className="each-info">
                    <Stack className="info-label">Version Number</Stack>
                    <Stack className="info-value">
                      {item.versionName || '-'}
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
              <Grid
                container
                rowSpacing={4}
                columnSpacing={{ xs: 3, sm: 3, md: 3 }}
              >
                <Grid item lg={3} key={index} className="each-info">
                  <Stack className="info-label">Request</Stack>
                  <Stack className="info-value">
                    {eachItem?.authorizationStatus ?? '--'}
                  </Stack>
                </Grid>

                <Grid item lg={3} key={index} className="each-info">
                  <Stack className="info-label">Request Status</Stack>
                  <Stack className="info-value">
                    {eachItem?.user?.userStatus ?? '--'}
                  </Stack>
                </Grid>

                <Grid item lg={3} key={index} className="each-info">
                  <Stack className="info-label">Initiater</Stack>
                  <Stack className="info-value">
                    {eachItem?.actionPerson?.personalDetails?.employeeName ??
                      '--'}
                  </Stack>
                </Grid>

                <Grid item lg={3} key={index} className="each-info">
                  <Stack className="info-label">Date & Time</Stack>
                  <Stack className="info-value">
                    {formatDateTime(eachItem?.onBoardDateTime) ?? '--'}
                  </Stack>
                </Grid>

                <Grid item lg={3} key={index} className="each-info">
                  <Stack className="info-label">Reviewer</Stack>
                  {eachItem?.reviewerList?.length > 0 ? (
                    <Stack className="info-value">
                      {ConCatArrNames(eachItem?.reviewerList) || '-'}
                    </Stack>
                  ) : (
                    <Stack>{'-'}</Stack>
                  )}
                </Grid>

                <Grid item lg={3} key={index} className="each-info">
                  <Stack className="info-label">Date & Time</Stack>
                  {eachItem?.reviewerList?.length > 0 ? (
                    <Stack className="info-value">
                      {getMaxDate(eachItem?.reviewerList) || '-'}
                    </Stack>
                  ) : (
                    <Stack>{'-'}</Stack>
                  )}
                </Grid>

                <Grid item lg={3} key={index} className="each-info">
                  <Stack className="info-label">Approvar</Stack>
                  {eachItem?.approverList?.length > 0 ? (
                    <Stack className="info-value">
                      {ConCatArrNames(eachItem?.approverList) || '-'}
                    </Stack>
                  ) : (
                    <Stack>{'-'}</Stack>
                  )}
                </Grid>

                <Grid item lg={3} key={index} className="each-info">
                  <Stack className="info-label">Date & Time</Stack>
                  {eachItem?.approverList?.length > 0 ? (
                    <Stack className="info-value">
                      {getMaxDate(eachItem?.approverList) || '-'}
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
            {' '}
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
                      <Stack>{item?.remarks || '-'}</Stack>
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
            padding: '10px 30px',
          }}
        >
          <BtnContained title="Close" onClick={() => navigate(-1)} />
        </Box>
      </Box>
    </Stack>
  );
};
