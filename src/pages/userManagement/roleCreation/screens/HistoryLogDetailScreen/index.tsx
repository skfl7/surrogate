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
import { ScreenHeader } from '../../../../../components/commonComponent/ScreenHeader/ScreenHeader';

export const HistoryLogDetailScreen = () => {
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
      <Box className="historyLog-container">
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
                      title={`${item?.role?.name || '-'} ${
                        item?.actionPerson?.userStatus || '-'
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
                      <div className="info-label">Role Name</div>
                      <div className="info-value">
                        {value?.role?.name || '-'}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3} sm={3} md={3} lg={3}>
                    <div className="each-info">
                      <div className="info-label">Version Number</div>
                      <div className="info-value">
                        {value?.versionName || '-'}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3}>
                    <div className="each-info">
                      <div className="info-label">Request</div>
                      <div className="info-value">
                        {value?.actionPerson?.userStatus}
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
                      {value.actionPerson.personalDetails.employeeName || '--'}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={3} sm={3} md={3} lg={3} key={index}>
                  <div className="each-info">
                    <div className="info-label">Initiated Date & Time</div>
                    <div className="info-value">
                      {formatDateTime(value?.role?.onBoardDateTime)}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={3} sm={3} md={3} lg={3} key={index}>
                  <div className="each-info">
                    <div className="info-label">Reviewer</div>

                    {value?.reviewerList?.length > 0 ? (
                      <Stack className="info-value">
                        {ConCatArrNames(value?.reviewerList) || '-'}
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
                        {getMaxDate(value?.reviewerList || [])}
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
                        {ConCatArrNames(value?.approverList) || '-'}
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
                        {getMaxDate(value?.approverList || [])}
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
            padding: '15px',
          }}
        >
          <BtnContained onClick={() => navigate(-1)} title="Close" />
        </Box>
      </Box>
    </Stack>
  );
};
