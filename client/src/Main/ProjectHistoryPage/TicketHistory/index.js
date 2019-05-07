import React from 'react';
import TicketHistory from './view';

const didTicketSucceed = ticket => {
  if (!ticket.allocatedTime || ticket.allocatedTime === 0) return null;

  return ticket.realTime <= ticket.allocatedTime;
};

const TicketHistoryContainer = ({ ticket, ...props }) => (
  <TicketHistory {...props} ticket={ticket} didTicketSucceed={didTicketSucceed(ticket)} />
);

export default TicketHistoryContainer;
