import React from 'react';
import TicketHistory from './view';

const getTicketTasksDevelopmentTime = tasks => {
  return Math.round(tasks.reduce((a, b) => a + b['realTime'], 0));
};

const didTicketSucceed = ticket => {
  if (!ticket.allocatedTime || ticket.allocatedTime === 0) return null;

  return getTicketTasksDevelopmentTime(ticket.tasks) <= ticket.allocatedTime;
};

const TicketHistoryContainer = ({ ticket, ...props }) => (
  <TicketHistory {...props} ticket={ticket} didTicketSucceed={didTicketSucceed(ticket)} />
);

export default TicketHistoryContainer;
