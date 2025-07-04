import React from 'react';
import type { JSX } from 'react';
import { Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router';

function CreateListing(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => {
          navigate('/create-listing');
        }}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
        }}
      >
        <Add />
      </Fab>
    </div>
  );
}

export default CreateListing;
