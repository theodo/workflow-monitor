import React from 'react';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { SuccessIcon, FailureIcon } from 'ui/Icons';
import TicketIdShort from './TicketIdShort';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    width: '900px',
    marginRight: '30px',
    marginBottom: '10px',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '20px 16px',
  },
  ticketIdContainer: {
    width: '30px',
    margin: '10px 20px',
  },
  ticketDescription: {
    flexGrow: 2,
    marginRight: '10px',
  },
};

const DidSucceedIcon = ({ didTicketSucceed }) => {
  if (didTicketSucceed === null) return null;

  return didTicketSucceed ? <SuccessIcon size="30px" /> : <FailureIcon size="30px" />;
};

const TicketHistory = ({ ticket, goToTicket, classes, didTicketSucceed }) => {
  return (
    <div className={classes['container']}>
      <Card key={ticket.id} className={classes['card']}>
        <CardActionArea onClick={() => goToTicket(ticket.id)}>
          <CardContent className={classes['cardContent']}>
            <TicketIdShort className={classes.ticketIdContainer} ticket={ticket} />
            <Typography className={classes.ticketDescription} align="center" component="h3">
              {ticket.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <DidSucceedIcon didTicketSucceed={didTicketSucceed} />
    </div>
  );
};

export default withStyles(styles)(TicketHistory);
