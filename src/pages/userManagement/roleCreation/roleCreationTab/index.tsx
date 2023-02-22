import {
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import '../style.scss';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import DuplicateRoleModal from '../../../../components/commonComponent/customModal/DuplicateRoleModal';
import ascending_icon from '../../../../assets/icons/ascending.svg';
import descending_icon from '../../../../assets/icons/descending.svg';
import {
  getDuplicateRoleData,
  getInitialPageDetails,
  getRoleCreationDetails,
  getRoleCreationList,
} from '../../../../services/roleCreationServices';
import ListTable from '../../../../components/commonComponent/commonListTable/commonListTable';
import localforage from 'localforage';
import ErrorMessage from '../../../../components/commonComponent/ErrorMessage';
import { MenuProps } from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import { formatDateTime } from '../../../../utils/DateTimeFormatter';
import { getPermission } from '../../../../utils/ActionAllowed/UserActionAllowed';

function RoleCreationTab() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openCardMenu = Boolean(anchorEl);
  const [filteredData, setFilterteredData] = useState<any>([]);
  const [duplicateRoleDataApi, setDuplicateRoleData] = useState([]);
  const [duplicateRole, openDulicateRole] = useState(false);
  const [viewId, setViewId] = useState('');
  const [viewName, setViewName] = useState('');
  const [userID, setUserId] = useState('');
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorElement);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 0,
  });
  const [totalCount, setTotalCount] = useState({
    totaLNoOfRecords: 0,
    totalNoOfPages: 0,
  });

  // sorting
  const [value, setValue] = React.useState<any>('lastModifiedDateTime');
  const [secondValue, setSecondValue] = React.useState<any>(null);
  const [threeValue, setThreeValue] = React.useState<any>(null);
  const [ascending, setAscending] = useState<boolean>(false);
  const [decendingSortingData, setDecendingSortingData] = useState<any>([]);
  const [actionAllowedItem, setActionAllowedItem] = useState([]);

  const onPageChange = (pageNo: number) => {
    setPagination({
      ...pagination,
      pageNumber: pageNo,
    });
  };

  const onPageSizeChange = (size: number) => {
    if (size === -1) {
      setPagination({
        ...pagination,
        pageSize: totalCount.totaLNoOfRecords,
        pageNumber: 0,
      });
    } else
      setPagination({
        ...pagination,
        pageSize: size,
        pageNumber: 0,
      });
  };
  const [apiError, setApiError] = useState('');

  const filterData = () => {
    const sort = decendingSortingData.sort((a: any, b: any) => {
      if (ascending) {
        if (threeValue) {
          const first = a?.[value]?.[secondValue]?.[threeValue] ?? '';
          const second = b?.[value]?.[secondValue]?.[threeValue] ?? '';
          return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
        }
        if (secondValue) {
          const first = a?.[value]?.[secondValue] ?? '';
          const second = b?.[value]?.[secondValue] ?? '';
          return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
        }
        const first = a?.[value] ?? '';
        const second = b?.[value] ?? '';
        return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
      }
      if (threeValue) {
        const first = a?.[value]?.[secondValue]?.[threeValue] ?? '';
        const second = b?.[value]?.[secondValue]?.[threeValue] ?? '';
        return first.toLowerCase() > second.toLowerCase() ? -1 : 1;
      }
      if (secondValue) {
        const first = a?.[value]?.[secondValue] ?? '';
        const second = b?.[value]?.[secondValue] ?? '';
        return first.toLowerCase() > second.toLowerCase() ? -1 : 1;
      }
      const first = a?.[value] ?? '';
      const second = b?.[value] ?? '';
      return first.toLowerCase() > second.toLowerCase() ? -1 : 1;
    });
    setFilterteredData([...sort]);
  };
  useEffect(() => {
    if (decendingSortingData.length > 0) {
      filterData();
    }
  }, [ascending, value, secondValue, threeValue, decendingSortingData]);

  const handleSortByName = (
    name: string,
    secondItem: string,
    threeItem: string
  ) => {
    const secondState = secondItem === '' ? null : secondItem;
    const threeState = threeItem === '' ? null : threeItem;

    if (
      value !== name ||
      secondValue !== secondState ||
      threeValue !== threeState
    ) {
      setAscending(true);
    } else {
      setAscending(!ascending);
    }

    setValue(name);
    setSecondValue(secondState);
    setThreeValue(threeState);
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
      border: '1px solid #f5f2f2',
      boxShadow:
        'rgba(2, 2, 2, 0.04) 0px 0px 1px 0px, rgba(0, 0, 0, 0.1) 0px 1px 1px 0px',
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

  const column = [
    {
      title: '#',
      dataIndex: 'ID',
      key: 'ID',
      width: '100px',
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {pagination?.pageNumber * pagination?.pageSize + index + 1}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return <Stack>{text}</Stack>;
      },
    },
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      width: '250px',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('name', '', '')}
          >
            <>{text}</>
            {value === 'name' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Initiated By',
      dataIndex: 'initiatedBy',
      key: 'initiatedBy',
      width: '220px',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('initiatedBy', '', '')}
          >
            <>{text}</>
            {value === 'initiatedBy' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Approved By',
      dataIndex: 'approvedBy',
      key: 'approvedBy',
      width: '220px',
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('approvedBy', '', '')}
          >
            <>{text}</>
            {value === 'approvedBy' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Date & Time',
      dataIndex: 'lastModifiedDateTime',
      key: 'lastModifiedDateTime',
      width: '250px',
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {' '}
            {row?.lastModifiedDateTime != null
              ? formatDateTime(row?.lastModifiedDateTime)
              : '--'}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('lastModifiedDateTime', '', '')}
          >
            <>{text}</>
            {value === 'lastModifiedDateTime' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Initiated Date',
      dataIndex: 'onBoardDateTime',
      key: 'onBoardDateTime',
      width: '250px',
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {' '}
            {row?.onBoardDateTime != null
              ? formatDateTime(row?.onBoardDateTime)
              : '--'}
          </Stack>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('onBoardDateTime', '', '')}
          >
            <>{text}</>
            {value === 'onBoardDateTime' && (
              <IconButton sx={{ height: '12px', width: '12px' }}>
                {ascending === true ? (
                  <img src={ascending_icon} alt="Sort Icon" />
                ) : (
                  <img src={descending_icon} alt="Sort Icon" />
                )}
              </IconButton>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'More',
      dataIndex: 'id',
      key: 'more',
      width: '100px',
      render: (_: string, row: any, index: number) => {
        return (
          <>
            <Box
              id="more-button"
              onClick={(e) => handleClick(e, row.id, row?.name)}
              aria-controls={menuOpen ? 'more-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? 'true' : undefined}
              sx={{
                justifyContent: 'flex-end',
                display: 'flex',
                borderBottom: 'none',
              }}
            >
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            </Box>

            <StyledMenu
              // className="boxShadow"
              id="more-menu"
              anchorEl={anchorElement}
              open={menuOpen}
              MenuListProps={{
                'aria-labelledby': 'more-button',
              }}
              onClose={handleClose}
            >
              {getPermission(
                actionAllowedItem,
                'USER_MANAGEMENT',
                'ROLE_CREATION',
                'VIEW_ROLES'
              ) && (
                <MenuItem onClick={handleViewClose} className="menu">
                  View Role
                </MenuItem>
              )}
              {getPermission(
                actionAllowedItem,
                'USER_MANAGEMENT',
                'ROLE_CREATION',
                'EDIT_ROLES'
              ) && (
                <MenuItem onClick={handleEditClose} className="menu">
                  Edit Role
                </MenuItem>
              )}
            </StyledMenu>
          </>
        );
      },
      headerRender: (text: string) => {
        return (
          <Stack sx={{ display: 'flex', alignItems: 'flex-end' }}>More</Stack>
        );
      },
    },
  ];

  useEffect(() => {
    fetchRoleCreationList();
    fetchDuplicateRolelist();
  }, [pagination]);

  const fetchDuplicateRolelist = async () => {
    const payload = {
      roleName: '',
    } as any;
    const result = await getDuplicateRoleList(payload);
    setDuplicateRoleData(result?.result);
  };

  const getDuplicateRoleList = async (payload: any) => {
    let res = {} as any;
    await getDuplicateRoleData(payload)
      .then((response) => {
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const fetchRoleCreationList = async () => {
    const payload = {
      page: pagination.pageNumber,
      size: pagination.pageSize,
    } as any;
    const result = await getListOfCards(payload);
    setTotalCount({
      totaLNoOfRecords: result?.result?.totalElements,
      totalNoOfPages: result?.result?.totalPages,
    });
    if (result?.result?.content) {
      // setFilterteredData(result?.result?.content);
      setDecendingSortingData([...(result?.result?.content ?? [])]);
    }
  };

  const getListOfCards = async (payload: any) => {
    let res = {} as any;
    await getRoleCreationList(payload)
      .then((response) => {
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const handleCardMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCardMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement>,
    id: any,
    name: string
  ) => {
    setAnchorElement(event.currentTarget);
    setViewId(id);
    setViewName(name);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };
  const handleViewClose = async () => {
    setAnchorElement(null);
    const payload = {
      roleId: viewId,
    } as any;
    const result = await getDetailofItem(payload);
    navigate('/userManagement/roleCreation/createRole', {
      state: { roleName: viewName, data: result?.result, isView: true },
    });
  };

  const getDetailofItem = async (payload: any) => {
    let res = {} as any;
    await getRoleCreationDetails(payload)
      .then((response) => {
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const getInitialData = async (payload: any) => {
    let res = {} as any;
    await getInitialPageDetails(payload)
      .then((response) => {
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        console.log(err);
        res = { error: err.response.data };
        handleError(err?.response?.data ?? '');
      });
    return res;
  };

  const handleError = (err: any) => {
    if (err?.exception?.fieldErrors) {
      const missingFields = err?.exception.fieldErrors?.map(
        (field: string) => `${field}, `
      );
      setApiError(missingFields);
    } else if (err?.exception?.shortMessage)
      setApiError(err?.exception?.shortMessage);
    else if (err?.error) setApiError(err?.error + ' ' + err?.path);
    else setApiError('Something went wrong!');
  };

  const handleEditClose = async () => {
    setAnchorElement(null);
    const payload = {
      roleId: viewId,
    } as any;
    const result = await getDetailofItem(payload);
    navigate('/userManagement/roleCreation/createRole', {
      state: { roleName: viewName, data: result?.result, isView: false },
    });
  };

  const handleDuplicateNext = (roleValue: string, data: any) => {
    navigate('/userManagement/roleCreation/createRole', {
      state: { roleName: `${roleValue} Copy`, data: data, newRole: true },
    });
  };

  useEffect(() => {
    getLocalStorageValue();
  }, []);

  const getLocalStorageValue = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setUserId(value.id);
      setActionAllowedItem(value?.actionsAllowed);
    } catch (err) {
      console.log(err);
    }
  };

  const StyledMenuDropDown = styled((props: MenuProps) => <Menu {...props} />)(
    () => ({
      '& .MuiPaper-root': {
        borderRadius: 6,
        minWidth: '257px',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.16))',
        '& .MuiMenu-list': {
          padding: '2px',
        },
        '& .MuiMenuItem-root': {
          padding: '15px 22px',
          fontSize: '14px',
          fontWeight: '400',
          fontFamily: 'Ilisarniq',
        },
      },
    })
  );

  return (
    <Stack>
      <Stack>
        <Box className="role-header-container">
          <ScreenHeader
            title="Role Creation"
            info="From here you can create access presets to assign with users in Users Creation."
            showBackButton={false}
          />
          <Box>
            <Button
              sx={{ textTransform: 'capitalize', boxShadow: 'none' }}
              variant="contained"
              color="secondary"
              startIcon={<AddIcon style={{width:'25px', height:'25px'}} />}
              aria-controls={openCardMenu ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openCardMenu ? 'true' : undefined}
              onClick={handleCardMenuClick}
              id="basic-button"
            >
              Create Role{' '}
            </Button>
            <StyledMenuDropDown
              id="basic-menu"
              anchorEl={anchorEl}
              open={openCardMenu}
              onClose={handleCardMenuClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                onClick={async () => {
                  const payload = {
                    userId: userID,
                  } as any;
                  const result = await getInitialData(payload);
                  navigate('/userManagement/roleCreation/createRole', {
                    state: {
                      roleName: '',
                      data: result?.result,
                      newRole: true,
                    },
                  });
                  handleCardMenuClose();
                }}
              >
                Create New Role
              </MenuItem>
              <MenuItem
                onClick={() => {
                  openDulicateRole(true);
                  handleCardMenuClose();
                }}
              >
                Duplicate Role
              </MenuItem>
            </StyledMenuDropDown>
          </Box>
        </Box>
        <Box sx={{ marginTop: 4 }}>
          <Box
            sx={{
              paddingX: 4,
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingY: 2.2,
            }}
          >
            <Typography>
              Various organisations along with basic details.
            </Typography>
          </Box>
          <Box className="tableDivider">
            <Divider sx={{ paddingX: 4 }} />
          </Box>
          <Box className="tableBox">
            <ListTable
              column={column}
              data={filteredData}
              pagination={{
                ...pagination,
                ...totalCount,
                onPageChange: onPageChange,
                onPageSizeChange: onPageSizeChange,
              }}
            />
          </Box>
        </Box>
      </Stack>
      {
        <DuplicateRoleModal
          openSuccess={duplicateRole}
          handleClose={() => {
            openDulicateRole(false);
            handleCardMenuClose();
          }}
          btn={'Next'}
          handleCloseSuccess={handleDuplicateNext}
          data={duplicateRoleDataApi}
        />
      }
      {apiError.length !== 0 && (
        <ErrorMessage
          message={apiError}
          handleClose={() => setApiError('')}
          severity="error"
          duration={3000}
        />
      )}
    </Stack>
  );
}

export default RoleCreationTab;
