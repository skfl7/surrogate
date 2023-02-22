import React, { useRef, useState } from 'react';

// MUI Components
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Box, Button, ButtonProps, styled, Typography } from '@mui/material';

// Styles
import './DragDrop.scss';

// Utils
import { bulkUpload } from '../../../utils/Constants';
import localforage from 'localforage';

// Component begins here

const DragDrop = (props: {
  progress?: Function;
  progressValue: number;
  buttonText: string;
  supportedFiles: string;
  sendFile?: Function;
  accept?: string;
  fileType?: string;
  openErrorModal?: any;
}) => {
  const { progressValue, buttonText, supportedFiles, sendFile, fileType } =
    props;
  const inputRef = useRef<any>();
  // drag state
  const [dragActive, setDragActive] = useState(false);

  // handle drag events
  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const uploadFile = async (files: any) => {
    const fileData = new FormData();
    for (let i = 0; i < files.length; i++) fileData.append('file', files[i]);
    try {
      localforage.getItem('loggedinUser').then((value: any) => {
        fileData.append('user_id', value.id);
        sendFile && fileData.get('file') && sendFile(fileData);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDrop = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log('e.dataTransfer.files', e.dataTransfer.files);
      uploadFile(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e: any) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      console.log('success', e.target.files);
      uploadFile(e.target.files);
    }
  };
  const onButtonClick = () => {
    inputRef?.current?.click();
  };

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    '&:hover': {
      backgroundColor: progressValue > 0 ? ' #82B1DB' : '#0662B7',
      boxShadow:
        progressValue > 0
          ? 'none'
          : '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    },
    marginTop: '4%',

    // '&:disabled': {
    //   backgroundColor: '#82B1DB !important',
    //   color: '#FFFFFF;',
    // },
  }));

  return (
    <form
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
      encType="multipart/form-data"
    >
      <input
        ref={inputRef}
        type="file"
        id="input-file-upload"
        multiple={true}
        onChange={handleChange}
        accept={props.accept}
      />

      <label
        id="label-file-upload"
        htmlFor="input-file-upload"
        style={{
          backgroundColor: props.openErrorModal
            ? '#FDF1F2'
            : progressValue === 100
            ? '#F1F9F3'
            : '',
        }}
      >
        <Box>
          <Box>
            <InsertDriveFileOutlinedIcon
              sx={{
                fontSize: '64px',
                width: { sm: '0.7em', md: '0.9em', lg: '1em' },
              }}
              color={
                props.openErrorModal
                  ? 'error'
                  : progressValue === 100
                  ? 'success'
                  : 'inherit'
              }
            />
          </Box>

          <Typography
            sx={{ fontSize: { sm: '24px', md: '20px' }, fontWeight: 'bold',color:'#151515' }}
          >
            {bulkUpload.DRAG_AND_DROP}
          </Typography>
          <Typography sx={{ fontSize: { sm: '0.8em', md: '1em' }, color:'#4D4E50' }}>
            {supportedFiles}
          </Typography>
          <ColorButton
            variant="contained"
            startIcon={
              <FileUploadOutlinedIcon
                sx={{ fontSize: { sm: '20px', md: '24px !important' },width:'25px',height:'25px' }}
              />
            }
            className="upload-button"
            onClick={onButtonClick}
            sx={{
              backgroundColor: progressValue > 0 ? ' #82B1DB' : '#0662B7',
              // backgroundColor:'#0662B7',
              fontSize: { sm: '0.9em', md: '1em' },
              boxShadow:
                progressValue > 0
                  ? 'none'
                  : '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
            }}
            // disabled={progressValue > 0 ? true : false}
            style={{ textTransform: 'inherit' }}
          >
            {buttonText}
          </ColorButton>
        </Box>
      </label>
      {dragActive && (
        <Box
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></Box>
      )}
    </form>
  );
};

export default DragDrop;
