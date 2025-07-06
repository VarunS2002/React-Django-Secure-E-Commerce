import { UserTypes } from '@/utilities/abstractions';

const resolveRoutes = (
  location: string,
  signedIn: boolean,
  userType: UserTypes,
): string => {
  const routes = [
    '/', '/login', '/store', '/listings', '/checkout', '/create-listing',
  ];
  if (!routes.some((route) => location === route || location === `${route}/`)) {
    return '/404';
  }
  if (signedIn) {
    if (userType === UserTypes.Customer) {
      if (location === '/store' || location === '/store/') {
        return '/store';
      }
      if (location === '/checkout' || location === '/checkout/') {
        return '/checkout';
      }
      return '/store';
    }
    if (userType === UserTypes.Seller) {
      if (location === '/listings' || location === '/listings/') {
        return '/listings';
      }
      if (location === '/create-listing' || location === '/create-listing/') {
        return '/create-listing';
      }
      return '/listings';
    }
  }
  return '/login';
};

export default resolveRoutes;
