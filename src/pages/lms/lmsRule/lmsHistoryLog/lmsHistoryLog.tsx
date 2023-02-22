/* eslint-disable react-hooks/exhaustive-deps */
import { IconButton, Menu, MenuItem, Stack, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './lmsHistoryLog.scss';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { checkTagStatus } from '../../../../utils/tagBasedIndicator/tagStatus';
import { useNavigate } from 'react-router-dom';
import ListTable from '../../../../components/commonComponent/commonListTable/commonListTable';
import HistoryLogCustomModal from '../../../../components/commonComponent/customModal/HistoryLogCustomModal';
import GroupButton from '../../../../components/commonComponent/GroupButton/GroupButton';
import { styled } from '@mui/material/styles';
import { MenuProps } from '@mui/material/Menu';
import ascending_icon from '../../../../assets/icons/ascending.svg';
import descending_icon from '../../../../assets/icons/descending.svg';
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
export const data = [
  {
    id: 1,
    ruleName: 'Main config_D_FBI',
    initiatedBy: 'Ganesh M',
    dateAndTime: '20 June 2022, 11:00',
    Reviewer: ' Venkatesan',

    status: 'Approved',
  },
  {
    id: 2,
    ruleName: 'Main Config_D_KYC',
    initiatedBy: 'Parithi',
    dateAndTime: '20 June 2022, 11:00',
    Reviewer: 'Venkatesan',
    status: 'Waiting for Approval',
  },
  {
    id: 3,
    ruleName: 'Main Config_R_C4C_Incomplete',
    initiatedBy: 'Kanimozhi',
    dateAndTime: '20 June 2022, 11:00',
    Reviewer: 'Abhishek',
    status: 'Rejected ',
  },
];
export const LMSHistoryLog = () => {
  const navigate = useNavigate();

  const [sortingData, setSortingData] = useState(data);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const open = Boolean(anchorElement);
  //sorting
  const [value, setValue] = React.useState<any>('dateAndTime');
  const [secondValue, setSecondValue] = React.useState<any>(null);
  const [threeValue, setThreeValue] = React.useState<any>(null);
  const [ascending, setAscending] = useState<boolean>(false);

  const filterData = () => {
    const sort = sortingData.sort((a: any, b: any) => {
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
    setSortingData([...sort]);
  };
  useEffect(() => {
    filterData();
  }, [ascending, value, secondValue, threeValue]);

  const handleSortByName = (
    name: string,
    secondItem: string,
    threeItem: string
  ) => {
    const secondState = secondItem === '' ? null : secondItem;
    const threeState = threeItem === '' ? null : threeItem;
    if (
      value === name &&
      secondValue === secondState &&
      threeValue === threeState &&
      !ascending
    ) {
      setAscending(true);
    } else {
      if (
        value !== name ||
        secondValue !== secondState ||
        threeValue !== threeState
      ) {
        setAscending(true);
      } else {
        setAscending(!ascending);
      }
    }
    setValue(name);
    setSecondValue(secondState);
    setThreeValue(threeState);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };
  const handleClickMenu = (event: React.MouseEvent<HTMLTableCellElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const openHistoryLogModal = () => {
    setShowHistoryModal(true);
  };

  const column = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '70px',
      render: (_: string, row: any, index: number) => {
        return <Stack sx={{ textAlign: 'center' }}>{index + 1}</Stack>;
      },
      headerRender: (text: string) => {
        return <Stack sx={{ textAlign: 'center' }}>{text}</Stack>;
      },
    },
    {
      title: 'Rule Name',
      dataIndex: 'ruleName',
      key: 'ruleName',
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
            onClick={() => handleSortByName('ruleName', '', '')}
          >
            <>{text}</>
            {value === 'ruleName' && (
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
      title: 'Date & Time',
      dataIndex: 'dateAndTime',
      key: 'dateAndTime',
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
            onClick={() => handleSortByName('dateAndTime', '', '')}
          >
            <>{text}</>
            {value === 'dateAndTime' && (
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
      title: 'Reviewer',
      dataIndex: 'Reviewer',
      key: 'Reviewer',
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
            onClick={() => handleSortByName('Reviewer', '', '')}
          >
            <>{text}</>
            {value === 'Reviewer' && (
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
      title: 'Request Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        return (
          <Stack
            sx={{
              color: text ? checkTagStatus(text).color : '',
            }}
          >
            {text}
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
            onClick={() => handleSortByName('status', '', '')}
          >
            <>{text}</>
            {value === 'status' && (
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
      render: () => {
        return (
          <>
            <Stack
              id="more-button"
              onClick={handleClickMenu}
              aria-controls={open ? 'more-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{ padding: '5px', borderBottom: 'none' }}
            >
              <MoreVertIcon />
            </Stack>
            <StyledMenu
              id="more-menu"
              anchorEl={anchorElement}
              open={open}
              MenuListProps={{
                'aria-labelledby': 'more-button',
              }}
              onClose={handleClose}
            >
              <MenuItem
                // onClick={() => handleClose()}
                onClick={() => {
                  handleClose();
                  openHistoryLogModal();
                }}
                style={{ padding: '10px 20px', textAlign: 'left' }}
              >
                History Log
              </MenuItem>
              <MenuItem
                // onClick={handleClose}
                onClick={() => {
                  handleClose();
                  navigate('/lms/lmsRule/viewRule', {
                    state: {
                      routeFromHistoryLog: true,
                    },
                  });
                }}
                style={{ padding: '10px 20px', textAlign: 'left' }}
              >
                View Rule
              </MenuItem>
            </StyledMenu>
          </>
        );
      },
    },
  ];
  const closeModal = () => {
    setShowHistoryModal(false);
  };

  const historyViewMoreAction = () => {
    navigate('/lms/lmsRule/historyLogDetails', {
      // state: data[status - 1].status,
    });
  };
  const tableHeader = [
    {
      header: 'Version Number',
    },
    {
      header: 'Surrogate Name',
    },
    {
      header: 'Checker Status',
    },
    {
      header: 'Current Status',
    },
  ];
  const tableData = [
    {
      versionNumber: 'V1.1.5',
      surrogateName: 'Card For Card',
      requestStatus: 'Approved',
      currentStatus: 'Active',
      detailHeaders: [
        { detailHeader: 'Version Number', value: 'V1.1.5' },
        { detailHeader: 'Surrogate Name', value: 'Card For Card' },
        { detailHeader: 'Request Status', value: 'Rejected' },
        { detailHeader: 'Current Status', value: 'Active' },
        { detailHeader: 'Initiater', value: 'Rajesh Kumar' },
        { detailHeader: 'Date & Time', value: '10 Aug, 2022 10:00' },
        { detailHeader: 'Reviewer', value: 'Ganesh' },
        { detailHeader: 'Date & Time', value: '12 Aug, 2022 10:00' },
        { detailHeader: 'Approver', value: 'Ganesh' },
        { detailHeader: 'Date & Time', value: '12 Aug, 2022 10:00' },
      ],
      reasonRejection: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus in ipsum aliquam cursus. Ac mattis lectus eleifend scelerisque Vitae quis praesent tempus ut',
        'Accumsan diam a vulputate ultrices turpis viverra rhoncus donec ultricies. In dui  ultricies in curabitur quis et. Justo velit    massa sed morbi nunc, sit magna.',
        'Facilisi est morbi sollicitudin ornare a. Ullamcorper semper fac.',
      ],
    },
    {
      versionNumber: 'V1.1.4',
      surrogateName: 'Card For Card',
      requestStatus: 'Approved',
      currentStatus: 'Active',
      detailHeaders: [
        { detailHeader: 'Version Number', value: 'V1.1.4' },
        { detailHeader: 'Surrogate Name', value: 'Card For Card' },
        { detailHeader: 'Request Status', value: 'Rejected' },
        { detailHeader: 'Current Status', value: 'Active' },
        { detailHeader: 'Initiater', value: 'Rajesh Kumar' },
        { detailHeader: 'Date & Time', value: '10 Aug, 2022 10:00' },
        { detailHeader: 'Reviewer', value: 'Ganesh' },
        { detailHeader: 'Date & Time', value: '12 Aug, 2022 10:00' },
        { detailHeader: 'Approver', value: 'Ganesh' },
        { detailHeader: 'Date & Time', value: '12 Aug, 2022 10:00' },
      ],
      reasonRejection: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus in ipsum aliquam cursus. Ac mattis lectus eleifend scelerisque Vitae quis praesent tempus ut',
        'Accumsan diam a vulputate ultrices turpis viverra rhoncus donec ultricies. In dui  ultricies in curabitur quis et. Justo velit    massa sed morbi nunc, sit magna.',
        'Facilisi est morbi sollicitudin ornare a. Ullamcorper semper fac.',
      ],
    },
    {
      versionNumber: 'V1.1.3',
      surrogateName: 'Card For Card',
      requestStatus: 'Approved',
      currentStatus: 'Active',
      detailHeaders: [
        { detailHeader: 'Version Number', value: 'V1.1.3' },
        { detailHeader: 'Surrogate Name', value: 'Card For Card' },
        { detailHeader: 'Request Status', value: 'Rejected' },
        { detailHeader: 'Current Status', value: 'Active' },
        { detailHeader: 'Initiater', value: 'Rajesh Kumar' },
        { detailHeader: 'Date & Time', value: '10 Aug, 2022 10:00' },
        { detailHeader: 'Reviewer', value: 'Ganesh' },
        { detailHeader: 'Date & Time', value: '12 Aug, 2022 10:00' },
        { detailHeader: 'Approver', value: 'Ganesh' },
        { detailHeader: 'Date & Time', value: '12 Aug, 2022 10:00' },
      ],

      reasonRejection: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus in ipsum aliquam cursus. Ac mattis lectus eleifend scelerisque Vitae quis praesent tempus ut',
        'Accumsan diam a vulputate ultrices turpis viverra rhoncus donec ultricies. In dui  ultricies in curabitur quis et. Justo velit    massa sed morbi nunc, sit magna.',
        'Facilisi est morbi sollicitudin ornare a. Ullamcorper semper fac.',
      ],
    },
  ];

  const GroupButtonData = [
    {
      title: 'All',
    },
    {
      title: 'Approved',
    },
    {
      title: 'Waiting for Approval',
    },
    {
      title: 'Rejected',
    },
  ];

  return (
    <Stack sx={{ backgroundColor: 'white' }}>
      <Stack className="LMSHistoryLogContainer">
        <Stack className="LMSHistoryLogHeader">
          <Box className="groupButtonContainer">
            <GroupButton data={GroupButtonData} />
          </Box>
        </Stack>
        <Stack className="LMSHistoryLogTable">
          <ListTable column={column} data={sortingData} />
        </Stack>
      </Stack>

      {showHistoryModal && (
        <HistoryLogCustomModal
          title={'Card  History Log'}
          closeBtn={'Close'}
          tableData={tableData}
          tableHeader={tableHeader}
          handleCloseSuccess={closeModal}
          openSuccess={showHistoryModal}
          viewMoreDetails={'view more details'}
          historyViewMoreFun={historyViewMoreAction}
        />
      )}
    </Stack>
  );
};
