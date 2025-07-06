import type {
  Dispatch,
  JSX,
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
  styled,
} from '@mui/material';
import { MdLogout } from 'react-icons/md';
import type { UserDetails } from '@/utilities/abstractions';

type Props = {
  setSignOutConfirmationOpen: Dispatch<SetStateAction<boolean>>;
  userDetails: UserDetails;
};

const CenteredDialogContent = styled(DialogContent)(() => ({
  textAlign: 'center',
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const SmallAvatar = styled(Avatar)(() => ({
  width: 40,
  height: 40,
}));

function Profile({
  setSignOutConfirmationOpen,
  userDetails,
}: Props): JSX.Element {
  let { phoneNumber } = userDetails;
  if (phoneNumber !== '' && phoneNumber !== null && phoneNumber !== undefined) {
    phoneNumber = `${phoneNumber.slice(0, -10)} ${phoneNumber.slice(-10)
      .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`;
  }

  return (
    <Paper>
      <CenteredDialogContent>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <Grid>
            <SmallAvatar>
              {userDetails.firstName[0]}
            </SmallAvatar>
          </Grid>

          <Grid>
            <Typography variant="h6" color="text.primary" align="center">
              {`${userDetails.firstName} ${userDetails.lastName}`}
            </Typography>
            <Typography variant="body2" align="center">
              {userDetails.email}
              <br />
              {phoneNumber}
            </Typography>
          </Grid>

          <Grid>
            <DialogContentText align="center">
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
          </Grid>
        </Grid>
      </CenteredDialogContent>
    </Paper>
  );
}

export default Profile;
