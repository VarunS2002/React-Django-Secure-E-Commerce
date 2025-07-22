import type {
  Dispatch,
  SetStateAction,
} from 'react';
import type { Item } from '@/utilities/abstractions';
import { authFetch } from '@/utilities/authentication';
import { API_URL } from '@/utilities/api';

const getItemsCustomer = async (
  setSessionExpiredDialogOpen: Dispatch<SetStateAction<boolean>>,
): Promise<Item[]> => {
  const items: Item[] = [];
  await authFetch(`${API_URL}/core/get_all_listings/`, {
    method: 'GET',
  }, setSessionExpiredDialogOpen)
    .then((response) => {
      if (!response?.ok) {
        // If the response is not OK, throw an error to catch it later
        throw new Error('Failed to fetch listings. Please try again.');
      }
      return response.json();
    })
    .then((data) => {
      items.push(...data);
      return data;
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch operation
      console.error('Failed to fetch listings. Please try again.');
    });
  return items;
};

const checkout = (
  goToStore: () => void,
  items: Item[],
  address: string,
  zip: string,
  phone: number,
  card: string,
  exp: string,
  csc: string,
  setCheckoutTitle: Dispatch<SetStateAction<string>>,
  setCheckoutMessage: Dispatch<SetStateAction<string>>,
  setCheckoutDialogOpen: Dispatch<SetStateAction<boolean>>,
  setSessionExpiredDialogOpen: Dispatch<SetStateAction<boolean>>,
): void => {
  authFetch(`${API_URL}/core/place_order/`, {
    method: 'POST',
    body: JSON.stringify({
      items,
      address,
      zip,
      phone,
      card,
      exp,
      csc,
    }),
  }, setSessionExpiredDialogOpen)
    .then((response) => {
      if (!response?.ok) {
        // If the response is not OK, throw an error to catch it later
        throw new Error('Failed to place order. Please try again.');
      }
      return response.json();
    })
    .then((data) => {
      setCheckoutTitle('Order Placed');
      setCheckoutMessage('Your order has been placed successfully.');
      setCheckoutDialogOpen(true);
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch operation
      setCheckoutTitle('Failed to Place Order');
      setCheckoutMessage('Please try again.');
      setCheckoutDialogOpen(true);
    });
};

const getItemsSeller = async (
  setSessionExpiredDialogOpen: Dispatch<SetStateAction<boolean>>,
): Promise<Item[]> => {
  const items: Item[] = [];
  await authFetch(`${API_URL}/core/get_my_listings/`, {
    method: 'GET',
  }, setSessionExpiredDialogOpen)
    .then((response) => {
      if (!response?.ok) {
        // If the response is not OK, throw an error to catch it later
        throw new Error('Failed to fetch listings. Please try again.');
      }
      return response.json();
    })
    .then((data) => {
      items.push(...data);
      return data;
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch operation
      console.error('Failed to fetch listings. Please try again.');
    });
  return items;
};

const deleteListing = (
  id: number,
  items: Item[],
  setItems: Dispatch<SetStateAction<Item[]>>,
  setDialogOpen: Dispatch<SetStateAction<boolean>>,
  setDialogTitle: Dispatch<SetStateAction<string>>,
  setDialogMessage: Dispatch<SetStateAction<string>>,
  setSessionExpiredDialogOpen: Dispatch<SetStateAction<boolean>>,
): void => {
  authFetch(`${API_URL}/core/delete_listing/`, {
    method: 'DELETE',
    body: JSON.stringify({
      id,
    }),
  }, setSessionExpiredDialogOpen)
    .then((response) => {
      if (!response?.ok) {
        // If the response is not OK, throw an error to catch it later
        throw new Error('Failed to delete listing. Please try again.');
      }
      return response.json();
    })
    .then((data) => {
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
      setDialogOpen(true);
      setDialogTitle('Listing Deleted');
      setDialogMessage('Your listing has been deleted successfully.');
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch operation
      setDialogOpen(true);
      setDialogTitle('Failed to Delete Listing');
      setDialogMessage('Please try again.');
    });
};

const createListing = (
  name: string,
  price: number,
  imageUrl: string,
  setDialogOpen: Dispatch<SetStateAction<boolean>>,
  setDialogTitle: Dispatch<SetStateAction<string>>,
  setDialogMessage: Dispatch<SetStateAction<string>>,
  setItems: Dispatch<SetStateAction<Item[]>>,
  setSessionExpiredDialogOpen: Dispatch<SetStateAction<boolean>>,
): void => {
  authFetch(`${API_URL}/core/create_listing/`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      price,
      imageUrl,
    }),
  }, setSessionExpiredDialogOpen)
    .then((response) => {
      if (!response?.ok) {
        // If the response is not OK, throw an error to catch it later
        throw new Error('Failed to create listing. Please try again.');
      }
      return response.json();
    })
    .then((data: Item) => {
      setDialogOpen(true);
      setDialogTitle('Product Added');
      setDialogMessage('Product has been successfully added!');
      setItems((prevItems) => [...prevItems, data]);
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch operation
      setDialogOpen(true);
      setDialogTitle('Failed to Add Product');
      setDialogMessage('Please try again.');
    });
};

export {
  getItemsCustomer,
  getItemsSeller,
  checkout,
  deleteListing,
  createListing,
};
