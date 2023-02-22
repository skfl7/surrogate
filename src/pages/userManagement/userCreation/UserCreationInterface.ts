import { personalDetailsInterface } from './userCreation.const';

export interface PersonalDetailsInterface extends personalDetailsInterface {
  employeeId?: string;
  employeeName?: string;
  email?: string;
  mobileNumber?: string;
}

export interface EmployeeDetailsInterface extends personalDetailsInterface {
  designation: string;
  dateOfJoining: string;
  reportingHead: EmployeeDropdownInterface;
  optionalReportingHead: EmployeeDropdownInterface;
}

export interface EmployeeDropdownInterface {
  name?: string;
  userId?: string;
}

export interface UserDataInterface {
  organizationId: string;
  roleType: string;
  personalDetails: PersonalDetailsInterface;
  channelAccessible: string[];
  roleAccessType: string;
  stateId: string[];
  cityId: string[];
  zoneId: string[];
  branchId: string[];
  reportingTo: string;
  email: string;
  reportingToSecondary: string;
  employeeDetails: EmployeeDetailsInterface;
}

export interface DropdownInterface {
  code: string;
  name: string;
}
