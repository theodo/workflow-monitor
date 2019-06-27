import React from 'react';
import { WithTicketData } from 'Main/shared';
import TicketPage from './view';

class TicketPageContainer extends React.Component {
  render() {
    const id = this.props.match.params.ticketId;
    const TicketPageWithTicketData = WithTicketData(TicketPage, id);

    return <TicketPageWithTicketData />;
  }
}
export default TicketPageContainer;
