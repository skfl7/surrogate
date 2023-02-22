import React from 'react';
import '../SalesDashbaordCard/card.scss';
import { Button } from '@mui/material';
import { ReactComponent as RightArrow } from '../../../../assets/icons/rightArrowIcon.svg';
import redDown from '../../../../assets/icons/red_down.svg';
import GreenUp from '../../../../assets/icons/green_up.svg';
import { useNavigate } from 'react-router-dom';

type TitleValue =
  | string
  | number
  | boolean
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | React.ReactFragment
  | React.ReactPortal
  | null
  | undefined;

type ProgressCardProps = {
  navPath: string;
  title: TitleValue;
  value: TitleValue;
  lastPeriodValue: TitleValue;
  lastYearValue: TitleValue;
  image: any;
  index: number;
};

function ProgressCard(props: ProgressCardProps) {
  var boxstyles = '';
  if (props.index === 1) {
    boxstyles = 'progress-icon-box';
  }
  if (props.index === 2) {
    boxstyles = 'approval-icon-box';
  }
  if (props.index === 3) {
    boxstyles = 'dropped-icon-box';
  }
  if (props.index === 4) {
    boxstyles = 'rejected-icon-box';
  }
  const navigate = useNavigate();

  return (
    <div className="value-cards">
      <div className="inner-div">
        <div className={boxstyles}>
          <img src={props.image} alt="card" />
        </div>
        <div className="card-text-area">
          <span className="card-text-heading">{props.title}</span>
          <span className="card-text-value">{props.value}</span>
        </div>
      </div>
      <div className="left-more-div">
        <div className="card-text-area">
          {props.lastPeriodValue !== 0 && (
            <span className="card-text-heading">Last Period</span>
          )}
          {props.lastPeriodValue !== 0 && (
            <div className="card-value-with-icon">
              <span className="card-text-value">{props.lastPeriodValue}</span>
              <img
                src={redDown}
                style={{ marginLeft: '4px', marginBottom: '2px' }}
                alt="down arrow"
              ></img>
            </div>
          )}
        </div>
        <div className="card-text-area">
          {props.lastYearValue !== 0 && (
            <span className="card-text-heading">Last Year</span>
          )}
          {props.lastYearValue !== 0 && (
            <div className="card-value-with-icon">
              <span className="card-text-value">{props.lastYearValue}</span>
              <img
                src={GreenUp}
                style={{ marginLeft: '4px', marginBottom: '2px' }}
                alt="up arrow"
              ></img>
            </div>
          )}
        </div>
        <Button
          endIcon={<RightArrow />} //style={{ width: '5px', height: '10px' }}
          onClick={() => {
            navigate(props.navPath);
          }}
          sx={{ fontSize: '14px', color: '#0662B7', textTransform: 'none' }}
        >
          More
        </Button>
      </div>
    </div>
  );
}

export default ProgressCard;
