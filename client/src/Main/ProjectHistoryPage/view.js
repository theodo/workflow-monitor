import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TicketHistory from './TicketHistory';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  fullPageHeightStyle: {
    height: '100%',
    overflow: 'auto',
  },
};

const ProjectHistoryPage = ({ tickets: { rows, count }, loadMore, goToTicket, classes }) => {
  return (
    <Grid container spacing={0} className={classes.fullPageHeightStyle}>
      <Grid item xs={1} />
      <Grid item xs={10}>
        <h3>Ticket history</h3>
        <div className={classes.container}>
          {rows.map(ticket => (
            <TicketHistory ticket={ticket} goToTicket={goToTicket} />
          ))}
          {count > rows.length && <button onClick={loadMore}>Load more</button>}
          {count === 0 && 'No ticket done on this project yet'}
        </div>
      </Grid>
      <Grid item xs={1} />
    </Grid>
  );
};

export default withStyles(styles)(ProjectHistoryPage);
