import { useLocation } from 'react-router-dom';
import { dataList } from '../../../../interface/Types';
import { TabBar } from '../../../../components/commonComponent/customTab/CustomTab';
import RoleCreationTab from '../roleCreationTab';
import '../style.scss';
import { AuthorisationLevel } from '../screens/AuthorisationLevel';
import { HistoryLog } from '../screens/HistoryLogScreen';

export const RoleCreation = () => {
  const location = useLocation();
  const TabListData: dataList = [
    {
      id: '1',
      data: 'Role Creation',
      component: <RoleCreationTab />,
      isDisabled: false,
      path:
        location.pathname === '/userManagement/' ||
        location.pathname === '/userManagement'
          ? location.pathname
          : location.pathname === '/userManagement/roleCreation/' ||
            location.pathname === '/userManagement/roleCreation'
          ? location.pathname
          : '/userManagement/roleCreation',
    },
    {
      id: '2',
      data: 'Authorization Level',
      component: <AuthorisationLevel />,
      isDisabled: false,
      path: '/userManagement/roleCreation/authorizationLevel',
    },
    {
      id: '3',
      data: 'History Log',
      component: <HistoryLog comingfrom={'roleCreation'} />,
      isDisabled: false,
      path: '/userManagement/roleCreation/historyLog',
    },
  ];

  return (
    <div className="role-creation-dashboard">
      <div className="role-creation-main-container">
        <TabBar data={TabListData} tab="roleCreationTab" />
      </div>
    </div>
  );
};
