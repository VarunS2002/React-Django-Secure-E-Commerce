import React, {
  useState,
} from 'react';
import type {
  Dispatch,
  SetStateAction,
} from 'react';
import {
  IconButton,
  Popover,
  Tooltip,
  Zoom,
} from '@material-ui/core';
import {
  AccountCircle,
} from '@material-ui/icons/';
import { signOut } from 'utilities/authentication';
import {
  UserDetails,
} from 'utilities/abstractions';
import ConfirmationDialog from 'pages/ConfirmationDialog';
import Profile from 'pages/Profile';

type Props = {
  signedIn: boolean,
  setSignedIn: Dispatch<SetStateAction<boolean>>,
  userDetails: UserDetails,
};

function ToolBarItems({
  signedIn,
  setSignedIn,
  userDetails,
}: Props): JSX.Element {
  const [accountAnchorElement, setAccountAnchorElement] = useState<HTMLButtonElement | null>(null);
  const [signOutConfirmationOpen, setSignOutConfirmationOpen] = useState(false);

  return (
    <>
      {signedIn ? (
        <>
          <Tooltip
            title="Account"
            aria-label="account"
            arrow
            enterTouchDelay={100}
            TransitionComponent={Zoom}
          >
            <IconButton
              color="inherit"
              aria-label="account"
              onClick={(event) => setAccountAnchorElement(event.currentTarget)}
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>
          <Popover
            id="account-menu"
            anchorEl={accountAnchorElement}
            keepMounted
            open={Boolean(accountAnchorElement)}
            onClose={() => setAccountAnchorElement(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Profile
              setSignOutConfirmationOpen={setSignOutConfirmationOpen}
              userDetails={userDetails}
            />
          </Popover>
          <ConfirmationDialog
            title="Sign Out"
            message="Are you sure you want to sign out?"
            oneAction={false}
            open={signOutConfirmationOpen}
            setOpen={setSignOutConfirmationOpen}
            onConfirm={() => {
              setAccountAnchorElement(null);
              setTimeout(() => {
                signOut(setSignedIn);
              }, 100);
            }}
          />
        </>
      ) : <></>}
    </>
  );
}

export default ToolBarItems;
