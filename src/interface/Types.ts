export interface tabList {
  id: string;
  data: string;
  component: JSX.Element;
  isDisabled?: boolean;
  isPermission?: boolean;
  path?: string;
}
export interface stackButtonInterface {
  title: string;
  onClick?: string;
}

export interface userAddDetails {
  organizationId?: string;
  roleType: string;
  personalDetails: {
    employeeId: string;
    employeeName: string;
    email: string;
    mobileNumber: string;
  };
  channelAccessible: string[];
  roleAccessType: string;
  stateId: string[];
  cityId: string[];
  reportingTo: string;
  email: string;
  reportingToSecondary: string;
  employeeDetails: {
    designation: string;
    dateOfJoining: string;
  };
}

export interface buttonGroupInterface extends Array<stackButtonInterface> {}
export interface dataList extends Array<tabList> {}

export interface toggleFunctionType {
  toggle: (a: boolean) => void;
}

export interface lmsDataInterface {
  id?: string;
  application?: string;
  customerName?: string;
  mobileNumber?: number;
  cibil?: string;
  income?: string;
  status?: string;
  lead?: string;
  surrogateName?: string;
  dateTime?: string;
  Policy?: string;
  channelName?: string;
  processedBy?: string;
  kycStatus?: string;
  version?: string;
  currentStatus?: string;
  initiatedBy?: string;
  request?: string;
  dateAndTime?: string;
}
