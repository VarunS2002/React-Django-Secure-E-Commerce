import React from 'react';
import type {
  Dispatch,
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
} from '@material-ui/core';
import { aboutStyles } from 'utilities/styles/styles';

type Props = {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
}

function About({
  open,
  setOpen,
}: Props): JSX.Element {
  const classes = aboutStyles();
  const version = '1.0.0';
  const description = 'Secure E-Commerce created using React and Django.';

  const closeDialog = (): void => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={closeDialog} maxWidth="xs">
      <DialogTitle className={classes.center}>About</DialogTitle>
      <DialogContent className={classes.center}>
        <Grid
          container
          direction="row"
          alignContent="center"
          justifyContent="center"
          spacing={2}
        >
          <Grid item className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Logo"
              src={`${process.env.PUBLIC_URL}/logo512.png`}
              className={classes.logo}
            />
            <br />
          </Grid>
          <Grid item className={classes.center}>
            <Typography variant="h6" color="textPrimary" className={classes.name}>
              Secure E-Commerce
            </Typography>
            <br />
          </Grid>
        </Grid>
        <DialogContentText>{description}</DialogContentText>
        <DialogContentText className={classes.links} color="textPrimary">
          <b>Version: </b>
          {version}
          <br />
          <b>Author: </b>
          <Link color="primary" href="https://github.com/VarunS2002" target="_blank" rel="noreferrer">
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
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default About;
