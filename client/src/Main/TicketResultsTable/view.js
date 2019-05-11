import React from 'react';
import Button from '@material-ui/core/Button';
import { EditingState } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';
import { setFavicon } from 'Utils/FaviconUtils';
import Cell from './Cell';
import { EditCell } from './EditCell';
import { Command } from './Command';

import './style.css';

class TicketResultsTable extends React.Component {
  title = '#' + this.props.ticketData.thirdPartyId + ' ' + this.props.ticketData.description;

  state = {
    columns: [
      { name: 'description', title: 'Description' },
      { name: 'estimatedTime', title: 'Estimated Time' },
      { name: 'realTime', title: 'Real Time' },
      { name: 'problems', title: 'Problems' },
      { name: 'problemCategory', title: 'Problem Category' },
    ],
    tableColumnExtensions: [
      { columnName: 'realTime', width: 110 },
      { columnName: 'estimatedTime', width: 110 },
    ],
  };

  componentDidMount() {
    document.title = this.title;
    setFavicon('caspr');
  }

  componentWillUnmount() {
    document.title = 'Caspr';
  }

  commitChanges = ({ changed }) => {
    if (changed) {
      const tasksToUpdate = this.props.ticketData.tasks
        .filter(task => changed[task.id])
        .map(task => ({ ...task, ...changed[task.id] }));

      tasksToUpdate.forEach(taskToUpdate => this.props.updateTask(taskToUpdate));
    }
  };

  printResults() {
    window.print();
  }

  render() {
    return (
      <div className="resultsPage">
        <div className="resultsGrid">
          <div className="printArea">
            <h2 className="displayOnlyOnPrint">{this.title}</h2>
            <Grid
              rows={this.props.ticketData.tasks}
              columns={this.state.columns}
              getRowId={row => row.id}
            >
              <EditingState onCommitChanges={this.commitChanges} />
              <Table cellComponent={Cell} columnExtensions={this.state.tableColumnExtensions} />
              <TableHeaderRow />
              <TableEditRow cellComponent={EditCell} />
              <TableEditColumn commandComponent={Command} showEditCommand width={100} />
            </Grid>
          </div>
        </div>
        <div className="printButton">
          <Button variant="contained" color="primary" onClick={() => this.printResults()}>
            Print results
          </Button>
        </div>
      </div>
    );
  }
}

export default TicketResultsTable;
