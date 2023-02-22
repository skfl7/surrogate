import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Checkbox,
  IconButton,
  MenuItem,
  Menu,
  Grid,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { colors } from '../../../../../style/Color';
import { programMmgt, tagBasedIndicator } from '../../../../../utils/Constants';
import { ListTagStatus } from '../../../../../utils/tagBasedIndicator/listTagStatus';
// import CustomModal from '../../../../../components/commonComponent/customModal/CustomModal';
import { ProgrammeManagementCardItemInterface } from '../../programmeMgntInterface';
import { formatDateTime } from '../../../../../utils/DateTimeFormatter';
import { MenuProps } from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import localforage from 'localforage';
import { getPermission } from '../../../../../utils/ActionAllowed/UserActionAllowed';
const useStyles = {
  root: {
    boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.12)',
  },
};
type props = {
  data: ProgrammeManagementCardItemInterface[];
  onClickCallback: (
    selected: boolean,
    selectedItem: ProgrammeManagementCardItemInterface,
    resume?: boolean
  ) => void;
  modalFunPause: () => void;
  modalFunResume: () => void;
  modalScheduledPauseFun: () => void;
  selectedItems: ProgrammeManagementCardItemInterface[];
  onSingleSelectCallback: (
    isSelected: boolean,
    item: ProgrammeManagementCardItemInterface[]
  ) => void;
  resumeitFun: (value: boolean) => void;
};
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(() => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    minWidth: '257px',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '2px',
    },
    '& .MuiMenuItem-root': {
      padding: '13px 22px',
      fontSize: '14px',
      fontWeight: '400',
      fontFamily: 'Ilisarniq',
    },
  },
}));
function CardList({
  data,
  onClickCallback,
  modalFunPause,
  modalFunResume,
  modalScheduledPauseFun,
  selectedItems,
  onSingleSelectCallback,
  resumeitFun,
}: props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    selectedItem: ProgrammeManagementCardItemInterface,
    value: string
  ) => {
    setAnchorEl(event.currentTarget);
    setResumePopUpTitle(value);
    setPausePopUpTitle(value);
    onSingleSelectCallback(true, [selectedItem]);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [resumePopUpTitle, setResumePopUpTitle] = useState('');
  const [pausePopUpTitle, setPausePopUpTitle] = useState('');
  const [resumeDisabled, setResumeDisabled] = useState<boolean>(false);
  const [pauseDisabled, setPauseDisabled] = useState<boolean>(false);
  const [schedulePauseDisabled, setSchedulePauseDisabled] =
    useState<boolean>(false);
  const [actionAllowedItem, setActionAllowedItem] = useState([]);
  // const openCardMenu = Boolean(anchorEl);
  // const open = Boolean(anchorElement);
  // const handleClick = (
  //   event: React.MouseEvent<HTMLTableCellElement>,
  //   value: string
  // ) => {
  //   setAnchorElement(event.currentTarget);
  //   setResumePopUpTitle(value);
  //   setPausePopUpTitle(value);
  // };

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

  const checkButtonStatus = (item: string) => {
    console.log('-----', item);
    const status = item.toUpperCase();
    switch (status) {
      case tagBasedIndicator.ACTIVE:
        setResumeDisabled(true);
        setPauseDisabled(false);
        setSchedulePauseDisabled(true);
        break;
      case tagBasedIndicator.PAUSED:
        setResumeDisabled(false);
        setPauseDisabled(true);
        setSchedulePauseDisabled(false);
        break;
      case tagBasedIndicator.PAUSED_SCHEDULED:
        setResumeDisabled(false);
        setPauseDisabled(true);
        setSchedulePauseDisabled(false);
        break;
    }
  };

  const getActiveDate = (
    isactive: boolean,
    dateValue: string,
    status: string
  ) => {
    let value = '';
    value = `${
      isactive
        ? dateValue
          ? `Paused since ${formatDateTime(dateValue)}`
          : '-'
        : status === 'PAUSE_SCHEDULED'
        ? `It will resume on ${formatDateTime(dateValue)}`
        : `Active since ${formatDateTime(dateValue)}`
    }`;
    return value;
  };
  const isItemSelected = (
    currentitem: ProgrammeManagementCardItemInterface
  ) => {
    let filteredArr =
      selectedItems?.length > 0
        ? selectedItems?.filter((item) => item.id === currentitem.id)
        : [];
    return filteredArr.length === 0 ? false : true;
  };
  const onClickCheckBox = (
    selected: boolean,
    selectedItem: ProgrammeManagementCardItemInterface,
    resume?: boolean
  ) => {
    onClickCallback(selected, selectedItem, resume);
  };
  return (
    <>
      <Grid container spacing={2}>
        {data.map(
          (
            dataItem: any //ProgrammeManagementCardItemInterface //todo
          ) => (
            <Grid item sm={4}>
              <Box
                key={dataItem.programTypeName}
                // width="31.5%"
                height="360px"
                sx={{
                  borderRadius: '12px',
                  ...useStyles.root,
                }}
              >
                <Card
                  sx={{
                    height: '360px',
                    borderRadius: '12px',
                    outline: isItemSelected(dataItem)
                      ? `1.5px solid ${colors.blue}`
                      : '0px',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: `2px solid ${colors.lightGrey}`,
                        paddingBottom: '5px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {getPermission(
                          actionAllowedItem,
                          'PRODUCT_MANAGEMENT',
                          'PROGRAM_MANAGEMENT',
                          'PASS_RESUME_PROGRAM'
                        ) && (
                          <Checkbox
                            style={{
                              transform: 'scale(1.2)',
                            }}
                            sx={{
                              color: '#A8A8A9',
                            }}
                            color="secondary"
                            size="medium"
                            onChange={(e) => {
                              onClickCheckBox(
                                e.target.checked,
                                dataItem,
                                false
                              );
                              // resumeitFun(false);
                            }}
                            checked={isItemSelected(dataItem)}
                          />
                        )}
                        <Typography
                          sx={{
                            letterSpacing: '0.0025em',
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: '16px',
                          }}
                        >
                          {dataItem.programTypeName}
                        </Typography>
                      </Box>
                      <Box
                        onClick={(e: any) => {
                          handleClick(e, dataItem, dataItem.programStatusName);
                          checkButtonStatus(dataItem.programStatus);
                        }}
                        id="demo-customized-button"
                        aria-controls={
                          open ? 'demo-customized-menu' : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                      >
                        <IconButton>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ padding: '0 8px' }}>
                      <Box sx={{ padding: '15px 0' }}>
                        <Typography
                          sx={{
                            color: ListTagStatus(dataItem.programStatus).color,
                            backgroundColor: ListTagStatus(
                              dataItem.programStatus
                            ).bgColor,
                            fontSize: '12px',
                            fontWeight: 400,
                            padding: '5px 8px',
                            borderRadius: '4px',
                            lineHeight: '14px',
                            letterSpacing: '0.004em',
                            // textAlign: "center",
                            width: 'max-content',
                          }}
                        >
                          {dataItem.programStatusName}
                        </Typography>
                      </Box>
                      <Box sx={{ padding: '0 0px 10px 0' }}>
                        <Typography
                          sx={{
                            color: '#AFAEAF',
                            fontSize: '12px',
                            fontWeight: 500,
                            paddingBottom: '3px',
                          }}
                        >
                          Last Modified
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#151515',
                            paddingBottom: '3px',
                          }}
                        >
                          {formatDateTime(dataItem.lastModifiedDateTime)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: '#AFAEAF',
                            fontSize: '12px',
                            fontWeight: 500,
                            paddingBottom: '2px',
                          }}
                        >
                          Status
                        </Typography>
                        {dataItem?.pauseTime &&
                          dataItem.programStatus !== 'ACTIVE' && (
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontSize: '14px',
                                fontWeight: 400,
                                color: '#151515',
                                paddingBottom: '1px',
                              }}
                            >
                              {getActiveDate(
                                true,
                                dataItem?.pauseTime,
                                dataItem.programStatus
                              )}
                            </Typography>
                          )}

                        {dataItem?.resumeTime && (
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontSize: '14px',
                              fontWeight: 400,
                              color: '#151515',
                              paddingBottom: '1px',
                            }}
                          >
                            {getActiveDate(
                              false,
                              dataItem?.resumeTime,
                              dataItem.programStatus
                            )}
                          </Typography>
                        )}
                        {dataItem.resumeStatus && (
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontSize: '14px',
                              fontWeight: 400,
                              color: '#151515',
                              paddingBottom: '1px',
                            }}
                          >
                            {dataItem.resumeStatus}
                          </Typography>
                        )}
                        {(dataItem.programStatus === 'PAUSED' ||
                          dataItem.programStatus === 'PAUSE_SCHEDULED') && (
                          <Typography
                            sx={{
                              padding: '3px 0',
                              fontSize: '14px',
                              fontWeight: 500,
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              color: '#0662B7',
                              letterSpacing: '0.0125em',
                            }}
                            onClick={() => {
                              onClickCheckBox(true, dataItem, true);
                              modalFunResume();
                              // resumeitFun(true);
                            }}
                            // color="secondary"
                          >
                            {'Resume it now'}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          )
        )}
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              modalFunResume();
            }}
            disabled={resumeDisabled}
            disableRipple
          >
            {programMmgt.RESUME_SURROGATE}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              modalFunPause();
            }}
            disabled={pauseDisabled}
            disableRipple
          >
            {programMmgt.PAUSE_SURROGATE}
          </MenuItem>
          <MenuItem
            disabled={schedulePauseDisabled}
            onClick={() => {
              handleClose();
              modalScheduledPauseFun();
            }}
            disableRipple
          >
            {programMmgt.EDIT_SCHEDULE_PAUSE}
          </MenuItem>
        </StyledMenu>
      </Grid>
    </>
  );
}
export default CardList;
