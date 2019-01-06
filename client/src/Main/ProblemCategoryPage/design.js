import React from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import AddProblemCategoryForm from './AddProblemCategoryForm';

const ProblemCategoryPage = (props) => (
  <Grid className="TaskPanel" container spacing={0}>
    <Grid item xs={1} >
    </Grid>
    <Grid item xs={10}>
      <AddProblemCategoryForm addProblemCategory={props.addProblemCategory}/>
      <Divider variant="middle" />
      <div>
        <h3>Existing problem categories :</h3>
        <ul>
          {!props.loading && props.problemCategories.map(problemCategory => (
            <li key={problemCategory.id}>
              {problemCategory.description}
            </li>
          ))}
        </ul>
      </div>
    </Grid>
    <Grid item xs={1} >
    </Grid>
  </Grid>
);

export default ProblemCategoryPage;
