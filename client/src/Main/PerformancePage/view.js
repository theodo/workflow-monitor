import React from 'react';
import { Bar } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/Button';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import ToggleStandardTime from 'Components/ToggleStandardTime';
import { appColors } from 'ui';

const style = {
  chartContainer: {
    padding: '5px 100px',
  },
  datesBrowser: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  changeWeekIcon: {
    margin: '0 3px',
  },
  performanceToggler: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: '5px',
  },
};

const DateRangeSlider = ({ classes, disableNextButton, slideDateRangeWindow }) => {
  return (
    <div className={classes.datesBrowser}>
      <IconButton onClick={slideDateRangeWindow('backward')}>
        <FastRewindIcon className={classes.changeWeekIcon} />
        <span>Previous</span>
      </IconButton>
      <IconButton disabled={disableNextButton} onClick={slideDateRangeWindow('forward')}>
        <span>Next</span>
        <FastForwardIcon className={classes.changeWeekIcon} />
      </IconButton>
    </div>
  );
};

const chartOptions = {
  legend: { position: 'bottom' },
  scales: {
    yAxes: [{ ticks: { stepSize: 1, beginAtZero: true, min: 0 } }],
  },
};

const PerformanceChart = ({ performanceType, chartInput }) => {
  const ordinatesData =
    performanceType === 'celerityTime'
      ? chartInput.celerityFailedTicketsCount
      : chartInput.casprFailedTicketsCount;

  const data = {
    labels: chartInput.daysLabel,
    datasets: [
      {
        backgroundColor: appColors.softRed,
        data: ordinatesData,
        label: 'Tickets Failed',
      },
    ],
  };

  return <Bar beginAtZero precision={1} data={data} height={125} options={chartOptions} redraw />;
};

const PerformancePage = ({
  changePerformanceType,
  chartInput,
  classes,
  disableNextButton,
  slideDateRangeWindow,
  performanceType,
}) => {
  return (
    <div className={classes.chartContainer}>
      <div className={classes.performanceToggler}>
        <h3 className={classes.title}>Performance Indicator</h3>
        <ToggleStandardTime
          initialPerformanceType={performanceType}
          changePerformanceType={changePerformanceType}
        />
      </div>
      <PerformanceChart performanceType={performanceType} chartInput={chartInput} />
      <DateRangeSlider
        classes={classes}
        disableNextButton={disableNextButton}
        slideDateRangeWindow={slideDateRangeWindow}
      />
    </div>
  );
};

export default withStyles(style)(PerformancePage);
