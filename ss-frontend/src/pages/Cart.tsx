import React from 'react';
import type {
  Dispatch,
  JSX,
  SetStateAction,
} from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Typography,
} from '@mui/material';
import {
  ShoppingCart,
  Payment,
} from '@mui/icons-material';
import type { Item } from 'utilities/abstractions';
import { useNavigate } from 'react-router';

type Props = {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  items: Item[],
}

function Cart(
  {
    open,
    setOpen,
    items,
  }: Props,
): JSX.Element {
  const navigate = useNavigate();
  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const proceedToCheckout = (): void => {
    navigate('/checkout');
  };

  const totalPrice = items.reduce((acc, item) => acc + Number(item.price.slice(1)) * item.quantity, 0);

  return (
    <div>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
        }}
      >
        <ShoppingCart />
      </Fab>
      <Dialog onClose={handleClose} aria-labelledby="cart-dialog-title" open={open}>
        <DialogTitle id="cart-dialog-title">Shopping Cart</DialogTitle>
        <DialogContent
          dividers
          style={
            {
              paddingTop: 0,
            }
          }
        >
          <List>
            {items.map((item) => (
              <ListItem key={item.id} style={{ paddingLeft: 0 }}>
                <ListItemAvatar>
                  <Avatar src={item.imageUrl} />
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={`Price: ${item.price} Quantity: ${item.quantity}`} />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6">
            Total: $
            {totalPrice}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Payment />}
            style={{
              marginTop: '20px',
              justifyContent: 'flex-end',
            }}
            onClick={proceedToCheckout}
            disabled={items.length === 0}
          >
            Checkout
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Cart;
