import { SET_TICKET_THIRD_PARTY_ID } from 'Queries/Tickets';
import React, { useState, useEffect } from 'react';
import { gqlClient } from 'Utils/Graphql';

const setIdShortAndThirdPartyId = async (ticket, setIdShort) => {
  const trelloTicket = await window.Trello.get(`/cards/${ticket.thirdPartyId}`);
  gqlClient.mutate({
    mutation: SET_TICKET_THIRD_PARTY_ID,
    variables: {
      ticketId: ticket.id,
      idShort: trelloTicket.idShort,
    },
  });
  setIdShort(trelloTicket.idShort);
};

const TicketIdShort = ({ ticket, className }) => {
  const [idShort, setIdShort] = useState('');
  useEffect(() => {
    if (!ticket.thirdPartyId || ticket.thirdPartyId.length < 10) {
      setIdShort(ticket.thirdPartyId);
    } else {
      setIdShortAndThirdPartyId(ticket, setIdShort);
    }
  });
  return <h3 className={className}>#{idShort}</h3>;
};

export default TicketIdShort;
