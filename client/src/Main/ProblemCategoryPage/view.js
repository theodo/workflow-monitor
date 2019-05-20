import React from 'react';
import Grid from '@material-ui/core/Grid';
import { HorizontalBar } from 'react-chartjs-2';
import { DatePicker } from 'material-ui-pickers';

const fullPageHeightStyle = {
  height: '100%',
  overflow: 'auto',
};

const ProblemCategoryPage = props => (
  <Grid container spacing={0} style={fullPageHeightStyle}>
    <Grid item xs={1} />
    <Grid item xs={10}>
      <h3>Pareto of Problem Categories</h3>
      <>
        <DatePicker
          margin="normal"
          label={props.startDate ? 'From' : 'From start'}
          value={props.startDate}
          onChange={date => props.handleDateChange('startDate', date)}
        />
        <DatePicker
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

export default ProblemCategoryPage;
