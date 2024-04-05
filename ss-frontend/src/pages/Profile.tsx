import React from 'react';
import type {
  Dispatch,
  SetStateAction,
} from 'react';
import {
  Avatar,
  Button,
  DialogContent,
  DialogContentText,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { MdLogout } from 'react-icons/md';
import { profileStyles } from 'utilities/styles/styles';
import {
  UserDetails,
} from 'utilities/abstractions';

type Props = {
  setSignOutConfirmationOpen: Dispatch<SetStateAction<boolean>>;
  userDetails: UserDetails
};

function Profile({
  setSignOutConfirmationOpen,
  userDetails,
}: Props): JSX.Element {
  const classes = profileStyles();
  let { phoneNumber } = userDetails;
  if (phoneNumber !== '' && phoneNumber !== null && phoneNumber !== undefined) {
    phoneNumber = `${phoneNumber.slice(0, -10)} ${phoneNumber.slice(-10)
      .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`;
  }

  return (
    <Paper>
      <DialogContent className={classes.center}>
        <Grid
          container
          direction="column"
          alignContent="center"
          justifyContent="center"
          spacing={2}
        >
          <Grid item className={classes.center}>
            <Avatar className={classes.avatar}>{userDetails.firstName[0]}</Avatar>
          </Grid>
          <Grid item className={classes.center}>
            <Typography variant="h6" color="textPrimary">
              {`${userDetails.firstName} ${userDetails.lastName}`}
            </Typography>
            {userDetails.email}
            <br />
            {phoneNumber}
          </Grid>
          <Grid item className={classes.center} />
        </Grid>
        <DialogContentText>
          <Button
            color="primary"
            variant="outlined"
            size="small"
            startIcon={<MdLogout />}
            onClick={() => setSignOutConfirmationOpen(true)}
          >
            Sign Out
          </Button>
        </DialogContentText>
      </DialogContent>
    </Paper>
  );
}

export default Profile;
