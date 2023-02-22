import { lmsTableHeader } from '../../../utils/Constants';
import MoreVertIcon from '@mui/icons-material/MoreVert';
export const Configuration = [
  {
    label: 'Rejected',
    value: 'rejected',
  },
  {
    label: 'Dropped',
    value: 'dropped',
  },
];
export const SurrogateCheckboxList = [
  {
    label: 'Payroll',
    value: 'payroll',
    isChecked: false,
  },
  {
    label: 'Card For Card',
    value: 'cardForCard',
    isChecked: false,
  },
  {
    label: 'CIBIL',
    value: 'cibil',
    isChecked: false,
  },
  {
    label: 'AQB',
    value: 'aqb',
    isChecked: false,
  },
  {
    label: 'Pre-Approved',
    value: 'preapproved',
    isChecked: false,
  },
  {
    label: 'Secured',
    value: 'secured',
    isChecked: false,
  },
];
export const RejectionTypeCheckboxList = [
  {
    label: 'Score',
  },
  {
    label: 'CIBIL',
  },
  {
    label: 'DPD',
  },
  {
    label: 'Income',
  },
  {
    label: 'C4C',
  },
  {
    label: 'Pincode',
  },
  {
    label: 'KYC',
  },
  {
    label: 'Others',
  },
];
export const DroppedTypeCheckboxList = [
  {
    label: 'Initial Verification',
  },
  {
    label: 'Surrogate Selection',
  },
  {
    label: 'Employment Details',
  },
  {
    label: 'HRMS-Fetching Data',
  },
  {
    label: 'C4C-Eligible',
  },
  {
    label: 'C4C-Verification',
  },
  {
    label: 'Card Selection',
  },
  {
    label: 'KYC',
  },
  {
    label: 'HRMS-Input',
  },
  {
    label: 'All',
  },
];
export const CommunicationMode = [
  {
    label: 'SMS',
  },
  {
    label: 'Whatsapp',
  },
  {
    label: 'Mail',
  },
  {
    label: 'Call',
  },
];
export const FrequencyPeriod = [
  {
    label: 'Enter Days',
    value: 'EnterDays',
  },
  {
    label: 'Selected Date(s)',
    value: 'SelectedDates',
  },
];
export const EveryDays = [
  {
    name: '1',
    code: '2',
  },
  {
    name: '2',
    code: '2',
  },
  {
    name: '3',
    code: '2',
  },
  {
    name: '4',
    code: '2',
  },
  {
    name: '5',
    code: '2',
  },
];
export const EveryOrder = [
  {
    name: 'First',
    code: 'First',
  },
  {
    name: 'Second',
    code: 'Second',
  },
  {
    name: 'Third',
    code: 'Third',
  },
  {
    name: 'Fourth',
    code: 'Fourth',
  },
  {
    name: 'Last',
    code: 'Last',
  },
];
export const WeekDays = [
  {
    name: 'Monday',
    code: 'Monday',
  },
  {
    name: 'Tuesday',
    code: 'Tuesday',
  },
  {
    name: 'Wednesday',
    code: 'Wednesday',
  },
  {
    name: 'Thursday',
    code: 'Thursday',
  },
  {
    name: 'Friday',
    code: 'Friday',
  },
  {
    name: 'Saturday',
    code: 'Saturday',
  },
  {
    name: 'Sunday',
    code: 'Sunday',
  },
];
export const LMSListData = [
  {
    id: 1,
    rulename: '#12345',
    startsAt: '20 Oct,2022',
    endedAt: '28 Oct,2022',
    lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
    initiatedBy: '123',
    reTargeted: '1500000',
    status: 'Rejected',
    more: <MoreVertIcon />,
  },
  {
    id: 2,
    rulename: '#12345',
    startsAt: '20 Oct,2022',
    endedAt: '28 Oct,2022',
    lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
    initiatedBy: '123',
    reTargeted: '1500000',
    status: 'Rejected',
    more: <MoreVertIcon />,
  },
  {
    id: 3,
    rulename: '#12345',
    startsAt: '20 Oct,2022',
    endedAt: '28 Oct,2022',
    lastModifiedDateTime: '04 Feb 2023, 2:26 PM',
    initiatedBy: '123',
    reTargeted: '1500000',
    status: 'Approved',
    more: <MoreVertIcon />,
  },
];
export const GroupButtonData = [
  {
    title: 'All',
  },
  {
    title: 'Active',
  },
  {
    title: 'Saved',
  },
  {
    title: 'Closed',
  },
];
export const ShowMoreModalData = [
  {
    sNo: '1',
    typeAndDSA: 'Score',
  },
  {
    sNo: '2',
    typeAndDSA: 'CIBIL',
  },
  {
    sNo: '3',
    typeAndDSA: 'DPD',
  },
  {
    sNo: '4',
    typeAndDSA: 'Income',
  },
  {
    sNo: '5',
    typeAndDSA: 'C4C',
  },
  {
    sNo: '6',
    typeAndDSA: 'Pincode',
  },
  {
    sNo: '7',
    typeAndDSA: 'KYC',
  },
  {
    sNo: '8',
    typeAndDSA: 'Others',
  },
];
export const ApplicableOrNOT = [
  {
    name: 'Applicable',
    code: 'applicable',
  },
  {
    name: 'Not Applicable',
    code: 'notapplicable',
  },
];
export const DSAList = [
  {
    value: 'All',
    title: 'All',
    children: [
      { value: 'name1', title: 'Name 1' },
      { value: 'name2', title: 'Name 2' },
      { value: 'name3', title: 'Name 3' },
      { value: 'name4', title: 'Name 4' },
    ],
  },
];
export const DivisionList = [
  {
    value: 'All',
    title: 'All',
    children: [
      { value: 'name1', title: 'Name 1' },
      { value: 'name2', title: 'Name 2' },
      { value: 'name3', title: 'Name 3' },
      { value: 'name4', title: 'Name 4' },
    ],
  },
];
export const FintechPartnerList = [
  {
    value: 'All',
    title: 'All',
    children: [
      { value: 'name1', title: 'Name 1' },
      { value: 'name2', title: 'Name 2' },
      { value: 'name3', title: 'Name 3' },
      { value: 'name4', title: 'Name 4' },
    ],
  },
];
export const product_label = [
  {
    id: 1,
    label: lmsTableHeader.HEADING1,
    defaultChecked: true,
  },
  {
    id: 2,
    label: lmsTableHeader.HEADING2,
    defaultChecked: true,
  },
  {
    id: 3,
    label: lmsTableHeader.HEADING3,
    defaultChecked: true,
  },
  {
    id: 4,
    label: lmsTableHeader.HEADING4,
    defaultChecked: true,
  },
  {
    id: 5,
    label: lmsTableHeader.HEADING5,
    defaultChecked: true,
  },
  {
    id: 6,
    label: lmsTableHeader.HEADING6,
    defaultChecked: true,
  },
];
