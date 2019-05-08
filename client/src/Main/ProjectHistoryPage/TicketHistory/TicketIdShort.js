import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { gqlClient } from 'Utils/Graphql';

const setIdShortAndThirdPartyId = async (ticket, setIdShort) => {
  const trelloTicket = await window.Trello.get(`/cards/${ticket.thirdPartyId}`);
  gqlClient.mutate({
    mutation: gql`
      mutation($ticketId: Int!, $idShort: String!) {
        setTicketThirdPartyId(ticketId: $ticketId, idShort: $idShort)
      }
    `,
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
