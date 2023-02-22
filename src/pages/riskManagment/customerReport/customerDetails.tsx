import { Stack, Box, Button, Grid, Typography } from '@mui/material';
import { ScreenHeader } from '../../../components/commonComponent/ScreenHeader/ScreenHeader';
import { riskChannnelData } from '../riskManagement.const';
import './style.scss';
import DownloadIcon from '../../../assets/icons/download_icon.svg';
import MailIcon from '../../../assets/icons/mail_icon.svg';
import { ReactComponent as PassIcon } from '../../../assets/icons/risk_mgmt_pass.svg';
import { ReactComponent as ApprovedIcon } from '../../../assets/icons/approved_risk_mngm_icon.svg';
import { ReactComponent as RejectedIcon } from '../../../assets/icons/risk_rejected_icon.svg';
import { ReactComponent as ReferIcon } from '../../../assets/icons/risk_refer_icon.svg';
import { ReactComponent as FailIcon } from '../../../assets/icons/risk_fail_icon.svg';
import { ReactComponent as M2PGoodIcon } from '../../../assets/icons/m2p_credit_score_good.svg';
import { ReactComponent as M2PBadIcon } from '../../../assets/icons/m2p_credit_score_bad.svg';
import { ReactComponent as M2PModerateIcon } from '../../../assets/icons/m2p_credit_score_moderate.svg';
import DetailsCard from '../../../components/commonComponent/DetailsCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { FooterButton } from '../../../components/commonComponent/FooterButton/FooterButton';
import { RiskMngmtAccordian } from '../../../components/commonComponent/RiskMngmtAccordian';
import { useState, useEffect } from 'react';
import CustomModal from '../../../components/commonComponent/customModal/CustomModal';
import GaugeChart from 'react-gauge-chart';
import localforage from 'localforage';
import { getPermission } from '../../../utils/ActionAllowed/UserActionAllowed';

