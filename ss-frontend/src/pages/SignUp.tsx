import { useState } from 'react';
import type {
  ChangeEvent,
  JSX,
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
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  styled,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  focusAndSetCursorToEnd,
  validateBeforeSignUp,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from '@/utilities/formValidation';
import { FormModes } from '@/utilities/abstractions';
import { signUp } from '@/utilities/authentication';
import ConfirmationDialog from '@/pages/ConfirmationDialog';

type Props = {
  changeMode: () => void,
};

const PaperContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 0, 1),
}));

const SignInContainer = styled(Grid)(({ theme }) => ({
  margin: theme.spacing(1, 0, 1),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  // Phone
  [theme.breakpoints.down('xs')]: {
    fontSize: 13,
  },
}));

function SignUp({
  changeMode,
}: Props): JSX.Element {
  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);
  const [signUpTitle, setSignUpTitle] = useState('');
  const [signUpMessage, setSignUpMessage] = useState('');
  const [switchToSignIn, setSwitchToSignIn] = useState(false);
  const [accountType, setAccountType] = useState(Number.POSITIVE_INFINITY);
  const [accountTypeError, setAccountTypeError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Container component="main" maxWidth="xs">
      <PaperContainer>
        <form
          noValidate
          onSubmit={(event) => {
            if (validateBeforeSignUp(
              event,
              accountType,
              setAccountTypeError,
              firstName,
              setFirstNameError,
              lastName,
              setLastNameError,
              email,
              setEmailError,
              password,
              setPasswordError,
              setShowPassword,
              setConfirmPasswordError,
              setShowConfirmPassword,
            )) {
              signUp(
                accountType,
                firstName,
                lastName,
                email,
                password,
                setSignUpDialogOpen,
                setSignUpTitle,
                setSignUpMessage,
                setSwitchToSignIn,
              );
            }
          }}
        >
          <FormControl variant="outlined" fullWidth required margin="normal" error={accountTypeError !== ''}>
            <InputLabel id="acc-type-label">
              Account Type
            </InputLabel>
            <Select
              labelId="acc-type-label"
              label="Account Type"
              id="acc-type"
              onChange={(event) => {
                setAccountType(event.target.value as number);
                setAccountTypeError('');
              }}
            >
              <MenuItem value={0} key={0}>
                Customer
              </MenuItem>
              <MenuItem value={1} key={1}>
                Seller
              </MenuItem>
            </Select>
            <FormHelperText>{accountTypeError}</FormHelperText>
          </FormControl>
          <TextField
            error={firstNameError !== ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => validateName(
              event,
              setFirstName,
              setFirstNameError,
            )}
            helperText={firstNameError}
            margin="normal"
            name="firstName"
            variant="outlined"
            required
            fullWidth
            id="firstName"
            label="First Name"
            autoComplete="given-name"
          />
          <TextField
            error={lastNameError !== ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => validateName(
              event,
              setLastName,
              setLastNameError,
            )}
            helperText={lastNameError}
            margin="normal"
            name="lastName"
            variant="outlined"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            autoComplete="family-name"
          />
          <TextField
            error={emailError !== ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              validateEmail(
                event,
                setEmail,
                setEmailError,
              );
              validatePassword(
                event,
                'email',
                email,
                emailError,
                setPassword,
                passwordError,
                setPasswordError,
                FormModes.SignUp,
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
            <InputLabel htmlFor="confirmPassword" error={confirmPasswordError !== ''}>Confirm Password *</InputLabel>
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
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign Up
          </SubmitButton>
          <SignInContainer container justifyContent="flex-end">
            <Grid>
              <StyledLink
                // component="button"
                variant="body2"
                onClick={(event) => {
                  event.preventDefault();
                  changeMode();
                }}
              >
                Already have an account? Sign In
              </StyledLink>
            </Grid>
          </SignInContainer>
        </form>
      </PaperContainer>
      <ConfirmationDialog
        title={signUpTitle}
        message={signUpMessage}
        oneAction
        open={signUpDialogOpen}
        setOpen={setSignUpDialogOpen}
        onClose={() => {
          if (switchToSignIn) changeMode();
        }}
        onConfirm={() => {
          if (switchToSignIn) changeMode();
        }}
      />
    </Container>
  );
}

export default SignUp;
