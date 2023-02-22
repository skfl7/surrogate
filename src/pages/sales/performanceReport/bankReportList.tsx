import React, { useState, useEffect } from 'react';

import {
  Stack,
  Grid,
  Box,
  Typography,
  FormControl,
  Divider,
} from '@mui/material';
import Dropdown from '../../../components/commonComponent/Dropdown';
import HeaderWithInfo from '../../../components/commonComponent/HeaderWithInfo';
import ChooseCategoryToViewData from '../../../components/commonComponent/ChooseCategoryToViewData';
import BtnContained from '../../../components/commonComponent/CustomText/Button/Contained';
import PerformanceReportTable from '../../../components/commonComponent/LeftColumnFixedTable';
import {
  DSAOrBranchWiseFilterDropdown,
  StateOrZoneWiseFilterDropdown,
  DistrictWiseFilterDropdown,
  ExecutiveWiseFilterDropdown,
  LeadWiseFilterDropdown,
  DSAWiseReportListSecondColumn,
  PerformanceReportListData,
  StateWiseReportListSecondColumn,
  ZonalWiseReportListSecondColumn,
  DistrictWiseReportListSecondColumn,
  BranchWiseReportListSecondColumn,
  LeadWiseReportListSecondColumn,
  ExecutiveWiseReportListSecondColumn,
  CategoryList,
} from './performanceReport.const';
import BtnOutlined from '../../../components/commonComponent/CustomText/Button/Outlined';
import './style.scss';
import Multiselector from '../../../components/commonComponent/MultiSelectNew';

function BankPerformanceReport() {
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('State Wise');

  // const firstColumn = DSAWiseReportListFirstColumn;
  const DSAWiseReportListFirstColumn = [
    {
      title: 'Branch Count',
      dataIndex: 'branchCount',
      key: 'branchCount',
    },
    {
      title: 'Total Applicationts',
      dataIndex: 'totalApplications',
      key: 'totalApplications',
    },
    {
      title: 'Approval Rate (%)',
      dataIndex: 'approvalRate',
      key: 'approvalRate',
    },
    {
      title: 'Acquired Customers',
      dataIndex: 'acquiredCustomers',
      key: 'acquiredCustomers',
    },
    {
      title: 'Rejected Applications',
      dataIndex: 'rejectedApplications',
      key: 'rejectedApplications',
    },
    {
      title: 'Dropped Applications',
      dataIndex: 'droppedApplications',
      key: 'droppedApplications',
    },
  ];
  const secondColumn =
    selectedCategory === 'State Wise'
      ? StateWiseReportListSecondColumn
      : selectedCategory === 'Zonal Wise'
      ? ZonalWiseReportListSecondColumn
      : selectedCategory === 'District Wise'
      ? DistrictWiseReportListSecondColumn
      : selectedCategory === 'Branch Wise'
      ? BranchWiseReportListSecondColumn
      : selectedCategory === 'Lead Wise'
      ? LeadWiseReportListSecondColumn
      : selectedCategory === 'Executive Wise'
      ? ExecutiveWiseReportListSecondColumn
      : DSAWiseReportListSecondColumn;

  const DropdownOptions =
    selectedCategory === 'State Wise' || selectedCategory === 'Zonal Wise'
      ? StateOrZoneWiseFilterDropdown
      : selectedCategory === 'District Wise'
      ? DistrictWiseFilterDropdown
      : selectedCategory === 'Lead Wise'
      ? LeadWiseFilterDropdown
      : selectedCategory === 'Executive Wise'
      ? ExecutiveWiseFilterDropdown
      : DSAOrBranchWiseFilterDropdown;

  useEffect(() => {
    const showTable = localStorage.getItem('bankReportListTable');
    if (showTable === 'true') {
      setIsFiltered(true);
    } else setIsFiltered(false);
  }, [localStorage.getItem('bankReportListTable')]);

  const searchFun = () => {
    setIsFiltered(true);
    localStorage.setItem('bankReportListTable', JSON.stringify(true));
  };

  const resetFun = () => {
    setIsFiltered(false);
    localStorage.setItem('bankReportListTable', JSON.stringify(false));
  };

  return (
    <Stack>
      <Stack className="choose-category-container each-container">
        <FormControl fullWidth>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography className="each-field-label">
                Choose category
              </Typography>
              <Dropdown
                selectedValue={selectedCategory}
                data={CategoryList}
                onSelect={(event: any) => {
                  setSelectedCategory(event.target.value);
                  setIsFiltered(false);
                }}
                label={'Select Report Type'}
              />
            </Grid>
          </Grid>
          <Stack className="underline"></Stack>
          <Grid container spacing={2}>
            {DropdownOptions?.map((eachItem: any, index: number) => {
              return (
                <Grid item xs={3} key={index}>
                  <Typography className="each-field-label">
                    {eachItem?.label}
                  </Typography>
                  <Multiselector options={eachItem?.option} />
                </Grid>
              );
            })}
          </Grid>
          <Box className="button-container">
            <BtnOutlined title="Reset" onClick={resetFun} />
            <BtnContained title="Search" onClick={searchFun} />
          </Box>
        </FormControl>
      </Stack>
      {isFiltered ? (
        <Stack className="each-container" style={{ margin: '0px' }}>
          <HeaderWithInfo
            header={`Bank Data - ${selectedCategory} Performance Report`}
            isInfoEnabled={false}
            info=""
            isDownloadEnabled={true}
          />
          <Divider sx={{ marginY: 2 }} />
          <PerformanceReportTable
            data={PerformanceReportListData}
            listColumn={DSAWiseReportListFirstColumn}
            statusColumn={secondColumn}
            flag="performance-report"
          />
        </Stack>
      ) : (
        <ChooseCategoryToViewData />
      )}
    </Stack>
  );
}

export default BankPerformanceReport;
