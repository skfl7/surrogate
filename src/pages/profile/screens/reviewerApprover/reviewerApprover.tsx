import React, { useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { ScreenHeader } from '../../../../components/commonComponent/ScreenHeader/ScreenHeader';
import './style.scss';
import Edit_icon from '../../../../assets/icons/editReviewer.svg';
import BtnOutlined from '../../../../components/commonComponent/CustomText/Button/Outlined';
import BtnContained from '../../../../components/commonComponent/CustomText/Button/Contained';
import { useNavigate } from 'react-router-dom';
import ApproverReviewerTable from '../../../../components/commonComponent/ReviewerApproverTable';
import { ReviewerApproverList } from '../../../userManagement/userCreation/userCreation.const';

export const ReviewerApprover = () => {
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();
  return (
    <Stack className="profileReviewerApproverContainer">
      <Stack className="profileReviewerContainerHeaderMain">
        <Stack className="profileReviewerHeaderContainer">
          <Stack className="profileReviewerHeaderSubContainer">
            <Stack className="profileReviewerHeaderTitle">
              <ScreenHeader
                title="Reviewer & Approver"
                info="List of all reviewers and approvers pertaining to each module."
                showBackButton={false}
              />
            </Stack>
            {edit ? (
              <></>
            ) : (
              <>
                <Stack className="profileReviewerHeaderStatus">
                  <Button
                    sx={{
                      fontSize: '14px',
                      marginLeft: '56px',
                      color: '#0662B7',
                      fontWeight: '600',
                      textTransform: 'none',
                    }}
                    onClick={()=>setEdit(true)}
                  >
                    <Stack sx={{ marginRight: '6px' }}>
                      <img src={Edit_icon} width="20px" height="20px" alt="" />
                    </Stack>
                    Edit
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
      <Stack
        className="profileReviewerApproverTableContainer"
        sx={{
          margin: edit ? '30px 0 80px 0' : '30px 0',
          backgroundColor: 'white',
        }}
      >
        <Stack sx={{ padding: '0px 32px 24px 32px' }}>
          <ApproverReviewerTable
            data={ReviewerApproverList}
            mode={edit ? 'edit' : 'view'}
          />
        </Stack>
      </Stack>

      {edit ? (
        <>
          <Box
            sx={{
              marginTop: '10px',
              backgroundColor: 'white',
              position: 'fixed',
              bottom: 0,
              right: 0,
              width: '100%',
              borderTop: '2px solid #f3f3f3 ',
              borderRadius: '8px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                padding: '10px 30px',
              }}
            >
              <BtnOutlined title="Cancel" onClick={() => setEdit(false)} />
              <BtnContained title="Save" onClick={() => setEdit(false)} />
            </Box>
          </Box>
        </>
      ) : (
        <></>
      )}
    </Stack>
  );
};
