export const PersonalDetails: personalDetailsInterface[] = [
  {
    label: 'Employee Id',
    placeHolder: 'Enter Employee Id',
    code: 'employeeId',
  },
  {
    label: 'Employee Name',
    placeHolder: 'Enter Employee Name',
    code: 'employeeName',
  },
  { label: 'Email Id', placeHolder: 'Enter Email Id', code: 'email' },
  {
    label: 'Mobile Number',
    placeHolder: 'Mobile Number',
    code: 'mobileNumber',
  },
];

export const EmploymentDetails: employmentDetailsInterface[] = [
  {
    label: 'Date of Joining',
    placeHolder: 'DD/MM/YYYY',
    code: 'dateOfJoining',
  },
  {
    label: 'Designation',
    placeHolder: 'Enter Designation',
    code: 'designation',
  },
  {
    label: 'Reporting Head',
    placeHolder: 'Enter Reporting Head',
    code: 'reportingHead',
  },
  {
    label: 'Optional Reporting Head',
    placeHolder: 'Enter Reporting Head (optional)',
    code: 'optionalReportingHead',
  },
];

export const dropdownTypes = [
  {
    name: 'STATE',
    label: 'State',
    displayOrder: 1,
  },
  {
    name: 'ZONE',
    label: 'Zone',
    displayOrder: 2,
  },
  {
    name: 'CITY',
    label: 'City',
    displayOrder: 3,
  },
  {
    name: 'BRANCH',
    label: 'Branch',
    displayOrder: 4,
  },
];

export const DropdownFields: dropdownFieldsInterface[] = [
  {
    label: 'State',
    option: [
      {
        value: 'All',
        title: 'All',
        children: [
          { value: 'tamilnadu', title: 'Tamilnadu' },
          { value: 'andra', title: 'Andhra' },
          { value: 'telungana', title: 'Telungana' },
          { value: 'karnataka', title: 'Karnataka' },
          { value: 'kerala', title: 'Kerala' },
        ],
      },
    ],
  },
  {
    label: 'Zone',
    option: [
      {
        value: 'All',
        title: 'All',
        children: [
          { value: 'tamilnadu', title: 'Tamilnadu' },
          { value: 'andra', title: 'Andhra' },
          { value: 'telungana', title: 'Telungana' },
          { value: 'karnataka', title: 'Karnataka' },
          { value: 'kerala', title: 'Kerala' },
        ],
      },
    ],
  },
  {
    label: 'District',
    option: [
      {
        value: 'All',
        title: 'All',
        children: [
          { value: 'tamilnadu', title: 'Tamilnadu' },
          { value: 'andra', title: 'Andhra' },
          { value: 'telungana', title: 'Telungana' },
          { value: 'karnataka', title: 'Karnataka' },
          { value: 'kerala', title: 'Kerala' },
        ],
      },
    ],
  },
  {
    label: 'Branch',
    option: [
      {
        value: 'All',
        title: 'All',
        children: [
          { value: 'tamilnadu', title: 'Tamilnadu' },
          { value: 'andra', title: 'Andhra' },
          { value: 'telungana', title: 'Telungana' },
          { value: 'karnataka', title: 'Karnataka' },
          { value: 'kerala', title: 'Kerala' },
        ],
      },
    ],
  },
];

export const ChannelDetails: channelDetailsInterface[] = [
  {
    label: 'Bank',
  },
  {
    label: 'DSA',
  },
  {
    label: 'Fintech Partner',
  },
];

export const RoleDetails: DropdownInterface[] = [
  {
    name: 'Initiator',
    code: 'INITIATOR',
  },
  {
    name: 'Reviewer',
    code: 'REVIEWER',
  },
  {
    name: 'Approver',
    code: 'APPROVER',
  },
  // {
  //   name: 'Admin',
  //   code: 'ADMIN',
  // },
];

export const RoleAccessFrom: roleAccessFromInterface[] = [
  {
    label: 'Role Presets',
    value: 'rolePresets',
  },
  {
    label: 'Other Existing users permission',
    value: 'other',
  },
];

