import { TabBar } from '../../../components/commonComponent/customTab/CustomTab';
import { dataList } from '../../../interface/Types';
import ReTargetingHistory from './screens/historyScreen/reTargetingHistory';
import ReTargeting from './screens/reTargetingScreen/reTargeting';

function Retargeting() {
  const TabListData: dataList = [
    {
      id: '1',
      data: 'Re-Targeting',
      component: <ReTargeting />,
      isDisabled: false,
      path: '/lms/retargeting',
    },

    {
      id: '2',
      data: 'Re-Targeting History',
      component: <ReTargetingHistory />,
      isDisabled: false,
      path: '/lms/retargeting/historyLog',
    },
  ];
  return (
    <>
      <TabBar data={TabListData} tab="lmsRetargeting" />
    </>
  );
}

export default Retargeting;
