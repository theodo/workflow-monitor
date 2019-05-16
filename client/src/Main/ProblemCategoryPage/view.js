import React from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { HorizontalBar } from 'react-chartjs-2';
import { formatMilliSecondToTime } from 'Utils/TimeUtils';

const fullPageHeightStyle = {
  height: '100%',
  overflow: 'auto',
};

const ProblemCategoryPage = props => (
  <Grid container spacing={0} style={fullPageHeightStyle}>
    <Grid item xs={1} />
    <Grid item xs={10}>
      <div>
        <h3>Pareto of Problem Categories</h3>
        <HorizontalBar beginAtZero data={props.chartData} options={props.chartOptions} />
      </div>
    </Grid>
    <Grid item xs={1} />
  </Grid>
);

export default ProblemCategoryPage;
