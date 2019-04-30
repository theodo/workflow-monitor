import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';
import { formatMilliSecondToTime } from 'Utils/TimeUtils';
import { TableCell } from '@material-ui/core';

const ProblemCategoryCell = ({ value, style }) => (
  <TableCell style={style}>{value && value.description}</TableCell>
);

const DurationCell = ({ value, style, row }) => {
  if (row.estimatedTime) {
    style = {
      ...style,
      color: row.estimatedTime < row.realTime ? 'red' : 'green',
    };
  }

  return <TableCell style={style}>{value && formatMilliSecondToTime(value)}</TableCell>;
};

export const Cell = props => {
  const { column, row } = props;
  const style = row.addedOnTheFly
    ? {
        backgroundColor: '#ffe6e6',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
      }
    : { whiteSpace: 'normal', wordWrap: 'break-word' };
  if (column.name === 'problemCategory') {
    return <ProblemCategoryCell {...props} style={style} />;
  } else if (column.name === 'estimatedTime' || column.name === 'realTime') {
    return <DurationCell {...props} style={style} />;
  }
  return <Table.Cell {...props} style={style} />;
};
