import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import {
  FormModes,
  UserDetails,
  UserTypes,
} from 'utilities/abstractions';
import { selectAccountTypeStyles } from 'utilities/styles/styles';
import {
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import {
  ShoppingCart,
  Store,
} from '@material-ui/icons';
import SignIn from 'pages/SignIn';
import SignUp from 'pages/SignUp';
import ForgotPassword from 'pages/ForgotPassword';

type Props = {
  setSignedIn: Dispatch<SetStateAction<boolean>>,
  userType: UserTypes,
  setUserType: Dispatch<SetStateAction<UserTypes>>,
  setUserDetails: Dispatch<SetStateAction<UserDetails>>,
}

function SelectAccountType(
  {
    setSignedIn,
    userType,
    setUserType,
    setUserDetails,
  }: Props,
): JSX.Element {
  const classes = selectAccountTypeStyles();
  const [mode, setMode] = useState(FormModes.SignIn);
  const [tabIndex, setTabIndex] = useState(userType < 2 ? userType : 0);
  const [typeTitle, setTypeTitle] = useState(UserTypes[userType]);
  const [lastTab, setLastTab] = useState(userType);

  const handleChange = (
    event: ChangeEvent<unknown> | null,
    newValue: UserTypes,
    modeChanged = false,
  ): void => {
    localStorage.setItem('userType', UserTypes[newValue]);
    setTabIndex(newValue);
    if (!modeChanged) {
      setLastTab(newValue);
    }
    setTypeTitle(UserTypes[newValue]);
  };

  const changeMode = (): void => {
    if (mode === FormModes.SignIn) {
      setMode(FormModes.SignUp);
      // handleChange(null, UserTypes.Admin, true);
    } else {
      setMode(FormModes.SignIn);
      handleChange(null, lastTab);
    }
  };

  const setModeToForgotPassword = (): void => {
    setMode(FormModes.ForgotPassword);
  };

  return (
    <Grid container className={classes.root}>
      <Paper elevation={4}>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.title}>
            {mode === FormModes.SignUp || mode === FormModes.ForgotPassword ? '' : typeTitle}
            {mode === FormModes.SignUp || mode === FormModes.ForgotPassword ? '' : ' '}
            {mode === FormModes.ForgotPassword ? 'Forgot Password' : FormModes[mode].replace(/(In|Up)/, ' $1')}
          </Typography>
        </Grid>
        <Divider />
        <Grid item xs={12} className={classes.paperGrid}>
          {mode === FormModes.SignIn ? (
            <Paper square className={classes.tabCard} elevation={0}>
              <Tabs
                value={tabIndex}
                onChange={handleChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                centered
                aria-label="icon label tabs"
              >
                <Tab
                  icon={<ShoppingCart />}
                  className={classes.tab}
                  label="Customer"
                />
                <Tab
                  icon={<Store />}
                  className={classes.tab}
                  label="Seller"
                />
              </Tabs>
            </Paper>
          ) : (<></>)}
        </Grid>
        <Grid item xs={12}>
          {mode === FormModes.SignIn
            ? (
              <SignIn
                changeMode={changeMode}
                setModeToForgotPassword={setModeToForgotPassword}
                userType={tabIndex}
                setUserType={setUserType}
                setSignedIn={setSignedIn}
                setUserDetails={setUserDetails}
              />
            )
            : <></>}
          {mode === FormModes.SignUp
            ? (
              <SignUp
                changeMode={changeMode}
              />
            )
            : <></>}
          {mode === FormModes.ForgotPassword ? <ForgotPassword changeMode={changeMode} /> : <></>}
        </Grid>
        <Grid item xs={12} className={classes.copyrightText} />
      </Paper>
    </Grid>
  );
}

export default SelectAccountType;
