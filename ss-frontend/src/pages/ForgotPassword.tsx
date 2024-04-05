import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
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
import { signUpStyles } from 'utilities/styles/styles';
import {
  focusAndSetCursorToEnd,
  validateBeforeResetPassword,
  validateConfirmPassword,
  validateEmail,
  validateOtp,
  validatePassword,
} from 'utilities/formValidation';
import { FormModes } from 'utilities/abstractions';
import {
  resetPassword,
  sendPasswordResetEmail,
} from 'utilities/authentication';
import ConfirmationDialog from 'pages/ConfirmationDialog';

type Props = {
  changeMode: () => void,
};

function ForgotPassword({
  changeMode,
}: Props): JSX.Element {
  const classes = signUpStyles();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [forgotDialogOpen, setForgotDialogOpen] = useState(false);
  const [forgotTitle, setForgotTitle] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const [resetMode, setResetMode] = useState(false);

  const [otp, setOtp] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          {!resetMode ? (
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                if (emailError === '' && email !== '') {
                  sendPasswordResetEmail(
                    email,
                    setForgotDialogOpen,
                    setForgotTitle,
                    setForgotMessage,
                    setResetMode,
                  );
                } else if (email === '') {
                  setEmailError('Email address cannot be empty.');
                }
              }}
            >
              <TextField
                error={emailError !== ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  validateEmail(
                    event, setEmail, setEmailError,
                  );
                }}
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Get OTP
              </Button>
              <Grid container justifyContent="flex-end" className={classes.signIn}>
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
                    Back to Sign In
                  </Link>
                </Grid>
              </Grid>
            </form>
          ) : (
            <form
              noValidate
              onSubmit={(event) => {
                if (validateBeforeResetPassword(
                  event,
                  otp,
                  setOtpError,
                  password,
                  setPasswordError,
                  setShowPassword,
                  setConfirmPasswordError,
                  setShowConfirmPassword,
                )) {
                  resetPassword(
                    email,
                    otp,
                    password,
                    setForgotDialogOpen,
                    setForgotTitle,
                    setForgotMessage,
                    setResetMode,
                    changeMode,
                  );
                }
              }}
            >
              <TextField
                error={otpError !== ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => validateOtp(event, setOtp, setOtpError)}
                helperText={otpError}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="otp"
                label="OTP"
                name="otp"
                autoComplete="one-time-code"
                type="number"
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
                  autoComplete="new-password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    validatePassword(
                      event,
                      'password',
                      email,
                      emailError,
                      setPassword,
                      passwordError,
                      setPasswordError,
                      FormModes.SignUp,
                    );
                    validateConfirmPassword(
                      event,
                      'password',
                      setConfirmPasswordError,
                    );
                  }}
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
              <FormControl variant="outlined" margin="normal" fullWidth>
                <InputLabel htmlFor="confirmPassword" error={confirmPasswordError !== ''}>
                  Confirm Password
                  *
                </InputLabel>
                <OutlinedInput
                  error={confirmPasswordError !== ''}
                  required
                  fullWidth
                  name="confirmPassword"
                  id="confirmPassword"
                  label="Confirm Password *"
                  autoComplete="new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => validateConfirmPassword(
                    event,
                    'confirmPassword',
                    setConfirmPasswordError,
                  )}
                  endAdornment={(
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setShowConfirmPassword(!showConfirmPassword);
                          setTimeout(() => focusAndSetCursorToEnd('confirmPassword'), 0);
                        }}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )}
                />
                <FormHelperText error={confirmPasswordError !== ''}>{confirmPasswordError}</FormHelperText>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Reset Password
              </Button>
              <Grid container justifyContent="flex-end" className={classes.signIn}>
                <Grid item>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={(event) => {
                      event.preventDefault();
                      setResetMode(false);
                      changeMode();
                    }}
                    className={classes.formOptions}
                  >
                    Back to Sign In
                  </Link>
                </Grid>
              </Grid>
            </form>
          )}
        </div>
        <ConfirmationDialog
          title={forgotTitle}
          message={forgotMessage}
          oneAction
          open={forgotDialogOpen}
          setOpen={setForgotDialogOpen}
          onConfirm={() => {
            if (forgotTitle === 'Password Reset Successful') {
              setResetMode(false);
              changeMode();
            }
          }}
          onClose={() => {
            if (forgotTitle === 'Password Reset Successful') {
              setResetMode(false);
              changeMode();
            }
          }}
        />
      </Container>
    </>
  );
}

export default ForgotPassword;
