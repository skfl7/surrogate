import React, { useEffect, useState } from 'react';
import './reviewCard.scss';
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import EditIcon from '../../../../assets/images/edit_card.svg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Info_Icon from '../../../../assets/images/info_icon.svg';
import Modal from '@mui/material/Modal';
import CardImage from '../../../../assets/images/image 44.png';
import TypoText from '../../../../components/commonComponent/CustomText/Textfield';
import TypographyInfo from '../../../../components/commonComponent/CustomText/Info';
import BtnContained from '../../../../components/commonComponent/CustomText/Button/Contained';

export interface dataList {
  surrogateProgramme: string;
  lastModify: string;
  status: string;
  autoResumeForm: string;
  StatusActiveDate: string;
  activeSince: string;
  id: number;
  resumeItNow: string;
  resumeStatus: string;
}
export interface dataHeaderList {
  surrogateProgramme: string;
  activeSince?: string;
  lastModify?: string;
  status?: string;
  autoResumeForm?: string;
  more?: string;
}
const tableHeaderData = [
  {
    surrogateProgramme: 'Surrogate Programme',
    activeSince: 'Active Since',
    lastModify: 'Last Modified',
    status: 'Status',
    autoResumeForm: 'Auto Resume From',
    more: 'More',
  },
];

const ReviewCard = () => {
  const { state } = useLocation();
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (state) {
      const { record } = state;
      setData(record);
    }
  }, [state]);

  let obj = {
    businessId: '',
    cardName: '',
    interestRate: '',
    maximumCardLimit: '',
    cibilScore: '',
    itrLimit: '',
    salaryLimit: '',
    c4cLimit: '',
    joiningFee: '',
    joiningFeeWavier: '',
    fuelSurchargeWavier: '',
    currencyMarkup: '',
    fuelSurcharge: '',
    fuelSurchargeDescription: '',
    annualFee: '',
    rewardDescription: [{ value: ' ' }],
    keyBenefits: [{ value: ' ' }],
    additionalBenefits: [{ value: ' ' }],
    welcomeBenefits: [{ value: '' }],
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const close = () => {
    navigate('/productManagement/cardCatalogue');
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editData, setEditData] = React.useState(obj);

  const handleValueChange = (e: any, value: any) => {
    setEditData((prev: any) => ({ ...prev, [value]: e }));
  };

  const editPage = () => {
    navigate('/productManagement/cardCatalogue/singleupload');
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '540px',
    height: '380px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    paddingX: 2,
  };

  console.log('data', data);
  return (
    <Box className="reviewCard">
      <Box className="reviewbox1">
        <Box className="head" sx={{ marginBottom: '15px' }}>
          <Box className="headFull">
            <Box onClick={goBack}>
              <ArrowBackIcon className="headback" />
            </Box>
            <Box>
              <TypoText title="Eterna - Platinum (ID No. 12345678)" />
              <TypographyInfo title="From here you can add your new card" />
            </Box>
          </Box>

          <Box className="headIconBox">
            <Button onClick={editPage} className="btn">
              <IconButton className="icon">
                <img
                  src={EditIcon}
                  style={{
                    filter: '',
                  }}
                />
              </IconButton>
              Edit Card
            </Button>
          </Box>
        </Box>
        <Divider />

        <Box className="body">
          <Box className="bodyBox">
            <Card className="card" sx={{ cursor: 'pointer' }}>
              <img className="img" src={CardImage} onClick={handleOpen} />

              {open && (
                <Modal
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="keep-mounted-modal-title"
                  aria-describedby="keep-mounted-modal-description"
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100vw',
                      height: '100vh',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '20px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingBottom: '15px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '16px',
                            color: '#231F20',
                            letterSpacing: '0.001em',
                          }}
                        >
                          Card Photo - Eterna - Platinum
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '16px',
                            color: '#0662B7',
                            letterSpacing: '0.0125em',
                            cursor: 'pointer',
                          }}
                          onClick={handleClose}
                        >
                          Close
                        </Typography>
                      </Box>
                      <Box className="cardImageBox">
                        <img
                          style={{
                            width: '35vw',
                            objectFit: 'contain',
                          }}
                          alt=""
                          src={CardImage}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Modal>
              )}
            </Card>
          </Box>

          <Box>
            <Grid container className="textGrid" spacing={5}>
              <Grid item xs={12} sm={6} md={4}>
                <Box className="businessText">
                  <TypoText color="grey" title="Business ID" />
                  <TypoText
                    handleChange={handleValueChange}
                    id={'businessId'}
                    title={data?.businessId}
                    // disableUnderline={true}
                    // value={data?.businessId}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <TypoText color="grey" title="Card Name" />
                  <TypoText
                    handleChange={handleValueChange}
                    id={'cardName'}
                    title={data?.cardName}
                    // value={data?.cardName}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <TypoText color="grey" title="Interest Rate (in%)" />
                  <TypoText
                    handleChange={handleValueChange}
                    id={'interestRate'}
                    title={data?.interestRate}
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={5}>
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <TypoText color="grey" title="Card Type" />
                  <Typography>Salaried</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <TypoText color="grey" title="Card Mode" />
                  <Typography>General Basic</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <TypoText color="grey" title="Card Category" />
                  <Typography>General</Typography>
                  {/* <Select
                      placeholder="General"
                      variant="outlined"
                      size="small"
                    /> */}
                </Box>
              </Grid>
            </Grid>

            <Grid container className="maximumCardGrid">
              <Grid item xs={12} sm={6} md={4}>
                <Box className="textField">
                  <TypoText color="grey" title="Maximum Card Limit" />
                  <TypoText title={data?.maximumCardLimit} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      <Box className="box2">
        <Box className="surrogateHead">
          <TypoText title=" Surrogate" />
          <img src={Info_Icon} />
          <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna. " />
        </Box>
        <Divider />

        <Box className="surrogateBody">
          <Typography variant="body2" className="title">
            Choose Surrogate
          </Typography>
          <Typography className="text">
            Payroll, Card for Card, CIBIL, AQB
          </Typography>
        </Box>
      </Box>

      <Box className="reviewbox3">
        <Box className="channelHead">
          <TypoText title=" Channels" />
          <img src={Info_Icon} />
          <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
        </Box>
        <Divider />

        <Box className="channelBody">
          <Typography variant="body2" className="title">
            Channels
          </Typography>
          <Typography className="text">Bank, DSA, Fintech Partner</Typography>
        </Box>
      </Box>

      <Box sx={{ backgroundColor: 'white', marginTop: 3, padding: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 1,
            paddingBottom: 2,
          }}
        >
          <TypoText title="Eligibility Criteria " />
          <img src={Info_Icon} />
          <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
        </Box>
        <Divider />

        <Grid container sx={{ marginTop: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              CIBIL Score
            </Typography>
            <Typography sx={{ fontSize: 16 }}>700</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Salary Limit
            </Typography>
            <Typography sx={{ fontSize: 16 }}>40,000.00</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              ITR Limit
            </Typography>
            <Typography sx={{ fontSize: 16 }}>50,000.00</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              C4C Limit
            </Typography>
            <Typography sx={{ fontSize: 16 }}>70,000.00</Typography>
          </Grid>
        </Grid>

        <Grid container sx={{ marginTop: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              AQB Limit (6 Month)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>70,000.00</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              RC (Vehicle Value)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>70,000.00</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 1,
            paddingBottom: 2,
          }}
        >
          <TypoText title=" Add on Card Availability" />
          <img src={Info_Icon} />
          <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
        </Box>
        <Divider />

        <Box
          sx={{
            paddingTop: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
            Add On Card
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
            Applicable
          </Typography>
        </Box>
      </Box>

      <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 2,
            paddingBottom: 2,
          }}
        >
          <TypoText title="Benifits" />
          <img src={Info_Icon} />
          <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
        </Box>
        <Divider />

        <Box
          sx={{ paddingY: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Currency Markup Charges
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>2%</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Currency Markup Description
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>
              3.50% of the transaction value as a foreign currency transaction
              fee.
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', paddingY: 2, gap: '20%' }}>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Airmiles
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>100</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Airmiles Minimum Spends
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>200000</Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
            Air miles Description
          </Typography>
          <Typography sx={{ fontWeight: '500' }}>
            Get 4 Frequent flyer Air miles for every citi prestige reward point
            you transfer to our airline partners
          </Typography>
        </Box>
        <Divider sx={{ padding: 2 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            paddingTop: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '80%',
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
                Cashback
              </Typography>
              <Typography sx={{ fontWeight: '500' }}>2%</Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
                Cashback Minimum Spends
              </Typography>
              <Typography sx={{ fontWeight: '500' }}>200</Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
                Spend Category
              </Typography>
              <Typography sx={{ fontWeight: '500' }}>
                Online Shopping,Flight Tickets,Fuel
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Cashback Description
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>
              5% cashback will be rewarded to you on purchases on movie tickets,
              bill payments, or on any payments made for utilities done through
              citi Billpay. The maximum cashback you will earn is 100 for each
              category{' '}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 2,
          }}
        >
          <TypoText title="Fee & Fee Wavier Details" />
          <img src={Info_Icon} />
          <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
        </Box>
        <Divider sx={{ paddingTop: 2 }} />

        <Box
          sx={{
            paddingY: 2,
            display: 'flex',
            justifyContent: 'space-between',
            width: '80%',
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Joining Fee
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>2%</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Joining Fee Wavier Limit
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>50,000</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Period
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>6 Months</Typography>
          </Box>
        </Box>
        <Box sx={{ paddingY: 2 }}>
          <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
            Joining Fee Description
          </Typography>
          <Typography sx={{ fontWeight: '500' }}>
            Spend 30,000 within 90 days of the card's setup and get the joining
            fee waived off
          </Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            paddingY: 2,
            width: '80%',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Annual Fee
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>1000</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Annual Fee Wavier Limit
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>50000</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Period
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>6 Months</Typography>
          </Box>
        </Box>

        <Box sx={{ paddingY: 2 }}>
          <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
            Annual Fee Description
          </Typography>
          <Typography sx={{ fontWeight: '500' }}>
            Spend 50,000 in a year and get a wavier of next year's annual fee
          </Typography>
        </Box>
        <Divider sx={{ padding: 2 }} />

        <Box
          sx={{
            display: 'flex',
            paddingY: 2,
            width: '80%',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Fuel Surcharge
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>1%</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Fuel Surcharge Wavier Limit
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>250</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Petrol Bunks
            </Typography>
            <Typography sx={{ fontWeight: '500' }}>All Petrol Bunks</Typography>
          </Box>
        </Box>

        <Box sx={{ paddingY: 2 }}>
          <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
            Fuel Surcharge Description
          </Typography>
          <Typography sx={{ fontWeight: '500' }}>
            1% fuel surcharge wavier at all fuel stations across india on
            minimum transaction of 400Max cashback of 250 per statement cycle
          </Typography>
        </Box>
      </Box>

      <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 1,
            paddingBottom: 2,
          }}
        >
          <TypoText title=" Rewards" />
          <img src={Info_Icon} />
          <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
        </Box>
        <Divider />

        <Box
          sx={{
            paddingTop: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
            Reward Description 1
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            sunt alias sequi tempora totam et eos sapiente nisi deserunt veniam
            atque voluptas corporis, distinctio soluta quaerat blanditiis neque
            voluptatibus deleniti?
          </Typography>
        </Box>
      </Box>

      <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 1,
            paddingBottom: 2,
          }}
        >
          <TypoText title=" Key Benefits" />
          <img src={Info_Icon} />
          <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
        </Box>
        <Divider />

        <Box
          sx={{
            paddingTop: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
            Key Benefits 1
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            sunt alias sequi tempora totam et eos sapiente nisi deserunt veniam
            atque voluptas corporis, distinctio soluta quaerat blanditiis neque
            voluptatibus deleniti?
          </Typography>
        </Box>
        <Box
          sx={{
            paddingTop: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
            Key Benefits 2
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            sunt alias sequi tempora totam et eos sapiente nisi deserunt veniam
            atque voluptas corporis, distinctio soluta quaerat blanditiis neque
            voluptatibus deleniti?
          </Typography>
        </Box>
      </Box>

      <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 1,
            paddingBottom: 2,
          }}
        >
          <TypoText title=" Additional Benefits" />
          <img src={Info_Icon} />
          <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
        </Box>
        <Divider />

        <Box
          sx={{
            paddingTop: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Additional Benefits 1
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Temporibus sunt alias sequi tempora totam et eos sapiente nisi
              deserunt veniam atque voluptas corporis, distinctio soluta quaerat
              blanditiis neque voluptatibus deleniti?
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Additional Benefits 2
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Temporibus sunt alias sequi tempora totam et eos sapiente nisi
              deserunt veniam atque voluptas corporis, distinctio soluta quaerat
              blanditiis neque voluptatibus deleniti?
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ marginTop: 3, backgroundColor: 'white', padding: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 1,
            paddingBottom: 2,
          }}
        >
          <TypoText title=" Welcome Benefits" />
          <img src={Info_Icon} />
          <TypographyInfo title="Lorem ipsum dolor sit amet consectetur. Urna." />
        </Box>
        <Divider />

        <Box
          sx={{
            paddingTop: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Welcome Benefits 1
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Temporibus sunt alias sequi tempora totam et eos sapiente nisi
              deserunt veniam atque voluptas corporis, distinctio soluta quaerat
              blanditiis neque voluptatibus deleniti?
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 14, color: 'grey' }}>
              Welcome Benefits 2
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Temporibus sunt alias sequi tempora totam et eos sapiente nisi
              deserunt veniam atque voluptas corporis, distinctio soluta quaerat
              blanditiis neque voluptatibus deleniti?
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: 'white',
          marginTop: 2,
          padding: 2,
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BtnContained onClick={close} title="close" />
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewCard;
