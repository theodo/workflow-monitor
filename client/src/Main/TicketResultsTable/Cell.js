import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';
import { formatMilliSecondToTime } from 'Utils/TimeUtils';
import { TableCell } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  cell: {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    paddingLeft: '8px',
    paddingRight: '12px',
  },
};

const ProblemCategoryCell = ({ value, classes, style }) => (
  <TableCell className={classes.cell} style={style}>
    {value && value.description}
  </TableCell>
);

const DurationCell = ({ value, classes, style, row }) => {
  if (row.estimatedTime) {
    style = {
      ...style,
      color: row.estimatedTime < row.realTime ? 'red' : 'green',
    };
  }

  return (
    <TableCell className={classes.cell} style={style}>
      {value && formatMilliSecondToTime(value)}
    </TableCell>
  );
};

const Cell = props => {
  const { column, row, classes } = props;
  const style = row.addedOnTheFly
    ? {
        backgroundColor: '#ffe6e6',
      }
    : null;
  if (column.name === 'problemCategory') {
    return <ProblemCategoryCell {...props} classes={classes} style={style} />;
  } else if (column.name === 'estimatedTime' || column.name === 'realTime') {
    return <DurationCell {...props} classes={classes} style={style} />;
  }
  return <Table.Cell {...props} className={classes.cell} />;
};

export default withStyles(styles)(Cell);
