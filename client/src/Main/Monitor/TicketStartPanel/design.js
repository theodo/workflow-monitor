import React, { Fragment } from 'react';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

const TicketStartPanel = () => (
  <Fragment>
    <p>To get started, press the arrow on the bottom right of the screen.</p>
    <p>
      <span style={{fontWeight: 'bold'}}><VerifiedUserIcon /> Protip! </span>
      To navigate, you can use keyboard shortcuts (N->Next/P->Previous/Spacebar->Pause)
    </p>
  </Fragment>
);

export default TicketStartPanel;
