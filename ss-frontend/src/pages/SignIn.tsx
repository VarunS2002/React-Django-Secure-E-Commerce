import React, {
  useState,
} from 'react';
import type {
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  TextField,
} from '@material-ui/core';
import {
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { signInStyles } from 'utilities/styles/styles';
import { signIn } from 'utilities/authentication';
import {
  focusAndSetCursorToEnd,
  validateBeforeSignIn,
  validateEmail,
  validatePassword,
} from 'utilities/formValidation';
import { getRememberMe } from 'utilities/userData';
import {
  UserTypes,
  FormModes,
  UserDetails,
} from 'utilities/abstractions';
import ConfirmationDialog from 'pages/ConfirmationDialog';

type Props = {
  changeMode: () => void,
  setModeToForgotPassword: () => void,
  userType: UserTypes,
  setUserType: Dispatch<SetStateAction<UserTypes>>,
  setSignedIn: Dispatch<SetStateAction<boolean>>,
  setUserDetails: Dispatch<SetStateAction<UserDetails>>,
};

function SignIn({
  changeMode,
  setModeToForgotPassword,
  userType,
  setUserType,
  setSignedIn,
  setUserDetails,
}: Props): JSX.Element {
  const classes = signInStyles();
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);
  const [signInTitle, setSignInTitle] = useState('');
  const [signInMessage, setSignInMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(getRememberMe());

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <form
          noValidate
          onSubmit={(event) => {
            if (validateBeforeSignIn(
              event,
              email,
              setEmailError,
              password,
              setPasswordError,
              setShowPassword,
            )) {
              signIn(
                email,
                password,
                userType,
                setEmailError,
                setPasswordError,
                setSignedIn,
                setUserType,
                setUserDetails,
                rememberMe,
                setSignInDialogOpen,
                setSignInTitle,
                setSignInMessage,
              );
            }
          }}
        >
          <TextField
            error={emailError !== ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => validateEmail(
              event, setEmail, setEmailError,
            )}
            helperText={emailError}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
          />
          <FormControl variant="outlined" margin="normal" fullWidth>
            <InputLabel htmlFor="password" error={passwordError !== ''}>Password *</InputLabel>
            <OutlinedInput
              error={passwordError !== ''}
              required
              fullWidth
              name="password"
              id="password"
              label="Password *"
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              onChange={(event: ChangeEvent<HTMLInputElement>) => validatePassword(
                event,
                'password',
                email,
                emailError,
                setPassword,
                passwordError,
                setPasswordError,
                FormModes.SignIn,
              )}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setShowPassword(!showPassword);
                      setTimeout(() => focusAndSetCursorToEnd('password'), 0);
                    }}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )}
            />
            <FormHelperText error={passwordError !== ''}>{passwordError}</FormHelperText>
          </FormControl>
          <Grid container className={classes.rememberMe}>
            <Grid item xs>
              {/* <FormControlLabel
                control={(
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                )}
                label="Remember me"
              /> */}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container className={classes.forgotPassword}>
            <Grid item xs>
              <Link
                component="button"
                variant="body2"
                onClick={setModeToForgotPassword}
                className={classes.formOptions}
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                component="button"
                variant="body2"
                onClick={(event) => {
                  event.preventDefault();
                  changeMode();
                }}
                className={classes.formOptions}
              >
                Don&apos;t have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <ConfirmationDialog
        title={signInTitle}
        message={signInMessage}
        oneAction
        open={signInDialogOpen}
        setOpen={setSignInDialogOpen}
      />
    </Container>
  );
}

export default SignIn;
