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
import BtnContained from '../../../../../../components/commonComponent/CustomText/Button/Contained';
import { colors } from '../../../../../../style/Color';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import './style.scss';
import { checkTagStatus } from '../../../../../../utils/tagBasedIndicator/tagStatus';
import {
  formatDateTime,
  getMaxDate,
} from '../../../../../../utils/DateTimeFormatter';
import { ConCatArrNames } from '../../../../../../utils/JoinNames';
import { ScreenHeader } from '../../../../../../components/commonComponent/ScreenHeader/ScreenHeader';

export const OrgHistoryLogDetails = () => {
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
      <Box className="org-historyLog-container">
        <Stack className="org-history">
          <Stack className="header">
            <Stack className="header-content">
              {hisLogDetailData.map((item: any) => {
                return (
                  <Stack>
                    <ScreenHeader
                      title={`${
                        item?.organization?.supplierDetails?.supplierName || '-'
                      } - History Log`}
                      info="Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.Commodo dolor."
                      showBackButton={true}
                    />
                  </Stack>
                );
              })}
            </Stack>
            <Stack className="historylog-status-tag">
              {hisLogDetailData.map((item: any) => {
                return (
                  <Typography
                    className="historyStatus"
                    sx={{
                      color: checkTagStatus(item?.authorizationStatus).color,
                      backgroundColor: checkTagStatus(item?.authorizationStatus)
                        .bgColor,
                    }}
                  >
                    {item?.authorizationStatus}
                  </Typography>
                );
              })}
            </Stack>
          </Stack>

          <Stack className="historlog-header-details">
            {hisLogDetailData.map((item: any, index: number) => {
              return (
                <Grid
                  container
                  rowSpacing={4}
                  columnSpacing={{ xs: 3, sm: 3, md: 3 }}
                  key={index}
                >
                  <Grid item sm={12} md={6} lg={3} className="each-info">
                    <Stack className="info-label">Org. Name</Stack>
                    <Stack className="info-value">
                      {item?.organization?.supplierDetails?.supplierName || '-'}
                    </Stack>
                  </Grid>

                  <Grid item sm={12} md={6} lg={3} className="each-info">
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
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={index}
                  className="each-info"
                >
                  <Stack className="info-label">Request</Stack>
                  <Stack className="info-value">
                    {eachItem?.authorizationStatus ?? '-'}
                  </Stack>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={index}
                  className="each-info"
                >
                  <Stack className="info-label">Request Status</Stack>
                  <Stack className="info-value">
                    {eachItem?.organization?.organizationStatus ?? '-'}
                  </Stack>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={index}
                  className="each-info"
                >
                  <Stack className="info-label">Initiater</Stack>
                  <Stack className="info-value">
                    {eachItem?.actionPerson?.personalDetails?.employeeName ??
                      '--'}
                  </Stack>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={index}
                  className="each-info"
                >
                  <Stack className="info-label">Date & Time</Stack>
                  <Stack className="info-value">
                    {formatDateTime(eachItem?.onBoardDateTime) ?? '-'}
                  </Stack>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={index}
                  className="each-info"
                >
                  <Stack className="info-label">Reviewer</Stack>
                  {eachItem?.reviewerList?.length > 0 ? (
                    <Stack className="info-value">
                      {ConCatArrNames(eachItem?.reviewerList) || '-'}
                    </Stack>
                  ) : (
                    <Stack>{'-'}</Stack>
                  )}
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={index}
                  className="each-info"
                >
                  <Stack className="info-label">Date & Time</Stack>
                  {eachItem?.reviewerList?.length > 0 ? (
                    <Stack className="info-value">
                      {getMaxDate(eachItem?.reviewerList) || '-'}
                    </Stack>
                  ) : (
                    <Stack>{'-'}</Stack>
                  )}
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={index}
                  className="each-info"
                >
                  <Stack className="info-label">Approvar</Stack>
                  {eachItem?.approverList?.length > 0 ? (
                    <Stack className="info-value">
                      {ConCatArrNames(eachItem?.approverList) || '-'}
                    </Stack>
                  ) : (
                    <Stack>{'-'}</Stack>
                  )}
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={index}
                  className="each-info"
                >
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
            {isReason === 'REJECTED' ? 'Reason For Rejection' : 'Changes'}
          </Typography>
          <List>
            {hisLogDetailData?.map((item: any, index: number) => {
              return (
                <>
                  <ListItem className="remarks-listitem">
                    <Stack>
                      <Stack>{item?.remarks || '-'}</Stack>
                    </Stack>
                  </ListItem>
                </>
              );
            })}
          </List>
        </Stack>
      </Box>
      <Box className="historyLog_footer_conatiner">
        <Box className="footer_Close_Btn">
          <BtnContained title="Close" onClick={() => navigate(-1)} />
        </Box>
      </Box>
    </Stack>
  );
};
