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

const ProblemCategoryPage = props => (
  <Grid container spacing={0} className={props.classes.fullPageHeightStyle}>
    <Grid item xs={1} />
    <Grid item xs={10}>
      <h3 className={props.classes.title}>Pareto of Problem Categories</h3>
      <>
        <DatePicker
          className={props.classes.datePicker}
          margin="normal"
          label={props.startDate ? 'From' : 'From start'}
          value={props.startDate}
          onChange={date => props.handleDateChange('startDate', date)}
        />
        <DatePicker
          className={props.classes.datePicker}
          margin="normal"
          label={props.endDate ? 'To' : 'to now'}
          value={props.endDate}
          onChange={date => props.handleDateChange('endDate', date)}
        />
      </>
      <HorizontalBar beginAtZero data={props.chartData} options={props.chartOptions} />
    </Grid>
    <Grid item xs={1} />
  </Grid>
);

export default withStyles(style)(ProblemCategoryPage);
