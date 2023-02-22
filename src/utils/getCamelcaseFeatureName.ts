export const getCamelCaseFeatureName = (str: string) => {
  const arr = str.split('_');
  const newArr = arr.map((item: string, index: number) => {
    if (index !== 0) item = `${item.charAt(0).toUpperCase()}${item.slice(1)}`;
    return item;
  });
  return newArr.length > 1 ? newArr.join('') : str;
  
};
