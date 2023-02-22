import { secureApi } from './xhr';
import { url } from '../utils/constants/url';

// user login
export const loginUser = (payload: any) =>
  secureApi.post(url.DEV_URL + url.USER_LOGIN, payload);

 // Update Password
export const updatePassword = (payload: any) =>
secureApi.post(url.DEV_URL + url.UPDATE_PASSWORD, payload);

//email check
export const emailCheck = (payload: any) =>
secureApi.post(url.DEV_URL + url.EMAIL_CHECK, payload);

//verify otp
export const verifyOTP = (payload: any) =>
secureApi.post(url.DEV_URL + url.VERIFY_OTP, payload);

//resend otp
export const resendOTP = (payload: any) =>
secureApi.post(url.DEV_URL + url.RESEND_OTP, payload);