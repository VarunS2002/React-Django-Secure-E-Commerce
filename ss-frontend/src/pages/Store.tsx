import { useState } from 'react';
import type {
  Dispatch,
  JSX,
  SetStateAction,
} from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  styled,
} from '@mui/material';
import Cart from '@/pages/Cart';
import { UserTypes } from '@/utilities/abstractions';
import type { Item } from '@/utilities/abstractions';
import { Delete } from '@mui/icons-material';
import CreateListing from '@/pages/CreateListing';
import ConfirmationDialog from '@/pages/ConfirmationDialog';
import { deleteListing } from '@/utilities/listings';

type Props = {
  items: Item[],
  setItems: Dispatch<SetStateAction<Item[]>>
  userType: UserTypes,
}

const NameTitle = styled(Typography)(() => ({
  whiteSpace: 'nowrap',
  overflowX: 'auto',
  overflowY: 'hidden',
  display: 'block', // required for scrollbars in Typography
}));

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number>(0);

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
            <Grid
              size={{
                xs: 12, sm: 6, md: 3, lg: 3,
              }}
              key={item.id}
            >
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
                  <NameTitle gutterBottom variant="h5">
                    {item.name}
                  </NameTitle>
                  {userType === UserTypes.Customer ? (
                    <Typography variant="body1" color="textSecondary" noWrap>
                      {item.seller}
                    </Typography>
                  ) : null}
                  <Typography variant="body2" color="textSecondary" noWrap>
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
                  ) : null}
                </CardContent>
                {
                  userType === UserTypes.Seller ? (
                    <CardContent
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <ConfirmationDialog
                        title="Confirm Deletion"
                        message="Are you sure you want to delete this listing? This action cannot be undone."
                        oneAction={false}
                        open={deleteDialogOpen}
                        setOpen={setDeleteDialogOpen}
                        onConfirm={() => deleteListing(
                          itemToDelete,
                          items,
                          setItems,
                          setDialogOpen,
                          setDialogTitle,
                          setDialogMessage,
                        )}
                      />
                      <IconButton
                        color="secondary"
                        size="small"
                        key={item.id}
                        onClick={() => {
                          setItemToDelete(item.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </CardContent>
                  ) : null
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
      ) : null}
      {userType === UserTypes.Seller ? (
        <CreateListing />
      ) : null}
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
