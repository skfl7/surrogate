import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI components
import { Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// UI components
import BulkList from '../bulkUpload/bulkList/BulkList';
import UploadCard from '../bulkUpload/uploadCard/UploadCard';
import { bulkUpload } from '../../../../utils/Constants';

import './index.scss';
import BulkImage from './bulkImage/BulkImage';
import PageLayout from '../../../../components/layout/pageLayout/pageLayout';
import { url } from '../../../../utils/constants/url';

const BulkUpload = ({ flag }: any) => {
  const navigate = useNavigate();
  const [openUpload, setOpenUpload] = useState(true);
  const [openList, setOpenList] = useState(false);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [openImageUploadList, setOpenImageUploadList] = useState(false);
  // const [file, setFile] = useState('xls');
  const [uploadResult, setUploadResult] = useState('');

  const handleToggle = (
    listVisibility: boolean,
    fileType: any,
    result: string
  ) => {
    setOpenList(listVisibility);
    setOpenUpload(!listVisibility);
    setUploadResult(result);
  };
  const uploadData = {
    title: bulkUpload.UPLOAD_CARD_DETAILS,
    para: bulkUpload.DOWNLOAD_SAMPLE_CSV_XLS,
    downloadSample: bulkUpload.DOWNLOAD_SAMPLE,
    supportedFormats: bulkUpload.SUPPORTED_FORMATS,
    upload: bulkUpload.UPLOAD_FILE,
    uploadType: 'v1/bulkcard/cardUploadExcel',
  };
  const uploadImage = {
    title: bulkUpload.UPLOAD_CARD,
    // para: bulkUpload.UPLOAD_MISSING_CARD,
    supportedFormats: bulkUpload.SUPPORTED_FORMATS_JPG,
    upload: bulkUpload.UPLOAD_CARD_PHOTO,
    uploadType: 'v1/bulkimage/cardBulkUpload',
  };

  const handleDownloadSample = () => {
    const href = url.DEV_URL + url.BULK_CARD_SERVICES + 'downloadSampleExcel';
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', 'myfile.xlsx');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Box className="bulk-upload-container">
      <Box className="bulk-upload-header">
        <Box sx={{ display: 'flex' }}>
          <ArrowBackIcon
            color="secondary"
            className="arrowBtn"
            onClick={() => navigate(-1)}
          />
          <Box sx={{ paddingLeft: '10px' }}>
            <Typography variant="subtitle1" sx={{ letterSpacing: 0.5 }}>
              {bulkUpload.BULK_UPLOAD_CARD_CATALOGUE_HEAD}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                letterSpacing: 0.2,
                color: '#AFAEAF',
                paddingBottom: '20px',
              }}
            >
              {bulkUpload.BULK_UPLOAD_CARD_CATALOGUE_SUBHEAD}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="upload-card-main-container">
        {openUpload && (
          <PageLayout>
            <UploadCard
              toggle={(
                listVisibility: boolean,
                fileType: string,
                result: string
              ) => handleToggle(listVisibility, fileType, result)}
              data={uploadData}
              fileName={'xls'}
              accept={'.xlsx'}
              handleDownloadSampleFile={handleDownloadSample}
            />
          </PageLayout>
        )}
        {openList && (
          <BulkList
            toggle={() => {
              setOpenImageUpload(true);
              setOpenList(false);
            }}
            fileCheck={'xls'}
            uploadResult={uploadResult}
          />
        )}

        {openImageUpload && (
          <UploadCard
            toggle={(
              listVisibility: boolean,
              fileType: string,
              result: string
            ) => {
              setOpenImageUploadList(listVisibility);
              setUploadResult(result);
              setOpenImageUpload(!listVisibility);
            }}
            data={uploadImage}
            fileName={'image'}
            bulkUploadResult={uploadResult}
            accept={'.png, .jpg'}
          />
        )}

        {openImageUploadList && (
          <BulkImage
            toggle={(dataListVisibility: boolean) => {
              // setOpenImageUpload(!dataListVisibility);
              // setOpenList(dataListVisibility);
              navigate('/productManagement/cardCatalogue');
            }}
            fileCheck={'image'}
            uploadResult={uploadResult}
          />
        )}
      </Box>
    </Box>
  );
};

export default BulkUpload;
