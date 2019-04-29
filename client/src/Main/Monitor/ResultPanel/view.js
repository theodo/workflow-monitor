import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TicketResultsTable from 'Main/TicketResultsTable';

const styles = () => ({
  resultPanel: {
    textAlign: 'center',
  },
});

class ResultPanel extends Component {
  render() {
    return (
      <div>
        <div className={this.props.classes.resultPanel}>
          <h2>Results</h2>
        </div>
        {this.props.ticketId && <TicketResultsTable ticketId={this.props.ticketId} />}
      </div>
    );
  }
}

export default withStyles(styles)(ResultPanel);
