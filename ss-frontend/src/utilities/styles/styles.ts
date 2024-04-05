import { makeStyles } from '@material-ui/core';

const appStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    overflow: 'auto',
  },
  /* centeredContent: {
    margin: 'auto',
    padding: theme.spacing(7),
    width: 'fit-content',
  }, */
  toolbar: {
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
  },
}));

const pageNotFoundStyles = makeStyles((theme) => ({
  rootText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh',
  },
  rootButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    display: 'flex',
  },
  boxButtons: {
    display: 'flex',
  },
  divider: {
    background: theme.palette.text.secondary,
  },
  statusCode: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  text: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
}));

const selectAccountTypeStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    paddingTop: theme.spacing(7),
    width: 'fit-content',
  },
  tabCard: {
    marginTop: theme.spacing(1),
  },
  title: {
    margin: theme.spacing(1, 0, 2),
    textAlign: 'center',
    paddingTop: theme.spacing(1.5),
  },
  tab: {
    // Desktop
    [theme.breakpoints.up('sm')]: {
      minWidth: 99,
      maxWidth: 99,
      width: 99,
    },
    // Phone
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  copyrightText: {
    paddingBottom: theme.spacing(2),
  },
  paperGrid: {
    margin: 'auto',
    textAlign: 'center',
  },
}));

const signInStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
  },
  rememberMe: {
    textAlign: 'left',
  },
  forgotPassword: {
    margin: theme.spacing(1, 0, 1),
    textAlign: 'left',
  },
  formOptions: {
    // Phone
    [theme.breakpoints.down('xs')]: {
      fontSize: 13,
    },
  },
}));

const signUpStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
  },
  signIn: {
    margin: theme.spacing(1, 0, 1),
  },
  formOptions: {
    // Phone
    [theme.breakpoints.down('xs')]: {
      fontSize: 13,
    },
  },
}));

const drawerWidth = 200;

const navigationBarStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  toolbar: {
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
  },
  menuButton: {
    // Desktop
    [theme.breakpoints.up('sm')]: {
      marginRight: 24,
      marginLeft: -19,
    },
    // Phone
    [theme.breakpoints.down('xs')]: {
      marginRight: theme.spacing(2),
    },
  },
  // Desktop
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  // Desktop
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  // Desktop
  hide: {
    display: 'none',
  },
  drawerPaper: {
    width: drawerWidth,
    // Desktop
    [theme.breakpoints.up('sm')]: {
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
  },
  // Desktop
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  // Desktop
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
  },
}));

const profileStyles = makeStyles(() => ({
  center: {
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  avatar: {
    width: 40,
    height: 40,
  },
}));

const aboutStyles = makeStyles(() => ({
  center: {
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  logo: {
    width: 40,
    height: 40,
  },
  name: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
  links: {
    fontSize: 15,
    lineHeight: 2,
  },
}));

export {
  pageNotFoundStyles,
  appStyles,
  selectAccountTypeStyles,
  signInStyles,
  signUpStyles,
  navigationBarStyles,
  profileStyles,
  aboutStyles,
};
