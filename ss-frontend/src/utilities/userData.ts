import type {
  Dispatch,
  SetStateAction,
} from 'react';
import { UserTypes } from 'utilities/abstractions';
import type { UserDetails } from 'utilities/abstractions';
import { signOut } from 'utilities/authentication';
import { API_URL } from 'utilities/api';

const getUserType = (): UserTypes => {
  const userType = localStorage.getItem('userType');
  if (userType !== null) {
    return UserTypes[userType as keyof typeof UserTypes];
  }
  localStorage.setItem('userType', 'Customer');
  return UserTypes.Customer;
};

const getRememberMe = (): boolean => true;
// const rememberMe = localStorage.getItem('rememberMe');
// if (rememberMe !== null) {
//   return JSON.parse(rememberMe);
// }
// return true;

const getIsSignedIn = (): boolean => {
  const isSignedIn = localStorage.getItem('isSignedIn');
  if (isSignedIn !== null) {
    return JSON.parse(isSignedIn);
  }
  return false;
};

const getUserData = async (
  setUserDetails: Dispatch<SetStateAction<UserDetails>>,
  setSessionExpiredDialogOpen: Dispatch<SetStateAction<boolean>>,
): Promise<boolean> => {
  const token = localStorage.getItem('access');
  let tokenExpired = false;
  if (token !== null) {
    if (getIsSignedIn() || getRememberMe()) {
      await fetch(`${API_URL}/core/current_user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 401) {
            tokenExpired = true;
            signOut();
            setSessionExpiredDialogOpen(true);
          }
          return response.json();
        })
        .then((json) => {
          if (!tokenExpired) {
            setUserDetails({
              id: json.id,
              userType: json.user_type,
              firstName: json.first_name,
              lastName: json.last_name,
              email: json.email,
              phoneNumber: json.contact_number,
              address: json.address,
            });
          }
        })
        .catch(() => {
          tokenExpired = true;
          localStorage.removeItem('access');
          signOut();
          setSessionExpiredDialogOpen(true);
        });
      if (tokenExpired) {
        return false;
      }
      localStorage.setItem('isSignedIn', String(true));
      return true;
    }
    localStorage.removeItem('access');
  }
  return false;
};

function getUserDetails(): UserDetails {
  return {
    id: Number.NaN,
    userType: UserTypes.Customer,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: null,
    address: null,
  };
}

export {
  getRememberMe,
  getIsSignedIn,
  getUserData,
  getUserType,
  getUserDetails,
};
