import React from 'react';
import { WithTicketData } from '../shared';
import TicketHistoryPage from './view';

class TicketHistoryPageContainer extends React.Component {
  render() {
    const id = this.props.match.params.ticketId;
    const TicketHistoryPageWithTicketDataData = WithTicketData(TicketHistoryPage, id);

    return <TicketHistoryPageWithTicketDataData />;
  }
}

export default TicketHistoryPageContainer;
