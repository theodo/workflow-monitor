import React from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AddProblemCategoryForm from './AddProblemCategoryForm';
import { formatMilliSecondToTime } from 'Utils/TimeUtils';

const fullPageHeightStyle = {
  height: '100%',
  overflow: 'auto',
};

const ProblemCategoryPage = props => (
  <Grid container spacing={0} style={fullPageHeightStyle}>
    <Grid item xs={1} />
    <Grid item xs={10}>
      <AddProblemCategoryForm addProblemCategory={props.addProblemCategory} />
      <br />
      <Divider variant="middle" />
      <div>
        <h3>Pareto of existing problem categories</h3>
        <List>
          {!props.loading &&
            props.problemCategories.map(problemCategory => (
              <ListItem key={problemCategory.id}>
                {problemCategory.description} - {problemCategory.count ? problemCategory.count : 0}{' '}
                occurrences -{' '}
                {problemCategory.overTime ? formatMilliSecondToTime(problemCategory.overTime) : 0}
              </ListItem>
            ))}
        </List>
      </div>
    </Grid>
    <Grid item xs={1} />
  </Grid>
);

export default ProblemCategoryPage;
