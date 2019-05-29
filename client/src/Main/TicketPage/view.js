import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TicketResultsTable from '../TicketResultsTable';

const fullPageHeightStyle = {
  height: '100%',
  overflow: 'auto',
};

const pageHeader = {
  display: 'flex',
  justifyContent: 'space-between',
};

const BackLink = props => <Link to="/history" {...props} />;

class TicketPage extends React.Component {
  render() {
    return (
      <div style={fullPageHeightStyle}>
        <div style={pageHeader}>
          <Button component={BackLink}>Back</Button>
          <h2>{this.props.ticketData.description}</h2>
          <div />
        </div>
        <TicketResultsTable ticketId={this.props.ticketData.id} />
      </div>
    );
  }
}

export default TicketPage;
