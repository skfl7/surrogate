import { secureApi } from './xhr';
import { url } from '../utils/constants/url';

// Get authorization detail
export const getAuthorizationDetail = (payload: any) =>
  secureApi.post(url.DEV_URL + url.AUTHORIZATION_DETAILS, payload);

//getAuthorizationActive
export const getAuthorizationActiveDetail = (payload: any) =>
  secureApi.post(url.DEV_URL + url.AUTHORIZATION_DETAILS_ACTIVE, payload);

// Get authorization list
export const getAuthorizationList = (payload: any) =>
  secureApi.post(url.DEV_URL + url.AUTHORIZATION_LIST, payload);

// Update authorization detail
export const createAuthorization = (payload: any) =>
  secureApi.post(url.DEV_URL + url.CREATE_AUTHORIZATION, payload);

// Update authorization detail
export const updateAuthorizationDetail = (payload: any) =>
  secureApi.post(url.DEV_URL + url.UPDATE_AUTHORIZATION, payload);

// get Role Creation List
export const getRoleCreationList = (payload: any) =>
  secureApi.post(url.DEV_URL + url.ROLE_CREATION + 'roleList', payload);

// View Each Role
export const getRoleCreationDetails = (payload: any) =>
  secureApi.post(
    url.DEV_URL + url.ROLE_CREATION + 'roleCreationDetails',
    payload
  );

// View Empty Data for Create New Role
export const getInitialPageDetails = (payload: any) =>
  secureApi.post(url.DEV_URL + url.ROLE_CREATION + 'roleInitialPage', payload);

//Get Duplicate Role Data List
export const getDuplicateRoleData = (payload: any) =>
  secureApi.post(url.DEV_URL + url.ROLE_CREATION + 'roleListByName', payload);

//Update Existing Role Data
export const editExistingRoleApi = (payload: any) =>
  secureApi.post(url.DEV_URL + url.ROLE_CREATION + 'roleCreationUpdate', payload);

//Create New Role Data
export const createNewRoleApi = (payload: any) =>
  secureApi.post(url.DEV_URL + url.ROLE_CREATION + 'roleCreation', payload);

//Create User List
export const userListSegregated = (payload: any) =>
  secureApi.post(url.DEV_URL + url.USER_LIST_SEGREGATED_BY_MODULE, payload);

//ID
export const userListByIDSegregated = (payload: any) =>
  secureApi.post(url.DEV_URL + url.USER_LIST_SEGREGATED_BY_ID, payload);

  // AUTH SEARCH
  export const productSearch = (payload: any) =>
    secureApi.post(url.DEV_URL + url.PRODUCT_SEARCH, payload);
