import React, { useEffect, useState } from 'react';

// MUI components
import {
  Box,
  Button,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

// common components
import DragDrop from '../../../../../components/commonComponent/dragDrop/DragDrop';

// Styles
import './UserUpload.scss';

// Utils
import { secureApi } from '../../../../../services/xhr';
import { url } from '../../../../../utils/constants/url';
import ErrorMessage from '../../../../../components/commonComponent/ErrorMessage';
import ErrorModal from '../../../../../components/commonComponent/customModal/ErrorModal';

const UploadUser = (props: {
  toggle: Function;
  data: any;
  correction?: Function;
  fileName: string;
  uploadProgressValue?: Function;
  handleDownloadSampleFile?: Function;
  bulkUploadResult?: any;
  accept: string;
}) => {
  const { toggle, data, fileName, handleDownloadSampleFile, bulkUploadResult } =
    props;
  const [progress, setProgress] = useState(0);
  const [apiError, setApiError] = useState('');
  const [apiErrorMsg, setApiErrorMsg] = useState('');
  const [openErrorModal, setopenErrorModal] = useState(false);

  useEffect(() => {
    setopenErrorModal(apiErrorMsg != '');
  }, [apiErrorMsg]);

  const handleCloseSuccess = () => {
    setopenErrorModal(false);
    setProgress(0);
    setApiErrorMsg('');
  };

  function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
  ) {
    return (
      <Box>
        <Box className="progress-container">
          <Box className="upload-card-progress-text">
            <Typography variant="body2">{`${Math.round(
              props.value
            )}% Completed`}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            {...props}
            sx={{
              '& .MuiLinearProgress-bar1Determinate': {
                backgroundColor: openErrorModal ? 'red' : 'green',
              },
            }}
            className="upload-card-progress"
          />
        </Box>
      </Box>
    );
  }

  const handleError = (err: any) => {
    if (err?.exception?.fieldErrors) {
      const missingFields = err?.exception.fieldErrors?.map(
        (field: string) => `${field}, `
      );
      setApiError(missingFields);
      setApiErrorMsg(missingFields);
    } else if (err?.exception?.shortMessage) {
      setApiError(err?.exception?.shortMessage);
      setApiErrorMsg(err?.exception?.shortMessage);
    } else if (err?.error) {
      setApiError(err?.error + ' ' + err?.path);
      setApiErrorMsg(err?.error + ' ' + err?.path);
    } else setApiError('Something went wrong!');
  };

  // upload api calls

  const uploadClick = (data: any) => {
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          uploadFile(data);
          clearInterval(timer);
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);
  };

  const uploadFile = (formData: any) => {
    if (fileName === 'image' && bulkUploadResult) {
      formData.append('bulkUploadId', bulkUploadResult.refNumber);
    }
    secureApi
      .post(url.DEV_URL + data.uploadType, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (data) => {
          //Set the progress value to show the progress bar
          data.total &&
            setProgress(Math.round((100 * data.loaded) / data.total));
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.result) {
          toggle(true, response.data.result);
        } else handleError(response?.data ?? '');
      })
      .catch((err) => {
        console.log(err);
        handleError(err?.response?.data ?? '');
      });
  };

  return (
    <>
      <Box className="upload-card-container">
        <Typography variant="h2" className="upload-card-head">
          {data.title}
        </Typography>
        <Typography
          className="upload-card-subhead"
          sx={{
            color: progress > 0 ? '#D3D3D3' : '',
          }}
        >
          {data.para}
        </Typography>
        {fileName === 'xls' && (
          <Button
            variant="text"
            // color={progress > 0 ? ' #82B1DB' : 'secondary'}
            style={{
              color: progress > 0 ? ' #82B1DB' : '#0662B7',
              textTransform: 'capitalize',
            }}
            disabled={progress > 0 ? true : false}
            startIcon={
              <FileDownloadOutlinedIcon
                sx={{
                  fontSize: '24px !important',
                  color: progress > 0 ? ' #82B1DB' : '#0662B7',
                }}
              />
            }
            onClick={() => {
              handleDownloadSampleFile && handleDownloadSampleFile();
            }}
          >
            {data.downloadSample}
          </Button>
        )}

        <DragDrop
          // progress={handleProgress}
          progressValue={progress}
          supportedFiles={data.supportedFormats}
          buttonText={data.upload}
          sendFile={uploadClick}
          accept={props.accept}
          fileType={fileName}
          openErrorModal={openErrorModal}
        />
        <LinearProgressWithLabel variant="determinate" value={progress} />
        {apiError.length !== 0 && (
          <ErrorMessage
            message={apiError}
            handleClose={() => setApiError('')}
            severity="error"
            duration={5000}
          />
        )}

        {openErrorModal && (
          <ErrorModal
            openSuccess={openErrorModal}
            handleCloseSuccess={handleCloseSuccess}
            ErrorMessageTitle={'Oops! Something Went wrong! Try again '}
            ErrorMessage={apiErrorMsg}
            ErrorMsgButton={'Try Again'}
          />
        )}
      </Box>
    </>
  );
};

export default UploadUser;
