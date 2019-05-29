import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Project from './Project';
import TaskEditor from '../TaskEditor/TaskEditor';
import './Settings.css';

const styles = () => ({
  mv25: {
    marginTop: '25px',
    marginBottom: '25px',
  },
});

class Settings extends Component {
  render() {
    const { classes, beginningTasksList, endTasksList, handleTasksChange, copyToken } = this.props;
    return (
      <div className="Settings">
        <Grid container spacing={3}>
          <Grid item xs={1} lg={2} />
          <Grid item xs={10} lg={8}>
            <Project />
            <Divider variant="middle" className={classes.mv25} />
            <h2>Edit your project default tasks</h2>
            <h3>Start tasks</h3>
            <TaskEditor
              tasks={beginningTasksList.tasks}
              updateTasks={tasks =>
                handleTasksChange(beginningTasksList.defaultTasksList, 'BEGINNING', tasks)
              }
            />
            <h3>End tasks</h3>
            <TaskEditor
              tasks={endTasksList.tasks}
              updateTasks={tasks => handleTasksChange(endTasksList.defaultTasksList, 'END', tasks)}
            />
            <Divider variant="middle" className={classes.mv25} />
            <h2>Copy CLI token :</h2>
            <Button variant="contained" onClick={copyToken}>
              Copy
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={1} md={2} />
      </div>
    );
  }
}

export default withStyles(styles)(Settings);
