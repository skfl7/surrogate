import { secureApi } from './xhr';
import { url } from '../utils/constants/url';

// Get org list items
export const getOrgStructureListItems = (payload: any) =>
  secureApi.post(url.DEV_URL + url.ORG_STRUCTURE_LIST, payload);

// Get org details
export const getOrgStructureDetails = (payload: any) =>
  secureApi.post(url.DEV_URL + url.GET_ORGANISATION, payload);

//fetch uploaded file
export const getOrgStructureFile = (filename: string) =>
  secureApi.get(`${url.DEV_URL}${url.ORGANIZATION_SERVICES}view/${filename}`);

export const getOrganizationDropDown = (payload: any) =>
  secureApi.post(url.DEV_URL + url.ORG_DROPDOWN_LIST, payload);

// Get organization filter dropdown options
export const getOrganizationDropdownData = (payload: any) =>
  secureApi.post(
    url.DEV_URL + url.ORGANIZATION_SERVICES + 'organizationDropDown',
    payload
  );

export const getOrganizationBankDropdownData = (payload: any) =>
  secureApi.post(url.DEV_URL + url.BANK_LIST + 'bankDropDown', payload);

// Get uploaded card data. returns success and failed records
export const getOrgUploadedData = (payload: any, config: any) =>
  secureApi.post(
    url.DEV_URL + url.BULK_ORGANISATION + 'organizationUploadedData',
    payload,
    config
  );

// org upload confirmation
export const orgUploadConfirmation = (payload: any) =>
  secureApi.post(
    url.DEV_URL + url.BULK_ORGANISATION + 'orgUploadConfirmation',
    payload
  );

// create Fintech
export const registerFintech = (payload: any) =>
  secureApi.post(
    url.DEV_URL + url.ORGANIZATION_SERVICES + 'fintechRegister',
    payload
  );

// create Fintech
export const updateFintech = (payload: any) =>
  secureApi.post(
    url.BASE_URL + url.ORGANIZATION_SERVICES + 'fintechRegisterUpdate',
    payload
  );

// create DSA
export const registerDSA = (payload: any) =>
  secureApi.post(url.DEV_URL + url.ORGANIZATION_SERVICES + 'dsaRegister', payload);

// create DSA
export const updateDSA = (payload: any) =>
  secureApi.post(
    url.BASE_URL + url.ORGANIZATION_SERVICES + 'dsaRegisterUpdate',
    payload
  );

//Add signle card img
export const addSingleImageOrg = (payload: any) =>
  secureApi.post(
    url.DEV_URL + url.ADD_SINGLE_IMG_ORG + 'addSingleImageOrg',
    payload
  );

  // Update Status of Data
export const updateStatusOfOrgStructure= (payload: any) =>
secureApi.post(url.DEV_URL + url.ORGANIZATION_SERVICES + 'organizationStatusUpdate', payload);

// Save As Draft 
export const saveDraftDSA= (payload: any) =>
secureApi.post(url.DEV_URL + url.SAVE_DRAFT_DSA, payload);
