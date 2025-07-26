import type {
  Dispatch,
  JSX,
  SetStateAction,
} from 'react';
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Link,
  Typography,
  styled,
} from '@mui/material';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const CenteredDialogTitle = styled(DialogTitle)(() => ({
  textAlign: 'center',
  marginTop: 'auto',
  marginBottom: 'auto',
}));

const CenteredDialogContent = styled(DialogContent)(() => ({
  textAlign: 'center',
  marginTop: 'auto',
  marginBottom: 'auto',
}));

const LogoAvatar = styled(Avatar)(() => ({
  width: 40,
  height: 40,
}));

const NameTypography = styled(Typography)(() => ({
  fontSize: '1.3rem',
  fontWeight: 'bold',
}));

const LinkContentText = styled(DialogContentText)(() => ({
  fontSize: 15,
  lineHeight: 2,
}));

function About({ open, setOpen }: Props): JSX.Element {
  const version = '1.0.0';
  const description = 'Security-focused e-commerce website with robust user authentication, session management, ' +
    'and secure post-authentication forms written in TypeScript with React and Python with Django.';

  const closeDialog = (): void => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={closeDialog} maxWidth="xs">
      <CenteredDialogTitle>About</CenteredDialogTitle>
      <CenteredDialogContent>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <Grid>
            <LogoAvatar
              variant="rounded"
              alt="Logo"
              src={`/logo512.png`}
            />
            <br />
          </Grid>
          <Grid>
            <NameTypography variant="h6" color="textPrimary">
              Secure E-Commerce
            </NameTypography>
            <br />
          </Grid>
        </Grid>
        <DialogContentText>{description}</DialogContentText>
        <LinkContentText color="textPrimary">
          <b>Version: </b>
          {version}
          <br />
          <b>Author: </b>
          <Link
            color="primary"
            href="https://github.com/VarunS2002"
            target="_blank"
            rel="noreferrer"
          >
            Varun Shanbhag
          </Link>
          <br />
          <b>License: </b>
          <Link
            color="primary"
            href="https://github.com/VarunS2002/React-Django-Secure-E-Commerce/blob/master/LICENSE"
            target="_blank"
            rel="noreferrer"
          >
            GNU GPLv3
          </Link>
          <br />
          <Link
            color="primary"
            href="https://github.com/VarunS2002/React-Django-Secure-E-Commerce"
            target="_blank"
            rel="noreferrer"
          >
            Source Code
          </Link>
        </LinkContentText>
      </CenteredDialogContent>
    </Dialog>
  );
}

export default About;
