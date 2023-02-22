import { colors } from '../../style/Color';
import { tagBasedIndicator } from '../Constants';

export const checkTagStatus = (value: string) => {
  let result = {
    bgColor: '#fff',
    color: '#000',
  };

  if (value) {
    if (
      value === tagBasedIndicator.ACTIVE ||
      value === tagBasedIndicator.APPROVED ||
      value === 'Active'
    ) {
      result.color = '#32A64D';
      result.bgColor = colors.lightGreen;
      return result;
    }
    if (
      value === tagBasedIndicator.PAUSED ||
      value.includes('Pending') ||
      value === tagBasedIndicator.WAITING_FOR_APPROVAL ||
      value === tagBasedIndicator.SAVED ||
      value.toLocaleLowerCase().includes('paused')
    ) {
      result.color = '#F37B21';
      result.bgColor = colors.PauseStatusBGColor;
      return result;
    }
    if (
      value === tagBasedIndicator.DEACTIVATE ||
      value === tagBasedIndicator.REJECTED
    ) {
      result.color = '#D02127';
      result.bgColor = colors.ScheduledPausedBgColor;
      return result;
    }
    if (
      value === tagBasedIndicator.PAUSED_SCHEDULED ||
      value === 'Pause Scheduled'
    ) {
      result.color = '#992D26';
      result.bgColor = colors.lightBrown;
      return result;
    }
    if (
      value === tagBasedIndicator.INACTIVE ||
      value === tagBasedIndicator.INACTIVE2
    ) {
      result.color = '#E63946';
      return result;
    }
    if (value.includes('Rejected')) {
      result.color = '#992D26';
    }

    if (value === 'INITIATED') {
      result.color = '#000000';
      result.bgColor = '#AFAEAF';
      return result;
    }

    if (value === 'REVIEWED' || value === 'APPROVED') {
      result.color = '#1C592A';
      result.bgColor = '#E3F3E6';
      return result;
    }
    if (value === 'WAITING_FOR_APPROVE') {
      result.color = '#F37B21';
      result.bgColor = '#f37b216e';
      return result;
    }

    if (value === 'REJECTED') {
      result.color = '#FCE4E5';
      result.bgColor = '#FCE4E5';
      return result;
    }
    if (value === 'INITIATED') {
      result.color = 'black';
      result.bgColor = '#FCE4E5';
      return result;
    }
  }
  return result;
};
