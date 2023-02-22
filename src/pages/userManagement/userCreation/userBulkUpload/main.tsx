import { dataList } from '../../../../interface/Types';
import { TabBar } from '../../../../components/commonComponent/customTab/CustomTab';

import { HistoryLog } from '../../roleCreation/screens/HistoryLogScreen';
import UserBulkUpload from '.';

function BulkUploadMain() {
  const TabListData: dataList = [
    {
      id: '1',
      data: 'User Creation',
      component: <UserBulkUpload />,
      isDisabled: false,
    },
    {
      id: '2',
      data: 'History Log',
      component: <HistoryLog comingFrom={'userCreation'} />,
      isDisabled: false,
    },
  ];

  return (
    <div className="user-creation-main-container">
      <TabBar data={TabListData} tab="userCreationBulkUploadMain" />
    </div>
  );
}

export default BulkUploadMain;
