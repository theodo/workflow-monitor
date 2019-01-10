import React from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AddProblemCategoryForm from './AddProblemCategoryForm';

const ProblemCategoryPage = (props) => (
  <Grid container spacing={0}>
    <Grid item xs={1} >
    </Grid>
    <Grid item xs={10}>
      <AddProblemCategoryForm addProblemCategory={props.addProblemCategory}/>
      <br/>
      <Divider variant="middle" />
      <div>
        <h3>Pareto of existing problem categories</h3>
        <List>
          {!props.loading && props.problemCategories.map(problemCategory => (
            <ListItem key={problemCategory.id}>
              {problemCategory.description} - {problemCategory.count ? problemCategory.count : 0} occurrences
            </ListItem>
          ))}
        </List>
      </div>
    </Grid>
    <Grid item xs={1} >
    </Grid>
  </Grid>
);

export default ProblemCategoryPage;
