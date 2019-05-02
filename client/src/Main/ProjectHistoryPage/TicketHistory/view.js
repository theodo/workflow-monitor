import React from 'react';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { SuccessIcon, FailureIcon } from 'ui/Icons';
import TicketDescriptionWithIdShort from './TicketDescriptionWithIdShort';

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
};

const getTicketTasksDevelopmentTime = tasks => {
  return Math.round(tasks.reduce((a, b) => a + b['realTime'], 0));
};

const didTicketSucceed = ticket => {
  return getTicketTasksDevelopmentTime(ticket.tasks) <= ticket.allocatedTime ? true : false;
};

const DidSucceedIcon = ({ ticket }) => {
  if (!ticket.allocatedTime || ticket.allocatedTime === 0) return null;

  return didTicketSucceed(ticket) ? <SuccessIcon size="30px" /> : <FailureIcon size="30px" />;
};

const TicketHistory = ({ ticket, goToTicket, classes }) => {
  return (
    <div className={classes['container']}>
      <Card key={ticket.id} className={classes['card']}>
        <CardActionArea onClick={() => goToTicket(ticket.id)}>
          <CardContent>
            <Typography component="h3">
              <TicketDescriptionWithIdShort ticket={ticket} />
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <DidSucceedIcon ticket={ticket} />
    </div>
  );
};

export default withStyles(styles)(TicketHistory);
