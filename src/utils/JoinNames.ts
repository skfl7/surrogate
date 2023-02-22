export const ConCatArrNames = (arr: any) => {
    let value = '';
  
    arr?.map((item: any) => {
      if (value === '') {
        value = item?.name;
      } else {
        value = value + ', ' + item?.name;
      }
    });
    return value;
  };