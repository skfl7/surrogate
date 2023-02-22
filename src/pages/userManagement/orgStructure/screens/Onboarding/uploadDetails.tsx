import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Upload } from './upload';
import TypoText from '../../../../../components/commonComponent/CustomText/Textfield';
import TypographySubTitle from '../../../../../components/commonComponent/CustomText/Typography';

export const UploadDetails = () => {
    const progressObj = {
        tinNumber:false,
        panNumber:false,
      }
  const [progress, setProgress] = useState(0);
  const [progressCheck,setProgressCheck]= useState(progressObj)
  const handleChange = function (value: boolean,type:string) {
    setProgressCheck((prev)=>({...prev,[type]:value}))
    setProgress(1);
  };
 
 
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (progress !== 0) {
        setProgress((oldProgress) => {
          // if (oldProgress === 100) {
          //   return 0;
          // }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [progress]);
  return (
    <Box>
      <Box sx={{ marginBottom: '20px', width: '280px' }}>
        <TypographySubTitle title="Registration Number (MSMED)" />
        <TypoText placeholder="Enter Registration Number" id="businessId" />
      </Box>


      <Box sx={{ display: 'flex', gap: 4.1, marginBottom: '20px' }}>
        <Box sx={{ width: '280px' }}>
          <TypographySubTitle title="TIN Number" />
          <TypoText placeholder="Enter TIN Number" id="businessId" />
        </Box>
        <Upload title='Attach Copy of TIN Number' />

      </Box>
      
      <Box sx={{ display: 'flex', gap: 4.1, marginBottom: '20px' }}>
        <Box sx={{ width: '280px' }}>
          <TypographySubTitle title="GST Number" />
          <TypoText placeholder="Enter GST Number" id="businessId" />
        </Box>
        <Upload title='Attach Copy of GST Number' danger={true} />
      </Box>

      
      

      <Box sx={{ display: 'flex', gap: 4.1, marginBottom: '20px' }}>
        <Box sx={{ width: '280px' }}>
          <TypographySubTitle title="PAN Number" />
          <TypoText placeholder="Enter PAN Number" id="businessId" />
        </Box>

          <Upload title='Attach Copy of PAN Number' danger={false}/>

      </Box>

      <Box sx={{ display: 'flex', gap: 4.1, marginBottom: '20px' }}>
        <Box sx={{ width: '280px' }}>
          <TypographySubTitle title="Shop & Establishment" />
          <TypoText placeholder="Enter Shop & Establishment" id="businessId" />
        </Box>

        <Upload title='Attach Copy of Shop & Establishment' />

      </Box>

      <Box sx={{ display: 'flex', gap: 4.1, marginBottom: '20px' }}>
        <Box sx={{ width: '280px' }}>
          <TypographySubTitle title="ESIC Registration No" />
          <TypoText placeholder="Enter ESIC Registration No" id="businessId" />
        </Box>

        <Upload title='Attach Copy of ESIC Registration No' />
        
      </Box>

      <Box sx={{ display: 'flex', gap: 4.1, marginBottom: '20px' }}>
        <Box sx={{ width: '280px' }}>
          <TypographySubTitle title="PF Registration No" />
          <TypoText placeholder="Enter PF Registration No" id="businessId" />
        </Box>

        <Upload title='Attach Copy of PF Registration No' />

      </Box>
    </Box>
  );
};
