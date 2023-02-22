import React, { useState, useEffect } from 'react';

// MUI components
import { Box } from '@mui/material';

// Style
import './index.scss';

// User upload related files
import UploadUser from './userUpload/UserUpload';
import UserBulkList from './userBulkList/UserBulkList';

// Common components
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import PageLayout from '../../../../components/layout/pageLayout/pageLayout';

// Utils and constants
import { url } from '../../../../utils/constants/url';
import { bulkUpload } from '../../../../utils/Constants';
import { useLocation, useNavigate } from 'react-router-dom';
import localforage from 'localforage';

const UserBulkUpload = ({ flag }: any) => {
  const navigate = useNavigate();

  const [openUpload, setOpenUpload] = useState(true);
  const [openList, setOpenList] = useState(false);

  const [uploadResult, setUploadResult] = useState('');
  const [organizationID, setorganizationId] = useState('');

  useEffect(() => {
    getLocalStorageValue();
  }, []);
  const getLocalStorageValue = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setorganizationId(value?.organization.id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggle = (listVisibility: boolean, result: string) => {
    setOpenList(listVisibility);
    setOpenUpload(!listVisibility);
    setUploadResult(result);
  };

  const { state } = useLocation();
  const gobackFun = () => {
    navigate('/userManagement/userCreation', {
      state: state.filteredData,
    });
  };

  const handleDownloadSample = () => {
    console.log('handleDownloadSample', organizationID);
    const href = `${url.DEV_URL}${url.BULK_USER}downloadUserSampleExcel/${organizationID}`;
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', 'sample.xlsx');
    document.body.appendChild(link);
    link.click();
  };

  const uploadData = {
    title: bulkUpload.UPLOAD_DOCUMENTS,
    para: bulkUpload.DOWNLOAD_SAMPLE_CSV_XLS,
    downloadSample: bulkUpload.DOWNLOAD_SAMPLE,
    supportedFormats: bulkUpload.SUPPORTED_FORMATS,
    uploadType: `${url.BULK_USER}userCreationUploadExcel`,
    upload: bulkUpload.UPLOAD_FILE,
  };

  return (
    <Box className="bulk-upload-container">
      <Box className="bulk-upload-header">
        <ScreenHeader
          title={bulkUpload.BULK_UPLOAD_USER_HEAD}
          info={bulkUpload.BULK_UPLOAD_USER_SUBHEAD}
          showBackButton={true}
          gobackFun={gobackFun}
        />
      </Box>
      <Box className="upload-card-main-container">
        {openUpload && (
          <PageLayout>
            <UploadUser
              toggle={(arg1: boolean, uploadResult: any) =>
                handleToggle(arg1, uploadResult)
              }
              data={uploadData}
              fileName={'xls'}
              accept={'.xlsx'}
              handleDownloadSampleFile={handleDownloadSample}
            />
          </PageLayout>
        )}
        {openList && (
          <UserBulkList
            toggle={(arg1: boolean, uploadResult: any) =>
              console.log('tcfvhgh')
            }
            fileCheck={'xls'}
            uploadResult={uploadResult}
          />
        )}
      </Box>
    </Box>
  );
};

export default UserBulkUpload;
