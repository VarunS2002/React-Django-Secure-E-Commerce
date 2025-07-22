import { useState } from 'react';
import type {
  ChangeEvent,
  Dispatch,
  JSX,
  SetStateAction,
} from 'react';
import type { Item } from '@/utilities/abstractions';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Container,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import ConfirmationDialog from '@/pages/ConfirmationDialog';
import {
  validateAddress,
  validateBeforeCheckout,
  validateCard,
  validateCsc,
  validateExp,
  validatePhone,
  validateZip,
} from '@/utilities/formValidation';
import { checkout } from '@/utilities/listings';

type Props = {
  items: Item[],
  setItems: Dispatch<SetStateAction<Item[]>>,
  setSessionExpiredDialogOpen: Dispatch<SetStateAction<boolean>>,
}

const PaperContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 0, 1),
}));

function Checkout({
  items,
  setItems,
  setSessionExpiredDialogOpen,
}: Props): JSX.Element {
  const navigate = useNavigate();
  const itemsInCart = items.filter((item) => item.quantity > 0);
  const totalPrice = items.reduce((acc, item) => acc + Number(item.price.slice(1)) * item.quantity, 0);

  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [checkoutTitle, setCheckoutTitle] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [zip, setZip] = useState('');
  const [zipError, setZipError] = useState('');
  const [phone, setPhone] = useState(0);
  const [phoneError, setPhoneError] = useState('');
  const [card, setCard] = useState('');
  const [cardError, setCardError] = useState('');
  const [exp, setExp] = useState('');
  const [expError, setExpError] = useState('');
  const [csc, setCsc] = useState('');
  const [cscError, setCscError] = useState('');

  const goToStore = (): void => {
    if (!checkoutDialogOpen) {
      navigate('/store');
    }
  };

  if (itemsInCart.length === 0) {
    goToStore();
  }

  return (
    <Container component="main" maxWidth="xs">
      <br />
      <br />
      <br />
      <PaperContainer>
        <Typography variant="h5">
          Total Price (inc. taxes): $
          {totalPrice}
        </Typography>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (validateBeforeCheckout(
              event,
              address,
              setAddressError,
              zip,
              setZipError,
              phone,
              setPhoneError,
              card,
              setCardError,
              csc,
              setCscError,
              exp,
              setExpError,
            )) {
              checkout(
                goToStore,
                itemsInCart,
                address,
                zip,
                phone,
                card,
                exp,
                csc,
                setCheckoutTitle,
                setCheckoutMessage,
                setCheckoutDialogOpen,
                setSessionExpiredDialogOpen,
              );
            }
          }}
        >
          <TextField
            error={addressError !== ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              validateAddress(event, setAddress, setAddressError);
            }}
            helperText={addressError}
            margin="normal"
            name="address"
            variant="outlined"
            required
            fullWidth
            autoFocus
            id="address"
            label="Street Address"
            autoComplete="street-address"
          />
          <TextField
            error={zipError !== ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              validateZip(event, setZip, setZipError);
            }}
            helperText={zipError}
            margin="normal"
            name="zip"
            variant="outlined"
            required
            fullWidth
            id="zip"
            label="Zip Code"
            autoComplete="postal-code"
          />
          <TextField
            error={phoneError !== ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              validatePhone(event, setPhone, setPhoneError);
            }}
            helperText={phoneError}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="tel-national"
            type="number"
          />
          <TextField
            error={cardError !== ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              validateCard(event, setCard, setCardError);
            }}
            helperText={cardError}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="creditCard"
            label="Credit Card Number"
            name="creditCard"
            autoComplete="cc-number"
          />
          <div style={{
            display: 'flex',
            gap: '1rem',
          }}
          >
            <TextField
              error={cscError !== ''}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                validateCsc(event, setCsc, setCscError);
              }}
              helperText={cscError}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="csc"
              label="CSC"
              name="csc"
              autoComplete="cc-csc"
            />
            <TextField
              error={expError !== ''}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                validateExp(event, setExp, setExpError);
              }}
              helperText={expError}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="exp"
              label="Expiry Date (MM/YY)"
              name="exp"
              autoComplete="cc-exp"
              type="text"
            />
          </div>
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Confirm Purchase
          </SubmitButton>
          <SubmitButton
            fullWidth
            variant="contained"
            color="secondary"
            onClick={goToStore}
          >
            Cancel
          </SubmitButton>
        </form>
      </PaperContainer>
      <ConfirmationDialog
        title={checkoutTitle}
        message={checkoutMessage}
        oneAction
        open={checkoutDialogOpen}
        setOpen={setCheckoutDialogOpen}
        onConfirm={() => {
          if (checkoutTitle === 'Order Placed') {
            setItems(items.map((item) => ({
              ...item,
              quantity: 0,
            })));
            goToStore();
          }
        }}
        onClose={() => {
          if (checkoutTitle === 'Order Placed') {
            setItems(items.map((item) => ({
              ...item,
              quantity: 0,
            })));
            goToStore();
          }
        }}
      />
    </Container>
  );
}

export default Checkout;
