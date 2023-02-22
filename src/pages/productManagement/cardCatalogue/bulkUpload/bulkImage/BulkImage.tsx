import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import '../bulkList/BulkList.scss';

// MUI components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// upload related components
import UploadCard from '../uploadCard/UploadCard';

// Utils
import { bulkUpload } from '../../../../../utils/Constants';

// common components
import PageLayout from '../../../../../components/layout/pageLayout/pageLayout';
import CustomModal from '../../../../../components/commonComponent/customModal/CustomModal';
import CommonTable from '../../../../../components/commonComponent/commonTable/CommonTable';

// Services
import {
  cardUploadConfirmation,
  getCardUploadedImages,
} from '../../../../../services/cardCatalogueServices';
import ErrorMessage from '../../../../../components/commonComponent/ErrorMessage';
import localforage from 'localforage';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '600px',
  bgcolor: 'background.paper',
  // border: '1px solid #000',
  borderRadius: '4px',
  // boxShadow: 1,
  padding: '20px',
};

export default function BulkImage(props: {
  toggle: Function;
  fileCheck: string;
  uploadResult?: any;
}) {
  const [listType, setListType] = useState(
    props.uploadResult.failure !== 0 ? 'error' : 'all'
  );
  const [userID, setUserId] = useState<string>();

  useEffect(() => {
    getLocalStorageID();
  }, []);
  const getLocalStorageID = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setUserId(value.id);
    } catch (err) {
      console.log(err);
    }
  };

  const column = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return <Stack>{index + 1}</Stack>;
      },
    },
    {
      title: listType !== 'valid' ? 'Error Details' : '',
      dataIndex: 'errorDetails',
      key: 'errorDetails',
      isError: listType !== 'valid' ? false : true,
      render: (_: string, row: any, index: number) => {
        // let arr = row.bulkUploadImageStatus.split('|');
        // let arr1 = arr.filter((str: any) => str !== '');
        // let singleValue = row.bulkUploadImageStatus;
        // console.log(arr, 'row');

        return (
          <Stack>
            {/* {
            arr.length > 2 ? (
              <div>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>
                    Multi Error
                  </Typography>
                  <img
                    src={infoIcon}
                    alt={infoIcon}
                    style={{ cursor: 'pointer' }}
                    onClick={handleOpen}
                  />
                </Box>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Box>
                      <Typography
                        id="modal-modal-title"
                        sx={{
                          borderBottom: '1px solid #36363624',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#555759',
                          padding: '0px 0px 16px',
                        }}
                      >
                        
                        Multi Error
                      </Typography>
                      <Box sx={{ paddingTop: 1 }}>
                        {arr1.map((item: any, indexValue: any) => {
                          return (
                            <Typography
                              sx={{ fontSize: '13px', padding: '16px 0px 8px' }}
                            >
                              {`${indexValue + 1}.${item}`}
                            </Typography>
                          );
                        })}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        sx={{
                          textTransform: 'capitalize',
                          color: '#0662B7',
                          borderColor: '#0662B7',
                          padding: '4px 21px',
                          // backgroundColor: '#0662B7',
                          // color: 'blue',
                          // '&:hover': {
                          //   backgroundColor: '#0662B7',
                          // },
                        }}
                        onClick={handleClose}
                      >
                        Close
                      </Button>
                    </Box>
                  </Box>
                </Modal>
              </div>
            ) : arr.length === 1 ? (
              <Stack>{singleValue}</Stack>
            ) : (
              <Stack> {listType != 'valid' ? '--' : ''}</Stack>
            )}
            ) : ( */}
            <Stack>{row.reason}</Stack>
            {/* )} */}
          </Stack>
        );
      },
    },
    {
      title: 'Card Name',
      dataIndex: 'cardName',
      key: 'cardName',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {(row.card && row.card.cardName) ||
              (row.error && row.error?.cardName) ||
              '--'}
          </Stack>
        );
      },
    },
    {
      title: 'Surrogate Name',
      dataIndex: 'surrogateName',
      key: 'surrogateName',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {(row.card && row.card.surrogateType) ||
              (row.error && row.error?.surrogateType) ||
              '--'}
          </Stack>
        );
      },
    },
    {
      title: 'Card Mode',
      dataIndex: 'cardMode',
      key: 'cardMode',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {(row.card && row.card.cardModeName) ||
              (row.error && row.error?.cardMode) ||
              '--'}
          </Stack>
        );
      },
    },
    {
      title: 'Card Type',
      dataIndex: 'cardType',
      key: 'cardType',
      isError: false,
      render: (_: string, row: any, index: number) => {
        console.log('cardType:', row);
        return (
          <Stack>
            {(row.card && row.card.cardTypeName) ||
              (row.error && row.error?.cardType) ||
              '--'}
          </Stack>
        );
      },
    },
    {
      title: 'Interest Rate',
      dataIndex: 'interestRate',
      key: 'interestRate',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {(row.card && row.card.interestRate) ||
              (row.error && row.error?.interestRate) ||
              '--'}
          </Stack>
        );
      },
    },
    {
      title: 'Extra Card',
      dataIndex: 'extraCard',
      key: 'extraCard',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {(row.card && row.card.addOnCard) ||
            (row.error && row.error.addOnCard)
              ? 'Applicable'
              : 'Not-Applicable'}
          </Stack>
        );
      },
    },
    {
      title: 'CIBIL Score',
      dataIndex: 'cibilScore',
      key: 'cibilScore',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {(row.card && row.card.cibil) ||
              (row.error && row.error?.cibil) ||
              '--'}
          </Stack>
        );
      },
    },
    {
      title: 'Salary Limit',
      dataIndex: 'salaryLimit',
      key: 'salaryLimit',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {(row.card && row.card.salary) ||
              (row.error && row.error?.salary) ||
              '--'}
          </Stack>
        );
      },
    },
    {
      title: 'ITR Limit',
      dataIndex: 'itrLimit',
      key: 'itrLimit',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {(row.card && row.card.itr) ||
              (row.error && row.error?.itr) ||
              '--'}
          </Stack>
        );
      },
    },
  ];

  // Styles
  const ColorButton = styled(ToggleButton)(({ theme }) => ({
    backgroundColor: ' rgb(240, 240, 240)',
    border: ' rgb(240, 240, 240) 1px ',
    color: 'black',
    textTransform: 'capitalize',
    '&.Mui-selected, &.Mui-selected:hover': {
      color: 'white',
      backgroundColor: '#1976d2',
    },
  }));

  const footerStyle = {
    backgroundColor: 'white',
    marginTop: '24px',
    padding: '25px 32px 20px',
    position: 'fixed',
    bottom: 0,
    right: 0,
    width: ' 100%',
    boxShadow:
      '0px 2px 10px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
  };

  // State variables
  const navigate = useNavigate();
  const [correctionState, setCorrectionState] = useState(
    props.uploadResult.failure !== 0 ? false : true
  );
  const [resultOfUpload, setResultOfUpload] = useState(props.uploadResult);
  const [progress, setProgress] = useState(0);
  // const [listType, setListType] = useState(
  //   props.uploadResult.failure !== 0 ? 'error' : 'all'
  // );
  const [isImageUploadSuccess, setIsImageUploadSuccess] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [openDiscard, setOpenDiscard] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 0,
  });
  const [totalCount, setTotalCount] = useState({
    totaLNoOfRecords: 0,
    totalNoOfPages: 0,
  });
  const [apiError, setApiError] = useState('');
  const [errorMessage, setErrorMessage] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Linear progress html
  function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
  ) {
    return (
      <Box>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            {...props}
            color={
              progress !== 100
                ? 'secondary'
                : correctionState
                ? 'success'
                : 'error'
            }
            sx={{
              backgroundColor: ' #e6e7e7',
              height: '8px',
              borderRadius: '5px',
            }}
          />
        </Box>
        <Box
          sx={{
            minWidth: 35,
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 2,
          }}
        >
          <Typography variant="body2">{`${Math.round(
            props.value
          )}% Completed`}</Typography>
        </Box>
      </Box>
    );
  }

  // useEffect calls

  // const didMount = useRef(false);
  useEffect(() => {
    // if (!didMount.current) {
    //   didMount.current = true;
    //   return;
    // } else
    fetchCardList();
  }, [pagination, listType]);

  // API call methods

  const getUploadedImageData = async (payload: any) => {
    let res = {};
    await getCardUploadedImages(payload, {
      onUploadProgress: (data: any) => {
        //Set the progress value to show the progress bar
        data.total && setProgress(Math.round((100 * data.loaded) / data.total));
      },
    })
      .then((response) => {
        res = response.data ? response.data : {};
      })
      .catch((err) => {
        console.log(err);
        res = { error: err?.response?.data };
        setApiError('Something went wrong! Please try again after sometime');
      });
    return res;
  };

  const prepareCardList = (responseData: any) => {
    const result = responseData?.result;
    if (result && result.content && Array.isArray(result.content)) {
      setDataList(result.content);
      setTotalCount({
        totaLNoOfRecords: result?.totalElements,
        totalNoOfPages: result?.totalPages,
      });
    } else if (responseData.error && responseData.error.error)
      console.log('API error! ', responseData.error.error);
  };

  const fetchCardList = async () => {
    const payload = {
      id: props.uploadResult.refNumber,
      page: pagination.pageNumber,
      size: pagination.pageSize,
    } as any;
    if (listType === 'error') payload.bulkUploadStatus = 'FAILURE';
    else if (listType === 'valid') payload.bulkUploadStatus = 'SUCCESS';
    const result = await getUploadedImageData(payload);
    prepareCardList(result);
  };

  // Pagination methods

  const onPageChange = (pageNo: number) => {
    setPagination({
      ...pagination,
      pageNumber: pageNo,
    });
  };

  const onPageSizeChange = (size: number) => {
    if (size === -1) {
      setPagination({
        ...pagination,
        pageSize: totalCount.totaLNoOfRecords,
      });
    } else
      setPagination({
        ...pagination,
        pageSize: size,
      });
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => {
    setListType(value);
  };

  const handleDiscard = () => {
    setOpenDiscard(true);
  };

  const CloseModalAndGoToListScreen = () => {
    setIsImageUploadSuccess(false);
    navigate('/productManagement/cardCatalogue');
  };

  const confirmCardUpload = (callback: Function) => {
    const payload = {
      bulkUploadId: props.uploadResult?.refNumber,
      actionUserId: userID,
    };
    cardUploadConfirmation(payload)
      .then((response) => {
        callback('success');
      })
      .catch((err) => {
        console.log(err);
        setApiError('Something went wrong! Please try again after sometime');
      });
  };

  const handleSubmitToReviewer = () => {
    if (progress === 100 && correctionState) {
      confirmCardUpload((apiResponse: string) => {
        if (apiResponse === 'success') {
          setIsImageUploadSuccess(true);
        }
      });
    }
  };

  const handleDiscardMissingAndUpload = () => {
    confirmCardUpload((apiResponse: string) => {
      if (apiResponse === 'success') {
        setOpenDiscard(false);
        setIsImageUploadSuccess(true);
      }
    });
  };

  const progressBar = {
    borderRadius: '10px',
    height: '8px',
  };

  const imageCardData = {
    title: bulkUpload.UPLOAD_CARD,
    para: bulkUpload.UPLOAD_MISSING_CARD,
    supportedFormats: bulkUpload.SUPPORTED_FORMATS_JPG,
    upload: bulkUpload.UPLOAD_MISSING_PHOTO,
    uploadType: 'v1/bulkimage/cardBulkUpload',
  };

  const handleCancel = () => {
    setOpenCancelModal(false);
    props.toggle(true);
  };
  const boxCenter = {
    display: 'flex',
    alignItems: 'center',
  };

  const callProgress = () => {
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          fetchCardList();
          clearInterval(timer);
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);
  };

  const updateDataListAfterCorrection = (newUploadResult: any) => {
    setResultOfUpload(newUploadResult);
    if (newUploadResult?.failure !== 0) {
      console.log('newUploadResult--', newUploadResult);
      setCorrectionState(false);
    } else if (newUploadResult?.success === newUploadResult?.total) {
      setCorrectionState(true);
    }
    setListType('error');
    callProgress();
  };

  return (
    <PageLayout className="bulk-card-photo">
      <Box sx={{ padding: '2% 0' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: '2%',
          }}
        >
          <Typography sx={{ fontSize: '19.2px' }}>
            {progress === 100
              ? `Card Upload Completed - ${props.uploadResult?.success} Cards out of ${props.uploadResult?.total} Cards`
              : 'Matching Card photo...'}
          </Typography>
          <CloseIcon color="secondary" />
        </Box>

        <LinearProgressWithLabel
          variant="determinate"
          value={progress}
          sx={progressBar}
        />
      </Box>
      <Divider />
      <Box
        sx={{
          padding: '2% 0',
          boxSizing: 'unset',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '5%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '5%',
            width: '65%',
          }}
        >
          <Box sx={boxCenter}>
            {/* <Typography variant="h6" sx={{ fontSize: '1rem' }}>
              File Name:
              {(progress === 100 && props.uploadResult?.fileName) || ''}
            </Typography> */}
          </Box>
          <Box sx={boxCenter}>
            <Typography variant="h6" sx={{ fontSize: '16px' }}>
              Record Found: {progress === 100 && resultOfUpload?.total}
            </Typography>
          </Box>
          <Box sx={boxCenter}>
            <Typography variant="h6" sx={{ fontSize: '16px' }}>
              Valid Records:
              {progress === 100 && resultOfUpload?.success}
            </Typography>
          </Box>
          <Box sx={boxCenter}>
            <Typography variant="h6" sx={{ fontSize: '16px' }}>
              Errors Found: {progress === 100 && resultOfUpload?.failure}
            </Typography>
          </Box>
        </Box>
        {progress !== 100 && (
          <Alert
            severity="warning"
            icon={
              <CircularProgress
                color="inherit"
                sx={{ width: '20px !important', height: '20px !important' }}
              />
            }
          >
            validating the uploaded documents
          </Alert>
        )}
        {progress === 100 && !correctionState && (
          <Alert severity="error">
            {resultOfUpload?.failure} Errors found in Uploaded File
          </Alert>
        )}
        {correctionState && progress === 100 && (
          <Alert severity="success">No Error found</Alert>
        )}
      </Box>
      <Divider />
      <Box
        sx={{
          margin: '1% 0',
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        {progress === 100 && (
          <ToggleButtonGroup
            color="primary"
            value={listType}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ColorButton value="all">All</ColorButton>
            <ColorButton value="valid">Valid</ColorButton>
            <ColorButton value="error">Missing</ColorButton>
          </ToggleButtonGroup>
        )}
      </Box>
      {progress > 0 && (
        <Box
          sx={{
            margin: '2% 0',
            display:
              progress === 100 && correctionState && listType === 'error'
                ? 'none'
                : 'block',
          }}
        >
          {progress === 100 && (
            <CommonTable
              // sx={{
              //   backgroundColor:
              //     progress === 100 && correctionState && listType === 'error'
              //       ? 'red'
              //       : 'pink',
              // }}
              column={column}
              data={dataList}
              pagination={{
                ...pagination,
                ...totalCount,
                onPageChange: onPageChange,
                onPageSizeChange: onPageSizeChange,
              }}
              errorKey="bulkUploadImageStatus"
            />
          )}
          {/* {progress !== 100 && (
            <CommonTable
              column={column}
              data={data1}
              pagination={{
                ...pagination,
                ...totalCount,
                onPageChange: onPageChange,
                onPageSizeChange: onPageSizeChange,
              }}
            />
          )} */}
        </Box>
      )}
      {progress === 100 && correctionState && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: '18px' }}>
            *No error found in the uploaded file*
          </Typography>
        </Box>
      )}

      {progress === 100 && !correctionState && (
        <UploadCard
          toggle={(arg1: boolean, arg2: string, newUploadResult: any) =>
            updateDataListAfterCorrection(newUploadResult)
          }
          data={imageCardData}
          fileName={props.fileCheck}
          // handleDownloadSampleFile={handleDownloadErrorFile}
          accept={'.png, .jpg'}
          bulkUploadResult={props.uploadResult}
        />
      )}

      {progress === 100 && (
        <>
          <Box sx={footerStyle}>
            <Box
              sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1%' }}
            >
              <Button
                variant="outlined"
                onClick={() => setOpenCancelModal(!openCancelModal)}
                sx={{ textTransform: 'capitalize' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                // color="secondary"
                onClick={handleSubmitToReviewer}
                sx={{
                  '&:hover': {
                    backgroundColor:
                      progress === 100 && correctionState
                        ? ' #0662B7'
                        : '#82B1DB',
                  },
                  backgroundColor:
                    progress === 100 && correctionState
                      ? ' #0662B7'
                      : '#82B1DB',
                  textTransform: 'capitalize',
                }}
              >
                {!correctionState ? 'Proceed' : 'Submit to reviewer'}
              </Button>
            </Box>
            {!correctionState && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1%',
                  marginTop: '1%',
                }}
              >
                <Button
                  variant="text"
                  color="secondary"
                  onClick={handleDiscard}
                  sx={{ fontSize: '12px', textTransform: 'capitalize' }}
                >
                  {`Discard Error entries and Continue >`}
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}

      <CustomModal
        openSuccess={isImageUploadSuccess}
        handleCloseSuccess={CloseModalAndGoToListScreen}
        successModalTitle={'Card Catalogue is Uploaded Successfully'}
        successModalMsg={
          '  Card Catalogue has been successully sent to the reviewer'
        }
        btn={' Close'}
      />

      <CustomModal
        openSuccess={openDiscard}
        handleCloseSuccess={() => setOpenDiscard(!openDiscard)}
        handleSuccess={handleDiscardMissingAndUpload}
        successModalTitle={'Do You want to discard?'}
        discardModalMsg={
          'Want to discard uploading missing card photos and continue the bulk upload'
        }
        yesContinueBtn={'Yes, Continue'}
        closeBtn={'Close'}
      />

      <CustomModal
        openSuccess={openCancelModal}
        handleCloseSuccess={() => setOpenCancelModal(!openCancelModal)}
        handleSuccess={handleCancel}
        successModalTitle={'Do You want to Cancel Bulk upload?'}
        discardModalMsg={
          'Want to discard cancel upload and go back to list screen?'
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
    </PageLayout>
  );
}
