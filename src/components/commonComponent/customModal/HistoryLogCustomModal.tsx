import React, { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Stack,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  IconButton,
  Grid,
  Dialog,
  ListItem,
  Box,
} from '@mui/material';
import './HistoryModal.scss';
import { modalStyle } from '../../../style/ModalStyle/ModalStyle';
import { formatDateTime, getMaxDate } from '../../../utils/DateTimeFormatter';
import { ConCatArrNames } from '../../../utils/JoinNames';

type props = {
  title?: string;
  closeBtn: string;
  tableData?: Array<any>;
  tableHeader?: any;
  handleCloseSuccess: () => void;
  handleClickOpen?: () => void;
  openSuccess: boolean;
  viewMoreDetails: string;
  historyViewMoreFun?: any;
  historyLogdetails?: any;
  historyLogRowDetail?: any;
  flag?: string;
  viewMoreHistory?: any;
  totalElement?: any;
  pageSizeNo?: any;
};
export default function HistoryLogCustomModal({
  title,
  closeBtn,
  tableHeader,
  handleCloseSuccess,
  handleClickOpen,
  openSuccess,
  viewMoreDetails,
  historyViewMoreFun,
  historyLogRowDetail,
  historyLogdetails,
  flag,
  viewMoreHistory,
  totalElement,
  pageSizeNo,
}: props) {
  const [open, setOpen] = useState(null);
  const handleOpen = (clickedIndex: any) => {
    if (open === clickedIndex) {
      setOpen(null);
    } else {
      setOpen(clickedIndex);
    }
  };

  return (
    <>
      <Stack className="historylog-custom-modal">
        <Dialog
          open={openSuccess}
          onClose={handleCloseSuccess}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
          fullWidth={true}
          className="history_modal"
        >
          <Stack className="historymodal-container" py={2} px={2}>
            <Stack className="historyModal-header">
              <Typography className="modal_title">
                {`${
                  historyLogRowDetail?.history?.card
                    ? historyLogRowDetail?.history?.card?.cardName
                    : historyLogRowDetail?.history?.role
                    ? historyLogRowDetail?.history?.role?.name
                    : historyLogRowDetail?.history?.organization
                        ?.supplierDetails
                    ? historyLogRowDetail?.history?.organization
                        ?.supplierDetails?.supplierName
                    : historyLogRowDetail?.history?.user
                    ? historyLogRowDetail?.history?.user?.personalDetails
                        ?.employeeName
                    : historyLogRowDetail?.history?.program
                    ? historyLogRowDetail?.history?.program?.programType
                    : '-'
                } - History Log`}
              </Typography>

              <Typography
                className="historylog-close-btn"
                onClick={handleCloseSuccess}
              >
                {closeBtn}
              </Typography>
            </Stack>
            <Stack className="historylog-modal-container">
              <Table aria-label="collapsible table">
                <TableHead className="historyModal-table-header">
                  <TableRow sx={{ width: '100%' }}>
                    {tableHeader.map((item: any, index: any) => {
                      return (
                        <TableCell
                          key={index}
                          sx={modalStyle.modalHeading}
                          className="historylog-header"
                        >
                          {item.header}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                {historyLogdetails.map((item: any, index: any) => {
                  return (
                    <TableBody sx={{ padding: '0px' }}>
                      <TableRow
                        sx={{
                          cursor: 'pointer',
                          borderRight: `${
                            open === index ? `1px solid #E9EAEB` : ''
                          }`,
                          borderLeft: `${
                            open === index ? `1px solid #E9EAEB` : ''
                          }`,
                          background: `${open === index ? `#F2FAFF` : ''}`,
                        }}
                        onClick={() => handleOpen(index)}
                      >
                        <TableCell sx={modalStyle.modalTabelRow}>
                          {item?.program?.versionName ||
                            item?.versionName ||
                            '-'}
                        </TableCell>
                        <TableCell sx={modalStyle.modalTabelRow}>
                          {open === index
                            ? ''
                            : item?.card
                            ? item?.card?.cardName
                            : item?.program?.programType
                            ? item?.program?.programType || ''
                            : historyLogRowDetail?.history?.user
                            ? historyLogRowDetail?.history?.user
                                ?.personalDetails?.employeeName
                            : item?.role
                            ? item?.role?.name
                            : item?.organization
                            ? item?.organization?.supplierDetails?.supplierName
                            : ''}
                        </TableCell>
                        <TableCell sx={modalStyle.modalTabelRow}>
                          {open === index
                            ? ''
                            : item?.organization
                            ? item?.actionPerson?.userStatus
                            : item?.authorizationStatus || '-'}
                        </TableCell>
                        <TableCell sx={modalStyle.modalTabelRow || '-'}>
                          <Stack
                            sx={{
                              display: ' flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>
                              {open === index ? '' : item?.currentStatus}
                            </div>
                            <div>
                              {' '}
                              <IconButton
                                sx={{ padding: '0px' }}
                                style={{ color: 'black' }}
                                aria-label="expand row"
                                size="small"
                                onClick={() => handleOpen(index)}
                              >
                                {open === index ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            </div>
                          </Stack>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{
                            padding: '0px 5px',
                            border: '1px solid #E9EAEB',
                            fontSize:'8px'
                          }}
                          colSpan={6}
                        >
                          <Collapse
                            in={open === index}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Grid container>
                              <Grid
                                sm={6}
                                md={6}
                                lg={3}
                                sx={{ margin: '10px 0px' }}
                              >
                                <Typography
                                  className="info-label"
                                  sx={modalStyle.modalTableKey}
                                >
                                  Version Number
                                </Typography>
                                <Typography
                                  className="info-value"
                                  sx={modalStyle.modalTbaleValue}
                                >
                                  {item?.program?.versionName ||
                                    item?.versionName ||
                                    '-'}
                                </Typography>
                              </Grid>
                              <Grid
                                sm={6}
                                md={6}
                                lg={3}
                                sx={{ margin: '10px 0px' }}
                              >
                                <Typography
                                  sx={modalStyle.modalTableKey}
                                  className="info-label"
                                >
                                  {item.program
                                    ? 'Surrogate Name'
                                    : item.role
                                    ? 'Role Name'
                                    : item?.organization
                                    ? 'Org. Name'
                                    : historyLogRowDetail?.history?.user
                                    ? 'User.Name'
                                    : 'Card Name'}
                                </Typography>
                                <Typography
                                  className="info-value"
                                  sx={modalStyle.modalTbaleValue}
                                >
                                  {item?.role
                                    ? item?.role?.name || '-'
                                    : historyLogRowDetail?.history?.user
                                        ?.personalDetails?.employeeName
                                    ? historyLogRowDetail?.history?.user
                                        ?.personalDetails?.employeeName
                                    : item?.program?.programType
                                    ? item.program.programType || '-'
                                    : item?.organization
                                    ? item?.organization?.supplierDetails
                                        ?.supplierName
                                    : item?.card?.cardName || '-'}
                                </Typography>
                              </Grid>

                              {(flag === 'Org.structure' ||
                                flag === 'UserCreation') && (
                                <Grid
                                  sm={6}
                                  md={6}
                                  lg={3}
                                  sx={{ margin: '10px 0px' }}
                                >
                                  <Typography
                                    className="info-label"
                                    sx={modalStyle.modalTableKey}
                                  >
                                    Request
                                  </Typography>
                                  <Typography
                                    className="info-value"
                                    sx={modalStyle.modalTbaleValue}
                                  >
                                    {item.authorizationStatus || '-'}
                                  </Typography>
                                </Grid>
                              )}

                              <Grid
                                sm={6}
                                md={6}
                                lg={3}
                                sx={{ margin: '10px 0px' }}
                              >
                                <Typography
                                  className="info-label"
                                  sx={modalStyle.modalTableKey}
                                >
                                  Request Status
                                </Typography>
                                <Typography
                                  className="info-value"
                                  sx={modalStyle.modalTbaleValue}
                                >
                                  {item?.program?.programStatus
                                    ? item?.program?.programStatus || '-'
                                    : item?.card
                                    ? item?.card?.cardStatus || '-'
                                    : item?.role
                                    ? item?.role?.roleStatus || '-'
                                    : item?.organization
                                    ? item?.organization?.organizationStatus ||
                                      '-'
                                    : item?.user
                                    ? item?.user?.userStatus || '-'
                                    : '-'}
                                </Typography>
                              </Grid>
                              <Grid
                                sm={6}
                                md={6}
                                lg={3}
                                sx={{ margin: '10px 0px' }}
                              >
                                <Typography
                                  className="info-label"
                                  sx={modalStyle.modalTableKey}
                                >
                                  Initiater
                                </Typography>
                                <Typography
                                  className="info-value"
                                  sx={modalStyle.modalTbaleValue}
                                >
                                  {item.actionPerson.personalDetails
                                    .employeeName || '-'}
                                </Typography>
                              </Grid>
                              <Grid
                                sm={6}
                                md={6}
                                lg={3}
                                sx={{ margin: '10px 0px' }}
                              >
                                <Typography
                                  className="info-label"
                                  sx={modalStyle.modalTableKey}
                                >
                                  Date & Time
                                </Typography>
                                <Typography
                                  className="info-value"
                                  sx={modalStyle.modalTbaleValue}
                                >
                                  {formatDateTime(item.onBoardDateTime) || '-'}
                                </Typography>
                              </Grid>
                              <Grid
                                sm={6}
                                md={6}
                                lg={3}
                                sx={{ margin: '10px 0px' }}
                              >
                                <Typography
                                  className="info-label"
                                  sx={modalStyle.modalTableKey}
                                >
                                  Reviewer
                                </Typography>

                                {item?.reviewerList?.length > 0 ? (
                                  <Typography
                                    className="info-value"
                                    sx={modalStyle.modalTbaleValue}
                                  >
                                    {ConCatArrNames(item?.reviewerList) || '-'}
                                  </Typography>
                                ) : (
                                  <Typography>{'-'}</Typography>
                                )}
                              </Grid>
                              <Grid
                                sm={6}
                                md={6}
                                lg={3}
                                sx={{ margin: '10px 0px' }}
                              >
                                <>
                                  <Typography
                                    className="info-label"
                                    sx={modalStyle.modalTableKey}
                                  >
                                    Date & Time
                                  </Typography>
                                  {item?.reviewerList?.length > 0 ? (
                                    <Typography
                                      className="info-value"
                                      sx={modalStyle.modalTbaleValue}
                                    >
                                      {getMaxDate(item?.reviewerList) || '-'}
                                    </Typography>
                                  ) : (
                                    <Typography>{'-'}</Typography>
                                  )}
                                </>
                              </Grid>
                              <Grid
                                sm={6}
                                md={6}
                                lg={3}
                                sx={{ margin: '10px 0px' }}
                              >
                                <Typography
                                  className="info-label"
                                  sx={modalStyle.modalTableKey}
                                >
                                  Approver
                                </Typography>

                                {item?.approverList?.length > 0 ? (
                                  <Typography
                                    className="info-value"
                                    sx={modalStyle.modalTbaleValue}
                                  >
                                    {ConCatArrNames(item?.approverList) || '-'}
                                  </Typography>
                                ) : (
                                  <Typography>{'-'}</Typography>
                                )}
                              </Grid>
                              <Grid
                                sm={6}
                                md={6}
                                lg={3}
                                sx={{ margin: '10px 0px' }}
                              >
                                <>
                                  <Typography
                                    className="info-label"
                                    sx={modalStyle.modalTableKey}
                                  >
                                    Date & Time
                                  </Typography>

                                  {item?.approverList?.length > 0 ? (
                                    <Typography
                                      className="info-value"
                                      sx={modalStyle.modalTbaleValue}
                                    >
                                      {getMaxDate(item?.approverList) || '-'}
                                    </Typography>
                                  ) : (
                                    <Typography>{'-'}</Typography>
                                  )}
                                </>
                              </Grid>
                              <Grid
                                xs={12}
                                sx={{ margin: '10px 0px' }}
                                className="historylog-remarks"
                              >
                                <Typography
                                  className="info-label"
                                  sx={modalStyle.modalTableKey}
                                >
                                  Changes
                                </Typography>

                                <ListItem
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    padding: '1px 2px',
                                    color: '#151515',
                                  }}
                                >
                                  <Stack
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                    }}
                                  >
                                    <Stack className="info-value">
                                      {item?.program?.remarks
                                        ? item?.program?.remarks || '-'
                                        : item?.card
                                        ? item?.card?.remarks || '-'
                                        : item?.remarks || '-'}
                                    </Stack>
                                  </Stack>
                                </ListItem>

                                <Typography
                                  className="view-more-details"
                                  onClick={() => historyViewMoreFun(index)}
                                >
                                  {viewMoreDetails}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  );
                })}
              </Table>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {pageSizeNo < totalElement ? (
                  <Typography
                    className="view-more-history"
                    onClick={viewMoreHistory}
                  >
                    View More History
                  </Typography>
                ) : (
                  <Typography className="historylog-alert-text">
                    {' '}
                    'Yeah , You have seen it all'
                  </Typography>
                )}
              </Box>
            </Stack>
          </Stack>
        </Dialog>
      </Stack>
    </>
  );
}
