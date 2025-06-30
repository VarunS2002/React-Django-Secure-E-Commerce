import type {
  Dispatch,
  SetStateAction,
} from 'react';
import { UserTypes } from 'utilities/abstractions';
import type { UserDetails } from 'utilities/abstractions';
import { API_URL } from 'utilities/api';

const signIn = (
  email: string,
  password: string,
  userType: UserTypes,
  setEmailError: Dispatch<SetStateAction<string>>,
  setPasswordError: Dispatch<SetStateAction<string>>,
  setSignedIn: Dispatch<SetStateAction<boolean>>,
  setUserType: Dispatch<SetStateAction<UserTypes>>,
  setUserDetails: Dispatch<SetStateAction<UserDetails>>,
  rememberMe: boolean,
  setSignInDialogOpen: Dispatch<SetStateAction<boolean>>,
  setSignInTitle: Dispatch<SetStateAction<string>>,
  setSignInMessage: Dispatch<SetStateAction<string>>,
): void => {
  try {
    fetch(`${API_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to sign in. Please try again.');
        }
        return response.json();
      })
      .then((json: {
        access: string;
        refresh: string;
      }) => {
        if (json.access && json.refresh) {
          localStorage.setItem('access', json.access);
          localStorage.setItem('refresh', json.refresh);
          fetch(`${API_URL}/core/current_user/`, {
            headers: {
              Authorization: `Bearer ${json.access}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Failed to fetch user details.');
              }
              return response.json();
            })
            .then((user) => {
              if (Number(user.user_type) === userType) {
                localStorage.setItem('isSignedIn', String(true));
                setSignedIn(true);
                setUserType(userType);
                setUserDetails((prevState: UserDetails) => ({
                  ...prevState,
                  userType: user.user_type,
                  email: user.email,
                  firstName: user.first_name,
                  lastName: user.last_name,
                  contactNumber: user.contact_number,
                  address: user.address,
                }));
                localStorage.setItem('rememberMe', String(rememberMe));
              } else {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                const attemptedType = UserTypes[userType].toLowerCase();
                setEmailError(`This is not a valid ${attemptedType} account`);
                setPasswordError('');
              }
            })
            .catch(() => {
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              setSignInDialogOpen(true);
              setSignInTitle('Sign In Failed');
              setSignInMessage('Could not retrieve user data.');
            });
        } else {
          setEmailError('Incorrect email address or password');
          setPasswordError('Incorrect email address or password');
        }
      })
      .catch(() => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setSignInDialogOpen(true);
        setSignInTitle('Sign In Failed');
        setSignInMessage('Please try again.');
      });
  } catch (error) {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setSignInDialogOpen(true);
    setSignInTitle('Sign In Failed');
    setSignInMessage('Please try again.');
  }
};

const signOut = (
  setSignedIn: Dispatch<SetStateAction<boolean>> | null = null,
): void => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('isSignedIn');
  if (setSignedIn !== null) {
    setSignedIn(false);
  }
};

const signUp = (
  accountType: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  changeMode: () => void,
  setSignUpDialogOpen: Dispatch<SetStateAction<boolean>>,
  setSignUpTitle: Dispatch<SetStateAction<string>>,
  setSignUpMessage: Dispatch<SetStateAction<string>>,
): void => {
  try {
    fetch(`${API_URL}/core/user_signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_type: accountType,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response is not OK, throw an error to catch it later
          throw new Error('Failed to sign up. Please try again.');
        }
        return response.json();
      })
      .then((data) => {
        setSignUpDialogOpen(true);
        setSignUpTitle('Sign Up Successful');
        setSignUpMessage('Please sign in.');
        changeMode();
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch operation
        setSignUpDialogOpen(true);
        setSignUpTitle('Sign Up Failed');
        setSignUpMessage('Please try again.');
      });
  } catch (error) {
    setSignUpDialogOpen(true);
    setSignUpTitle('Sign Up Failed');
    setSignUpMessage('Please try again.');
  }
};

const sendPasswordResetEmail = (
  email: string,
  setForgotDialogOpen: Dispatch<SetStateAction<boolean>>,
  setForgotTitle: Dispatch<SetStateAction<string>>,
  setForgotMessage: Dispatch<SetStateAction<string>>,
  setResetMode: Dispatch<SetStateAction<boolean>>,
): void => {
  try {
    fetch(`${API_URL}/core/generate_otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response is not OK, throw an error to catch it later
          throw new Error('Failed to send OTP. Please try again.');
        }
        return response.json();
      })
      .then((data) => {
        setForgotDialogOpen(true);
        setForgotTitle('OTP Sent');
        setForgotMessage('Please check your email.');
        setResetMode(true);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch operation
        setForgotDialogOpen(true);
        setForgotTitle('Failed to Send OTP');
        setForgotMessage('Please try again.');
      });
  } catch (error) {
    setForgotDialogOpen(true);
    setForgotTitle('Failed to Send OTP');
    setForgotMessage('Please try again.');
  }
};

const resetPassword = (
  email: string,
  otp: number,
  password: string,
  setForgotDialogOpen: Dispatch<SetStateAction<boolean>>,
  setForgotTitle: Dispatch<SetStateAction<string>>,
  setForgotMessage: Dispatch<SetStateAction<string>>,
  setResetMode: Dispatch<SetStateAction<boolean>>,
  changeMode: () => void,
): void => {
  try {
    fetch(`${API_URL}/core/reset_password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response is not OK, throw an error to catch it later
          throw new Error('Failed to reset password. Please try again.');
        }
        return response.json();
      })
      .then((data) => {
        setForgotDialogOpen(true);
        setForgotTitle('Password Reset Successful');
        setForgotMessage('Please sign in.');
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch operation
        setForgotDialogOpen(true);
        setForgotTitle('Failed to Reset Password');
        setForgotMessage('Please try again.');
      });
  } catch (error) {
    setForgotDialogOpen(true);
    setForgotTitle('Failed to Reset Password');
    setForgotMessage('Please try again.');
  }
};

const sendFeedback = (
  feedback: string,
  setFeedbackDialogOpen: Dispatch<SetStateAction<boolean>>,
  setFeedbackTitle: Dispatch<SetStateAction<string>>,
  setFeedbackMessage: Dispatch<SetStateAction<string>>,
): void => {
  try {
    fetch(`${API_URL}/core/feedback/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response is not OK, throw an error to catch it later
          throw new Error('Failed to send feedback. Please try again.');
        }
        return response.json();
      })
      .then((data) => {
        setFeedbackDialogOpen(true);
        setFeedbackTitle('Feedback Sent');
        setFeedbackMessage('Thank you for your feedback.');
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch operation
        setFeedbackDialogOpen(true);
        setFeedbackTitle('Failed to Send Feedback');
        setFeedbackMessage('Please try again.');
      });
  } catch (error) {
    setFeedbackDialogOpen(true);
    setFeedbackTitle('Failed to Send Feedback');
    setFeedbackMessage('Please try again.');
  }
};

export {
  signIn,
  signOut,
  signUp,
  sendPasswordResetEmail,
  resetPassword,
  sendFeedback,
};
