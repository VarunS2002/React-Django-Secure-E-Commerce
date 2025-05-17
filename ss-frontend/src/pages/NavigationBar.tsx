import React, { useState } from 'react';
import type {
  Dispatch,
  JSX,
  SetStateAction,
} from 'react';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  ChevronLeft,
  Menu,
} from '@mui/icons-material';
import { UserTypes } from 'utilities/abstractions';
import type { UserDetails } from 'utilities/abstractions';
import DrawerItems from 'pages/DrawerItems';
import ToolBarItems from 'pages/ToolBarItems';

type Props = {
  signedIn: boolean,
  setSignedIn: Dispatch<SetStateAction<boolean>>,
  userType: UserTypes,
  userDetails: UserDetails,
};

const AppTitleText = styled(Typography)(() => ({
  flexGrow: 1,
}));

const PhoneMenuButton = styled(IconButton)(({ theme }) => ({
  // Desktop
  [theme.breakpoints.up('sm')]: {
    marginRight: 24,
    marginLeft: -19,
  },
  // Phone
  [theme.breakpoints.down('xs')]: {
    marginRight: theme.spacing(2),
  },
}));

const drawerWidth = 180;

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  // Desktop
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // Desktop
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DesktopMenuButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  // Desktop
  [theme.breakpoints.up('sm')]: {
    marginRight: 24,
    marginLeft: -19,
  },
  // Phone
  [theme.breakpoints.down('xs')]: {
    marginRight: theme.spacing(2),
  },
  // Desktop
  ...(open && {
    display: 'none',
  }),
}));

const ToolbarSpacer = styled('div')(({ theme }) => ({
  // Desktop
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  // Phone
  [theme.breakpoints.down('xs')]: {
    ...theme.mixins.toolbar,
  },
}));

const PhoneStyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    // Desktop
    [theme.breakpoints.up('sm')]: {
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
  },
}));

const DesktopStyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  width: open ? drawerWidth : theme.spacing(7),
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: open
      ? theme.transitions.duration.enteringScreen
      : theme.transitions.duration.leavingScreen,
  }),
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : theme.spacing(7),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: open
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
    overflowX: open ? 'initial' : 'hidden',
    whiteSpace: 'nowrap',
    [theme.breakpoints.up('sm')]: {
      flexShrink: 0,
    },
  },
}));

function NavigationBar({
  signedIn,
  setSignedIn,
  userType,
  userDetails,
}: Props): JSX.Element {
  const [navigationBarIsOpen, setNavigationBarIsOpen] = useState(false);

  const handleDrawerChange = (): void => {
    setNavigationBarIsOpen(!navigationBarIsOpen);
  };

  return (
    <>
      {/* AppBar */}
      {/* Phone */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <AppBar position="fixed" color="primary" enableColorOnDark>
          <Toolbar>
            <PhoneMenuButton
              color="inherit"
              edge="start"
              onClick={handleDrawerChange}
            >
              <Menu />
            </PhoneMenuButton>
            <AppTitleText variant="h6" noWrap>
              Secure E-Commerce
            </AppTitleText>
            <ToolBarItems
              signedIn={signedIn}
              setSignedIn={setSignedIn}
              userDetails={userDetails}
            />
          </Toolbar>
        </AppBar>
      </Box>
      {/* Desktop */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <StyledAppBar position="fixed" open={navigationBarIsOpen} color="primary" enableColorOnDark>
          <Toolbar>
            <DesktopMenuButton
              color="inherit"
              onClick={handleDrawerChange}
              edge="start"
            >
              <Menu />
            </DesktopMenuButton>
            <AppTitleText variant="h6" noWrap>
              Secure E-Commerce
            </AppTitleText>
            <ToolBarItems
              signedIn={signedIn}
              setSignedIn={setSignedIn}
              userDetails={userDetails}
            />
          </Toolbar>
        </StyledAppBar>
      </Box>
      {/* Drawer */}
      {/* Phone */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <nav>
          <PhoneStyledDrawer
            variant="temporary"
            anchor="left"
            open={navigationBarIsOpen}
            onClose={handleDrawerChange}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            <ToolbarSpacer />
            <Divider />
            {signedIn
              ? (
                <>
                  <List>
                    <DrawerItems
                      section={1}
                      userType={userType}
                      navigationBarIsOpen={null}
                      setNavigationBarIsOpen={setNavigationBarIsOpen}
                    />
                  </List>
                  <Divider />
                </>
              )
              : null}
            <List>
              <DrawerItems
                section={2}
                userType={null}
                navigationBarIsOpen={null}
                setNavigationBarIsOpen={setNavigationBarIsOpen}
              />
            </List>
            <Divider />
          </PhoneStyledDrawer>
        </nav>
      </Box>
      {/* Desktop */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <DesktopStyledDrawer variant="permanent" open={navigationBarIsOpen}>
          <ToolbarSpacer>
            <IconButton onClick={handleDrawerChange}>
              <ChevronLeft />
            </IconButton>
          </ToolbarSpacer>
          <Divider />
          {signedIn
            ? (
              <>
                <List>
                  <DrawerItems
                    section={1}
                    userType={userType}
                    navigationBarIsOpen={navigationBarIsOpen}
                    setNavigationBarIsOpen={setNavigationBarIsOpen}
                  />
                </List>
                <Divider />
              </>
            )
            : null}
          <List>
            <DrawerItems
              section={2}
              userType={null}
              navigationBarIsOpen={navigationBarIsOpen}
              setNavigationBarIsOpen={setNavigationBarIsOpen}
            />
          </List>
          <Divider />
        </DesktopStyledDrawer>
      </Box>
    </>
  );
}

export default NavigationBar;
