import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
import CustomModal from '../../../../../components/commonComponent/customModal/CustomModal';

// Styles
import './UploadCard.scss';

// Utils
import { secureApi } from '../../../../../services/xhr';
import { url } from '../../../../../utils/constants/url';
import ErrorMessage from '../../../../../components/commonComponent/ErrorMessage';
import ErrorModal from '../../../../../components/commonComponent/customModal/ErrorModal';

const UploadCard = (props: {
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
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [openDiscard, setOpenDiscard] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiErrorMsg, setApiErrorMsg] = useState('');
  const [openErrorModal, setopenErrorModal] = useState(false);

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

  const handleCancel = () => {
    setOpenDiscard(!openDiscard);
    navigate('/productManagement/cardCatalogue');
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

  const footerStyle = {
    backgroundColor: 'white',
    marginTop: '24px',
    padding: '25px 32px 20px',
    position: 'fixed',
    bottom: 0,
    right: 0,
    width: ' 100%',
    // borderTop: ' 1px solid black',
    boxShadow:
      '0px 2px 10px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
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
        // onUploadProgress: (data) => {
        //   //Set the progress value to show the progress bar
        //   data.total &&
        //     setProgress(Math.round((100 * data.loaded) / data.total));
        // },
      })
      .then((response) => {
        if (response.data.result) {
          toggle(true, fileName, response.data.result);
        } else handleError(response?.data ?? '');
      })
      .catch((err) => {
        console.log(err);
        handleError(err?.response?.data ?? '');
      });
  };

  useEffect(() => {
    setopenErrorModal(apiErrorMsg != '');
  }, [apiErrorMsg]);

  const handleCloseSuccess = () => {
    //todo need to check
    setopenErrorModal(false);
    setProgress(0);
    setApiErrorMsg('');
  };

  return (
    <>
      {/* <PageLayout> */}
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
      {fileName === 'image' && (
        <Box sx={footerStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1%' }}>
            <Button
              variant="outlined"
              sx={{ textTransform: 'capitalize' }}
              onClick={() => setOpenDiscard(!openDiscard)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              // onClick={handleProceed}
              disabled
              sx={{
                backgroundColor: '#82B1DB',
                textTransform: 'capitalize',
              }}
            >
              {'Proceed'}
            </Button>
          </Box>
        </Box>
      )}

      <CustomModal
        openSuccess={openDiscard}
        handleCloseSuccess={() => setOpenDiscard(!openDiscard)}
        handleSuccess={handleCancel}
        successModalTitle={'Do You want to discard?'}
        discardModalMsg={
          'Want to discard uploading document and continue the bulk upload organisation'
        }
        yesContinueBtn={'Yes, Continue'}
        closeBtn={'Close'}
      />

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

export default UploadCard;
