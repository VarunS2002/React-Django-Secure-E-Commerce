import type {
  Dispatch,
  SetStateAction,
} from 'react';
import { UserTypes } from '@/utilities/abstractions';
import type { UserDetails } from '@/utilities/abstractions';
import {
  authFetch,
  signOut,
} from '@/utilities/authentication';
import { API_URL } from '@/utilities/api';

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

  if (token && (getIsSignedIn() || getRememberMe())) {
    const userData = await authFetch(`${API_URL}/core/current_user/`, {}, setSessionExpiredDialogOpen)
      .then(
        (response) => response?.json()
      );

    if (userData) {
      setUserDetails({
        id: userData.id,
        userType: userData.user_type,
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        phoneNumber: userData.contact_number,
        address: userData.address,
      });
      localStorage.setItem('isSignedIn', String(true));
      return true;
    }
    return false;
  }
  else if (token) {
    signOut();
  }
  else {
    localStorage.removeItem('refresh');
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
