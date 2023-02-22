/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import localforage from 'localforage';

// MUI components
import {
  Badge,
  Box,
  Dialog,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Assets
import YesBank from '../../assets/images/bank_axis_logo.svg';
import Home from '../../assets/icons/home_icon.svg';
import drop_up_arrow_icon from '../../assets/icons/drop_up_arrow_icon.svg';
import drop_down_arrow_icon from '../../assets/icons/drop_down_arrow_icon.svg';
import access_library from '../../assets/icons/access_library.svg';
import dashboard_icon from '../../assets/icons/dashboard_icon.svg';
import dashboard_white from '../../assets/icons/dashboard_white.svg';
import home_white from '../../assets/icons/home_white.svg';
import access_library_white from '../../assets/icons/access_library_white.svg';
import credit_rule_icon from '../../assets/icons/credit_rule_icon.svg';
import credit_rule_icon_white from '../../assets/icons/credit_rule_icon_white.svg';
import card_catalogue_icon from '../../assets/icons/card_catalogue_icon.svg';
import card_catalogue_icon_white from '../../assets/icons/card_catalogue_icon_white.svg';
import sales_report_white from '../../assets/icons/sales_report_white.svg';
import apply_credit_card_icon from '../../assets/icons/apply_credit_card_icon.svg';
import collape_icon from '../../assets/icons/collape_icon.svg';
import White_Hover_arrow_left from '../../assets/icons/White_Hover_arrow_left.svg';
import sales_icon from '../../assets/icons/sales_icon.svg';
import user_managemen_icon from '../../assets/icons/user_managemen_icon.svg';
import userCreation_white from '../../assets/icons/userCreation_white.svg';
import risk_management_icon from '../../assets/icons/risk_management_icon.svg';
import lms_icon from '../../assets/icons/lms_icon.svg';
import product_management_icon from '../../assets/icons/product_management_icon.svg';
import sales_dashboard_icon from '../../assets/icons/sales_dashboard_icon.svg';
import sales_dashboard_white from '../../assets/icons/sales_dashboard_white.svg';
import sales_report_icon_sidebar from '../../assets/icons/sales_report_icon_sidebar.svg';
import performance_report_icon from '../../assets/icons/performance_report_icon.svg';
import performance_report_white from '../../assets/icons/performance_report_white.svg';
import programme_management_icon from '../../assets/icons/programme_management_icon.svg';
import role_creation_icon from '../../assets/icons/roleCreation.svg';
import user_creation_icon from '../../assets/icons/userCreation.svg';
import org_structure_icon from '../../assets/icons/orgStructure.svg';
import orgStructure_white from '../../assets/icons/orgStructure_white.svg';
import retargeting_white from '../../assets/icons/retargeting_white.svg';
import retargeting_icon from '../../assets/icons/retargeting-icon.svg';
import lms_rule_icon from '../../assets/icons/lms-rule-icon.svg';
import lms_rule_white from '../../assets/icons/lms_rule_white.svg';
import powerByM2p from '../../assets/icons/power_by_icon.svg';
import risk_customer_report from '../../assets/icons/risk-customer-report.svg';
import programme_management_white from '../../assets/icons/programme_management_white.svg';
import apply_credit_card_white from '../../assets/icons/apply_credit_card_white.svg';
import roleCreation_white from '../../assets/icons/roleCreation_white.svg';
import profile_img from '../../assets/images/profile.svg';
import logout_img from '../../assets/images/logout.svg';
import profile_icon from '../../assets/icons/profile_icon.svg';
import profile_arrow_icon from '../../assets/icons/profile_arrow_icon.svg';
import collapse_logo from '../../assets/icons/collapse_logo.svg';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

// Styles
import './Layout.scss';
import { getPermission } from '../../utils/ActionAllowed/UserActionAllowed';

const drawerWidth = 300;
const drawerWidthMobile = 250;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  // overflowX: "hidden",
  overflow: 'unset',
  backgroundColor: 'black',
  color: 'white',
  zIndex: 1,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflow: 'unset',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: 'black',
  color: 'white',
});

const DrawerHeaderTab = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
const DrawerTab = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDivider-root': { borderColor: 'grey' },
  '& .MuiListItemIcon-root': { minWidth: '20px' },
  '& .MuiButtonBase-root-MuiListItemButton-root ': { padding: '0 4rem' },
  '& .MuiButtonBase-root MuiListItemButton-root MuiListItemButton-gutters MuiListItemButton-root MuiListItemButton-gutters MuiButtonBase-root-MuiListItemButton-root':
    { padding: '0 4rem !important' },
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const openedMixinMobile = (theme: Theme): CSSObject => ({
  width: drawerWidthMobile,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  // overflowX: "hidden",
  overflow: 'unset',
  backgroundColor: 'black',
  color: 'white',
  zIndex: 1,
});

const closedMixinMobile = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflow: 'unset',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: 'black',
  color: 'white',
});

