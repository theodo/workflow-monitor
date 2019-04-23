import React from 'react';
import { EditingState } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
} from '@devexpress/dx-react-grid-material-ui';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import ProblemCategoryAutocomplete from '../Monitor/ProblemCategoryAutocomplete/ProblemCategoryAutocomplete';
import { formatMilliSecondToTime, parseMillisecondFromFormattedTime } from '../../Utils/TimeUtils';

const getRowId = row => row.id;

const ProblemCategoryEditCell = ({
  value, onValueChange
}) => (
  <TableCell>
    <ProblemCategoryAutocomplete
      value={value || null}
      onChange={onValueChange}
      placeholder={''}
    />
  </TableCell>
);

const DurationEditCell = ({
  value, onValueChange
}) => (
  <TableCell>
    <TextField
      id="time"
      type="time"
      value={formatMilliSecondToTime(value)}
      onChange={event => onValueChange(parseMillisecondFromFormattedTime(event.target.value))}
      inputProps={{
        step: 1
      }}
    />
  </TableCell>
);

const EditCell = (props) => {
  const { column } = props;
  if (column.name === 'problemCategory') {
    return <ProblemCategoryEditCell {...props} />;
  } else if (column.name === 'estimatedTime' || column.name === 'realTime') {
    return <DurationEditCell {...props} />;
  }
  return <TableEditRow.Cell {...props} />;
};

const ProblemCategoryCell = ({
  value, style
}) => (
  <TableCell style={style}>
    {value && value.description}
  </TableCell>
);

const DurationCell = ({
  value, style, row
}) => {
  if (row.estimatedTime) {
    style = {
      ...style,
      color: (row.estimatedTime < row.realTime ? 'red' : 'green'),
    };
  }

  return (
    <TableCell style={style}>
      {value && formatMilliSecondToTime(value)}
    </TableCell>
  );
};

const Cell = (props) => {
  const { column, row } = props;
  const style = row.addedOnTheFly ? {
    backgroundColor: '#ffe6e6',
  } : {};
  if (column.name === 'problemCategory') {
    return <ProblemCategoryCell {...props} style={style}/>;
  } else if (column.name === 'estimatedTime' || column.name === 'realTime') {
    return <DurationCell {...props} style={style}/>;
  }
  return <Table.Cell {...props} style={style}/>;
};

class TicketResultsTable extends React.Component {
  state = {
    columns:[
      { name: 'description', title: 'Description' },
      { name: 'estimatedTime', title: 'Estimated Time' },
      { name: 'realTime', title: 'Real Time' },
      { name: 'problems', title: 'Problems' },
      { name: 'problemCategory', title: 'Problem Category' },
    ]
  }
  commitChanges = ({changed}) => {
    if (changed) {
      const tasks = this.props.results
        .filter(task => changed[task.id])
        .map(task => ({ ...task, ...changed[task.id] }));

      tasks.forEach((task) => this.props.updateTask(task));
    }
  }
  render() {
    return this.props.results ? (
      <Grid
        rows={this.props.results}
        columns={this.state.columns}
        getRowId={getRowId}
      >
        <EditingState
          onCommitChanges={this.commitChanges}
        />
        <Table cellComponent={Cell}/>
        <TableHeaderRow />
        <TableEditRow
          cellComponent={EditCell}
        />
      </Grid>
    ) : null;
  }
}

export default TicketResultsTable;