export const PermissionsList = [
  {
    code: 'PRODUCT_MANAGEMENT',
    name: 'Product Management',
    roleAccess: 'NO',
    subAction: [
      {
        code: 'PROGRAM_MANAGEMENT',
        name: 'Program Management',
        roleAccess: 'NO',
        secondSubActions: [
          {
            code: 'PASS_RESUME_PROGRAM',
            name: 'PASS RESUME PROGRAM',
            roleAccess: 'NO',
            defaultEnable: 'NO',
          },
        ],
      },
      {
        code: 'CARD_CATALOGUE',
        name: 'Card catalogue',
        roleAccess: 'NO',
        secondSubActions: [
          {
            code: 'BULK_UPLOAD_CARD',
            name: 'BULK UPLOAD CARD',
            roleAccess: 'NO',
            defaultEnable: 'NO',
          },
        ],
      },
      {
        code: 'CREDIT_RULE',
        name: 'Credit rule',
        roleAccess: 'NO',
        secondSubActions: [
          {
            code: 'CREATE_CREDIT_RULE',
            name: 'CREATE CREDIT RULE',
            roleAccess: 'NO',
            defaultEnable: 'NO',
          },
        ],
      },
    ],
  },
];
export const ReviewerApproverList = [
  {
    name: 'Product Management',
    isVisible: true,
    subModules: [
      {
        subModuleName: 'Programme Management',
        reviewer: 1,
        approver: 1,
        isVisible: true,
        reviewerData: [
          {
            userName: 'vignesh',
            userId: '63aa87938d72dd219bc2875e',
          },
        ],
        approverData: [
          {
            userName: 'vignesh',
            userId: '63aa87938d72dd219bc2875e',
          },
        ],
      },
      {
        subModuleName: 'Credit Rule',
        reviewer: 1,
        approver: 1,
        isVisible: true,
        reviewerData: [
          {
            userName: 'vignesh',
            userId: '63aa87938d72dd219bc2875e',
          },
        ],
        approverData: [
          {
            userName: 'vignesh',
            userId: '63aa87938d72dd219bc2875e',
          },
        ],
      },
    ],
  },
  {
    name: 'Sales',
    isVisible: true,
    subModules: [
      {
        subModuleName: 'Customer reports',
        reviewer: 1,
        approver: 1,
        isVisible: true,
        reviewerData: [
          {
            userName: 'vignesh',
            userId: '63aa87938d72dd219bc2875e',
          },
        ],
        approverData: [
          {
            userName: 'vignesh',
            userId: '63aa87938d72dd219bc2875e',
          },
        ],
      },
      {
        subModuleName: 'Performance Report',
        reviewer: 1,
        approver: 1,
        isVisible: true,
        reviewerData: [
          {
            userName: 'vignesh',
            userId: '63aa87938d72dd219bc2875e',
          },
        ],
        approverData: [
          {
            userName: 'vignesh',
            userId: '63aa87938d72dd219bc2875e',
          },
        ],
      },
    ],
  },
  {
    name: 'User Management',
    isVisible: true,
    subModules: [
      {
        subModuleName: 'Role Creation',
        reviewer: 1,
        approver: 1,
        isVisible: true,
        reviewerData: [
          {
            userName: 'vignesh',
            userId: '63aa87938d72dd219bc2875e',
          },
        ],
        approverData: [
          {
            userName: 'vignesh',
            userId: '63aa87938d72dd219bc2875e',
          },
        ],
      },
      {
        subModuleName: 'User Creation',
        reviewer: 1,
        approver: 1,
        isVisible: true,
        reviewerData: [
          {
            userName: 'vignesh',
            userId: '63aa87938d72dd219bc2875e',
          },
        ],
        approverData: [
          {
            userName: 'vignesh',
            userId: '63aa87938d72dd219bc2875e',
          },
        ],
      },
    ],
  },
];

export const ReviewerApproverAllocation: reviewerApproverInterface[] = [
  {
    label: 'Yes, I will assign',
    value: 'yes,I',
  },
  {
    label: 'User will assign in their end',
    value: 'user',
  },
];

