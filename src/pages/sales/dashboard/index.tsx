import { useLocation } from 'react-router-dom';
import './dashboard.scss';
import DsaPage from './dsaPage/dsa';
import { dataList } from '../../../interface/Types';
import { TabBar } from '../../../components/commonComponent/customTab/CustomTab';

function Dashboard() {
  const location = useLocation();
  const TabListData: dataList = [
    {
      id: '1',
      data: 'DSA',
      component: <DsaPage />,
      isDisabled: false,
      path:
        location.pathname === '/sales/' || location.pathname === '/sales'
          ? location.pathname
          : location.pathname === '/sales/salesDashboard/' ||
            location.pathname === '/sales/salesDashboard'
          ? location.pathname
          : '/sales/salesDashboard',
    },
    {
      id: '2',
      data: 'Fintech Partners',
      component: <DsaPage />,
      isDisabled: false,
      path: '/sales/salesDashboard/fintechPartners',
    },
    {
      id: '3',
      data: 'Bank Divisions',
      component: <DsaPage />,
      isDisabled: false,
      path: '/sales/salesDashboard/bankDivisions',
    },
  ];

  return (
    <div className="sales-dashboard">
      <div className="sales-main-container">
        <TabBar data={TabListData} tab="salesDashboard" />
      </div>
    </div>
  );
}

export default Dashboard;
