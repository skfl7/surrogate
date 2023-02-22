import { secureApi } from './xhr';
import { url } from '../utils/constants/url';

// get User Creation list
export const getUserCreationList = (payload: any) =>
  secureApi.post(url.DEV_URL + url.USER_CREATION + 'userList', payload);

// View Each User Creation
export const getUserCreationDetails = (payload: any) =>
  secureApi.post(url.DEV_URL + url.USER_CREATION + 'userProfileDetails', payload);

// Reviewer and Approver Data
export const getReviewerApproverData = (payload: any) =>
  secureApi.post(
    url.DEV_URL + url.USER_CREATION + 'userProfileReviewerApproverListAllModule',
    payload
  );

// Get Reporting Head List
export const getReportingHeadList = (payload: any) =>
  secureApi.post(url.DEV_URL + url.USER_CREATION + 'userListForTypo', payload);

export const getReportingHeadListUsers = (payload: any) =>
  secureApi.post(
    url.DEV_URL + url.USER_CREATION + 'userListForTypoActionAllowed',
    payload
  );

// Get State List
export const getStateList = (payload: any) =>
  secureApi.post(url.DEV_URL + url.MASTER_URL + 'stateList', payload);

// Get Zone List
export const getZoneList = (payload: any) =>
  secureApi.post(url.DEV_URL + url.MASTER_URL + 'zoneListDropDown', payload);

// Get District List
export const getDistrictList = (payload: any) =>
  secureApi.post(url.DEV_URL + url.MASTER_URL + 'cityList', payload);

// Get Branch List
export const getBranchList = (payload: any) =>
  secureApi.post(url.DEV_URL + url.MASTER_URL + 'branchListDropDown', payload);

// Update Status of Data
export const updateStatusOfUserCreation = (payload: any) =>
  secureApi.post(url.DEV_URL + url.USER_CREATION + 'userStatusUpdate', payload);

export const addUserMember = (payload: any) =>
  secureApi.post(url.DEV_URL + url.USER_CREATION + 'addMembers', payload);

export const updateUserMember = (payload: any) =>
  secureApi.post(url.DEV_URL + url.USER_CREATION + 'userDetailsUpdate', payload);

// Update Permission Status of Data
export const updatePermissionsOfUserCreation = (payload: any) =>
  secureApi.post(
    url.DEV_URL + url.USER_CREATION + 'userPermissionUpdate',
    payload
  );

// Save As Draft User
export const saveDraftUserCreation = (payload: any) =>
secureApi.post(url.DEV_URL + url.SAVE_DRAFT_USERCREATION , payload);

// Save As Draft User Permission
export const saveDraftUserPermission = (payload: any) =>
secureApi.post(url.DEV_URL + url.SAVE_DRAFT_USERPERMISSION , payload);


// -------------------------- Bulk upload APIs ---------------------------------

// Get uploaded user API
export const getUploadedUsers = (payload: any, config: any) =>
  secureApi.post(
    url.DEV_URL + url.BULK_USER + 'userUploadedData',
    payload,
    config
  );

// user upload confirmation
export const userUploadConfirmation = (payload: any) =>
  secureApi.post(url.DEV_URL + url.BULK_USER + 'userUploadConfirmation', payload);


