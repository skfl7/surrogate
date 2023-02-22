
import { Stack } from '@mui/material';
import { TabBar } from '../../../../components/commonComponent/customTab/CustomTab';
import { dataList } from '../../../../interface/Types';
import { CardCatalogue } from '../screens/CardCatalogue';
import { HistoryLog } from '../screens/HistoryLog';

const LabTabs = () => {
  const TabListData: dataList = [
    {
      id: '1',
      data: 'card catalogue',
      component: <CardCatalogue />,
      isDisabled: false,
      path: '/productManagement/cardCatalogue',
    },
    {
      id: '2',
      data: 'history log',
      component: <HistoryLog />,
      path: '/productManagement/cardCatalogue/historyLog',
    },
  ];
  return (
    <Stack sx={{ backgroundColor: '#eceff2' }}>
      <TabBar data={TabListData} tab="cardCatalogue" />
    </Stack>
  );
};

export default LabTabs;
