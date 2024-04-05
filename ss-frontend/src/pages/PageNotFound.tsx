import React from 'react';
import {
  Box,
  Button,
  Divider,
  Typography,
} from '@material-ui/core';
import { pageNotFoundStyles } from 'utilities/styles/styles';

function PageNotFound(): JSX.Element {
  const classes = pageNotFoundStyles();

  return (
    <>
      <div className={classes.rootText}>
        <Box className={classes.boxText}>
          <Typography variant="h6" className={classes.statusCode}>
            404
          </Typography>
          <Divider orientation="vertical" variant="middle" flexItem className={classes.divider} />
          <Typography variant="body2" color="textPrimary" className={classes.text}>
            This page could not be found
          </Typography>
        </Box>
      </div>
      <div className={classes.rootButtons}>
        <Box className={classes.boxButtons}>
          <Button color="primary" href="/">
            Go Home
          </Button>
          <Button color="primary" href="https://github.com/VarunS2002" target="_blank" rel="noreferrer">
            Report
          </Button>
        </Box>
      </div>
    </>
  );
}

export default PageNotFound;
