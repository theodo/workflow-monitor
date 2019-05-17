import React from 'react';
import { TableCell, TextField } from '@material-ui/core';
import { formatMilliSecondToTime, parseMilliSecondFromFormattedTime } from 'Utils/TimeUtils';
import ProblemCategoryChangeButton from 'Components/ProblemCategoryChangeButton';

const ProblemCategoryEditCell = ({ value, onValueChange }) => (
  <TableCell>
    <ProblemCategoryChangeButton value={value || null} onChange={onValueChange} placeholder={''} />
  </TableCell>
);

const DurationEditCell = ({ value, onValueChange }) => (
  <TableCell>
    <TextField
      id="time"
      type="time"
      value={formatMilliSecondToTime(value)}
      onChange={event => onValueChange(parseMilliSecondFromFormattedTime(event.target.value))}
      inputProps={{
        step: 1,
      }}
    />
  </TableCell>
);

const MultilineEditCell = ({ value, onValueChange, ...props }) => (
  <TableCell>
    <TextField
      multiline
      onChange={event => onValueChange(event.target.value)}
      type="text"
      value={value}
    />
  </TableCell>
);

export const EditCell = props => {
  if (props.column.name === 'problemCategory') {
    return <ProblemCategoryEditCell {...props} />;
  } else if (props.column.name === 'estimatedTime' || props.column.name === 'realTime') {
    return <DurationEditCell {...props} />;
  }
  return <MultilineEditCell {...props} />;
};
