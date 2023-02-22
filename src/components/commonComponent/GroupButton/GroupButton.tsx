import * as React from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import { stackButtonInterface } from '../../../interface/Types';
import './groupButtonStyle.scss';
type props = {
  data?: Array<stackButtonInterface>;
  onChange?: any;
};

const GroupButton = ({ data, onChange }: props) => {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const onClickAction = (item: any, index: number) => {
    setActiveIndex(index);
    console.log(item, 'button group');
    onChange(item);
  };

  return (
    <Box>
      <ButtonGroup
        variant="text"
        aria-label="outlined button group"
        className="buttonContainer"
        sx={{
          backgroundColor: '#F3F3F3',
          padding: '3px',
          width: { sm: '100%', md: 'unset' },
        }}
        // onClick={onClickAction}
      >
        {data &&
          data.map((item: any, index: number) => {
            const activeClass = activeIndex === index ? 'activeButton' : '';
            return (
              <Button
                key={index}
                className={`buttonContainerTitle ${activeClass}`}
                value={item.title}
                onClick={() => onClickAction(item, index)}
                sx={{
                  textTransform: 'capitalize',
                  width: { sm: '33%', md: 'unset' },
                }}
              >
                {item.title || item.name}
              </Button>
            );
          })}
      </ButtonGroup>
    </Box>
  );
};
export default GroupButton;
