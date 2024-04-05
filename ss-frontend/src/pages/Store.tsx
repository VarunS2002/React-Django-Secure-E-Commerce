import React, {
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from '@material-ui/core';
import Cart from 'pages/Cart';
import {
  Item,
  UserTypes,
} from 'utilities/abstractions';
import {
  Delete,
} from '@material-ui/icons';
import CreateListing from './CreateListing';
import ConfirmationDialog from './ConfirmationDialog';
import { deleteListing } from '../utilities/listings';

type Props = {
  items: Item[],
  setItems: Dispatch<SetStateAction<Item[]>>
  userType: UserTypes,
}

function Store(
  {
    items,
    setItems,
    userType,
  }: Props,
): JSX.Element {
  // eslint-disable-next-line prefer-const
  let itemsInCart = items.filter((item) => item.quantity > 0);
  const [cartOpen, setCartOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const handleQuantityChange = (id: number, delta: number): void => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        let updatedQuantity = Math.max(0, item.quantity + delta);
        updatedQuantity = Math.min(5, updatedQuantity);
        return {
          ...item,
          quantity: updatedQuantity,
        };
      }
      return item;
    });
    setItems(newItems);
  };

  return (
    <>
      <div style={{
        flexGrow: 1,
        padding: 30,
      }}
      >
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card>
                <div
                  style={{
                    height: 0,
                    paddingTop: '70%', // This creates a container that is a perfect square
                    position: 'relative',
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // This ensures the image covers the square area without being stretched
                    }}
                  />
                </div>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                  {userType === UserTypes.Customer ? (
                    <Typography variant="body1" color="textSecondary">
                      {item.seller}
                    </Typography>
                  ) : <></>}
                  <Typography variant="body2" color="textSecondary">
                    {item.price}
                  </Typography>
                  {userType === UserTypes.Customer ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      paddingTop="10px"
                      justifyContent="flex-end"
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        style={{
                          minWidth: '32px',
                          height: '32px',
                        }}
                      >
                        -
                      </Button>
                      <Typography
                        style={{
                          margin: '0 10px',
                          minWidth: '32px',
                          textAlign: 'center',
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        style={{
                          minWidth: '32px',
                          height: '32px',
                        }}
                      >
                        +
                      </Button>
                    </Box>
                  ) : <></>}
                </CardContent>
                {
                  userType === UserTypes.Seller ? (
                    <CardContent
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <IconButton
                        color="secondary"
                        size="small"
                        key={item.id}
                        onClick={() => {
                          deleteListing(item.id, items, setItems, setDialogOpen, setDialogTitle, setDialogMessage);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </CardContent>
                  ) : <></>
                }
                {/* <CardActions style={{ justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                  >
                    Add to Cart
                  </Button>
                </CardActions> */}
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      {userType === UserTypes.Customer ? (
        <Cart
          open={cartOpen}
          setOpen={setCartOpen}
          items={itemsInCart}
        />
      ) : <></>}
      {userType === UserTypes.Seller ? (
        <CreateListing />
      ) : <></>}
      <ConfirmationDialog
        title={dialogTitle}
        message={dialogMessage}
        oneAction
        open={dialogOpen}
        setOpen={setDialogOpen}
      />
    </>
  );
}

export default Store;
