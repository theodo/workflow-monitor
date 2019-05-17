import React from 'react';
import TicketHistory from './view';

const didTicketSucceed = (ticket, referenceTime) => {
  if (referenceTime === null || referenceTime === 0) return null;

  return ticket.realTime <= referenceTime;
};

const TicketHistoryContainer = ({ performanceType, ticket, ...props }) => {
  const referenceTime =
    performanceType === 'celerityTime' ? ticket.allocatedTime : ticket.estimatedTime;

  return (
    <TicketHistory
      {...props}
      ticket={ticket}
      didTicketSucceed={didTicketSucceed(ticket, referenceTime)}
    />
  );
};

export default TicketHistoryContainer;
