import {
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Stack,
  MenuItem,
  Menu,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { colors } from '../../../../../style/Color';
import { programMmgt, tagBasedIndicator } from '../../../../../utils/Constants';
import { checkTagStatus } from '../../../../../utils/tagBasedIndicator/tagStatus';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ascending_icon from '../../../../../assets/icons/ascending.svg';
import descending_icon from '../../../../../assets/icons/descending.svg';
import { ProgrammeManagementCardItemInterface } from '../../programmeMgntInterface';
import { formatDateTime } from '../../../../../utils/DateTimeFormatter';
import { MenuProps } from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import { getPermission } from '../../../../../utils/ActionAllowed/UserActionAllowed';
import localforage from 'localforage';
export interface dataList {
  surrogateProgramme: string;
  lastModify: string;
  status: string;
  autoResumeForm: string;
  StatusActiveDate: string;
  activeSince: string;
  id: number;
  resumeItNow: string;
  resumeStatus: string;
}
export interface dataHeaderList {
  surrogateProgramme: string;
  activeSince?: string;
  lastModify?: string;
  status?: string;
  autoResumeForm?: string;
  more?: string;
}
const tableHeaderData = [
  {
    surrogateProgramme: 'Surrogate Programme',
    activeSince: 'Active Since',
    lastModify: 'Last Modified',
    status: 'Status',
    autoResumeForm: 'Auto Resume From',
    more: 'More',
  },
];
type props = {
  data: ProgrammeManagementCardItemInterface[];
  onClickCallback: (
    selected: boolean,
    selectedItem: ProgrammeManagementCardItemInterface
  ) => void;
  modalFunPause: () => void;
  modalFunResume: () => void;
  modalScheduledPauseFun: () => void;
  onSingleSelectCallback: (
    isSelected: boolean,
    item: ProgrammeManagementCardItemInterface[]
  ) => void;
  selectedItems: ProgrammeManagementCardItemInterface[];
  onMultiSelectCallback: (
    itemArr: ProgrammeManagementCardItemInterface[]
  ) => void;
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
export const ListView = ({
  data,
  onClickCallback,
  modalFunPause,
  modalFunResume,
  modalScheduledPauseFun,
  onSingleSelectCallback,
  selectedItems,
  onMultiSelectCallback,
}: props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    selectedItem: ProgrammeManagementCardItemInterface,
    value: string
  ) => {
    setAnchorEl(event.currentTarget);
    onSingleSelectCallback(true, [selectedItem]);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [selected, setSelected] = React.useState<string[]>([]);
  const [value, setValue] = React.useState<any>('lastModifiedDateTime');
  const [sortingData, setSortingData] = useState<any>([]);
  const [ascending, setAscending] = useState<boolean>(false);
  const [resumeDisabled, setResumeDisabled] = useState<boolean>(false);
  const [pauseDisabled, setPauseDisabled] = useState<boolean>(false);
  const [schedulePauseDisabled, setSchedulePauseDisabled] =
    useState<boolean>(false);
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

  useEffect(() => {
    selectedItems.length === 0 && setSelected([]);
  }, [selectedItems]);

  const filterData = () => {
    const sort = data.sort((a: any, b: any) => {
      if (ascending) {
        return a[value] < b[value] ? -1 : 1;
      }
      return a[value] > b[value] ? -1 : 1;
    });
    setSortingData([...sort]);
  };
  useEffect(() => {
    if (data?.length > 0) {
      filterData();
    }
  }, [ascending, value, data]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n: any) => n.id);
      setSelected(newSelected);
      onMultiSelectCallback(data);
    } else {
      onMultiSelectCallback([]);
      setSelected([]);
    }
  };
  const isSelected = (id: string) => {
    const res = selected.indexOf(id);
    if ((res && res !== -1) || res === 0) {
      return true;
    } else {
      return false;
    }
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
  const handleClickCheckbox = (id: string) => {
    const result = isSelected(id);
    let selectedData = selected;
    if (result) {
      const index = selected.indexOf(id);
      selectedData.splice(index, 1);
      setSelected([...selectedData]);
    } else {
      setSelected([...selectedData, id]);
    }
  };
  const onClickCheckBox = (
    selected: boolean,
    selectedItem: ProgrammeManagementCardItemInterface
  ) => {
    onClickCallback(selected, selectedItem);
  };
  const handleSortByName = (name: string) => {
    if (value === name && !ascending) {
      setAscending(true);
    } else {
      if (value !== name) {
        setAscending(true);
      } else {
        setAscending(!ascending);
      }
    }
    setValue(name);
  };
  const checkButtonStatus = (item: string) => {
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
  return (
    <Stack>
      <TableContainer
        component={Paper}
        elevation={0}
        className="common-table-container1"
      >
        <Table
          aria-label="Table"
          sx={{
            borderBottom: 'none',
            width: '100%',
          }}
        >
          <TableHead
            style={{ background: colors.tableHeaderLightBlue }}
            sx={{ padding: '5px' }}
          >
            {tableHeaderData.map((items: dataHeaderList, index: number) => (
              <TableRow
                key={index}
                style={{ padding: '5px', borderBottom: 'none' }}
              >
                {getPermission(
                  actionAllowedItem,
                  'PRODUCT_MANAGEMENT',
                  'PROGRAM_MANAGEMENT',
                  'PASS_RESUME_PROGRAM'
                ) && (
                  <TableCell sx={{ padding: '5px', borderBottom: 'none' }}>
                    <Checkbox
                      style={{
                        transform: 'scale(1.2)',
                      }}
                      sx={{
                        color: '#A8A8A9',
                      }}
                      color={'secondary'}
                      indeterminate={
                        selected.length > 0 && selected.length < data.length
                      }
                      checked={
                        data.length > 0 && selected.length === data.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{
                        'aria-label': 'select all desserts',
                      }}
                    />
                  </TableCell>
                )}
                <TableCell
                  sx={{
                    fontWeight: 800,
                    padding: '5px',
                    borderBottom: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSortByName('programTypeName')}
                >
                  {items.surrogateProgramme}
                  {value === 'programTypeName' && (
                    <IconButton
                      sx={{ height: '12px', width: '12px', marginLeft: '10px' }}
                    >
                      {ascending === true ? (
                        <img src={ascending_icon} alt="Sort Icon" />
                      ) : (
                        <img src={descending_icon} alt="Sort Icon" />
                      )}
                    </IconButton>
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 800,
                    padding: '5px',
                    borderBottom: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSortByName('pauseTime')}
                >
                  {items.activeSince}
                  {value === 'pauseTime' && (
                    <IconButton
                      sx={{ height: '12px', width: '12px', marginLeft: '10px' }}
                    >
                      {ascending === true ? (
                        <img src={ascending_icon} alt="Sort Icon" />
                      ) : (
                        <img src={descending_icon} alt="Sort Icon" />
                      )}
                    </IconButton>
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 800,
                    padding: '5px',
                    borderBottom: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSortByName('lastModifiedDateTime')}
                >
                  {items.lastModify}
                  {value === 'lastModifiedDateTime' && (
                    <IconButton
                      sx={{ height: '12px', width: '12px', marginLeft: '10px' }}
                    >
                      {ascending === true ? (
                        <img src={ascending_icon} alt="Sort Icon" />
                      ) : (
                        <img src={descending_icon} alt="Sort Icon" />
                      )}
                    </IconButton>
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 800,
                    padding: '5px',
                    borderBottom: 'none',
                    width: '148px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSortByName('programStatusName')}
                >
                  {items.status}
                  {value === 'programStatusName' && (
                    <IconButton
                      sx={{ height: '12px', width: '12px', marginLeft: '10px' }}
                    >
                      {ascending === true ? (
                        <img src={ascending_icon} alt="Sort Icon" />
                      ) : (
                        <img src={descending_icon} alt="Sort Icon" />
                      )}
                    </IconButton>
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 800,
                    padding: '5px',
                    borderBottom: 'none',
                    cursor: 'pointer',
                  }}
                  align="center"
                  onClick={() => handleSortByName('resumeTime')}
                >
                  {items.autoResumeForm}
                  {value === 'resumeTime' && (
                    <IconButton
                      sx={{ height: '12px', width: '12px', marginLeft: '10px' }}
                    >
                      {ascending === true ? (
                        <img src={ascending_icon} alt="Sort Icon" />
                      ) : (
                        <img src={descending_icon} alt="Sort Icon" />
                      )}
                    </IconButton>
                  )}
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 800, padding: '5px', borderBottom: 'none' }}
                >
                  {items.more}
                </TableCell>
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {sortingData.length > 0 &&
              sortingData.map((dataItem: any, index: number) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    key={index}
                    sx={{ padding: '5px', borderBottom: 'none' }}
                    style={
                      isItemSelected(dataItem) === true
                        ? { background: colors.tableGrey }
                        : { background: colors.white }
                    }
                  >
                    {getPermission(
                      actionAllowedItem,
                      'PRODUCT_MANAGEMENT',
                      'PROGRAM_MANAGEMENT',
                      'PASS_RESUME_PROGRAM'
                    ) && (
                      <TableCell
                        padding={'checkbox'}
                        sx={{ padding: '5px', borderBottom: 'none' }}
                      >
                        <Checkbox
                          style={{
                            transform: 'scale(1.2)',
                          }}
                          sx={{
                            color: '#A8A8A9',
                          }}
                          color={'secondary'}
                          checked={isItemSelected(dataItem)}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                          onChange={(e) => {
                            handleClickCheckbox(dataItem?.id || '');
                            onClickCheckBox(e.target.checked, dataItem);
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell sx={{ padding: '5px', borderBottom: 'none' }}>
                      {dataItem.programTypeName}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: checkTagStatus(dataItem.pauseTime).color,
                        padding: '5px',
                        borderBottom: 'none',
                      }}
                    >
                      {dataItem?.programStatus === 'ACTIVE'
                        ? dataItem.resumeTime === '' || !dataItem.resumeTime
                          ? '-'
                          : formatDateTime(dataItem?.resumeTime)
                        : dataItem.pauseTime !== null
                        ? formatDateTime(dataItem.pauseTime)
                        : '-'}
                    </TableCell>
                    <TableCell sx={{ padding: '5px', borderBottom: 'none' }}>
                      {dataItem.lastModifiedDateTime !== null
                        ? formatDateTime(dataItem.lastModifiedDateTime)
                        : '-'}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: checkTagStatus(dataItem.programStatus).color,
                        padding: '5px',
                        borderBottom: 'none',
                      }}
                    >
                      {dataItem.programStatusName}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ padding: '5px', borderBottom: 'none' }}
                    >
                      {dataItem?.programStatus === 'PAUSE_SCHEDULED'
                        ? dataItem.resumeTime === '' || !dataItem.resumeTime
                          ? '-'
                          : formatDateTime(dataItem?.resumeTime)
                        : '-'}
                    </TableCell>
                    <TableCell
                      onClick={(e: any) => {
                        handleClick(e, dataItem, dataItem.programStatusName);
                        checkButtonStatus(dataItem.programStatus);
                      }}
                      sx={{ borderBottom: 'none', width: '0' }}
                    >
                      <MoreVertIcon
                        id="demo-customized-button"
                        aria-controls={
                          open ? 'demo-customized-menu' : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
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
          disabled={resumeDisabled}
          onClick={() => {
            handleClose();
            modalFunResume();
          }}
          disableRipple
        >
          {programMmgt.RESUME_SURROGATE}
        </MenuItem>
        <MenuItem
          disabled={pauseDisabled}
          onClick={() => {
            handleClose();
            modalFunPause();
          }}
          disableRipple
        >
          {programMmgt.PAUSE_SURROGATE}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            modalScheduledPauseFun();
          }}
          disabled={schedulePauseDisabled}
          disableRipple
        >
          {programMmgt.EDIT_SCHEDULE_PAUSE}
        </MenuItem>
      </StyledMenu>
    </Stack>
  );
};
