import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import '../index.scss';
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  Snackbar,
  Stack,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import infoIcon from '../../../../../assets/images/wrong_Info.svg';
import './OrgBulkList.scss';

// upload related components
import UploadUser from '../orgUpload/OrgUpload';

// Utils
import { bulkUpload } from '../../../../../utils/Constants';

// common components
import CustomModal from '../../../../../components/commonComponent/customModal/CustomModal';
import CommonTable from '../../../../../components/commonComponent/commonTable/CommonTable';

// Services
import {
  cardUploadConfirmation,
  getCardUploadedData,
} from '../../../../../services/cardCatalogueServices';
import { url } from '../../../../../utils/constants/url';
import {
  getOrgUploadedData,
  orgUploadConfirmation,
} from '../../../../../services/orgStructureServices';
import GroupButton from '../../../../../components/commonComponent/GroupButton/GroupButton';
import localforage from 'localforage';

const style = {
  maxWidth: '320px',
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

export default function BulkList(props: {
  toggle?: Function;
  fileCheck: string;
  uploadResult?: any;
}) {
  const [listType, setListType] = useState<any>('Error');
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
      title: 'Error Details',
      dataIndex: 'errorDetails',
      key: 'errorDetails',
      isError: listType !== 'Valid' ? false : true,
      render: (_: string, row: any, index: number) => {
        let arr = row.reason.split('|');
        let arr1 = arr.filter((str: any) => str !== '');
        let singleValue = row.reason.replace('|', '');
        return (
          <Stack sx={{ minWidth: { sm: '100px', lg: '' } }}>
            {arr.length > 2 ? (
              <div className="uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu">
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>
                    Multi Error
                  </Typography>
                  <img
                    src={infoIcon}
                    alt={infoIcon}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpen(row.id)}
                  />
                </Box>
                <Modal
                  open={open === row.id}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style} className="bulk-upload-multi-error ">
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
                        {' '}
                        Multi Error
                      </Typography>{' '}
                      {/* <Divider sx={{ paddingY: 1 }} /> */}
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
            ) : arr.length === 2 ? (
              <Stack>{singleValue}</Stack>
            ) : (
              <Stack> {listType != 'Valid' ? '--' : ''}</Stack>
            )}
          </Stack>
        );
      },
    },
    {
      title: 'Company Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ minWidth: { sm: '150px', lg: '' } }}>
            {' '}
            {(row.organization &&
              row.organization.supplierDetails?.supplierName) ||
              (row.error && row.error?.supplierName) ||
              '--'}
          </Stack>
        );
      },
    },
    {
      title: 'Company Registration No.',
      dataIndex: 'companyRegistration',
      key: 'companyRegistration',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ minWidth: { sm: '200px', lg: '' } }}>
            {(row.organization &&
              row?.organization?.supplierDetails?.companyRegistration) ||
              (row.error && row.error?.registerNumber) ||
              '--'}
          </Stack>
        );
      },
    },
    {
      title: 'Surrogate Name',
      dataIndex: 'surrogateTypeList',
      key: 'surrogateTypeList',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ minWidth: { sm: '150px', lg: '' } }}>
            {(row.organization && row?.organization?.surrogateTypeList) ||
              (row.error && row.error?.surrogateTypeList) ||
              '--'}
          </Stack>
        );
      },
    },
    {
      title: 'Cities Of Operation',
      dataIndex: 'operatingCity',
      key: 'operatingCity',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ minWidth: { sm: '150px', lg: '' } }}>
            {(row.organization &&
              row?.organization?.supplierDetails?.operatingCity) ||
              (row.error && row.error?.supplierDetails?.operatingCity) ||
              '--'}
          </Stack>
        );
      },
    },
    {
      title: 'Telephone No.',
      dataIndex: 'tellNumber',
      key: 'tellNumber',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack sx={{ minWidth: { sm: '150px', lg: '' } }}>
            {(row.organization &&
              row?.organization?.supplierDetails?.tellNumber) ||
              (row.error && row.error?.tellNumber) ||
              '--'}
          </Stack>
        );
      },
    },
    {
      title: 'Email ID',
      dataIndex: 'email',
      key: 'email',
      isError: false,
      render: (_: string, row: any, index: number) => {
        return (
          <Stack>
            {(row.organization && row?.organization?.supplierDetails?.email) ||
              (row.error && row.error?.email) ||
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
    props?.uploadResult?.failureCount !== 0 ? false : true
  );
  const [resultOfUpload, setResultOfUpload] = useState(props.uploadResult);
  const [progress, setProgress] = useState(0);
  // const [listType, setListType] = useState(
  //   props?.uploadResult?.failureCount !== 0 ? 'error' : 'all'
  // );
  // const [listType, setListType] = useState(
  // 'error'
  // );
  // const [imageUpload, setImageUpload] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [openDiscard, setOpenDiscard] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 0,
  });
  const [totalCount, setTotalCount] = useState({
    totaLNoOfRecords: 0,
    totalNoOfPages: 0,
  });
  const toggleOptions = [
    { title: 'All' },
    { title: 'Valid' },
    { title: 'Error' },
  ];
  const [apiError, setApiError] = useState('');
  const [errorMessage, setErrorMessage] = useState(true);
  // const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const [open, setOpen] = useState('');
  const handleOpen = (id: string) => setOpen(id);
  const handleClose = () => setOpen('');

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
              height: { sm: '6px', md: '8px' },
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
          <Typography variant="body2" fontSize={{ sm: '0.8em', md: '1em' }}>
            {' '}
            {`${Math.round(props.value)}% Completed`}
          </Typography>
        </Box>
      </Box>
    );
  }

  const callProgress = () => {
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          fetchOrgList();
          clearInterval(timer);
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);
  };

  // useEffect calls

  const didMount = useRef(false);
  useEffect(() => {
    // if (!didMount.current) {
    //   didMount.current = true;
    //   return;
    // } else
    callProgress();
  }, []);

  useEffect(() => {
    // if (!didMount.current) {
    //   didMount.current = true;
    //   return;
    // } else
    fetchOrgList();
  }, [listType, pagination]);

  // API call methods

  const getUploadedCardData = async (payload: any) => {
    let res = {};
    await getOrgUploadedData(payload, {
      // onUploadProgress: (data: any) => {
      //   //Set the progress value to show the progress bar
      //   data.total && setProgress(Math.round((100 * data.loaded) / data.total));
      // },
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

  useEffect(() => {
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);
  }, []);

  const fetchOrgList = async () => {
    const payload = {
      bulkUploadId: props.uploadResult.refNumber,
      page: pagination.pageNumber,
      size: pagination.pageSize,
    } as any;
    if (listType === 'Error') payload.bulkUploadStatus = 'FAILURE';
    else if (listType === 'Valid') payload.bulkUploadStatus = 'SUCCESS';
    const result = await getUploadedCardData(payload);
    prepareCardList(result);
  };

  // Handle change methods

  const handleDownloadErrorFile = () => {
    const href =
      url.DEV_URL +
      url.BULK_ORGANISATION +
      'orgDownloadFailureExcel/' +
      props.uploadResult.refNumber;
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', 'myfile.xlsx');
    document.body.appendChild(link);
    link.click();
    // downloadFailureExcel(props.uploadResult.refNumber)
    //   .then((response) => {
    //     console.log('response', response);
    //     const url = window.URL.createObjectURL(new Blob([response.data]));
    //     const link = document.createElement('a');
    //     console.log('linkkkkk:', url);
    //     // link.href = url;
    //     // link.setAttribute(
    //     //   'download',
    //     //   response &&
    //     //     response.headers &&
    //     //     response?.headers['content-disposition'].split('filename=')[1]
    //     //   // 'Error_file.xlsx'
    //     // );
    //     // document.body.appendChild(link);
    //     // link.click();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
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
    // event: React.MouseEvent<HTMLElement>,
    value: any
  ) => {
    console.log(value, 'handle change');
    setListType(value.title);
  };

  const handleDiscard = () => {
    setOpenDiscard(true);
  };

  const handleProceed = () => {
    if (progress === 100 && correctionState) {
      handleContinue();
    }
  };

  const confirmOrgUpload = (callback: Function) => {
    const payload = {
      bulkUploadId: props.uploadResult?.refNumber,
      actionUserId: userID,
    };
    orgUploadConfirmation(payload)
      .then((response) => {
        callback('success', response.data);
      })
      .catch((err) => {
        console.log(err);
        setApiError('Something went wrong! Please try again after sometime');
      });
  };

  const handleContinue = () => {
    confirmOrgUpload((apiResponse: string, responseData: any) => {
      if (apiResponse === 'success') {
        setOpenDiscard(false);
        setOpenSuccessModal(true);
        setModalMessage(
          responseData?.result?.message || 'Organisation Uploaded Successfully'
        );
      }
    });
  };
  const progressBar = {
    borderRadius: '10px',
    height: '8px',
  };

  const uploadData = {
    title: bulkUpload.CORRECTION_FILE,
    para: bulkUpload.DOWNLOAD_SAMPLE_CSV_XLS,
    downloadSample: bulkUpload.DOWNLOAD_ERROR_FILE,
    supportedFormats: bulkUpload.SUPPORTED_FORMATS,
    upload: bulkUpload.UPLOAD_CORRECTION_FILE,
    uploadType: `${url.BULK_ORGANISATION}organizationFailureExcelUpload`,
  };
  const CloseModalAndGoToListScreen = () => {
    setOpenSuccessModal(false);
    navigate('/userManagement/orgStructure');
  };
  const handleCancel = () => {
    setOpenCancelModal(false);
    navigate('/userManagement/orgStructure');
  };
  const boxCenter = {
    display: 'flex',
    alignItems: 'center',
  };

  const updateDataListAfterCorrection = (newUploadResult: any) => {
    setResultOfUpload(newUploadResult);
    if (newUploadResult?.failureCount !== 0) {
      setCorrectionState(false);
    } else {
      setCorrectionState(true);
    }
    setListType('Error');
    callProgress();
  };

  return (
    <>
      <Box
        sx={{
          padding: { sm: '20px', md: '30.45px 38.4px' },
          backgroundColor: 'white',
          marginBottom: '80px',
        }}
      >
        <Box sx={{ padding: '2% 0' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '2%',
            }}
          >
            <Typography sx={{ fontSize: { sm: '15px', md: '22px' } }}>
              {progress === 100
                ? 'Validated'
                : 'Validating Uploaded Document...'}
            </Typography>
            <CloseIcon
              color="secondary"
              sx={{ fontSize: { sm: '16px', md: '19.2px' } }}
            />
          </Box>

          <LinearProgressWithLabel
            variant="determinate"
            value={progress}
            sx={progressBar}
          />
        </Box>
        <Divider />
        <Box className="orgfileMessage">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { sm: 'column', md: 'row' },
              gap: '5%',
              width: { sm: '100%', md: '65%' },
            }}
          >
            <Box sx={boxCenter}>
              <Typography
                variant="h6"
                sx={{ fontSize: { sm: '14px', md: '16px' } }}
              >
                File Names: {progress === 100 && resultOfUpload?.fileName}
              </Typography>
            </Box>
            <Box sx={boxCenter}>
              <Typography
                variant="h6"
                sx={{ fontSize: { sm: '14px', md: '16px' } }}
              >
                Record Found:
                {progress === 100 &&
                  resultOfUpload?.successCount + resultOfUpload?.failureCount}
              </Typography>
            </Box>
            <Box sx={boxCenter}>
              <Typography
                variant="h6"
                sx={{ fontSize: { sm: '14px', md: '16px' } }}
              >
                Valid Records:
                {progress === 100 && resultOfUpload?.successCount}
              </Typography>
            </Box>
            <Box sx={boxCenter}>
              <Typography
                variant="h6"
                sx={{ fontSize: { sm: '14px', md: '16px' } }}
              >
                Errors Found: {progress === 100 && resultOfUpload?.failureCount}
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
              Validating the uploaded documents
            </Alert>
          )}
          {progress === 100 && !correctionState && (
            <Alert severity="error" sx={{ margin: { sm: '2% 0', md: '' } }}>
              {resultOfUpload?.failureCount} Errors found in Uploaded File
            </Alert>
          )}
          {correctionState && progress === 100 && (
            <Alert severity="success">No Error found</Alert>
          )}
        </Box>
        <Divider />
        <Box
          className="orgGroupButton"
          sx={
            {
              // margin: '1% 0',
              // display: 'flex',
              // justifyContent: 'flex-end',
              // width: '100%',
            }
          }
        >
          {progress === 100 && (
            <GroupButton data={toggleOptions} onChange={handleChange} />
          )}
        </Box>
        {progress > 0 && (
          <Box
            sx={{
              margin: '2% 0',
              display:
                progress === 100 && correctionState && listType === 'Error'
                  ? 'none'
                  : 'block',
            }}
          >
            {progress === 100 && (
              <CommonTable
                column={column}
                data={dataList}
                pagination={{
                  ...pagination,
                  ...totalCount,
                  onPageChange: onPageChange,
                  onPageSizeChange: onPageSizeChange,
                }}
                errorKey="bulkUploadStatus"
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '50px',
            }}
          >
            <Typography sx={{ fontSize: '15px' }}>
              *No error found in the uploaded file*
            </Typography>
          </Box>
        )}
      </Box>
      {progress === 100 && !correctionState && (
        <Box sx={{ margin: ' 30.45px 0 60.9px' }}>
          <UploadUser
            toggle={(isList: boolean, uploadResult: any) => {
              updateDataListAfterCorrection(uploadResult);
            }}
            data={uploadData}
            fileName={props.fileCheck}
            handleDownloadSampleFile={handleDownloadErrorFile}
            accept={'.xlsx'}
          />
        </Box>
      )}

      {progress === 100 && (
        <Box sx={footerStyle}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: { sm: 'space-between', md: 'flex-end' },
              gap: { sm: '2%', md: '1%' },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpenCancelModal(true)}
              sx={{
                textTransform: 'capitalize',
                width: { sm: '49%', md: 'initial' },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleProceed}
              sx={{
                backgroundColor:
                  progress === 100 && correctionState ? ' #0662B7' : '#82B1DB',
                textTransform: 'capitalize',
                width: { sm: '49%', md: 'initial' },
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
      )}

      <CustomModal
        openSuccess={openDiscard}
        handleCloseSuccess={() => setOpenDiscard(false)}
        handleSuccess={handleContinue}
        successModalTitle={'Do You want to discard?'}
        discardModalMsg={
          'Want to discard corrections for error entires in the excel sheet and continue upload photos'
        }
        yesContinueBtn={'Yes, Continue'}
        closeBtn={'Close'}
      />
      <CustomModal
        openSuccess={openSuccessModal}
        handleCloseSuccess={CloseModalAndGoToListScreen}
        successModalTitle={'Organisation is Uploaded Successfully'}
        successModalMsg={modalMessage}
        btn={' Close'}
      />
      <CustomModal
        openSuccess={openCancelModal}
        handleCloseSuccess={() => setOpenCancelModal(false)}
        handleSuccess={handleCancel}
        successModalTitle={'Do You want to Cancel Bulk upload?'}
        discardModalMsg={
          'Want to discard the entires in the excel sheet and Go back to list screen?'
        }
        yesContinueBtn={'Yes, Continue'}
        closeBtn={'Close'}
      />
      {apiError.length !== 0 && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setApiError('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {apiError}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
