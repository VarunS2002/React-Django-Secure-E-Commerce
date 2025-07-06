import {
  type Dispatch,
  type JSX,
  type SetStateAction,
  useState,
} from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  styled,
} from '@mui/material';
import {
  validateBeforeCreateListing,
  validateImgUrl,
  validatePrice,
  validateProductName,
} from '@/utilities/formValidation';
import { useNavigate } from 'react-router';
import { createListing } from '@/utilities/listings';
import ConfirmationDialog from '@/pages/ConfirmationDialog';
import type { Item } from '@/utilities/abstractions';

type Props = {
  setItems: Dispatch<SetStateAction<Item[]>>;
}

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 0, 1),
}));

function CreateListingForm({
  setItems,
}: Props): JSX.Element {
  const navigate = useNavigate();
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
            name,
            setNameError,
            price,
            setPriceError,
            imageUrl,
            setImageUrlError,
          )) {
            createListing(name, price, imageUrl, setDialogOpen, setDialogTitle, setDialogMessage, setItems);
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
            validateProductName(event, setName, setNameError);
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
            validatePrice(event, setPrice, setPriceError);
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
            validateImgUrl(event, setImageUrl, setImageUrlError);
          }}
        />
        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Create Listing
        </SubmitButton>
        <SubmitButton
          fullWidth
          variant="contained"
          color="secondary"
          onClick={() => {
            navigate('/listings');
          }}
        >
          Cancel
        </SubmitButton>
      </form>
      <ConfirmationDialog
        title={dialogTitle}
        message={dialogMessage}
        oneAction
        open={dialogOpen}
        setOpen={setDialogOpen}
        onClose={() => {
          if (dialogTitle === 'Product Added') {
            navigate('/listings');
          }
        }}
        onConfirm={() => {
          if (dialogTitle === 'Product Added') {
            navigate('/listings');
          }
        }}
      />
    </Container>
  );
}

export default CreateListingForm;
