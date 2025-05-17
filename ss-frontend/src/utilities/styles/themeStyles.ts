import { createTheme } from '@mui/material';
import type { Theme } from '@mui/material';

const themeStyles = (): Theme => createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3880FF',
    },
    secondary: {
      main: '#EB0028',
    },
    background: {
      default: '#121212',
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            transitionDelay: '9999s',
            transitionProperty: 'background-color, color',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: 'inherit',
            WebkitTextFillColor: 'inherit',
            caretColor: 'inherit',
          },
        },
      },
    },
  },
});

export default themeStyles;
