import { useState } from 'react';
import type {
  ChangeEvent,
  Dispatch,
  JSX,
  SetStateAction,
} from 'react';
import {
  Box,
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
  styled,
  TextField,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { signIn } from '@/utilities/authentication';
import {
  focusAndSetCursorToEnd,
  validateBeforeSignIn,
  validateEmail,
  validatePassword,
} from '@/utilities/formValidation';
import { getRememberMe } from '@/utilities/userData';
import {
  UserTypes,
  FormModes,
} from '@/utilities/abstractions';
import type { UserDetails } from '@/utilities/abstractions';
import ConfirmationDialog from '@/pages/ConfirmationDialog';

type Props = {
  changeMode: () => void,
  setModeToForgotPassword: () => void,
  userType: UserTypes,
  setUserType: Dispatch<SetStateAction<UserTypes>>,
  setSignedIn: Dispatch<SetStateAction<boolean>>,
  setUserDetails: Dispatch<SetStateAction<UserDetails>>,
};

const PaperContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 0, 1),
}));

const RememberMeContainer = styled(Grid)(() => ({
  textAlign: 'left',
}));

const ForgotPasswordContainer = styled(Grid)(({ theme }) => ({
  margin: theme.spacing(1, 0, 1),
  justifyContent: 'space-between',
  flex: 1,
  alignItems: 'center',
}));

// Phone
const StyledLink = styled(Link)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    fontSize: 13,
  },
}));

function SignIn({
  changeMode,
  setModeToForgotPassword,
  userType,
  setUserType,
  setSignedIn,
  setUserDetails,
}: Props): JSX.Element {
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);
  const [signInTitle, setSignInTitle] = useState('');
  const [signInMessage, setSignInMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // TODO: Implement
  const [rememberMe, setRememberMe] = useState(getRememberMe());

  return (
    <Container component="main" maxWidth="xs">
      <PaperContainer>
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
            onChange={(event: ChangeEvent<HTMLInputElement>) => validateEmail(event, setEmail, setEmailError)}
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
          <RememberMeContainer container>
            <Grid>
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
          </RememberMeContainer>
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign In
          </SubmitButton>
          <ForgotPasswordContainer container>
            <Grid>
              <StyledLink
                // component="button"
                variant="body2"
                onClick={setModeToForgotPassword}
              >
                Forgot password?
              </StyledLink>
            </Grid>
            <Grid>
              <StyledLink
                // component="button"
                variant="body2"
                onClick={(event) => {
                  event.preventDefault();
                  changeMode();
                }}
              >
                Don&apos;t have an account? Sign Up
              </StyledLink>
            </Grid>
          </ForgotPasswordContainer>
        </form>
      </PaperContainer>
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
