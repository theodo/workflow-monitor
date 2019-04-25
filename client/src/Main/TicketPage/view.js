import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TicketResultsTable from '../TicketResultsTable';

const fullPageHeightStyle = {
  height: '100%',
  overflow: 'auto'
};

const BackLink = props => <Link to="/history" {...props} />;

class TicketPage extends React.Component {
  render() {
    console.log(this.props.ticketData);
    return (
      <div style={fullPageHeightStyle}>
        <h3>
          <Button component={BackLink}>Back</Button> {this.props.ticketData.description}
        </h3>
        <TicketResultsTable ticketId={this.props.ticketData.id} />
      </div>
    );
  }
}

export default TicketPage;
