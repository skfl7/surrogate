import { dataList } from '../../../interface/Types';
import { TabBar } from '../../../components/commonComponent/customTab/CustomTab';
import LMSList from './lmsList';
import { Stack } from '@mui/material';
import './style.scss';
import { useLocation } from 'react-router-dom';
import { LMSHistoryLog } from './lmsHistoryLog/lmsHistoryLog';

function LMSRule() {
  const TabListData: dataList = [
    {
      id: '1',
      data: 'LMS Rule',
      component: <LMSList />,
      isDisabled: false,
      path: '/lms/lmsRule',
    },
    {
      id: '2',
      data: 'History Log',
      component: <LMSHistoryLog />,
      isDisabled: false,
      path: '/lms/lmsRule/historyLog',
    },
  ];

  const location = useLocation();
  console.log('location?.state?.activeTab', location?.state?.activeTab);
  return (
    <Stack className="lms-rule-main-container">
      <TabBar
        data={TabListData}
        // activeTab={location?.state?.activeTab ?? '1'}
        tab="lmsRule"
      />
    </Stack>
  );
}

export default LMSRule;
