import { useState } from 'react';
import type {
  ChangeEvent,
  Dispatch,
  JSX,
  SetStateAction,
} from 'react';
import {
  FormModes,
  UserTypes,
  UserTypeNames,
  FormModeNames,
} from '@/utilities/abstractions';
import type { UserDetails } from '@/utilities/abstractions';
import {
  Divider,
  Grid,
  Paper,
  styled,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  ShoppingCart,
  Store,
} from '@mui/icons-material';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';

type Props = {
  setSignedIn: Dispatch<SetStateAction<boolean>>,
  userType: UserTypes,
  setUserType: Dispatch<SetStateAction<UserTypes>>,
  setUserDetails: Dispatch<SetStateAction<UserDetails>>,
}

const PaperContainer = styled(Grid)(({ theme }) => ({
  margin: 'auto',
  paddingTop: theme.spacing(7),
  width: 'fit-content',
}));

const TitleText = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(1, 0, 2),
  textAlign: 'center',
  paddingTop: theme.spacing(1.5),
}));

const PaperGrid = styled(Grid)(({ theme }) => ({
  margin: 'auto',
  textAlign: 'center',
  marginBottom: theme.spacing(1),
}));

const CopyrightTextContainer = styled(Grid)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
}));

function SelectAccountType(
  {
    setSignedIn,
    userType,
    setUserType,
    setUserDetails,
  }: Props,
): JSX.Element {
  const [mode, setMode] = useState<FormModes>(FormModes.SignIn);
  const [tabIndex, setTabIndex] = useState(userType < 2 ? userType : 0);
  const [typeTitle, setTypeTitle] = useState(UserTypeNames[userType]);
  const [lastTab, setLastTab] = useState(userType);

  const handleChange = (
    _event: ChangeEvent<unknown> | null,
    newValue: UserTypes,
    modeChanged = false,
  ): void => {
    localStorage.setItem('userType', UserTypeNames[newValue]);
    setTabIndex(newValue);
    if (!modeChanged) {
      setLastTab(newValue);
    }
    setTypeTitle(UserTypeNames[newValue]);
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
    <PaperContainer container>
      <Paper elevation={4}>
        <Grid size={{ xs: 12 }}>
          <TitleText variant="h4">
            {mode === FormModes.SignUp || mode === FormModes.ForgotPassword ? '' : typeTitle}
            {mode === FormModes.SignUp || mode === FormModes.ForgotPassword ? '' : ' '}
            {mode === FormModes.ForgotPassword ? 'Forgot Password' : FormModeNames[mode].replace(/(In|Up)/, ' $1')}
          </TitleText>
        </Grid>
        <Divider />
        <PaperGrid size={{ xs: 12 }}>
          {mode === FormModes.SignIn ? (
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
                label="Customer"
              />
              <Tab
                icon={<Store />}
                label="Seller"
              />
            </Tabs>
          ) : null}
        </PaperGrid>
        <Grid size={{ xs: 12 }}>
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
            : null}
          {mode === FormModes.SignUp
            ? (
              <SignUp
                changeMode={changeMode}
              />
            )
            : null}
          {mode === FormModes.ForgotPassword ? <ForgotPassword changeMode={changeMode} /> : null}
        </Grid>
        <CopyrightTextContainer size={{ xs: 12 }} />
      </Paper>
    </PaperContainer>
  );
}

export default SelectAccountType;
