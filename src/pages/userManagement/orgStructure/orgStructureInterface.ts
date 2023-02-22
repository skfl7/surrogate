import { ReactNode } from "react";

export interface OrganisationDropDownInterface {
  code?: string;
  name?: string;
}

export interface SupplierDetailsInterface {
  stateName: ReactNode;
  supplierName?: string;
  workAddress?: string;
  stateRef?: string;
  stateId?: string[];
  cityId?: string[];
  cityRef?: string;
  countryRef?: string;
  operatingCity?: string;
  tellNumber?: string;
  email?: string;
  businessSince?: string;
  businessNature?: string;
  companyNature?: string;
  companyClarity?: string;
  companyRegistrationNo?: string;
  majorProducts?: string;
  serviceDescription?: string;
}

export interface regulatoryRequirementPaymentInterface {
  payeeDetails?: string;
  payeeAddress?: string;
  defaultCreditPeriod?: any;
  reason?: string;
}

export interface DirectorDetailsInterface {
  name?: string;
  mobileNumber?: string;
  email?: string;
  gender?: string;
  dob?: string;
  role?: string;
  designation?: string;
  address?: string;
}

export interface KeyContactDetailsInterface {
  name?: string;
  mobileNumber?: string;
  email?: string;
  role?: string;
  designation?: string;
  reportingHead?: string;
}

export interface regulatoryRequirementInterface {
  shopNumberFileUploadSuccess: any;
  tinFileUploadSuccess: boolean;
  gstNumberFileUploadSuccess: boolean;
  panNumberFileUploadSuccess: boolean;
  esicNumberFileUploadSuccess: boolean;
  pfNumberfileUploadSuccess: boolean;
  registerNumber?: string;
  tinNumber?: string;
  tinNumberFile?: string;
  tinNumberFileSuccess?: boolean;
  gstNumber?: string;
  gstNumberFile?: string;
  gstNumberFileSuccess?: boolean;
  panNumber?: string;
  panNumberFile?: string;
  panNumberFileSuccess?: boolean;
  shopNumber?: string;
  shopNumberFile?: string;
  shopNumberFileSuccess?: boolean;
  esicNumber?: string;
  esicNumberFile?: string;
  esicNumberFileSuccess?: boolean;
  pfRegisterNumber?: string;
  pfNumberFile?: string;
  pfNumberFileSuccess?: boolean;
  paymentDetails?: string;
  payeeAddress?: string;
  creditperiod?: string;
  reason?: string;
}

export interface bankDetailsInterface {
  bankName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  addressline1?: string;
  addressline2?: string;
  pincode?: string;
  micrCode?: string;
  micrCodeFile?: string;
  micrCodeFileSuccess?: boolean;
}

export interface documentValue {
  esicNumberFileData?: any; //done
  gstNumberFileData?: any; //done
  panNumberFileData?: any; //done
  pfNumberFileData?: any; //done
  shopNumberFileData?: any;
  tinNumberFileData?: any; //done
  cancelledCheckFile?: any;
}
