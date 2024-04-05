import React, {
  Dispatch,
  SetStateAction,
} from 'react';
import { Fab } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

function CreateListing(): JSX.Element {
  const history = useHistory();

  return (
    <div>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => {
          history.push('/create-listing');
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