export const UserCreationPermissions = [
  {
    id: 1,
    label: 'Dashboard',
    isExpanded: false,
    isChecked: false,
  },
  {
    id: 2,
    label: 'Apply Credit Card',
    isExpanded: false,
    isChecked: false,
  },
  {
    id: 3,
    label: 'Product Management',
    isExpanded: true,
    isChecked: false,
    data: [
      {
        id: 1,
        innerTitle: 'Product Management',
        isSwitched: false,
        items: [
          {
            id: 1,
            label: 'View Programme Management',
            isChecked: false,
            isDisabled: true,
          },
          {
            id: 2,
            label: 'Pass & Resume Surrogate',
            isChecked: false,
            isDisabled: false,
          },
        ],
      },
      {
        id: 2,
        innerTitle: 'Credit Rule',
        isSwitched: false,
        items: [
          {
            id: 1,
            label: 'View Credit Rule',
            isChecked: false,
            isDisabled: true,
          },
          {
            id: 2,
            label: 'Create Credit Rule',
            isChecked: false,
            isDisabled: false,
          },
          {
            id: 3,
            label: 'View Operational Pincode',
            isChecked: false,
            isDisabled: false,
          },
          {
            id: 4,
            label: 'Edit Operational Pincode',
            isChecked: false,
            isDisabled: false,
          },
          {
            id: 5,
            label: 'BRE Back Test',
            isChecked: false,
            isDisabled: false,
          },
        ],
      },
      {
        id: 3,
        innerTitle: 'Card Catalog',
        isSwitched: false,
        items: [
          {
            id: 1,
            label: 'View Card',
            isChecked: false,
            isDisabled: true,
          },
          {
            id: 2,
            label: 'Bulk Card Upload',
            isChecked: false,
            isDisabled: false,
          },
          {
            id: 3,
            label: 'Activate/Deactivate',
            isChecked: false,
            isDisabled: false,
          },
          {
            id: 4,
            label: 'Assign Surrogate',
            isChecked: false,
            isDisabled: false,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    label: 'Sales',
    isExpanded: true,
    isChecked: false,
    data: [
      {
        id: 1,
        innerTitle: 'Dashboard',
        isSwitched: false,
        items: [
          {
            id: 1,
            label: 'View Sales Dashboard',
            isChecked: false,
            isDisabled: true,
          },
        ],
      },
      {
        id: 2,
        innerTitle: 'Performance Reports',
        isSwitched: false,
        items: [
          {
            id: 1,
            label: 'View Performance Report',
            isChecked: false,
            isDisabled: true,
          },
          {
            id: 2,
            label: 'Download/email report',
            isChecked: false,
            isDisabled: false,
          },
        ],
      },
      {
        id: 3,
        innerTitle: 'Customer Reports',
        isSwitched: false,
        items: [
          {
            id: 1,
            label: 'View Customer Reports',
            isChecked: false,
            isDisabled: true,
          },
          {
            id: 2,
            label: 'Download/email report',
            isChecked: false,
            isDisabled: false,
          },
        ],
      },
    ],
  },
  {
    id: 5,
    label: 'User Management',
    isExpanded: true,
    isChecked: false,
  },
  {
    id: 6,
    label: 'LMS',
    isExpanded: true,
    isChecked: false,
    data: [
      {
        id: 1,
        innerTitle: 'Dashboard',
        isSwitched: false,
        items: [
          {
            id: 1,
            label: 'View Dashboard',
            isChecked: false,
            isDisabled: true,
          },
          {
            id: 2,
            label: 'Download/Email Customer Data',
            isChecked: false,
            isDisabled: false,
          },
          {
            id: 3,
            label: 'Re-Target Application',
            isChecked: false,
            isDisabled: false,
          },
        ],
      },
      {
        id: 2,
        innerTitle: 'LMS Rule & Re-Targeting',
        isSwitched: false,
        items: [
          {
            id: 1,
            label: 'Create LMS Rule',
            isChecked: false,
            isDisabled: true,
          },
          {
            id: 2,
            label: 'Re-Target',
            isChecked: false,
            isDisabled: false,
          },
        ],
      },
    ],
  },
  {
    id: 7,
    label: 'Risk Management',
    isExpanded: true,
    isChecked: false,
    data: [
      {
        id: 1,
        innerTitle: 'Customer Report',
        isSwitched: false,
        items: [
          {
            id: 1,
            label: 'View Customer Report',
            isChecked: false,
            isDisabled: true,
          },
          {
            id: 2,
            label: 'Refer approval',
            isChecked: false,
            isDisabled: false,
          },
          {
            id: 3,
            label: 'Forced Action',
            isChecked: false,
            isDisabled: false,
          },
        ],
      },
    ],
  },
  {
    id: 8,
    label: 'Dev Support',
    isExpanded: true,
    isChecked: false,
    data: [
      {
        id: 1,
        innerTitle: 'Access Library',
        isSwitched: false,
        items: [
          {
            id: 1,
            label: 'View Access Library',
            isChecked: false,
            isDisabled: true,
          },
          {
            id: 2,
            label: 'Copy Links',
            isChecked: false,
            isDisabled: false,
          },
        ],
      },
    ],
  },
];

export interface userCreationFilterInterface {
  label?: string;
  option?: Array<object>;
}

export interface personalDetailsInterface {
  label?: string;
  placeHolder?: string;
  code?: string;
}

export interface employmentDetailsInterface {
  label?: string;
  placeHolder?: string;
  code?: string;
}
export interface dropdownFieldsInterface {
  label?: string;
  option?: Array<object>;
}

export interface channelDetailsInterface {
  label?: string;
}

export interface roleDetailsInterface {
  label?: string;
  value?: string;
}

export interface roleAccessFromInterface {
  label?: string;
  value?: string;
}

export interface reviewerApproverInterface {
  label?: string;
  value?: string;
}

export interface cardCatalogueFilterInterface {
  label?: string;
  option?: Array<object>;
}

interface DropdownInterface {
  code: string;
  name: string;
}

export const CardCatalogueDropdown: cardCatalogueFilterInterface[] = [
  {
    label: 'Card Mode',
    option: [
      { value: 'All', name: 'All Mode' },
      { value: 'Salaried', name: 'Salaried' },
      { value: 'Business', name: 'Business' },
      { value: 'Doctor', name: 'Doctor' },
      { value: 'Teacher', name: 'Teacher' },
      { value: 'Defence', name: 'Defence' },
      { value: 'Chartered Accountant', name: 'Chartered Accountant' },
      { value: 'FD Based', name: 'FD Based' },
    ],
  },
  {
    label: 'Card Category',
    option: [
      { value: 'All', name: 'All' },
      { value: 'Tamilnadu', name: 'Tamilnadu' },
      { value: 'Andra', name: 'Andhra' },
      { value: 'Telungana', name: 'Telungana' },
      { value: 'Karnataka', name: 'Karnataka' },
      { value: 'Kerala', name: 'Kerala' },
    ],
  },
  {
    label: 'Card Status',
    option: [
      { value: 'All', name: 'All' },
      { value: 'Tamilnadu', name: 'Tamilnadu' },
      { value: 'Andra', name: 'Andhra' },
      { value: 'Telungana', name: 'Telungana' },
      { value: 'Karnataka', name: 'Karnataka' },
      { value: 'Kerala', name: 'Kerala' },
    ],
  },
  {
    label: 'Choose Surrogate',
    option: [
      { value: 'All', name: 'All' },
      { value: 'Tamilnadu', name: 'Tamilnadu' },
      { value: 'Andra', name: 'Andhra' },
      { value: 'Telungana', name: 'Telungana' },
      { value: 'Karnataka', name: 'Karnataka' },
      { value: 'Kerala', name: 'Kerala' },
    ],
  },
];

export interface ZonefilterInterface {
  options?: Array<any>;
  // value?: string;
}
