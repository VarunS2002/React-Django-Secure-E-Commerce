import type { JSX } from 'react';
import {
  Box,
  Button,
  Divider,
  styled,
  Typography,
} from '@mui/material';

const RootTextContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '80vh',
}));

const BoxContainer = styled(Box)(() => ({
  display: 'flex',
}));

const RootButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StatusCode = styled(Typography)(() => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
}));

const StatusText = styled(Typography)(() => ({
  marginTop: 'auto',
  marginBottom: 'auto',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  background: theme.palette.text.secondary,
}));

function PageNotFound(): JSX.Element {
  return (
    <>
      <RootTextContainer>
        <BoxContainer>
          <StatusCode variant="h6">
            404
          </StatusCode>
          <StyledDivider orientation="vertical" variant="middle" flexItem />
          <StatusText variant="body2" color="textPrimary">
            This page could not be found
          </StatusText>
        </BoxContainer>
      </RootTextContainer>
      <RootButtonContainer>
        <BoxContainer>
          <Button color="primary" href="/">
            Go Home
          </Button>
          <Button color="primary" href="https://github.com/VarunS2002" target="_blank" rel="noreferrer">
            Report
          </Button>
        </BoxContainer>
      </RootButtonContainer>
    </>
  );
}

export default PageNotFound;
