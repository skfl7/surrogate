import localforage from 'localforage';

export const getPermission = (
  acctionAllowed: Array<any>,
  module: string,
  subModule?: string,
  action?: string
) => {
  var isPermission = false;
  const foundModule = acctionAllowed?.find(
    (action: any) => action.name === module
  );
  if (
    foundModule &&
    foundModule !== null &&
    foundModule !== undefined &&
    foundModule !== 0 &&
    foundModule !== ''
  ) {
    if (subModule) {
      const foundSubModule = foundModule?.subAction?.find(
        (item: any) => item.name === subModule
      );

      if (
        foundSubModule &&
        foundSubModule !== null &&
        foundSubModule !== undefined &&
        foundSubModule !== 0 &&
        foundSubModule !== ''
      ) {
        if (action) {
          const foundAction = foundSubModule?.secondSubActions?.find(
            (item: any) => item.name === action
          );
          if (
            foundAction &&
            foundAction !== null &&
            foundAction !== undefined &&
            foundAction !== 0 &&
            foundAction !== ''
          ) {
            isPermission =
              foundAction.roleAccess?.toUpperCase() === 'YES' ? true : false;
          }
        } else {
          isPermission =
            foundSubModule.roleAccess?.toUpperCase() === 'YES' ? true : false;
        }
      }
    } else {
      isPermission =
        foundModule.roleAccess?.toUpperCase() === 'YES' ? true : false;
    }
  }
  return isPermission;
};

export const getPermissionn = async (
  module: string,
  subModule?: string,
  action?: string
) => {
  let isPermission = false;
  let value: any = await localforage.getItem('loggedinUser');

  const actionsAllowed = value.actionsAllowed;
  const foundModule = actionsAllowed.find(
    (action: any) => action.name === module
  );
  if (foundModule) {
    if (subModule) {
      const foundSubModule = foundModule.subAction?.find(
        (item: any) => item.name === subModule
      );
      if (foundSubModule) {
        if (action) {
          const foundAction = foundSubModule.secondSubActions?.find(
            (item: any) => item.name === action
          );
          if (foundAction) {
            isPermission =
              foundAction.roleAccess?.toUpperCase() === 'YES' ? true : false;
          }
        } else {
          isPermission =
            foundSubModule.roleAccess?.toUpperCase() === 'YES' ? true : false;
        }
      }
    } else {
      isPermission =
        foundModule.roleAccess?.toUpperCase() === 'YES' ? true : false;
      console.log(
        'ispermission',
        foundModule.roleAccess?.toUpperCase() === 'YES' ? true : false
      );
    }
  }
  return isPermission;
};
