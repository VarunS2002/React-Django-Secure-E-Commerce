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
  let refreshToken = localStorage.getItem('refresh');

  const fetchUser = async (accessToken: string): Promise<null | Record<string, never>> => {
    const response = await fetch(`${API_URL}/core/current_user/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      return null;
    }

    return response.json();
  };

  const refreshAccessToken = async (): Promise<null | string> => {
    if (!refreshToken) return null;
    const response = await fetch(`${API_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.access) localStorage.setItem('access', data.access);
    if (data.refresh) {
      refreshToken = data.refresh;
      localStorage.setItem('refresh', data.refresh);
    }

    return data.access;
  };

  if (token && (getIsSignedIn() || getRememberMe())) {
    let userData = await fetchUser(token);

    if (!userData) {
      const newToken = await refreshAccessToken();
      if (newToken) userData = await fetchUser(newToken);
    }

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

    signOut();
    setSessionExpiredDialogOpen(true);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return false;
  }
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');

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
