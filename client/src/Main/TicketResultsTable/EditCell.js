import React from 'react';
import { TableCell, TextField } from '@material-ui/core';
import ProblemCategoryAutocomplete from '../Monitor/ProblemCategoryAutocomplete/ProblemCategoryAutocomplete';
import { TableEditRow } from '@devexpress/dx-react-grid-material-ui';
import { formatMilliSecondToTime, parseMillisecondFromFormattedTime } from 'Utils/TimeUtils';

const ProblemCategoryEditCell = ({ value, onValueChange }) => (
  <TableCell>
    <ProblemCategoryAutocomplete value={value || null} onChange={onValueChange} placeholder={''} />
  </TableCell>
);

const DurationEditCell = ({ value, onValueChange }) => (
  <TableCell>
    <TextField
      id="time"
      type="time"
      value={formatMilliSecondToTime(value)}
      onChange={event => onValueChange(parseMillisecondFromFormattedTime(event.target.value))}
      inputProps={{
        step: 1,
      }}
    />
  </TableCell>
);

const NormalEditCell = ({ value, onValueChange, ...props }) => (
  <TableCell>
    <TextField
      type="text"
      {...props}
      value={value}
      onChange={event => onValueChange(event.target.value)}
    />
  </TableCell>
);

export const EditCell = props => {
  if (props.column.name === 'problemCategory') {
    return <ProblemCategoryEditCell {...props} />;
  } else if (props.column.name === 'estimatedTime' || props.column.name === 'realTime') {
    return <DurationEditCell {...props} />;
  }
  return <NormalEditCell multiline {...props} />;
};
