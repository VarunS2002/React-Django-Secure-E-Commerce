import React, {
  useEffect,
  useState,
} from 'react';
import PageNotFound from 'pages/PageNotFound';
import SelectAccountType from 'pages/SelectAccountType';
import {
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ThemeProvider,
} from '@material-ui/core';
import themeStyles from 'utilities/styles/themeStyles';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { appStyles } from 'utilities/styles/styles';
import {
  getUserData,
  getUserDetails,
  getUserType,
} from 'utilities/userData';
import resolveRoutes from 'utilities/resolveRoutes';
import NavigationBar from 'pages/NavigationBar';
import Store from 'pages/Store';
import {
  Item,
  UserTypes,
} from 'utilities/abstractions';
import {
  getItemsCustomer,
  getItemsSeller,
} from 'utilities/listings';
import Checkout from './pages/Checkout';
import CreateListingForm from './pages/CreateListingForm';

function App(): JSX.Element {
  const history = useHistory();
  const location = useLocation();
  const [signedIn, setSignedIn] = useState(false);
  const [sessionExpiredDialogOpen, setSessionExpiredDialogOpen] = useState(false);
  const [userType, setUserType] = useState(getUserType());
  const [userDetails, setUserDetails] = useState(getUserDetails());
  const classes = appStyles();

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    getUserData(setUserDetails, setSessionExpiredDialogOpen)
      .then((signedInUser) => {
        setSignedIn(signedInUser);
        const resolvedRoute = resolveRoutes(location.pathname, signedInUser, userType);
        if (location.pathname !== resolvedRoute) {
          history.push(resolvedRoute);
        }
      });
    if (signedIn) {
      window.onunload = () => {
        localStorage.removeItem('isSignedIn');
      };
    }
  }, [history, location.pathname, signedIn, userType]);

  useEffect(() => {
    const fetchListings = async () => {
      if (signedIn) {
        if (userType === UserTypes.Customer) {
          setItems(await getItemsCustomer());
        } else {
          setItems(await getItemsSeller());
        }
      }
    };
    fetchListings();
  }, [signedIn, userType]);

  return (
    <ThemeProvider theme={themeStyles()}>
      <meta name="color-scheme" content="dark" />
      <Switch>
        <Route exact path="/404">
          <PageNotFound />
        </Route>
        <Route path="/">
          <div className={classes.root}>
            <CssBaseline />
            <NavigationBar
              signedIn={signedIn}
              setSignedIn={setSignedIn}
              userType={userType}
              userDetails={userDetails}
            />
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <Switch>
                <Route exact path="/login">
                  <SelectAccountType
                    setSignedIn={setSignedIn}
                    userType={userType}
                    setUserType={setUserType}
                    setUserDetails={setUserDetails}
                  />
                </Route>
                <Route exact path="/store">
                  <Store
                    items={items}
                    setItems={setItems}
                    userType={userType}
                  />
                </Route>
                <Route exact path="/checkout">
                  <Checkout items={items} setItems={setItems} />
                </Route>
                <Route exact path="/listings">
                  <Store
                    items={items}
                    setItems={setItems}
                    userType={userType}
                  />
                </Route>
                <Route exact path="/create-listing">
                  <CreateListingForm
                    items={items}
                    setItems={setItems}
                  />
                </Route>
              </Switch>
            </main>
          </div>
        </Route>
      </Switch>
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
