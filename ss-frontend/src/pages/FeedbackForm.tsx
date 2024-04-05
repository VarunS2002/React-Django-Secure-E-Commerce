import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import {
  focusAndSetCursorToEnd,
  validateFeedback,
} from 'utilities/formValidation';
import { sendFeedback } from '../utilities/authentication';
import ConfirmationDialog from './ConfirmationDialog';

type Props = {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
};

function FeedbackForm({
  open,
  setOpen,
}: Props): JSX.Element {
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleClose = () => {
    setFeedback('');
    setFeedbackError('');
    setOpen(false);
  };
  const handleSubmit = () => {
    if (feedback === '') {
      setFeedbackError('Feedback cannot be empty');
      focusAndSetCursorToEnd('feedback');
    } else if (feedbackError !== '') {
      focusAndSetCursorToEnd('feedback');
    } else {
      sendFeedback(feedback, setFeedbackDialogOpen, setFeedbackTitle, setFeedbackMessage);
      handleClose();
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Feedback</DialogTitle>
        <DialogContent>
          <TextField
            error={feedbackError !== ''}
            helperText={feedbackError}
            margin="dense"
            id="name"
            label="Your Feedback"
            type="text"
            variant="outlined"
            fullWidth
            required
            style={{ width: '300px' }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => validateFeedback(
              event, setFeedback, setFeedbackError,
            )}
            multiline
            rows={5}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog
        title={feedbackTitle}
        message={feedbackMessage}
        oneAction
        open={feedbackDialogOpen}
        setOpen={setFeedbackDialogOpen}
      />
    </div>
  );
}

export default FeedbackForm;
