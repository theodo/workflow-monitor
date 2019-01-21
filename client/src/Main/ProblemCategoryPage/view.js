import React from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'Recharts';
import AddProblemCategoryForm from './AddProblemCategoryForm';


const fullPageHeightStyle = {
  height: '100%',
  overflow: 'auto'
};

const ProblemCategoryPage = (props) => (
  <Grid container spacing={0} style={fullPageHeightStyle}>
    <Grid item xs={1} >
    </Grid>
    <Grid item xs={10}>
      <AddProblemCategoryForm addProblemCategory={props.addProblemCategory}/>
      <br/>
      <Divider variant="middle" />
      <div>
        <h3>Pareto of existing problem categories</h3>
        <BarChart width={730} height={250} data={props.problemCategories}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="description" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
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
