import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Upload_Img from '../../../../../assets/images/uploadImg.svg';

export const Upload = (props: any) => {
  const progressObj = {
    tinNumber: false,
    panNumber: false,
  };
  const [danger, setDanger] = useState(props.danger);
  const [progress, setProgress] = useState(0);
  const [progressCheck, setProgressCheck] = useState(progressObj);
  // const handleChange = function (value: boolean,type:string) {
  //   // setProgressCheck((prev)=>({...prev,[type]:value}))
  //   setProgress(1);
  // };

  // useEffect(()=>{
  //   setDanger()
  // })

  const handleInput = (e: any) => {
    e.preventDefault();
    props.callbackFunc(props.id, e);
    if (e.target.files && e.target.files[0]) {
      setProgress(1);
    }
  };
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (progress !== 0) {
        setProgress((oldProgress) => {
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  // console.log('props.danger ===true', props.danger === true);
  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Box>
          <Box
            sx={{
              width: '422px',
              display: 'flex',
              border:
                progress !== 100
                  ? '2px dashed #f3f3f3'
                  : props.danger === true
                  ? '2px dashed #FDF1F2'
                  : '2px dashed #F1F9F3',
              borderColor: '#D2D2D3',
              backgroundColor:
                progress !== 100
                  ? '#F3F3F3'
                  : props.danger === true
                  ? '#FDF1F2'
                  : '#F1F9F3',
              borderRadius: '4px',
              height: '52px',
              marginTop: '8px',
              paddingY: '5px',
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <Button sx={{ paddingX: '10px' }} component="label">
                <img src={Upload_Img} alt="upload" />
                <input
                  hidden
                  accept={'.jpg, .png, .jpeg, '}
                  type="file"
                  onChange={handleInput}
                />
                <Box sx={{ paddingY: '3px', paddingLeft: '20px' }}>
                  <Typography
                    sx={{
                      textTransform: 'capitalize',
                      fontWeight: '400',
                      fontSize: {
                        sm: '10px ',
                        md: '14px ',
                      },

                      lineHeight: '16px',
                      color:
                        progress !== 100
                          ? '#0662B7'
                          : props.danger === true
                          ? '#E63946'
                          : '#32A64D',
                    }}
                  >
                    {props.title}
                  </Typography>
                  <Typography
                    sx={{
                      textTransform: 'capitalize',
                      fontSize: {
                        sm: '8px ',
                        md: '10px ',
                      },
                      fontWeight: '400',
                      letterSpacing: '0.004em',
                      color:
                        progress !== 100
                          ? '#a6a6ad'
                          : props.danger === true
                          ? '#F18F96'
                          : '#8BCD9A',
                    }}
                  >
                    Upload file in PDF/JPEG/PNG formats with a maximum file size 2MB
                  </Typography>
                  {progress == 0 ? (
                    ''
                  ) : (
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        color={'secondary'}
                        sx={{
                          backgroundColor: '#E6E7E7',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor:
                              progress !== 100
                                ? 'secondary'
                                : props.danger === true
                                ? '#E63946'
                                : '#8BCD9A',
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Button>
            </Box>

            {/* <Box sx={{ paddingY: '3px' }}>
              <Typography
                sx={{
                  fontWeight: '400',
                  fontSize: '12px',
                  lineHeight: '16px',
                  color:
                    progress !== 100
                      ? '#0662B7'
                      : danger
                      ? '#E63946'
                      : '#32A64D',
                }}
              >
                {props.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: '400',
                  letterSpacing: '0.004em',
                  color:
                    progress !== 100 ? 'grey' : danger ? '#F18F96' : '#8BCD9A',
                }}
              >
                Upload file in PDF/JPEG/PNG formats with a maximum file size 2MB
              </Typography>
              {progress == 0 ? (
                ''
              ) : (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    color={'secondary'}
                    sx={{
                      backgroundColor: '#E6E7E7',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor:  progress !== 100
                              ? 'secondary'
                              : danger
                              ? '#E63946'
                              : '#8BCD9A', 
                      }
                    }}  
                  />
                </Box>
              )}
            </Box> */}
          </Box>
          {progress !== 100 ? (
            ''
          ) : props.danger === true ? ( //need to check
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography
                sx={{ fontSize: '10px', fontWeight: '400', color: '#E63946' }}
              >
                {props.keyValue ||
                  `Wrong format!, Please re-upload the correct format file`}
              </Typography>
            </Box>
          ) : (
            ''
          )}
          {/* {danger ?
        
        (<Box sx={{display:'flex',justifyContent:'flex-end'}} >
            <Typography sx={{ fontSize: '10px', fontWeight: '400',color:'#E63946' }}>
              Wrong format!, Please re-upload the correct format file
            </Typography>
          </Box>  ):""
         } */}
        </Box>
      </Box>
    </Box>
  );
};
