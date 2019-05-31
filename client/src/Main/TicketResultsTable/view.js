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
import EditCell from './EditCell';
import { Command } from './Command';
import { formatMilliSecondToTime } from 'Utils/TimeUtils';

import './style.css';

const getTotalTimeFromTasks = (tasks, timeType) => {
  return formatMilliSecondToTime(
    tasks.reduce((total, task) => (task[timeType] ? total + task[timeType] : total), 0),
  );
};

const TotalTimeResult = ({ tasks }) => {
  const totalEstimatedTime = getTotalTimeFromTasks(tasks, 'estimatedTime');
  const totalRealTime = getTotalTimeFromTasks(tasks, 'realTime');

  const style = {
    color: totalRealTime <= totalEstimatedTime ? 'green' : 'red',
    fontWeight: '500',
  };

  return (
    <div className="totalTimeResultContainer">
      <h3 className="totalTimeTitle">Total Time: </h3>
      <span style={style}>
        {totalRealTime} / {totalEstimatedTime}
      </span>
    </div>
  );
};

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
      { columnName: 'realTime', width: 150 },
      { columnName: 'estimatedTime', width: 150 },
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
          <TotalTimeResult tasks={this.props.ticketData.tasks} />
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