const DrawerHeaderMobile = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
const DrawerMobile = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidthMobile,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDivider-root': { borderColor: 'grey' },
  '& .MuiListItemIcon-root': { minWidth: '20px' },
  '& .MuiButtonBase-root-MuiListItemButton-root ': { padding: '0 4rem' },
  '& .MuiButtonBase-root MuiListItemButton-root MuiListItemButton-gutters MuiListItemButton-root MuiListItemButton-gutters MuiButtonBase-root-MuiListItemButton-root':
    { padding: '0 4rem !important' },
  ...(open && {
    ...openedMixinMobile(theme),
    '& .MuiDrawer-paper': openedMixinMobile(theme),
  }),
  ...(!open && {
    ...closedMixinMobile(theme),
    '& .MuiDrawer-paper': closedMixinMobile(theme),
  }),
}));

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(true);

  //modile
  const [openMobile, setOpenMobile] = React.useState(true);

  const [openIndex, setOpenIndex] = React.useState(0);
  const [openList, setOpenList] = React.useState(false);
  const [checkIndex, setCheckIndex] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElMenuBar, setAnchorElMenuBar] =
    React.useState<null | HTMLElement>(null);
  const [menuItemIndex, setMenuItemIndex] = React.useState<any>();
  const [menuItemSubIndex, setMenuItemSubIndex] = React.useState<any>();
  const [closedMenuAnchorEl, setClosedMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [openSubMenu, setOpenSubMenu] = React.useState(true);

  const openMenu = Boolean(anchorEl);
  const openClosedSubMenu = Boolean(closedMenuAnchorEl);

  const wrapperRef = useRef<any>();
  const [employeeName, setEmployeeName] = useState('');
  const [roleType, setRoletype] = useState('');
  const [actionAllowedItem, setActionAllowedItem] = useState([]);
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const openMenuBarMobile = Boolean(anchorElMenuBar);

  const sideBarOptions = [
    {
      key: 1,
      content: 'HOME',
      path: '/portal',
      image: Home,
      active_image: home_white,
      subContent: [],
      isVisible: true,
    },
    {
      key: 2,
      content: 'DASHBOARD',
      path: '/dashboard',
      image: dashboard_icon,
      active_image: dashboard_white,
      subContent: [],
      isVisible:
        getPermission(actionAllowedItem, 'DASHBOARD', 'DASHBOARD') &&
        getPermission(
          actionAllowedItem,
          'DASHBOARD',
          'DASHBOARD',
          'MAIN_DASHBOARD'
        ),
    },
    {
      key: 3,
      content: 'PRODUCT MNGMT.',
      path: '/productManagement',
      image: product_management_icon,
      isVisible: getPermission(actionAllowedItem, 'PRODUCT_MANAGEMENT'),

      subContent: [
        {
          key: 31,
          data: 'Programme Mngmt.',
          path: '/productManagement/programmeManagement',
          active_image: programme_management_white,
          img: programme_management_icon,
          isVisible:
            getPermission(
              actionAllowedItem,
              'PRODUCT_MANAGEMENT',
              'PROGRAM_MANAGEMENT'
            ) &&
            getPermission(
              actionAllowedItem,
              'PRODUCT_MANAGEMENT',
              'PROGRAM_MANAGEMENT',
              'VIEW_PROGRAM_MANAGEMENT'
            ),
        },
        {
          key: 32,
          data: 'Credit Rule',
          path: '/productManagement/creditRule',
          active_image: credit_rule_icon_white,
          img: credit_rule_icon,
          isVisible: getPermission(
            actionAllowedItem,
            'PRODUCT_MANAGEMENT',
            'CREDIT_RULE'
          ),
        },
        {
          key: 33,
          data: 'Card Catalogue',
          path: '/productManagement/cardCatalogue',
          active_image: card_catalogue_icon_white,
          img: card_catalogue_icon,
          isVisible:
            getPermission(
              actionAllowedItem,
              'PRODUCT_MANAGEMENT',
              'CARD_CATALOGUE'
            ) &&
            getPermission(
              actionAllowedItem,
              'PRODUCT_MANAGEMENT',
              'CARD_CATALOGUE',
              'VIEW_CARD'
            ),
        },
      ],
    },
    {
      key: 4,
      content: 'SALES',
      path: '/sales',
      image: sales_icon,
      isVisible: getPermission(actionAllowedItem, 'SALES'),

      subContent: [
        {
          key: 41,
          data: 'Dashboard',
          path: '/sales/salesDashboard',
          active_image: sales_dashboard_white,
          img: sales_dashboard_icon,
          isVisible:
            getPermission(actionAllowedItem, 'SALES', 'SALES_DASHBOARD') &&
            getPermission(
              actionAllowedItem,
              'SALES',
              'SALES_DASHBOARD',
              'VIEW_SALES'
            ),
        },
        {
          key: 42,
          data: 'Sales Report',
          path: '/sales/salesReport',
          active_image: sales_report_white,
          img: sales_report_icon_sidebar,
          isVisible:
            getPermission(actionAllowedItem, 'SALES', 'CUSTOMER_REPORT') &&
            getPermission(
              actionAllowedItem,
              'SALES',
              'CUSTOMER_REPORT',
              'VIEW_CUSTOMER_REPORT'
            ),
        },
        {
          key: 43,
          data: 'Performance Report',
          path: '/sales/performanceReport',
          active_image: performance_report_white,
          img: performance_report_icon,
          isVisible:
            getPermission(actionAllowedItem, 'SALES', 'PERFORMANCE_REPORT') &&
            getPermission(
              actionAllowedItem,
              'SALES',
              'PERFORMANCE_REPORT',
              'VIEW_PERFORMANCE_REPORT'
            ),
        },
      ],
    },
    {
      key: 5,
      content: 'APPLY CREDIT CARD',
      path: '/applyCreditCard',
      image: apply_credit_card_icon,
      active_image: apply_credit_card_white,
      subContent: [],
      isVisible: getPermission(
        actionAllowedItem,
        'APPLY_CREDIT_CARD',
        'APPLY_CREDIT_CARD'
      ),
    },
    {
      key: 6,
      content: 'USER MNGMT.',
      path: '/userManagement',
      image: user_managemen_icon,
      isVisible: getPermission(actionAllowedItem, 'USER_MANAGEMENT'),

      subContent: [
        {
          key: 61,
          data: 'Role Creation',
          path: '/userManagement/roleCreation',
          active_image: roleCreation_white,
          img: role_creation_icon,
          isVisible:
            getPermission(
              actionAllowedItem,
              'USER_MANAGEMENT',
              'ROLE_CREATION'
            ) &&
            getPermission(
              actionAllowedItem,
              'USER_MANAGEMENT',
              'ROLE_CREATION',
              'VIEW_ROLES'
            ),
        },
        {
          key: 62,
          data: 'User Creation',
          path: '/userManagement/userCreation',
          active_image: userCreation_white,
          img: user_creation_icon,
          isVisible:
            getPermission(
              actionAllowedItem,
              'USER_MANAGEMENT',
              'USER_CREATION'
            ) &&
            getPermission(
              actionAllowedItem,
              'USER_MANAGEMENT',
              'USER_CREATION',
              'VIEW_USERS'
            ),
        },
        {
          key: 63,
          data: 'Org Structure',
          path: '/userManagement/orgStructure',
          active_image: orgStructure_white,
          img: org_structure_icon,
          isVisible:
            getPermission(
              actionAllowedItem,
              'USER_MANAGEMENT',
              'ORGANIZATION_STRUCTURE'
            ) &&
            getPermission(
              actionAllowedItem,
              'USER_MANAGEMENT',
              'ORGANIZATION_STRUCTURE',
              'VIEW_ORGANIZATION'
            ),
        },
        // {
        //   data: 'Branch Details',
        //   path: '/userManagement/branchDetails',
        //   img: branch_details_icon,
        // },
      ],
    },
    {
      key: 7,
      content: 'LMS',
      path: '/lms',
      image: lms_icon,
      isVisible: getPermission(actionAllowedItem, 'LMS'),
      subContent: [
        {
          key: 71,
          data: 'Dashboard',
          path: '/lms/dashboard',
          active_image: dashboard_white,
          img: dashboard_icon,
          isVisible:
            getPermission(actionAllowedItem, 'LMS', 'LMS_DASHBOARD') &&
            getPermission(
              actionAllowedItem,
              'LMS',
              'LMS_DASHBOARD',
              'VIEW_LMS_DASHBOARD'
            ),
        },
        {
          key: 72,
          data: 'LMS Rule',
          path: '/lms/lmsRule',
          active_image: retargeting_white,
          img: retargeting_icon,
          isVisible: getPermission(
            actionAllowedItem,
            'LMS',
            'LMS_RULE_RE_TARGET'
          ),
        },
        {
          key: 73,
          data: 'Re-Targeting',
          path: '/lms/retargeting',
          active_image: lms_rule_white,
          img: lms_rule_icon,
          isVisible: getPermission(
            actionAllowedItem,
            'LMS',
            'LMS_RULE_RE_TARGET'
          ),
        },
      ],
    },
    {
      key: 8,
      content: 'RISK MNGMT.',
      path: '/risktManagement',
      image: risk_management_icon,
      isVisible:
        getPermission(actionAllowedItem, 'RISK_MANAGEMENT') &&
        getPermission(
          actionAllowedItem,
          'RISK_MANAGEMENT',
          'RISK_MANAGEMENT_CUSTOMER_REPORT'
        ) &&
        getPermission(
          actionAllowedItem,
          'RISK_MANAGEMENT',
          'RISK_MANAGEMENT_CUSTOMER_REPORT',
          'VIEW_RISK_MANAGEMENT_CUSTOMER_REPORT'
        ),

      subContent: [
        {
          key: 81,
          data: 'Customer Reports',
          path: '/riskManagement',
          active_image: sales_report_white,
          img: risk_customer_report,
          isVisible: getPermission(
            actionAllowedItem,
            'RISK_MANAGEMENT',
            'RISK_MANAGEMENT_CUSTOMER_REPORT'
          ),
        },
      ],
    },
    {
      key: 9,
      content: 'ACCESS LIBRARY',
      path: '/accessLibrary',
      image: access_library,
      active_image: access_library_white,
      subContent: [],
      isVisible: getPermission(
        actionAllowedItem,
        'DEV_SUPPORT',
        'ACCESS_LIBRARY',
        'VIEW_ACCESS_LIBRARY'
      ),
    },
  ];
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    if (windowDimensions.width <= 1024) {
      setOpen(false);
    }
  }, [open, windowDimensions]);
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }
  const handleCloseMenuBar = () => {
    setAnchorElMenuBar(null);
  };
  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenuBar(event.currentTarget);
  };

  useEffect(() => {
    let locationPath = location.pathname;
    setMenuItemIndex(
      sideBarOptions.find((item) => item.path === locationPath)?.key
    );

    let locationPathMenu = location.pathname?.split('/');

    if (locationPathMenu.length) {
      const mainMenuKey = '/' + locationPathMenu[1];
      const subMenuKey = '/' + locationPathMenu[2];

      const mainMainObj = sideBarOptions?.find(
        (item) => item.path === mainMenuKey
      )?.subContent;
      setMenuItemSubIndex(
        mainMainObj?.find(
          (itemObj) => itemObj.path === mainMenuKey + subMenuKey
        )?.key
      );
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current?.contains(event.target)) {
        if (!event.target.className.includes('first-item')) {
          //This if condition is to make sure openSubMenu state is set instead of closing the menu
          setClosedMenuAnchorEl(null);
        }
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localforage
      .removeItem('loggedinUser')
      .then(function () {
        // Run this code once the key has been removed.
        console.log('Key is cleared!');
        window.location.reload();
        localStorage.removeItem('isLoggedin');
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
  };
  const onClickHandleProfile = () => {
    navigate('/profile');
    setAnchorEl(null);
  };

  const handleDrawerClose = () => {
    // let value = !open;
    setOpen(!open);
    // callback(value);
    setClosedMenuAnchorEl(null);
  };

  const closeHamberIcon = () => {
    setAnchorElMenuBar(null);
  };
  const handleClick = (id: number) => {
    setOpenIndex(id);
    if (checkIndex === id) {
      setOpenList(!openList);
    } else {
      setOpenList(true);
    }
  };
  const listStyle = {
    display: 'block',
  };
  const badgeStyle = {
    '& .MuiBadge-badge': {
      // width: 8,
      // height: 13,
      // borderRadius: '50%',
      fontSize: '10px',
    },
  };

  const handleSubMenu = (mainMenuKey: any, value: any, index: any) => {
    const mainMenuObj = sideBarOptions.find(
      (item) => item.key === mainMenuKey
    )?.subContent;

    setMenuItemSubIndex(
      mainMenuObj?.find((itemObj) => itemObj.key === value)?.key
    );
    setClosedMenuAnchorEl(null);
  };
  useEffect(() => {
    getLocalStorageValue();
  }, []);

  const getLocalStorageValue = async () => {
    try {
      const value: any = await localforage.getItem('loggedinUser');
      setEmployeeName(value?.personalDetails?.employeeName);
      setRoletype(value?.employeeDetails?.designation);
      setActionAllowedItem(value?.actionsAllowed);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main>
      <Box
        sx={{
          display: 'flex',
          background: '#F0F2F5',
          position: 'relative',
          width: '100%',
        }}
        ref={wrapperRef}
      >
        {/* Tab and Destop Navbar start */}
        <DrawerTab
          variant="permanent"
          open={open}
          className="sidebar-main"
          sx={{ display: { xs: 'none', md: 'block' } }} //
        >
          <DrawerHeaderTab>
            {open ? (
              <IconButton sx={{ height: '72px' }}>
                <img src={YesBank} alt="" style={{ padding: '0px 4px' }} />
              </IconButton>
            ) : (
              <IconButton sx={{ padding: '0px 4px', height: '72px' }}>
                <img
                  src={collapse_logo}
                  alt=""
                  style={{ padding: '0', margin: '0 auto' }}
                />
              </IconButton>
            )}

            <IconButton
              onClick={handleDrawerClose}
              sx={{ display: { md: 'none', lg: 'block' } }}
            >
              <img
                // src={theme.direction === 'rtl' ? collape_icon : collape_icon}
                src={collape_icon}
                style={{
                  // marginTop: "10px",
                  position: 'absolute',
                  top: '4.1vh',
                  zIndex: 999999,
                  right: open ? '-135px' : '-5px',
                  // boxShadow: '0 0 18px #dfe0e3',
                }}
                alt=""
              />
            </IconButton>
          </DrawerHeaderTab>
          <Divider />
          <List className="sidebar-menu" sx={{ margin: '24px 0' }}>
            {sideBarOptions.map((text, index) => {
              return text.isVisible ? (
                <ListItem
                  key={text.content}
                  disablePadding
                  sx={listStyle}
                  onClick={() => setCheckIndex(text.key)}
                >
                  {text.subContent.length === 0 && (
                    // <Link to={text.path}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        // px: 2.5,
                        padding: open ? '8px 25px' : '0',
                        borderRadius: '4px',
                        ':hover': {
                          color: 'white',
                        },
                        fontWeight: '400',
                        fontSize: '14px',
                      }}
                      className="lineDiv"
                      component={NavLink}
                      to={text.path}
                      // classes={({ isActive }: any) =>
                      //   isActive ? 'active' : 'inactive'
                      // }
                      onClick={() => {
                        setMenuItemIndex(text.key);
                        setClosedMenuAnchorEl(null);
                        setOpenList(false);
                        setOpenIndex(-1);
                      }}
                      // style={{
                      //   backgroundColor:
                      //     menuItemIndex === index + 1 ? '#0662B7' : '',
                      // }}
                      // disabled={text?.isVisible}
                    >
                      {menuItemIndex === index + 1 && (
                        <span className="lineActive"></span>
                      )}
                      {/* <ListItemIcon sx={{ margin: '0' }}>
                        <img src={text.image} alt="" style={{ padding: '0' }} />
                      </ListItemIcon>
                      {!open && (
                        <img
                          // src={Hover_arrow_left}
                          src={White_Hover_arrow_left}
                          alt=""
                          style={{
                            position: 'absolute',
                            top: '29px',
                            right: '13px',
                          }}
                        />
                      )} */}
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          margin: open ? '0' : '0',
                          justifyContent: 'center',
                          fontWeight: '100',
                        }}
                      >
                        <img
                          src={
                            menuItemIndex === index + 1
                              ? text?.active_image
                              : text.image
                          }
                          alt=""
                        />
                      </ListItemIcon>
                      {open && text.content === 'HOME' && (
                        <Badge
                          badgeContent={2}
                          color="error"
                          sx={badgeStyle}
                          overlap="circular"
                        >
                          <ListItemText
                            primary={text.content}
                            sx={{
                              display: open ? 'block' : 'none',
                              paddingLeft: '8px',
                              fontWeight: '400',
                              fontSize: '14px',
                            }}
                          />
                        </Badge>
                      )}
                      {open && text.content !== 'HOME' && (
                        <ListItemText
                          primary={text.content}
                          sx={{
                            opacity: open ? 1 : 0,
                            padding: '0 0.5rem',
                          }}
                        />
                      )}
                    </ListItemButton>
                  )}
                  {text.subContent.length > 0 && (
                    <>
                      <ListItemButton
                        onClick={(event: any) => {
                          handleClick(text.key);
                          setMenuItemIndex(text.key);
                          setClosedMenuAnchorEl(event.currentTarget);
                          setOpenSubMenu(true);
                        }}
                        sx={{
                          // borderLeft:
                          //   // (openList && openIndex === index + 1) ||
                          //   !open && openIndex === index + 1
                          //     ? '4px solid #CBE0F5'
                          //     : '',

                          // backgroundColor:
                          //   openIndex === index + 1
                          //     ? openList
                          //       ? ' #4D4E50'
                          //       : !open
                          //       ? 'blue'
                          //       : ''
                          //     : '',

                          borderLeft:
                            !open && openIndex === index + 1
                              ? '4px solid #CBE0F5'
                              : '',

                          backgroundColor:
                            !open && openIndex === index + 1
                              ? '#0662B7'
                              : openList && openIndex === index + 1
                              ? '#4D4E50'
                              : '',
                          '&:hover': {
                            backgroundColor:
                              (openList && openIndex === index + 1) ||
                              (!open && openIndex === index + 1)
                                ? '#4D4E50'
                                : '',
                          },
                          borderRadius: '0px',
                          padding: open ? '8px 25px' : '15px 25px',
                        }}
                        // disabled={text?.isVisible}
                      >
                        <ListItemIcon sx={{ margin: open ? '0' : '0' }}>
                          <img
                            src={text.image}
                            alt=""
                            style={{ padding: '0' }}
                          />
                        </ListItemIcon>
                        {!open && (
                          <img
                            // src={Hover_arrow_left}
                            src={White_Hover_arrow_left}
                            alt=""
                            style={{
                              position: 'absolute',
                              top: '29px',
                              right: '13px',
                            }}
                          />
                        )}
                        {open && (
                          <ListItemText
                            primary={text.content}
                            sx={{
                              opacity: open ? 1 : 0,
                              padding: '0',
                              paddingLeft: '8px',
                              color: 'white',
                            }}
                          />
                        )}

                        {open && (
                          <img
                            src={
                              openList && openIndex === index + 1
                                ? drop_up_arrow_icon
                                : drop_down_arrow_icon
                            }
                            alt=""
                          />
                        )}
                      </ListItemButton>
                      {openIndex === index + 1 &&
                        open &&
                        text.subContent.length > 0 &&
                        text.subContent.map((subData, index) => {
                          return subData?.isVisible ? (
                            <ListItemButton
                              key={subData.key}
                              component={NavLink}
                              to={subData.path}
                              // classes={({ isActive }: any) =>
                              //   isActive ? 'active' : 'inactive'
                              // }
                              sx={{
                                padding: '0',
                                // padding: '8px 18px',
                                backgroundColor: '#282829',
                                '&:hover': {
                                  backgroundColor: '#282829',
                                },
                                borderRadius: '4px',
                              }}
                              className="lineDiv"
                              onClick={() =>
                                handleSubMenu(text.key, subData.key, index)
                              }
                            >
                              {menuItemSubIndex ===
                                menuItemIndex * 10 + (index + 1) && (
                                <span className="lineActive"></span>
                              )}
                              <Collapse
                                in={openList}
                                timeout="auto"
                                unmountOnExit
                                sx={
                                  {
                                    // padding: '0 2.6rem',
                                    // backgroundColor: 'grey',
                                  }
                                }
                              >
                                <List
                                  component="div"
                                  disablePadding
                                  sx={{ padding: '0' }}
                                >
                                  {/* <Link to={subData.path}> */}
                                  <ListItemButton
                                    sx={{ pl: 7 }}
                                    // component={NavLink}
                                    // to={subData.path}
                                    // classes={({ isActive }: any) =>
                                    //   isActive ? 'active' : 'inactive'
                                    // }
                                  >
                                    <ListItemIcon>
                                      <img
                                        src={
                                          menuItemSubIndex ===
                                          menuItemIndex * 10 + (index + 1)
                                            ? subData.active_image
                                            : subData.img
                                        }
                                        alt=""
                                      />
                                    </ListItemIcon>
                                    {open && (
                                      <ListItemText
                                        primary={subData.data}
                                        sx={{
                                          paddingLeft: '8px',
                                          color: '#FFFFFF',
                                          fontWeight: '400',
                                          fontSize: '14px !important',
                                        }}
                                      />
                                    )}
                                  </ListItemButton>
                                  {/* </Link> */}
                                </List>
                              </Collapse>
                            </ListItemButton>
                          ) : (
                            ''
                          );
                        })}
                      {openIndex === index + 1 &&
                        !open &&
                        text.subContent.length > 0 && (
                          <Menu
                            id="fade-menu"
                            anchorEl={closedMenuAnchorEl}
                            open={openClosedSubMenu}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            className="sub-menu"
                            // ref={wrapperRef}
                          >
                            <MenuItem
                              key={text.content}
                              className="first-item"
                              onClick={() =>
                                setOpenSubMenu((value: boolean) => !value)
                              }
                            >
                              {text.content}
                              <img
                                src={
                                  openSubMenu
                                    ? drop_up_arrow_icon
                                    : drop_down_arrow_icon
                                }
                                alt=""
                              />
                            </MenuItem>
                            {openSubMenu &&
                              text.subContent.map((content: any) => (
                                <ListItemButton
                                  key={content.key}
                                  component={NavLink}
                                  to={content.path}
                                  // classes={({ isActive }: any) =>
                                  //   isActive ? 'active' : 'inactive'
                                  // }
                                  sx={{
                                    padding: '0',
                                    // padding: '8px 18px',
                                    backgroundColor: '#282829',
                                    '&:hover': {
                                      backgroundColor: '#282829',
                                    },
                                    borderRadius: '4px',
                                  }}
                                  className="lineDiv"
                                  onClick={() => {
                                    handleSubMenu(text.key, content.key, index);
                                    setClosedMenuAnchorEl(null);
                                  }}
                                >
                                  <MenuItem key={content.data}>
                                    <ListItemIcon>
                                      <img src={content.img} alt="" />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={content.data}
                                      sx={{
                                        fontWeight: '400',
                                        fontSize: '14px',
                                      }}
                                    />
                                  </MenuItem>
                                </ListItemButton>
                              ))}
                          </Menu>
                        )}
                    </>
                  )}
                </ListItem>
              ) : (
                ''
              );
            })}
          </List>
          {open ? (
            <Stack sx={{ position: 'absolute', bottom: '5px' }}>
              <Stack
                sx={{
                  padding: '15px 25px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Box className="powerByStyle">Powered by</Box>
                <Box style={{ marginLeft: '9px' }}>
                  <img src={powerByM2p} alt="" width="20px" height="20px" />
                </Box>
              </Stack>
            </Stack>
          ) : (
            <Stack sx={{ position: 'absolute', bottom: '5px' }}>
              <Stack
                sx={{
                  padding: '15px 25px',
                }}
              >
                <Box>
                  <img src={powerByM2p} alt="" width="20px" height="20px" />
                </Box>
              </Stack>
            </Stack>
          )}
        </DrawerTab>

        {/* Tab and Destop Navbar end */}

        {/* Mobile Navbar start */}
        <Dialog
          open={openMenuBarMobile}
          onClose={handleCloseMenuBar}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
          sx={{
            mt: -4,
            mb: -4,
            '& .MuiDialog-container': {
              justifyContent: 'flex-end',
            },
            display: { xs: 'block', md: 'none' },
          }}
        >
          <DrawerMobile
            variant="permanent"
            open={openMobile}
            className="sidebar-main"
          >
            <DrawerHeaderMobile>
              <IconButton sx={{ height: '72px' }}>
                <img src={YesBank} alt="" style={{ padding: '0px 4px' }} />
              </IconButton>
              <IconButton onClick={closeHamberIcon}>
                <CloseIcon sx={{ color: 'white' }} />
              </IconButton>
            </DrawerHeaderMobile>
            <Divider />
            <List className="sidebar-menu" sx={{ margin: '24px 0' }}>
              {sideBarOptions.map((text, index) => {
                return text.isVisible ? (
                  <ListItem
                    key={text.content}
                    disablePadding
                    sx={listStyle}
                    onClick={() => setCheckIndex(text.key)}
                  >
                    {text.subContent.length === 0 && (
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: 'initial',
                          padding: '8px 25px',
                          borderRadius: '4px',
                          ':hover': {
                            color: 'white',
                          },
                          fontWeight: '400',
                          fontSize: '14px',
                        }}
                        className="lineDiv"
                        component={NavLink}
                        to={text.path}
                        onClick={() => {
                          setMenuItemIndex(text.key);
                          setAnchorElMenuBar(null);
                          setOpenList(false);
                          setOpenIndex(-1);
                        }}
                      >
                        {menuItemIndex === index + 1 && (
                          <span className="lineActive"></span>
                        )}

                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            margin: '0',
                            justifyContent: 'center',
                            fontWeight: '100',
                          }}
                        >
                          <img
                            src={
                              menuItemIndex === index + 1
                                ? text?.active_image
                                : text.image
                            }
                            alt=""
                          />
                        </ListItemIcon>
                        {text.content === 'HOME' && (
                          <Badge
                            badgeContent={2}
                            color="error"
                            sx={badgeStyle}
                            overlap="circular"
                          >
                            <ListItemText
                              primary={text.content}
                              sx={{
                                display: openMobile ? 'block' : 'none',
                                paddingLeft: '8px',
                                fontWeight: '400',
                                fontSize: '14px',
                              }}
                            />
                          </Badge>
                        )}
                        {text.content !== 'HOME' && (
                          <ListItemText
                            primary={text.content}
                            sx={{
                              opacity: openMobile ? 1 : 0,
                              padding: '0 0.5rem',
                            }}
                          />
                        )}
                      </ListItemButton>
                    )}
                    {text.subContent.length > 0 && (
                      <>
                        <ListItemButton
                          onClick={(event: any) => {
                            handleClick(text.key);
                            setMenuItemIndex(text.key);
                            setOpenSubMenu(true);
                          }}
                          sx={{
                            borderLeft:
                              !openMobile && openIndex === index + 1
                                ? '4px solid #CBE0F5'
                                : '',

                            backgroundColor:
                              !openMobile && openIndex === index + 1
                                ? '#0662B7'
                                : openList && openIndex === index + 1
                                ? '#4D4E50'
                                : '',
                            '&:hover': {
                              backgroundColor:
                                (openList && openIndex === index + 1) ||
                                (!openMobile && openIndex === index + 1)
                                  ? '#4D4E50'
                                  : '',
                            },
                            borderRadius: '0px',
                            padding: openMobile ? '8px 25px' : '15px 25px',
                          }}
                        >
                          <ListItemIcon sx={{ margin: openMobile ? '0' : '0' }}>
                            <img
                              src={text.image}
                              alt=""
                              style={{ padding: '0' }}
                            />
                          </ListItemIcon>

                          <ListItemText
                            primary={text.content}
                            sx={{
                              opacity: 1,
                              padding: '0',
                              paddingLeft: '8px',
                              color: 'white',
                            }}
                          />

                          <img
                            src={
                              openList && openIndex === index + 1
                                ? drop_up_arrow_icon
                                : drop_down_arrow_icon
                            }
                            alt=""
                          />
                        </ListItemButton>
                        {openIndex === index + 1 &&
                          text.subContent.length > 0 &&
                          text.subContent.map((subData, index) => {
                            return subData?.isVisible ? (
                              <ListItemButton
                                key={subData.key}
                                component={NavLink}
                                to={subData.path}
                                sx={{
                                  padding: '0',
                                  backgroundColor: '#282829',
                                  '&:hover': {
                                    backgroundColor: '#282829',
                                  },
                                  borderRadius: '4px',
                                }}
                                className="lineDiv"
                                onClick={() => {
                                  handleSubMenu(text.key, subData.key, index);
                                  setAnchorElMenuBar(null);
                                }}
                              >
                                {menuItemSubIndex ===
                                  menuItemIndex * 10 + (index + 1) && (
                                  <span className="lineActive"></span>
                                )}
                                <Collapse
                                  in={openList}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <List
                                    component="div"
                                    disablePadding
                                    sx={{ padding: '0' }}
                                  >
                                    <ListItemButton sx={{ pl: 7 }}>
                                      <ListItemIcon>
                                        <img
                                          src={
                                            menuItemSubIndex ===
                                            menuItemIndex * 10 + (index + 1)
                                              ? subData.active_image
                                              : subData.img
                                          }
                                          alt=""
                                        />
                                      </ListItemIcon>

                                      <ListItemText
                                        primary={subData.data}
                                        sx={{
                                          paddingLeft: '8px',
                                          color: '#FFFFFF',
                                          fontWeight: '400',
                                          fontSize: '14px !important',
                                        }}
                                      />
                                    </ListItemButton>
                                  </List>
                                </Collapse>
                              </ListItemButton>
                            ) : (
                              ''
                            );
                          })}
                      </>
                    )}
                  </ListItem>
                ) : (
                  ''
                );
              })}
            </List>

            <Stack sx={{ position: 'absolute', bottom: '5px' }}>
              <Stack
                sx={{
                  padding: '15px 25px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ fontSize: '15px' }}>Powered by</Box>
                <Box style={{ marginLeft: '9px' }}>
                  <img src={powerByM2p} alt="" width="20px" height="20px" />
                </Box>
              </Stack>
            </Stack>
          </DrawerMobile>
        </Dialog>
        {/* Mobile Navbar end */}

        <Box
          sx={{
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '72px',
              // height: '12vh',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '13px 20px',
              boxShadow: '0 0 18px #DFE0E3',
              backgroundColor: 'white',
              // boxShadow: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'Ilisarniq',
                letterSpacing: '0.0015em',
                fontSize: '20px',
                fontWeight: '500',
                color: '#151515',
                lineHeight: '22px',
                display: { sm: 'none', md: 'block' },
              }}
            >
              {/* Surrogate Programme */}
            </Typography>
            <Stack sx={{ display: { sx: 'block', md: 'none' } }}>
              <IconButton onClick={handleClickMenu}>
                <MenuIcon sx={{ border: 'none' }} />
              </IconButton>
            </Stack>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                height: '72px',
                padding: '0px 30px',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                style={{ marginRight: '50px' }}
                sx={{ display: { sm: 'none', md: 'block' } }}
              >
                <Typography
                  style={{
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#151515',
                  }}
                >
                  {employeeName}
                </Typography>
                <Typography
                  style={{
                    fontSize: '12px',
                    fontWeight: '400',
                    color: ' #4D4E50',
                    textTransform: 'capitalize',
                  }}
                >
                  {roleType}
                </Typography>
              </Box>

              <IconButton
                id="basic-button"
                sx={{
                  height: 10,

                  width: 10,
                }}
                aria-controls={openMenu ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? 'true' : undefined}
                onClick={handleMenuClick}
              >
                <img
                  src={profile_icon}
                  alt=""
                  style={{ height: '40px', width: '40px' }}
                />

                <img
                  src={profile_arrow_icon}
                  style={{ padding: '0 10px' }}
                  className="hidenArrowprofile"
                  alt=""
                />
              </IconButton>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <Box
                  sx={{
                    display: { sm: 'block', md: 'none' },
                    padding: { sm: '8px 0', md: 'unset' },
                  }}
                >
                  <MenuItem
                    sx={{
                      gap: 2,
                      width: '200px',
                      height: '45px',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                    onClick={handleLogout}
                  >
                    <Box style={{ marginRight: '50px' }}>
                      <Typography
                        style={{
                          fontSize: '14px',
                          fontWeight: '400',
                          color: '#151515',
                        }}
                      >
                        {employeeName}
                      </Typography>
                      <Typography
                        style={{
                          fontSize: '12px',
                          fontWeight: '400',
                          color: ' #4D4E50',
                          textTransform: 'capitalize',
                        }}
                      >
                        {roleType}
                      </Typography>
                    </Box>
                  </MenuItem>
                </Box>
                <Box>
                  <MenuItem
                    sx={{
                      gap: 2,
                      width: '200px',
                      height: '45px',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                    onClick={onClickHandleProfile}
                  >
                    <img src={profile_img} alt="profile" />
                    Profile
                  </MenuItem>
                </Box>

                <Box>
                  <MenuItem
                    sx={{
                      gap: 2,
                      width: '200px',
                      height: '45px',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                    onClick={handleLogout}
                  >
                    <img src={logout_img} alt="profile" />
                    Logout
                  </MenuItem>
                </Box>
              </Menu>
            </Box>
          </Box>
          <Box
            sx={{
              width: '100%',
              // height: '90vh',
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </main>
  );
}
