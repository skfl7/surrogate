import { useLocation } from 'react-router-dom';
import { TabBar } from '../../../../components/commonComponent/customTab/CustomTab';
import { dataList } from '../../../../interface/Types';
import { ProgramManagementScreen } from '../screens/programMmgt';
import { ProgrammeHistoryLog } from '../screens/ProgrammeHistoryLog';

function ProgramManagement() {
  const location = useLocation();
  const TabListData: dataList = [
    {
      id: '1',
      data: 'Programme Management',
      component: <ProgramManagementScreen />,
      isDisabled: false,
      path:
        location.pathname === '/productManagement/' ||
        location.pathname === '/productManagement'
          ? location.pathname
          : '/productManagement/programmeManagement',
    },

    {
      id: '2',
      data: 'History Log',
      component: <ProgrammeHistoryLog />,
      isDisabled: false,
      path: '/productManagement/programmeManagement/historyLog',
    },
    // {
    //   id: '3',
    //   data: 'Reviewer Log',
    //   component: <ReviewerLog />,
    //   isDisabled: false,
    // },
  ];
  return (
    <>
      <TabBar data={TabListData} tab="programManagement" />
    </>
  );
}

export default ProgramManagement;
