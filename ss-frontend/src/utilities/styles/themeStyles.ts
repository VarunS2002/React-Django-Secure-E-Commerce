import { createTheme } from '@material-ui/core/';
import type { Theme } from '@material-ui/core/';

const themeStyles = (): Theme => createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#3880FF',
    },
    secondary: {
      main: '#EB0028',
    },
    background: {
      default: '#121212',
      paper: '#303030',
    },
  },
  overrides: {
    MuiInputBase: {
      input: {
        '&:-webkit-autofill': {
          transitionDelay: '9999s',
          transitionProperty: 'background-color, color',
        },
      },
    },
    MuiOutlinedInput: {
      input: {
        '&:-webkit-autofill': {
          WebkitBoxShadow: 'inherit',
          WebkitTextFillColor: 'inherit',
          caretColor: 'inherit',
        },
      },
    },
  },
});

export default themeStyles;
