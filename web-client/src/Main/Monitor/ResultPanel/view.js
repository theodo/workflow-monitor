import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TicketResultsTable from 'Main/TicketResultsTable';
import LoadingSpinner from 'Components/LoadingSpinner';

const styles = () => ({
  resultPanel: {
    textAlign: 'center',
  },
});

const ResultPanel = ({ classes, ticketId }) => {
  return (
    <>
      {!ticketId && <LoadingSpinner absolute />}
      <div className={classes.resultPanel}>
        <h2>Results</h2>
      </div>
      {ticketId && <TicketResultsTable ticketId={ticketId} />}
    </>
  );
};

export default withStyles(styles)(ResultPanel);
