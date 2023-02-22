export interface authorisationDataInterface {
  id?: any;
  version?: string;
  initiatedBy?: string;
  approvedBy?: string;
  lastModified?: string;
  date?: string;
  currentStatus?: string;
  actions?: string;
}

function createData(
  id: any,
  version: string,
  initiatedBy: string,
  approvedBy: string,
  date: string,
  currentStatus?: string
) {
  return {
    id,
    version,
    initiatedBy,
    approvedBy,
    date,
    currentStatus,
  };
}

export const authorisationRows = [
  createData(1, 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
  createData(2, 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
  createData(3, 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Closed'),
  createData(4, 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
  createData(5, 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
  createData(
    6,
    'v 1.0.0',
    'Vinith',
    'Vinith',
    '22/02/2022',
    'Waiting for Approval'
  ),
  createData(7, 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
  createData(8, 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Closed'),
  createData(9, 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
  createData(10, 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Closed'),
  // createData('11', 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
  // createData('12', 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Closed'),
  // createData('13', 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
  // createData('14', 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
  // createData('15', 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
  // createData('16', 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Closed'),
  // createData('17', 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
  // createData('18', 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
  // createData('19', 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Closed'),
  // createData('20', 'v 1.0.0', 'Vinith', 'Vinith', '22/02/2022', 'Active'),
];

export const authorisation_user_data = [
  {
    module_id: 1,
    module_name: 'Product Management',
    code: 'PRODUCT',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    sub_module: [
      {
        sub_module_id: 1,
        sub_module_name: 'Programme Management',
        code: 'PROGRAM',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [
            { user_id: 3, user_name: 'Ganesh' },

            { user_id: 4, user_name: 'Abishek' },
          ],
        },
      },
      {
        sub_module_id: 2,
        sub_module_name: 'Credit Rule',
        code: 'POLICY',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [
            { user_id: 3, user_name: 'Ganesh' },
            { user_id: 4, user_name: 'Abishek' },
          ],
        },
      },
      {
        sub_module_id: 3,
        sub_module_name: 'Card Catalog',
        code: 'CARD',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [{ user_id: 3, user_name: 'Ganesh' }],
        },
      },
    ],
  },
  {
    module_id: 2,
    module_name: 'User Management',
    code: 'USER_MANAGEMENT',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    sub_module: [
      {
        sub_module_id: 4,
        sub_module_name: 'Org.Structure',
        code: 'ORGANIZATION',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [{ user_id: 3, user_name: 'Ganesh' }],
        },
      },
      {
        sub_module_id: 5,
        sub_module_name: 'Branch Details',
        code: 'BRANCH',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [{ user_id: 3, user_name: 'Ganesh' }],
        },
      },
      {
        sub_module_id: 6,
        sub_module_name: 'Role Creation',
        code: 'ROLE',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [{ user_id: 3, user_name: 'Ganesh' }],
        },
      },
      {
        sub_module_id: 7,
        sub_module_name: 'User Creation',
        code: 'USER',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [{ user_id: 3, user_name: 'Ganesh' }],
        },
      },
    ],
  },
  {
    module_id: 3,
    module_name: 'LMS',
    code: 'LMS',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    sub_module: [
      {
        sub_module_id: 8,
        sub_module_name: 'LMS Rule',
        code: 'LMS',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [],
          approver_data: [],
        },
      },
    ],
  },
  {
    module_id: 4,
    module_name: 'Risk Management',
    code: 'RISK_MANAGEMENT',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    sub_module: [
      {
        sub_module_id: 9,
        sub_module_name: 'Customer Support',
        code: 'CUSTOMER_SUPPORT',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [{ user_id: 3, user_name: 'Ganesh' }],
        },
      },
    ],
  },
];

