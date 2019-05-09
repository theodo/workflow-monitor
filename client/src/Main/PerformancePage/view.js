import React from 'react';
import { Bar } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/Button';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import { appColors } from 'ui';

const style = {
  chartContainer: {
    padding: '5px 100px',
  },
  weekBrowser: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  changeWeekIcon: {
    margin: '0 3px',
  },
};

const WeekBrowser = ({ classes, disableNextWeekButton, moveDaysForward }) => {
  return (
    <div className={classes.weekBrowser}>
      <IconButton onClick={moveDaysForward(-7)}>
        <FastRewindIcon className={classes.changeWeekIcon} />
        <span>Previous Week</span>
      </IconButton>
      <IconButton disabled={disableNextWeekButton} onClick={moveDaysForward(7)}>
        <span>Next Week</span>
        <FastForwardIcon className={classes.changeWeekIcon} />
      </IconButton>
    </div>
  );
};

const PerformancePage = ({ chartInput, classes, disableNextWeekButton, moveDaysForward }) => {
  const data = {
    labels: chartInput.daysLabel,
    datasets: [
      {
        backgroundColor: appColors.softRed,
        data: chartInput.failuresCountData,
        label: 'Tickets Failed',
      },
    ],
  };
  return (
    <div className={classes.chartContainer}>
      <h3>Performance Indicator</h3>
      <Bar data={data} height={140} />
      <WeekBrowser
        classes={classes}
        disableNextWeekButton={disableNextWeekButton}
        moveDaysForward={moveDaysForward}
      />
    </div>
  );
};

export default withStyles(style)(PerformancePage);
