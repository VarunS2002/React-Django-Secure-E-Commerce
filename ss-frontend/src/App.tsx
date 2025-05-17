import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  JSX,
} from 'react';
import PageNotFound from 'pages/PageNotFound';
import SelectAccountType from 'pages/SelectAccountType';
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ThemeProvider,
  styled,
} from '@mui/material';
import themeStyles from 'utilities/styles/themeStyles';
import {
  Outlet,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  getUserData,
  getUserDetails,
  getUserType,
} from 'utilities/userData';
import resolveRoutes from 'utilities/resolveRoutes';
import NavigationBar from 'pages/NavigationBar';
import Store from 'pages/Store';
import {
  type UserDetails,
  UserTypes,
  Item,
} from 'utilities/abstractions';
import {
  getItemsCustomer,
  getItemsSeller,
} from 'utilities/listings';
import Checkout from 'pages/Checkout';
import CreateListingForm from 'pages/CreateListingForm';

const RootContainer = styled(Box)(() => ({
  display: 'flex',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(1),
  overflow: 'auto',
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
  [theme.breakpoints.down('sm')]: {
    ...theme.mixins.toolbar,
  },
}));

// const CenteredContent = styled(Box)(({ theme }) => ({
//   margin: 'auto',
//   padding: theme.spacing(7),
//   width: 'fit-content',
// }));

type Props = {
  signedIn: boolean,
  setSignedIn: Dispatch<SetStateAction<boolean>>,
  userType: UserTypes,
  userDetails: UserDetails,
};

function Layout({
  signedIn, setSignedIn, userType, userDetails,
}: Props): JSX.Element {
  return (
    <RootContainer>
      <CssBaseline />
      <NavigationBar
        signedIn={signedIn}
        setSignedIn={setSignedIn}
        userType={userType}
        userDetails={userDetails}
      />
      <ContentContainer>
        <ToolbarSpacer />
        <Outlet />
        {' '}
      </ContentContainer>
    </RootContainer>
  );
}

function App(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [signedIn, setSignedIn] = useState(false);
  const [sessionExpiredDialogOpen, setSessionExpiredDialogOpen] = useState(false);
  const [userType, setUserType] = useState(getUserType());
  const [userDetails, setUserDetails] = useState(getUserDetails());

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    getUserData(setUserDetails, setSessionExpiredDialogOpen)
      .then((signedInUser) => {
        setSignedIn(signedInUser);
        const resolvedRoute = resolveRoutes(location.pathname, signedInUser, userType);
        if (location.pathname !== resolvedRoute) {
          navigate(resolvedRoute);
        }
      });

    const handleBeforeUnload = (): void => {
      localStorage.removeItem('isSignedIn');
    };

    if (signedIn) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate, location.pathname, signedIn, userType]);

  useEffect(() => {
    const fetchListings = async (): Promise<void> => {
      if (signedIn) {
        if (userType === UserTypes.Customer) {
          setItems(await getItemsCustomer());
        } else {
          setItems(await getItemsSeller());
        }
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchListings();
  }, [signedIn, userType]);

  return (
    <ThemeProvider theme={themeStyles()}>
      <meta name="color-scheme" content="dark" />
      <Routes>
        <Route path="/404" element={<PageNotFound />} />
        <Route
          path="/"
          element={(
            <Layout
              signedIn={signedIn}
              setSignedIn={setSignedIn}
              userType={userType}
              userDetails={userDetails}
            />
          )}
        >
          <Route
            path="login"
            element={(
              <SelectAccountType
                setSignedIn={setSignedIn}
                userType={userType}
                setUserType={setUserType}
                setUserDetails={setUserDetails}
              />
            )}
          />
          <Route
            path="store"
            element={(<Store items={items} setItems={setItems} userType={userType} />
            )}
          />
          <Route
            path="checkout"
            element={<Checkout items={items} setItems={setItems} />}
          />
          <Route
            path="listings"
            element={(<Store items={items} setItems={setItems} userType={userType} />)}
          />

          <Route
            path="create-listing"
            element={<CreateListingForm setItems={setItems} />}
          />
        </Route>
      </Routes>
      <Dialog
        maxWidth="xs"
        open={sessionExpiredDialogOpen}
        onClose={() => setSessionExpiredDialogOpen(false)}
      >
        <DialogTitle>Session Expired</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have been signed out automatically since your session has expired.
            You will have to sign in again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setSessionExpiredDialogOpen(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
