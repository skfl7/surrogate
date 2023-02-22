import { secureApi } from './xhr';
import { url } from '../utils/constants/url';

// Get card filter dropdown options
export const getProgramMgntDropdownData = (payload: any) =>
  secureApi.post(url.DEV_URL + url.PROGRAM_DROPDOWN, payload);

// Get card list items
export const getProgramMgntListItems = (payload: any) =>
  secureApi.post(url.DEV_URL + url.PROGRAM_LIST, payload);

// Get card item detail
export const getProgramMgntItemDetail = (payload: any) =>
  secureApi.post(url.DEV_URL + url.PROGRAM_DETAILS, payload);

// update item status
export const updateProgramMgntItemStatus = (payload: any) =>
  secureApi.post(url.DEV_URL + url.PROGRAM_UPDATE, payload);

// historyLog Table
export const historyLog = (payload: any) =>
  secureApi.post(url.DEV_URL + url.HISTORYLOG_TABLE, payload);

// historyLog Details
export const historyLogDetailsListItem = (payload: any) =>
  secureApi.post(url.DEV_URL + url.HISTORYLOG_DETAILS, payload);
