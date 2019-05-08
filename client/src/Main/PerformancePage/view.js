import React from 'react';
import { Bar } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';
import { appColors } from 'ui';

const style = {
  chartContainer: {
    padding: '15px 100px',
  },
};

const PerformancePage = ({ chartInput, classes }) => {
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
      <Bar data={data} />
    </div>
  );
};

export default withStyles(style)(PerformancePage);
