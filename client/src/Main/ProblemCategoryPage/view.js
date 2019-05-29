import React from 'react';
import Grid from '@material-ui/core/Grid';
import { HorizontalBar } from 'react-chartjs-2';
import { DatePicker } from 'material-ui-pickers';
import { withStyles } from '@material-ui/core/styles';

const style = {
  fullPageHeightStyle: {
    height: '100%',
    overflow: 'auto',
  },
  title: {
    marginBottom: '3px',
  },
  datePicker: {
    marginTop: '0px',
  },
};

const ProblemCategoryPage = ({
  classes,
  handleDateChange,
  startDate,
  endDate,
  chartData,
  chartOptions,
}) => (
  <Grid container spacing={0} className={classes.fullPageHeightStyle}>
    <Grid item xs={1} />
    <Grid item xs={10}>
      <h2 className={classes.title}>Pareto of Problem Categories</h2>
      <>
        <DatePicker
          className={classes.datePicker}
          margin="normal"
          label={startDate ? 'From' : 'From start'}
          value={startDate}
          onChange={date => handleDateChange('startDate', date)}
        />
        <DatePicker
          className={classes.datePicker}
          margin="normal"
          label={endDate ? 'To' : 'to now'}
          value={endDate}
          onChange={date => handleDateChange('endDate', date)}
        />
      </>
      <HorizontalBar beginAtZero data={chartData} options={chartOptions} />
    </Grid>
    <Grid item xs={1} />
  </Grid>
);

export default withStyles(style)(ProblemCategoryPage);
