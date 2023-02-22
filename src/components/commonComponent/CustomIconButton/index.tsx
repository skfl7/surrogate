import { Button, IconButton, Stack } from '@mui/material';
import './style.scss';

function ButtonWithIcons(props: {
  data: {
    icon: string;
    label: string;
    inActiveIcon: any;
    activeIcon: any;
    isDisabled: boolean;
  };
  onClick: Function;
}) {
  const icon = props?.data?.icon
    ? props?.data?.icon
    : props?.data?.inActiveIcon;
  return (
    <Stack direction="row" spacing={3} className="btn-with-icon-container">
      <Button
        variant="contained"
        disabled={props?.data?.isDisabled}
        className={props?.data?.isDisabled ? 'disabled' : 'enabled'}
        onClick={() => props.onClick()}
        color="secondary"
      >
        <IconButton sx={{ padding: '0', marginRight: '8px' }}>
          <img
            src={props?.data?.isDisabled ? icon : props?.data?.activeIcon}
            alt="icon"
          />
        </IconButton>
        {props?.data?.label ?? '--'}
      </Button>
    </Stack>
  );
}

export default ButtonWithIcons;
