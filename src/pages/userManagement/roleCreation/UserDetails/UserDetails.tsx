import { dataList } from '../../../../interface/Types';
import { TabBar } from '../../../../components/commonComponent/customTab/CustomTab';
import '../style.scss';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import LMS from './LMS';
import RiskManagement from './RiskManagement';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import { Box, Stack } from '@mui/material';

export const UserDetails = () => {
  localStorage.getItem('checkTab');
  const TabListData: dataList = [
    {
      id: '1',
      data: 'Product Management',
      component: <ProductManagement />,
      isDisabled: false,
      path: '/userManagement/roleCreation/userdetails/productManagement',
    },
    {
      id: '2',
      data: 'User Management',
      component: <UserManagement />,
      isDisabled: false,
      path: '/userManagement/roleCreation/userdetails/userManagement',
    },
    {
      id: '3',
      data: 'LMS',
      component: <LMS />,
      isDisabled: false,
      path: '/userManagement/roleCreation/userdetails/lms',
    },
    {
      id: '4',
      data: 'Risk Management',
      component: <RiskManagement />,
      isDisabled: false,
      path: '/userManagement/roleCreation/userdetails/riskManagement',
    },
  ];

  return (
    <Stack>
      <Stack sx={{ paddingTop: '30px' }}>
        <Box className="role-header-container">
          <ScreenHeader
            title="Authorization level - Users Details"
            info="From here, you can assign authorization to users."
            showBackButton={true}
          />
        </Box>
        <TabBar data={TabListData} tab={'checkTab'} />
      </Stack>
    </Stack>
  );
};