export const skelton = [
  {
    module_id: 1,
    module_name: 'Product Management',
    code: 'PRODUCT',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    sub_module: [
      {
        sub_module_id: 1,
        sub_module_name: 'Programme Management',
        code: 'PROGRAM',
        initiator_data: 1,
        reviewer_data: 0,
        approver_data: 0,
      },
      {
        sub_module_id: 2,
        sub_module_name: 'Credit Rule',
        code: 'POLICY',
        initiator_data: '',
        reviewer_data: 0,
        approver_data: 0,
      },
      {
        sub_module_id: 3,
        sub_module_name: 'Card Catalog',
        code: 'CARD',
        initiator_data: '',
        reviewer_data: 0,
        approver_data: 0,
      },
    ],
  },
  {
    module_id: 2,
    module_name: 'User Management',
    code: 'USER_MANAGEMENT',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    sub_module: [
      {
        sub_module_id: 4,
        sub_module_name: 'Org.Structure',
        code: 'ORGANIZATION',
        initiator_data: '',
        reviewer_data: 0,
        approver_data: 0,
      },
      {
        sub_module_id: 5,
        sub_module_name: 'Branch Details',
        code: 'BRANCH',
        initiator_data: '',
        reviewer_data: 0,
        approver_data: 0,
      },
      {
        sub_module_id: 6,
        sub_module_name: 'Role Creation',
        code: 'ROLE',
        initiator_data: '',
        reviewer_data: 0,
        approver_data: 0,
      },
      {
        sub_module_id: 7,
        sub_module_name: 'User Creation',
        code: 'USER',
        initiator_data: '',
        reviewer_data: 0,
        approver_data: 0,
      },
    ],
  },
  {
    module_id: 3,
    module_name: 'LMS',
    code: 'LMS',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    sub_module: [
      {
        sub_module_id: 8,
        sub_module_name: 'LMS Rule',
        code: 'LMS',
        initiator_data: '',
        reviewer_data: 0,
        approver_data: 0,
      },
    ],
  },
  {
    module_id: 4,
    module_name: 'Risk Management',
    code: 'RISK_MANAGEMENT',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    sub_module: [
      {
        sub_module_id: 9,
        sub_module_name: 'Customer Support',
        code: 'CUSTOMER_SUPPORT',
        initiator_data: '',
        reviewer_data: 0,
        approver_data: 0,
      },
    ],
  },
];

export const review_user_data = [
  {
    module_id: 1,
    module_name: 'Product Management',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    sub_module: [
      {
        sub_module_id: 1,
        sub_module_name: 'Programme Management',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [
            { user_id: 3, user_name: 'Ganesh' },
            { user_id: 4, user_name: 'Abishek' },
          ],
        },
      },
      {
        sub_module_id: 2,
        sub_module_name: 'Credit Rule',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [
            { user_id: 3, user_name: 'Ganesh' },
            { user_id: 4, user_name: 'Abishek' },
          ],
        },
      },
      {
        sub_module_id: 3,
        sub_module_name: 'Card Catalog',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [{ user_id: 3, user_name: 'Ganesh' }],
        },
      },
    ],
  },
  {
    module_id: 2,
    module_name: 'Sales',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    sub_module: [
      {
        sub_module_id: 9,
        sub_module_name: 'Customer Support',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [
            { user_id: 3, user_name: 'Ganesh' },
            { user_id: 4, user_name: 'Abishek' },
          ],
          approver_data: [{ user_id: 3, user_name: 'Ganesh' }],
        },
      },
    ],
  },
  {
    module_id: 3,
    module_name: 'User Management',
    sub_modules: 'Sub-modules',
    reviewer: 'Reviewer',
    approver: 'Approver',
    sub_module: [
      {
        sub_module_id: 4,
        sub_module_name: 'Org.Structure',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [{ user_id: 3, user_name: 'Ganesh' }],
        },
      },
      {
        sub_module_id: 5,
        sub_module_name: 'Branch Details',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [{ user_id: 3, user_name: 'Ganesh' }],
        },
      },
      {
        sub_module_id: 6,
        sub_module_name: 'Role Creation',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [{ user_id: 3, user_name: 'Ganesh' }],
        },
      },
      {
        sub_module_id: 7,
        sub_module_name: 'User Creation',
        sub_module_data: {
          initiator_data: [{ user_id: 1, user_name: 'Parithi' }],
          reviewer_data: [{ user_id: 2, user_name: 'Ashwin' }],
          approver_data: [{ user_id: 3, user_name: 'Ganesh' }],
        },
      },
    ],
  },
];

export const auth_payload = {
  authorizationId: '63996c33d2260f77e0137d92',

  productManagement: {
    programManagement: {
      reviewer: 1,
      approver: 1,
    },
    creditRule: {
      reviewer: 1,
      approver: 1,
    },
    cardCatalog: {
      reviewer: 1,
      approver: 1,
    },
  },
  userManagement: {
    organizationStructure: {
      reviewer: 1,
      approver: 1,
    },
    branchDetails: {
      reviewer: 1,
      approver: 1,
    },
    roleCreation: {
      reviewer: 1,
      approver: 1,
    },
    userCreation: {
      reviewer: 1,
      approver: 1,
    },
  },
  lms: {
    lmsRule: {
      reviewer: 1,
      approver: 1,
    },
  },
  riskManagement: {
    customerSupport: {
      reviewer: 1,
      approver: 1,
    },
  },
};
