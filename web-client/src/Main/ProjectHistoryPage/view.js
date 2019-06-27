import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TicketHistory from './TicketHistory';
import ToggleStandardTime from 'Components/ToggleStandardTime';

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
  date: {
    marginTop: '20px',
    marginBottom: '10px',
  },
};

const getDisplayedDate = (index, ticketsTable) => {
  const currentDate = new Date(parseInt(ticketsTable[index].createdAt)).toDateString();

  if (index === 0) return currentDate;

  const previousDate = new Date(parseInt(ticketsTable[index - 1].createdAt)).toDateString();
  return previousDate !== currentDate ? currentDate : null;
};

const ProjectHistoryPage = ({
  tickets: { rows, count },
  loadMore,
  goToTicket,
  classes,
  performanceType,
  setPerformanceType,
}) => {
  return (
    <Grid container spacing={0} className={classes.fullPageHeightStyle}>
      <Grid item xs={1} />
      <Grid item xs={10}>
        <h2>Ticket history</h2>
        <ToggleStandardTime
          initialPerformanceType={performanceType}
          setPerformanceType={setPerformanceType}
        />
        <div className={classes.container}>
          {rows.map((ticket, index, ticketsTable) => {
            const dateToDiplay = getDisplayedDate(index, ticketsTable);
            return (
              <div key={ticket.id}>
                {dateToDiplay && (
                  <div className={classes.date}>
                    {new Date(parseInt(ticket.createdAt)).toDateString()}
                  </div>
                )}
                <TicketHistory
                  ticket={ticket}
                  goToTicket={goToTicket}
                  performanceType={performanceType}
                />
              </div>
            );
          })}
          {count > rows.length && <button onClick={loadMore}>Load more</button>}
          {count === 0 && 'No ticket done on this project yet'}
        </div>
      </Grid>
      <Grid item xs={1} />
    </Grid>
  );
};

export default withStyles(styles)(ProjectHistoryPage);
