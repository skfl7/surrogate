import { dataList } from '../../../interface/Types';
import { TabBar } from '../../../components/commonComponent/customTab/CustomTab';
import UsersList from './usersList';
import './style.scss';
import { USerCreationHistoryLog } from './HistoryLog';

function UserCreation() {
  const TabListData: dataList = [
    {
      id: '1',
      data: 'User Creation',
      component: <UsersList />,
      isDisabled: false,
      path: '/userManagement/userCreation',
    },
    {
      id: '2',
      data: 'History Log',
      component: <USerCreationHistoryLog />,
      isDisabled: false,
      path: '/userManagement/userCreation/historyLog',
    },
  ];

  return (
    <div className="user-creation-main-container">
      <TabBar data={TabListData} tab="userCreationTab" />
    </div>
  );
}

export default UserCreation;
