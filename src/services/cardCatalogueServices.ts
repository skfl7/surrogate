import { secureApi } from './xhr';
import { url } from '../utils/constants/url';

// get Card list
export const getCardList = (payload: any) =>
  secureApi.post(url.DEV_URL + url.CARD_SERVICES + 'cardList', payload);

// Get card filter dropdown options
export const getCardDropdownData = (payload: any) =>
  secureApi.post(url.DEV_URL + url.CARD_SERVICES + 'cardDropdownList', payload);

// Update card status (Resume, pause)
export const updateCardStatus = (payload: any) =>
  secureApi.post(url.DEV_URL + url.CARD_SERVICES + 'cardStatusUpdate', payload);

// Update card surrogate selection (Remove or assign surrogate)
export const updateCardSurrogate = (payload: any) =>
  secureApi.post(url.DEV_URL + url.CARD_SERVICES + 'cardSurrogateUpdate', payload);

// Bulk upload - Upload card excel
export const bulkUploadExcel = (payload: any) =>
  secureApi.post(url.DEV_URL + url.BULK_CARD_SERVICES + 'cardUploadExcel', payload);

// Get uploaded card data. returns success and failed records
export const getCardUploadedData = (payload: any, config: any) =>
  secureApi.post(
    url.DEV_URL + url.BULK_CARD_SERVICES + 'cardUploadedData',
    payload,
    config
  );

// Download failure excel
export const downloadFailureExcel = (ref: string) =>
  secureApi.get(
    url.DEV_URL + url.BULK_CARD_SERVICES + 'downloadFailureExcel/' + ref
  );

// card upload confirmation
export const cardUploadConfirmation = (payload: any) =>
  secureApi.post(
    url.DEV_URL + url.BULK_CARD_SERVICES + 'cardUploadConfirmation/',
    payload
  );

// Get uploaded card image. Returns success and failed records
export const getCardUploadedImages = (payload: any, config: any) =>
  secureApi.post(
    url.DEV_URL + url.BULK_CARD_IMAGE_SERVICES + 'bulkUploadImageUploadData',
    payload,
    config
  );

// create  new single card
export const createNewSingleCard = (payload: any) =>
  secureApi.post(url.DEV_URL + url.CARD_SERVICES + 'addNewCard', payload);

// image upload
export const imageUpload = (payload: any) =>
  secureApi.post(url.DEV_URL + url.IMAGE_UPLOAD_SERVICES + 'addFile', payload);

// Get single card details
export const getCardDetails = (payload: any) =>
  secureApi.post(url.DEV_URL + url.CARD_SERVICES + 'getCardDetails/', payload);

// image upload
export const viewImage = (cardId: any) =>
  secureApi.get(url.DEV_URL + url.CARD_SERVICES + 'view/' + cardId);

// Edit single card
export const editSingleCard = (payload: any) =>
  secureApi.post(url.DEV_URL + url.CARD_SERVICES + 'cardDetailsUpdate', payload);

// Save As Draft
export const saveAsDraft = (payload: any) =>
 secureApi.post(url.DEV_URL + url.SAVE_DRAFT_NEWCARD, payload);