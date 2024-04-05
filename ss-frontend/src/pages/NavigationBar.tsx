import React, {
  useState,
} from 'react';
import type {
  Dispatch,
  SetStateAction,
} from 'react';
import {
  AppBar,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  ChevronLeft,
  Menu,
} from '@material-ui/icons/';
import { navigationBarStyles } from 'utilities/styles/styles';
import {
  UserDetails,
  UserTypes,
} from 'utilities/abstractions';
import DrawerItems from 'pages/DrawerItems';
import ToolBarItems from 'pages/ToolBarItems';

type Props = {
  signedIn: boolean,
  setSignedIn: Dispatch<SetStateAction<boolean>>,
  userType: UserTypes,
  userDetails: UserDetails,
};

function NavigationBar({
  signedIn,
  setSignedIn,
  userType,
  userDetails,
}: Props): JSX.Element {
  const classes = navigationBarStyles();
  const [navigationBarIsOpen, setNavigationBarIsOpen] = useState(false);

  const handleDrawerChange = (): void => {
    setNavigationBarIsOpen(!navigationBarIsOpen);
  };

  return (
    <>
      {/* AppBar */}
      {/* Phone */}
      <Hidden smUp implementation="js">
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerChange}
              className={classes.menuButton}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap className={classes.title}>
              Secure E-Commerce
            </Typography>
            <ToolBarItems
              signedIn={signedIn}
              setSignedIn={setSignedIn}
              userDetails={userDetails}
            />
          </Toolbar>
        </AppBar>
      </Hidden>
      {/* Desktop */}
      <Hidden xsDown implementation="js">
        <AppBar
          position="fixed"
          className={`${classes.appBar} ${navigationBarIsOpen ? classes.appBarShift : ''}`}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={handleDrawerChange}
              edge="start"
              className={`${classes.menuButton} ${navigationBarIsOpen ? classes.hide : ''}`}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap className={classes.title}>
              Secure E-Commerce
            </Typography>
            <ToolBarItems
              signedIn={signedIn}
              setSignedIn={setSignedIn}
              userDetails={userDetails}
            />
          </Toolbar>
        </AppBar>
      </Hidden>
      {/* Drawer */}
      {/* Phone */}
      <Hidden smUp implementation="js">
        <nav>
          <Drawer
            variant="temporary"
            anchor="left"
            open={navigationBarIsOpen}
            onClose={handleDrawerChange}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <div className={classes.toolbar} />
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
              : <></>}
            <List>
              <DrawerItems
                section={2}
                userType={null}
                navigationBarIsOpen={null}
                setNavigationBarIsOpen={setNavigationBarIsOpen}
              />
            </List>
            <Divider />
          </Drawer>
        </nav>
      </Hidden>
      {/* Desktop */}
      <Hidden xsDown implementation="js">
        <Drawer
          variant="permanent"
          className={`${classes.drawerPaper} ${navigationBarIsOpen ? classes.drawerOpen : classes.drawerClose}`}
          classes={{ paper: `${navigationBarIsOpen ? classes.drawerOpen : classes.drawerClose}` }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerChange}>
              <ChevronLeft />
            </IconButton>
          </div>
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
            : <></>}
          <List>
            <DrawerItems
              section={2}
              userType={null}
              navigationBarIsOpen={navigationBarIsOpen}
              setNavigationBarIsOpen={setNavigationBarIsOpen}
            />
          </List>
          <Divider />
        </Drawer>
      </Hidden>
    </>
  );
}

export default NavigationBar;
