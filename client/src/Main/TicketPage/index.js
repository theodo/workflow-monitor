import React from 'react';
import { WithTicketData } from '../shared';
import TicketPage from './view';

class TicketPageContainer extends React.Component {
  render() {
    const id = this.props.match.params.ticketId;
    const TicketPageWithTicketDataData = WithTicketData(TicketPage, id);

    return <TicketPageWithTicketDataData />;
  }
}

export default TicketPageContainer;
