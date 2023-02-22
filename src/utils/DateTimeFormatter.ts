import moment from 'moment';

export const formatDateTime = (value: string) => {
  return moment(value).format('DD MMM YYYY, h:mm A');
  
};

export const getMaxDate = (arr: any) => {
  let value = '';
  if (arr.length > 0) {
    let temp = new Date(
      Math.max(...arr.map((e: any) => new Date(e.actionedTime)))
    );
    value = formatDateTime(String(temp));
  }
  return value;
};
