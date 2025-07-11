import type {
  Dispatch,
  JSX,
  SetStateAction,
} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type Props = {
  title: string,
  message: string,
  oneAction: boolean,
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  onConfirm?: () => void | undefined,
  onClose?: () => void | undefined,
}

function ConfirmationDialog({
  title,
  message,
  oneAction,
  open,
  setOpen,
  onConfirm,
  onClose,
}: Props): JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (onClose) {
          onClose();
        }
        setOpen(false);
      }}
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {oneAction ? null : <Button onClick={() => setOpen(false)} color="primary">No</Button>}
        <Button
          onClick={() => {
            if (onConfirm) {
              onConfirm();
            }
            setOpen(false);
          }}
          color="primary"
        >
          {oneAction ? 'Ok' : 'Yes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
