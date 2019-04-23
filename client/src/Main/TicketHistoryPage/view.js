import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TicketResultsTable from '../TicketResultsTable';

const fullPageHeightStyle = {
  height: '100%',
  overflow: 'auto'
};

const BackLink = props => <Link to="/history" {...props} />;

const TicketHistoryPage = ({ ticket, updateTask }) => (
  <div style={fullPageHeightStyle}>
    <h3>
      <Button component={BackLink}>
        Back
      </Button>{ticket.description}
    </h3>
    <TicketResultsTable updateTask={updateTask} results={ticket.tasks} />
  </div>
);

export default TicketHistoryPage;