export default function CustomerDetailScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [statusText, setStatusText] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [forceRejectionModal, setForceRejectionModal] = useState(false);
  const [okForceRejectionModal, setOKForceRejectionModal] = useState(false);
  const [forceApprovalModal, setForceApprovalModal] = useState(false);
  const [okForceApprovalModal, setOKForceApprovalModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [okApprovalModal, setOKApprovalModal] = useState(false);
  const [rejectionModal, setrejectionModal] = useState(false);
  const [okRejectionModal, setOKRejectionModal] = useState(false);
  const [showHowItsCalculatedModal, setHowItsCalulatedModal] = useState(false);
  const [displayCategories, setDisplayCategories] = useState<any>(
    state?.scoreData
  );
  const [cashFlowData, setCashlowData] = useState<any>(state?.cashFlowData);
  const [riskAccordianData, setRiskAccordianData] = useState<any>(
    state?.riskMngmtViewContent
  );
  const [textAreaValue, setTextAreaValue] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  const [actionAllowedItem, setActionAllowedItem] = useState([]);

  useEffect(() => {
    getLocalStorageValue();
  }, []);

  const getLocalStorageValue = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setActionAllowedItem(value?.actionsAllowed);
    } catch (err) {
      console.log(err);
    }
  };

  const textareaonchangeFun = (e: any) => {
    setButtonDisabled(textAreaValue.length > 6 ? false : true);
    setTextAreaValue(e.target.value);
  };

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (state) {
      setStatusText(state.statusText);
      setButtonText(state.modalText);
    }
  }, [state]);

  const handleEditRoleClick = () => {
    if (statusText === 'Approved') {
      setForceRejectionModal(true);
    } else if (statusText === 'Rejected') {
      setForceApprovalModal(true);
    }
  };

  var bgColor = '';
  var txtColor = '';

  if (cashFlowData.customerCreditScore >= 750) {
    bgColor = '#F1F9F3';
    txtColor = '#32A64D';
  } else if (
    cashFlowData.customerCreditScore < 750 &&
    cashFlowData.customerCreditScore > 450
  ) {
    bgColor = '#FEFBF3';
    txtColor = '#E4AC04';
  } else if (cashFlowData.customerCreditScore < 450) {
    bgColor = '#FDF1F2';
    txtColor = '#E63946';
  }

  const gobackFun = () => {
    navigate('/riskManagement', {
      state: true,
    });
  };

  return (
    <Stack className="risk-mngmt-customer-details">
      <Stack>
        <Box className="upper-head-container">
          <Box className="create-header-container">
            <ScreenHeader
              title="Customer Details / Application No : 1234567890"
              info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer senectus mattis."
              showBackButton={true}
              gobackFun={gobackFun}
            />
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              {statusText === 'Approved' && (
                <Button
                  startIcon={<ApprovedIcon />}
                  className="status-approved-text"
                >
                  {statusText}
                </Button>
              )}
              {statusText === 'Rejected' && (
                <Button
                  startIcon={<RejectedIcon />}
                  className="status-rejected-text"
                >
                  {statusText}
                </Button>
              )}
              {statusText === 'Refer' && (
                <Button startIcon={<ReferIcon />} className="status-refer-text">
                  {statusText}
                </Button>
              )}
              <Box className="icons-container">
                <Stack className="each-icon">
                  <img src={DownloadIcon} alt="" />
                </Stack>
                <Stack className="each-icon">
                  <img src={MailIcon} alt="" />
                </Stack>
              </Box>

              {getPermission(
                actionAllowedItem,
                'RISK_MANAGEMENT',
                'RISK_MANAGEMENT_CUSTOMER_REPORT',
                'FORCED_ACTION'
              ) &&
                buttonText.length > 0 && (
                  <Button
                    sx={{ textTransform: 'capitalize', padding: '0' }}
                    color="secondary"
                    onClick={handleEditRoleClick}
                  >
                    {buttonText} {'>'}
                  </Button>
                )}
            </Box>
          </Box>
          <div className="viewpage-detail">
            <div className="underline"></div>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              // gridColumn={2.3}
              // container
              // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              // rowSpacing={2}
              // gap={1.1}
            >
              {displayCategories?.details?.map(
                (eachItem: any, index: number) => {
                  return (
                    <Grid item xs={12} sm={6} md={2.3} lg={2.3} key={index}>
                      <div className="each-info">
                        <div className="info-label">
                          {eachItem?.label ?? '--'}
                        </div>
                        <div className="info-value">
                          {eachItem?.value ?? '--'}
                        </div>
                      </div>
                    </Grid>
                  );
                }
              )}
            </Grid>
          </div>
        </Box>

        <Box className="credit-score-outer-container">
          <Box sx={{ width: '50%' }}>
            <Box className="credit-container1">
              <Box>
                <Typography className="credit-title-text">
                  User Cashflow
                </Typography>
                <Typography className="credit-info-text">
                  Lorem ipsum dolor sit amet consectetur. Phasellus in amet
                  netus at ante. Nunc quam interdum odio consectetur. Fermentum
                  iaculis.
                </Typography>
              </Box>
              <div className="underline"></div>
              <Box className="credit-lower-box">
                <Typography sx={{ fontSize: '20px' }}>
                  Score {cashFlowData.userCashFlowScore}
                  {'/'}
                  {cashFlowData.userCashFlowTotal}
                </Typography>
                <Box className="credit-status-box">
                  {cashFlowData.userCashFlowScore /
                    cashFlowData.userCashFlowTotal >=
                  0.5 ? (
                    <>
                      <Typography className="pass-text">Pass</Typography>
                      <PassIcon />
                    </>
                  ) : (
                    <>
                      <Typography className="fail-text">Fail</Typography>
                      <FailIcon />
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            <Box className="credit-container2">
              <Box>
                <Typography className="credit-title-text">
                  User Cashflow
                </Typography>
                <Typography className="credit-info-text">
                  Lorem ipsum dolor sit amet consectetur. Phasellus in amet
                  netus at ante. Nunc quam interdum odio consectetur. Fermentum
                  iaculis.
                </Typography>
              </Box>
              <div className="underline"></div>
              <Box className="credit-lower-box">
                <Typography sx={{ fontSize: '20px' }}>
                  Score {cashFlowData.userCreditProfileScore}
                  {'/'}
                  {cashFlowData.userCreditProfileTotal}
                </Typography>
                <Box className="credit-status-box">
                  {cashFlowData.userCreditProfileScore /
                    cashFlowData.userCreditProfileTotal >=
                  0.5 ? (
                    <>
                      <Typography className="pass-text">Pass</Typography>
                      <PassIcon />
                    </>
                  ) : (
                    <>
                      <Typography className="fail-text">Fail</Typography>
                      <FailIcon />
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="credit-score-meter-container">
            <Box className="header-container">
              <Typography
                sx={{ fontSize: '16px', fontWeight: '600', color: '#151515' }}
              >
                M2P{'’'}s credit Score
              </Typography>
              <Stack
                className="calculate-text"
                onClick={() => setHowItsCalulatedModal(true)}
              >
                How its Calculated?
              </Stack>
            </Box>
            <Box className="underline" />
            <GaugeChart
              id="gauge-chart2"
              nrOfLevels={18}
              percent={cashFlowData.m2pCreditScore / 1000}
              colors={['#ED747E', '#F8E8B8', '#70C182']}
              needleColor="#0662B7"
              cornerRadius={1}
              needleBaseColor="#82B1DB"
              textColor="none"
              style={{ height: 200 }}
            />
            <Box className="lower-container">
              <Typography sx={{ fontSize: '16px' }}>
                M2P{'’'}s Credit Score is{' '}
              </Typography>
              <Typography className="container-text" sx={{ marginTop: '7px' }}>
                {statusText !== 'Approved' ? ` 400/900` : `700`}
              </Typography>
            </Box>
            <Box className="status-box">
              <Typography
                sx={{ color: txtColor, marginRight: '4px', marginTop: '3px' }}
              >
                {cashFlowData.creditScoreText}
              </Typography>
              {cashFlowData.creditScoreText === 'Good' && <M2PGoodIcon />}
              {cashFlowData.creditScoreText === 'Bad' && <M2PBadIcon />}
              {cashFlowData.creditScoreText === 'Moderate' && (
                <M2PModerateIcon />
              )}
            </Box>
          </Box>
        </Box>

        <Box className="refer-value-container">
          <Box className="left-container">
            <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
              Bank - Refer Value
            </Typography>
            <Typography
              sx={{ fontSize: '34px', color: '#D78320', fontWeight: 'bold' }}
            >
              700 - 749
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: bgColor,
              height: '132px',
              borderRadius: '12px',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
              Customers Credit Score
            </Typography>
            <Typography
              sx={{ fontSize: '34px', color: txtColor, fontWeight: 'bold' }}
            >
              {cashFlowData.customerCreditScore}
            </Typography>
          </Box>
        </Box>

        <Stack>
          <DetailsCard data={riskChannnelData} gridColumn={2.3} />
        </Stack>

        <Stack sx={{ marginTop: '32px' }} mb={13}>
          <RiskMngmtAccordian data={riskAccordianData} />
        </Stack>

        {statusText === 'Refer' &&
        getPermission(
          actionAllowedItem,
          'RISK_MANAGEMENT',
          'RISK_MANAGEMENT_CUSTOMER_REPORT',
          'REFER_APPROVAL_MANAGEMENT'
        ) ? (
          <FooterButton
            cancel="Reject"
            submit="Approve"
            handleSubmitClick={() => setApprovalModal(true)}
            handleCancelClick={() => setrejectionModal(true)}
          />
        ) : (
          <FooterButton
            submit="Close"
            disabled={true}
            handleSubmitClick={goBack}
          />
        )}
        {forceRejectionModal && (
          <CustomModal
            openSuccess={forceRejectionModal}
            handleCloseSuccess={() => setForceRejectionModal(false)}
            handleSuccess={() => {
              setForceRejectionModal(false);
              setOKForceRejectionModal(true);
            }}
            title={'Enter Reason For Force Rejection'}
            textarea_title={'Add Reasons'}
            maxLength={'Maximum of 500 words'}
            close={'Cancel'}
            submit={'Force Reject'}
            textAreaHeight={'230px'}
            textAreaValue={textAreaValue}
            buttonDisabled={buttonDisabled}
            textareaonchangeFun={textareaonchangeFun}
          />
        )}
        {okForceRejectionModal && (
          <CustomModal
            openSuccess={okForceRejectionModal}
            handleCloseSuccess={() => {
              setOKForceRejectionModal(false);
              gobackFun();
            }}
            btn={' Close'}
            rejectedModaltitle={'Application Force Rejection'}
            rejectedModalMsg={
              'Your action of force rejection of application has been successfully sent to the reviewer.'
            }
            modalType={'Success For Rejection'}
          />
        )}
        {forceApprovalModal && (
          <CustomModal
            openSuccess={forceApprovalModal}
            handleCloseSuccess={() => setForceApprovalModal(false)}
            handleSuccess={() => {
              setForceApprovalModal(false);
              setOKForceApprovalModal(true);
            }}
            title={'Enter Reason For Forced Approval'}
            textarea_title={'Add Reasons'}
            maxLength={'Maximum of 500 words'}
            close={'Cancel'}
            submit={'Force Approve'}
            textAreaHeight={'230px'}
            textAreaValue={textAreaValue}
            buttonDisabled={buttonDisabled}
            textareaonchangeFun={textareaonchangeFun}
          />
        )}
        {okForceApprovalModal && (
          <CustomModal
            openSuccess={okForceApprovalModal}
            handleCloseSuccess={() => {
              setOKForceApprovalModal(false);
              gobackFun();
            }}
            btn={' Close'}
            successModalTitle={'Application Force Approval'}
            successModalMsg={
              'Your action of force approval of application has been successfully sent to the reviewer.'
            }
          />
        )}
        {approvalModal && (
          <CustomModal
            openSuccess={approvalModal}
            handleCloseSuccess={() => setApprovalModal(false)}
            handleSuccess={() => {
              setApprovalModal(false);
              setOKApprovalModal(true);
            }}
            title={'Enter Reason For Approval'}
            textarea_title={'Add Reasons'}
            maxLength={'Maximum of 500 words'}
            close={'Cancel'}
            submit={'Approve'}
            textAreaHeight={'230px'}
            textAreaValue={textAreaValue}
            buttonDisabled={buttonDisabled}
            textareaonchangeFun={textareaonchangeFun}
          />
        )}
        {okApprovalModal && (
          <CustomModal
            openSuccess={okApprovalModal}
            handleCloseSuccess={() => {
              setOKForceApprovalModal(false);
              gobackFun();
            }}
            btn={' Close'}
            successModalTitle={'Approved Successfully'}
            successModalMsg={
              'Application no: 123456 has been successfully approved.'
            }
          />
        )}

        {rejectionModal && (
          <CustomModal
            openSuccess={rejectionModal}
            handleCloseSuccess={() => setrejectionModal(false)}
            handleSuccess={() => {
              setrejectionModal(false);
              setOKRejectionModal(true);
            }}
            title={'Enter Reason For Rejection'}
            textarea_title={'Add Reasons'}
            maxLength={'Maximum of 500 words'}
            close={'Cancel'}
            submit={'Reject'}
            textAreaHeight={'230px'}
            textAreaValue={textAreaValue}
            buttonDisabled={buttonDisabled}
            textareaonchangeFun={textareaonchangeFun}
          />
        )}
        {okRejectionModal && (
          <CustomModal
            openSuccess={okRejectionModal}
            handleCloseSuccess={() => {
              setOKRejectionModal(false);
              gobackFun();
            }}
            btn={' Close'}
            rejectedModaltitle={'Application Rejected'}
            rejectedModalMsg={'Application no: 123456 has been rejected.'}
            modalType={'Success For Rejection'}
          />
        )}
        {showHowItsCalculatedModal && (
          <CustomModal
            openSuccess={showHowItsCalculatedModal}
            handleCloseSuccess={() => setHowItsCalulatedModal(false)}
            title={'How Its Calculated?'}
            duplicateRoleCloseBtn={' Close'}
            modalContent={
              'Lorem ipsum dolor sit amet consectetur. Ut velit placerat vestibulum sit sollicitudin nullam nascetur. Nec at sed proin consectetur. Pellentesque id ut blandit scelerisque diam. Duis convallis diam placerat amet. Vestibulum neque consectetur et amet mauris purus nullam iaculis. In adipiscing viverra nunc mattis ultricies cras elit. Tincidunt dictum faucibus interdum cras aliquet. Non lacus.'
            }
          />
        )}
      </Stack>
    </Stack>
  );
}
