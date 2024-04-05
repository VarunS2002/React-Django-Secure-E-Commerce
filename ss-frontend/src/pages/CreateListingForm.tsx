import React, {
  useState,
} from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
} from '@material-ui/core';
import { signUpStyles } from 'utilities/styles/styles';
import {
  validateBeforeCreateListing,
  validateImgUrl,
  validatePrice,
  validateProductName,
} from 'utilities/formValidation';
import { useHistory } from 'react-router-dom'; // Assuming signUpStyles can be reused for form styling
import { createListing } from 'utilities/listings';
import ConfirmationDialog from 'pages/ConfirmationDialog';
import { Item } from 'utilities/abstractions';

type Props = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const CreateListingForm = (
  {
    items,
    setItems,
  }: Props,
) => {
  const history = useHistory();
  const classes = signUpStyles(); // Reuse styles from signUpStyles or define new styles as needed
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [price, setPrice] = useState(0);
  const [priceError, setPriceError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlError, setImageUrlError] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  return (
    <Container component="main" maxWidth="xs">
      <br />
      {' '}
      <br />
      <Typography component="h1" variant="h5">
        Add Product
      </Typography>
      <form
        onSubmit={(event) => {
          if (validateBeforeCreateListing(
            event,
            name, setNameError, price, setPriceError, imageUrl, setImageUrlError,
          )) {
            createListing(
              name, price, imageUrl, setDialogOpen, setDialogTitle, setDialogMessage, setItems,
            );
          }
        }}
        noValidate
      >
        <TextField
          error={nameError !== ''}
          helperText={nameError}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Product Name"
          name="name"
          autoComplete="pname"
          onChange={(event) => {
            validateProductName(
              event, setName, setNameError,
            );
          }}
        />
        <TextField
          error={priceError !== ''}
          helperText={priceError}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="price"
          label="Price"
          name="price"
          type="number"
          autoComplete="price"
          onChange={(event) => {
            validatePrice(
              event, setPrice, setPriceError,
            );
          }}
        />
        <TextField
          error={imageUrlError !== ''}
          helperText={imageUrlError}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="imageUrl"
          label="Product Image URL"
          name="imageUrl"
          autoComplete="image-url"
          onChange={(event) => {
            validateImgUrl(
              event, setImageUrl, setImageUrlError,
            );
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Create Listing
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
          onClick={() => {
            history.push('/listings');
          }}
        >
          Cancel
        </Button>
      </form>
      <ConfirmationDialog
        title={dialogTitle}
        message={dialogMessage}
        oneAction
        open={dialogOpen}
        setOpen={setDialogOpen}
        onClose={() => {
          if (dialogTitle === 'Product Added') {
            history.push('/listings');
          }
        }}
        onConfirm={() => {
          if (dialogTitle === 'Product Added') {
            history.push('/listings');
          }
        }}
      />
    </Container>
  );
};

export default CreateListingForm;
