/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Divider, IconButton, InputBase, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './AccessLibrary.scss';
import ContentCopyIcon from '../../assets/icons/copy.svg';
import SearchIcon from '@mui/icons-material/Search';
import CustomModal from '../../components/commonComponent/customModal/CustomModal';
import ListTable from '../../components/commonComponent/commonListTable/commonListTable';
import ascending_icon from '../../assets/icons/ascending.svg';
import descending_icon from '../../assets/icons/descending.svg';
import { ScreenHeader } from '../../components/commonComponent/ScreenHeader/ScreenHeader';
import GroupButton from '../../components/commonComponent/GroupButton/GroupButton';
import localforage from 'localforage';
import { getPermission } from '../../utils/ActionAllowed/UserActionAllowed';
const AccessLibrary = () => {
  const [accessModal, setAccessModal] = useState(false);
  const [accessLink, setAccessLink] = useState('');

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

  //Table
  const onClickCopyIcon = (link: string, row: any) => {
    setAccessModal(!accessModal);
    setAccessLink(row?.copyLink);
  };
  const data = [
    {
      id: 1,
      application: '#12345',
      customerName: 'Ganesh M',
      channelType: 'DSA',
      lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
      copyLink:
        'https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html',
      copyIcon: <img src={ContentCopyIcon} alt="" />,
    },
    {
      id: 2,
      application: '#345',
      customerName: 'Venket ',
      channelType: 'Fintech',
      lastModifiedDateTime: '04 Feb 2023, 2:26 PM',

      copyLink:
        'https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html',
      copyIcon: <img src={ContentCopyIcon} alt="" />,
    },
    {
      id: 3,
      application: '#67',
      customerName: 'Karthik Kumar',
      channelType: 'Fintech',
      lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
      copyLink:
        'https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html',
      copyIcon: <img src={ContentCopyIcon} alt="" />,
    },
    {
      id: 4,
      application: '#897',
      customerName: 'Jack',
      channelType: 'Bank Branch',
      lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
      copyLink:
        'https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html',
      copyIcon: <img src={ContentCopyIcon} alt="" />,
    },
    {
      id: 5,
      application: '#12345',
      customerName: 'Maha',
      channelType: 'DSA',
      lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
      copyLink:
        'https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html',
      copyIcon: <img src={ContentCopyIcon} alt="" />,
    },
    {
      id: 6,
      application: '#12345',
      customerName: 'Maha',
      channelType: 'DSA',
      lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
      copyLink:
        'https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html',
      copyIcon: <img src={ContentCopyIcon} alt="" />,
    },
    {
      id: 7,
      application: '#12345',
      customerName: 'Maha',
      channelType: 'DSA',
      lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
      copyLink:
        'https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html',
      copyIcon: <img src={ContentCopyIcon} alt="" />,
    },
    {
      id: 8,
      application: '#12345',
      customerName: 'Maha',
      channelType: 'DSA',
      lastModifiedDateTime: '04 Feb 2023, 2:26 PM',

      copyLink:
        'https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html',
      copyIcon: <img src={ContentCopyIcon} alt="" />,
    },
    {
      id: 9,
      application: '#12345',
      customerName: 'Maha',
      channelType: 'DSA',
      lastModifiedDateTime: '04 Feb 2023, 2:26 PM',

      copyLink:
        'https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html',
      copyIcon: <img src={ContentCopyIcon} alt="" />,
    },
  ];

  const [dataItems, setDataItems] = useState(data);
  const [toggleOption, setToggleOption] = useState('All');
  //sorting
  const [value, setValue] = React.useState<any>('lastModifiedDateTime');
  const [secondValue, setSecondValue] = React.useState<any>(null);
  const [threeValue, setThreeValue] = React.useState<any>(null);
  const [ascending, setAscending] = useState<boolean>(false);

  const filterData = () => {
    const sort = dataItems.sort((a: any, b: any) => {
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
    setDataItems([...sort]);
  };
  useEffect(() => {
    filterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ascending, value, secondValue, threeValue]);

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
  const column = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      sortColumn: false,
      headerRender: (text: string) => {
        return (
          <Stack sx={{ width: '2.34375vw', textAlign: 'center' }}>{text}</Stack>
        );
      },
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ width: '2.34375vw', textAlign: 'center' }}>
            {index + 1}
          </Stack>
        );
      },
    },
    {
      title: 'Application #',
      dataIndex: 'application',
      key: 'application',
      sortColumn: true,
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
            onClick={() => handleSortByName('application', '', '')}
          >
            <Box sx={{ width: '8vw' }}>{text}</Box>
            {value === 'application' && (
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
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      sortColumn: false,
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              width: '9.375vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('customerName', '', '')}
          >
            {text}
            {value === 'customerName' && (
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
      render: (text: string) => {
        return <Stack sx={{ width: '9.375vw' }}>{text}</Stack>;
      },
    },
    {
      title: 'Channel Type',
      dataIndex: 'channelType',
      key: 'channelType',
      sortColumn: false,
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              width: '9.375vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('channelType', '', '')}
          >
            {text}
            {value === 'channelType' && (
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
      render: (text: string) => {
        return <Stack sx={{ width: '9.375vw' }}>{text}</Stack>;
      },
    },
    {
      title: 'Date & Time',
      dataIndex: 'lastModifiedDateTime',
      key: 'lastModifiedDateTime',
      sortColumn: false,
      headerRender: (text: string) => {
        return (
          <Stack
            sx={{
              width: '9.375vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              cursor: 'pointer',
            }}
            onClick={() => handleSortByName('lastModifiedDateTime', '', '')}
          >
            {text}
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
      render: (text: string) => {
        return <Stack sx={{ width: '9.375vw' }}>{text}</Stack>;
      },
    },
    {
      title: 'Copy Link',
      dataIndex: 'copyLink',
      key: 'copyLink',
      sortColumn: false,
    },
    {
      title: '',
      dataIndex: 'copyIcon',
      key: 'copyIcon',
      sortColumn: false,
      render: (text: string, row: any) => {
        return (
          <Stack
            onClick={() => onClickCopyIcon(text, row)}
            sx={{ width: '30px', textAlign: 'center' }}
          >
            {getPermission(
              actionAllowedItem,
              'DEV_SUPPORT',
              'ACCESS_LIBRARY',
              'COPY_LINKS'
            ) && text}
          </Stack>
        );
      },
    },
  ];
  const toggleOptionHandleChange = (value: any) => {
    setToggleOption(value.title);
  };
  const toggleOptions = [
    { title: 'Bank' },
    { title: 'DSA' },
    { title: 'Fintech' },
  ];
  return (
    <Box className="access-library-container-model">
      <Box className="header-box">
        <ScreenHeader
          title="Access Library"
          info="Copy a text link of any channel from here."
          showBackButton={false}
        />
      </Box>
      <Divider />
      <Box className="search-container">
        <Box className="search-box">
          <SearchIcon className="search-icon" />
          <InputBase placeholder="Search by ..." />
        </Box>
        <Box>
          <GroupButton
            data={toggleOptions}
            onChange={(arg1: any) => toggleOptionHandleChange(arg1)}
          />
        </Box>
      </Box>
      <Stack sx={{ margin: '30px 0' }}>
        <ListTable column={column} data={dataItems} />
      </Stack>
      {accessModal && (
        <CustomModal
          openSuccess={accessModal}
          handleCloseSuccess={() => setAccessModal(false)}
          successModalTitle={'Share the link'}
          accessLibraryLink={accessLink}
          accessLibraryMsg={'Here you can copy the link and share it'}
          org_ID={'#12345'}
          org_Name={'Ganesh Agency'}
          channel_type={'DSA'}
          accessLibraryModaBtn={'Link to share'}
          duplicateRoleCloseBtn={' Close'}
          accessLibraryCopyLinkBtn={'Copy Link'}
        />
      )}
    </Box>
  );
};
export default AccessLibrary;
