import { colors } from '../Color';

export const useStyles = {
  tabs: {
    '& .MuiTabs-indicator': {
      backgroundColor: colors.blue,
      height: 2,
    },
    '& .MuiTab-root.Mui-selected': {
      color: colors.black,
    },
  },
  pagination: {
    '& .MuiInputBase-root': {
      width: '80px !important',
      display: 'flex',
      alignItems: 'flex-start',
      border: '1px solid #D2D2D3',
      marginLeft: '16px',
      marginRight: '16px',
      justifyContent: 'space-between',
      // backgroundColor: 'green',
      borderRadius: '4px',
    },
    '& .MuiTablePagination-select': {
      textAlignLast: 'left !important',
      textAlign: 'left !important',
    },
  },
  numberPag: {
    'ul > li:not(:first-child):not(:last-child) > button:not(.Mui-selected)': {
      backgroundColor: 'transparent',
      color: '#AFAEAF',
    },
    '& .Mui-selected': {
      backgroundColor: '#0662B7 !important',
      color: 'white',
    },
    'ul > li': {
      paddingLeft: '10px',
    },
  },
};
