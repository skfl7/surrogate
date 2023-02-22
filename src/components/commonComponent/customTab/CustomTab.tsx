import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useEffect, useState } from 'react';
import { dataList, tabList } from '../../../interface/Types';
import { colors } from '../../../style/Color';

type props = {
  data?: dataList;
  tab?: any;
};

export const TabBar = ({ data, tab }: props) => {
  const [value, setValue] = useState<any>('1');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const prevActiveTab = localStorage.getItem(tab);
    if (prevActiveTab !== null) {
      updateParams(prevActiveTab);
    } else {
      updateParams('1');
    }
  }, []);

  useEffect(() => {
    let route = location.pathname;
    const activeTab = data?.find((item) => item.path === route);
    setValue(activeTab?.id);
    updateParams(activeTab?.id);
  }, [location.pathname]);

  const updateParams = (value: any) => {
    localStorage.setItem(tab, value);
    setValue(value);
  };

  const handleChange = (event: React.SyntheticEvent, val: any) => {
    updateParams(val.id);
    setValue(val.id);
    navigate(val.path);
  };

  return (
    <Box>
      {/* sx={{ maxWidth: { sm: 480, md: 'unset' } }}  // Tab scroll   */}
      <TabContext value={value}>
        <Box>
          <TabList
            onChange={handleChange}
            textColor="primary"
            indicatorColor="secondary"
            className="tabContainer"
            variant="scrollable"
            scrollButtons={false}
            aria-label="scrollable auto tabs example"
            sx={{
              backgroundColor: colors.bgGrey,
              padding: { xs: '10px 0px 0px 0px ', md: '30px 30px 0  30px' },
            }}
          >
            {data?.map((item: tabList, index: number) => {
              return (
                <Tab
                  key={index}
                  disabled={item?.isDisabled ?? false}
                  label={<span>{item.data}</span>}
                  value={item}
                  sx={{
                    borderBottom: item.id === value ? '2px solid #0662B7' : '',
                    fontWeight: 400,
                    fontSize: { xs: '12px', md: '16px' },
                    lineHeight: { xs: '15px ', md: '20px' },
                    textTransform: 'capitalize',
                    margin: { xs: '0px 20px', md: '0px 40px 0 0' },
                    padding: { xs: '0px', md: '0px' },
                  }}
                ></Tab>
              );
            })}
          </TabList>
          {data?.map((item: tabList, index: number) => {
            return (
              <TabPanel
                key={index}
                value={item.id}
                sx={{ padding: { xs: '0px' } }}
              >
                {item.component}
              </TabPanel>
            );
          })}
        </Box>
      </TabContext>
    </Box>
  );
};
