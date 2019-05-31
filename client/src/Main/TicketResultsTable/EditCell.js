import { KeyboardTimePicker } from '@material-ui/pickers';
import React from 'react';
import { TableCell, TextField, withStyles } from '@material-ui/core';
import { OffSetHours, resetDayjsDateToUnixEpoch } from 'Utils/TimeUtils';
import ProblemCategoryChangeButton from 'Components/ProblemCategoryChangeButton';

const styles = {
  timeCell: {
    paddingLeft: 8,
    paddingRight: 12,
  },
  timePicker: {
    width: 130,
  },
};

const ProblemCategoryEditCell = ({ value, onValueChange }) => (
  <TableCell>
    <ProblemCategoryChangeButton value={value || null} onChange={onValueChange} placeholder={''} />
  </TableCell>
);

const DurationEditCell = ({ value, onValueChange, classes, column }) => (
  <TableCell className={classes.timeCell}>
    <KeyboardTimePicker
      className={classes.timePicker}
      ampm={false}
      format="HH:mm:ss"
      views={['hours', 'minutes', 'seconds']}
      label={column.name === 'estimatedTime' ? 'Estimated Time' : 'Real Time'}
      value={new Date(value - OffSetHours())}
      onChange={time => onValueChange(resetDayjsDateToUnixEpoch(time).getTime())}
    />
  </TableCell>
);

const MultilineEditCell = ({ value, onValueChange }) => (
  <TableCell>
    <TextField
      multiline
      onChange={event => onValueChange(event.target.value)}
      type="text"
      value={value ? value : ''}
    />
  </TableCell>
);

const EditCell = props => {
  if (props.column.name === 'problemCategory') {
    return <ProblemCategoryEditCell {...props} />;
  } else if (props.column.name === 'estimatedTime' || props.column.name === 'realTime') {
    return <DurationEditCell {...props} />;
  }
  return <MultilineEditCell {...props} />;
};

export default withStyles(styles)(EditCell);
