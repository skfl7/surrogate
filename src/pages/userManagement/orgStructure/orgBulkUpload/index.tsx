import React, { useState } from 'react';
import { Box } from '@mui/material';
import { bulkUpload } from '../../../../utils/Constants';
import './index.scss';
import UploadUser from './orgUpload/OrgUpload';
import OrgBulkList from './orgBulkList/OrgBulkList';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import PageLayout from '../../../../components/layout/pageLayout/pageLayout';
import { url } from '../../../../utils/constants/url';

const OrgBulkUpload = ({ flag }: any) => {
  const [openUpload, setOpenUpload] = useState(true);
  const [openList, setOpenList] = useState(false);
  const [file, setFile] = useState('xls');
  const [uploadResult, setUploadResult] = useState('');

  const handleToggle = (listVisibility: boolean, result: string) => {
    setOpenList(listVisibility);
    setOpenUpload(!listVisibility);
    setUploadResult(result);
    // setFile(check);
  };

  const handleDownloadSample = () => {
    console.log('handleDownloadSample');
    const href = url.DEV_URL + url.ORG_DOWNLOAD_SAMPLE;
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
    uploadType: `${url.BULK_ORGANISATION}organizationUploadExcel`,
    upload: bulkUpload.UPLOAD_FILE,
  };

  return (
    <Box className="bulk-upload-container">
      <Box className="bulk-upload-header">
        <ScreenHeader
          title={bulkUpload.BULK_UPLOAD_ORG_HEAD}
          info={bulkUpload.BULK_UPLOAD_ORG_SUBHEAD}
          showBackButton={true}
        />
      </Box>
      <Box className="upload-card-main-container">
        {openUpload && (
          <PageLayout>
            <UploadUser
              toggle={(arg1: boolean, arg2: string) => handleToggle(arg1, arg2)}
              data={uploadData}
              fileName={'xls'}
              accept={'.xlsx'}
              handleDownloadSampleFile={handleDownloadSample}
            />
          </PageLayout>
        )}
        {openList && (
          <OrgBulkList fileCheck={'xls'} uploadResult={uploadResult} />
        )}
      </Box>
    </Box>
  );
};

export default OrgBulkUpload;
