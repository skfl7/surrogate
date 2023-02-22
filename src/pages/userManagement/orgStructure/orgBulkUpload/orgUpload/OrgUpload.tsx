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
import ErrorMessage from '../../../../../components/commonComponent/ErrorMessage';

// Styles
import './OrgUpload.scss';

// Utils
import { secureApi } from '../../../../../services/xhr';
import { url } from '../../../../../utils/constants/url';
import ErrorModal from '../../../../../components/commonComponent/customModal/ErrorModal';

const OrgUpload = (props: {
  toggle: Function;
  data: any;
  correction?: Function;
  fileName: string;
  uploadProgressValue?: Function;
  handleDownloadSampleFile?: Function;
  accept: string;
}) => {
  const { toggle, data, fileName, handleDownloadSampleFile } = props;
  const [progress, setProgress] = useState(0);
  const [apiError, setApiError] = useState('');
  const [apiErrorMsg, setApiErrorMsg] = useState('');
  const [openErrorModal, setopenErrorModal] = useState(false);

  useEffect(() => {
    setopenErrorModal(apiErrorMsg != '');
  }, [apiErrorMsg]);

  const handleCloseSuccess = () => {
    // setopenErrorModal(false);
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
            <Typography
              variant="body2"
              fontSize={{ sm: '0.8em', md: '1em' }}
            >{`${Math.round(props.value)}% Completed`}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            {...props}
            sx={{
              '& .MuiLinearProgress-bar1Determinate': {
                backgroundColor: openErrorModal ? '#E63946' : 'green',
              },
              height: { sm: '6px', md: '8px' },
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
    } else {
      setApiError('Something went wrong!');
      setApiErrorMsg('Something went wrong!');
    }
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

    // return () => {
    //   clearInterval(timer);
    // };
  };
  const uploadFile = (formData: any) => {
    secureApi
      .post(url.DEV_URL + data.uploadType, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // onUploadProgress: (data) => {
        //   //Set the progress value to show the progress bar
        //   data.total &&
        //     setProgress(Math.round((100 * data.loaded) / data.total));
        // },
      })
      .then((response) => {
        if (response.data.result) {
          toggle(true, response.data.result);
        } else {
          handleError(response?.data ?? '');
        }
      })
      .catch((err) => {
        console.log(err, 'err');
        handleError(err?.response?.data ?? '');
        //setApiError('Something went wrong! Please try again after sometime');
        //setApiErrorMsg('Something went wrong! Please try again after sometime');
      });
  };

  return (
    <>
      <Box className="upload-org-container">
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
              padding: '6px 0',
            }}
            // disabled={progress > 0 ? true : false}
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
      </Box>

      {apiError.length !== 0 && (
        <ErrorMessage
          message={apiError}
          handleClose={() => setApiError('')}
          severity="error"
          duration={3000}
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
    </>
  );
};

export default OrgUpload;
