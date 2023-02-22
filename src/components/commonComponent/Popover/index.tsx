import { Button, Popover, Stack, Typography } from '@mui/material';
import './style.scss';
import { useNavigate } from 'react-router-dom';

function PopoverContainer(props: {
  id: any;
  handleClose: Function;
  openActionModal?: Function;
  anchorEl: any;
  open: boolean;
  options: any;
}) {
  const navigate = useNavigate();

  const callRoutePath = (eachItem: any) => {
    if (eachItem?.routePath !== '')
      navigate(eachItem?.routePath, {
        state: { filteredData: eachItem.params },
      });
    else if (
      eachItem?.label === 'Activate User' ||
      eachItem?.label === 'Deactivate User' ||
      eachItem?.label === 'Duplicate LMS Rule'
    ) {
      props?.openActionModal !== undefined && props.openActionModal();
    }

    props.handleClose();
  };

  return (
    <Popover
      className="popover-container"
      id={props.id}
      open={props.open}
      anchorEl={props.anchorEl}
      onClose={() => props.handleClose()}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Stack>
        {props?.options?.map((eachItem: any, index: number) => {
          return eachItem.isPermission ? (
            <Button
              disabled={eachItem?.disabled}
              sx={{
                p: 2,
                width: '100%',
                justifyContent: 'flex-start',
                // height: 50,
                padding: '12px 12px',
              }}
              key={index}
              onClick={() => {
                callRoutePath(eachItem);
              }}
            >
              <Typography
                sx={{
                  textTransform: 'none',
                  padding: '8px 22px 8px 8px',
                  textAlign: 'left',
                  fontFamily: 'Ilisarniq',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '16px',
                  display: 'flex',
                  alignItems: 'left',
                  letterSpacing: '0.0025em',
                  color: '#151515',
                  opacity: eachItem?.disabled ? 0.38 : 1,
                }}
              >
                {eachItem?.label}
              </Typography>
            </Button>
          ) : (
            ''
          );
        })}
      </Stack>
    </Popover>
  );
}

export default PopoverContainer;
