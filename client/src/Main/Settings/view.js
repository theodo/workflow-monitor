import React, { Component } from 'react';
import copy from 'copy-to-clipboard';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import Project from './Project';
import TaskEditor from '../TaskEditor/TaskEditor';
import './Settings.css';
import { SAVE_DEFAULT_TASKS_LIST } from 'Queries/DefaultTasksLists';
import { formatDefaultTasksList } from 'Utils/TaskUtils';
import { gqlClient } from 'Utils/Graphql';
import withDefaultTasks from 'Main/shared/WithDefaultTasks.hoc';
import { compose } from 'redux';

const styles = () => ({
  mv25: {
    marginTop: '25px',
    marginBottom: '25px',
  },
});

class Settings extends Component {
  handleTasksChange = async (tasksList, tasks, type) => {
    const defaultTasksList = tasksList
      ? {
          id: tasksList.id,
          type: tasksList.type,
          defaultTasks: formatDefaultTasksList(tasks),
        }
      : {
          type,
          defaultTasks: formatDefaultTasksList(tasks),
        };
    await gqlClient.mutate({
      mutation: SAVE_DEFAULT_TASKS_LIST,
      variables: {
        defaultTasksList,
      },
    });
  };

  copyToken = () => {
    copy(localStorage.getItem('jwt_token'));
    alert('Token copied');
  };

  render() {
    const { classes, beginningTasksList, endTasksList } = this.props;
    return (
      <div className="Settings">
        <Grid container spacing={24}>
          <Grid item xs={1} lg={2} />
          <Grid item xs={10} lg={8}>
            <Project />
            <Divider variant="middle" className={classes.mv25} />
            <h2>Add your default tasks :</h2>
            <h3>Start tasks</h3>
            <TaskEditor
              tasks={beginningTasksList.tasks}
              updateTasks={tasks =>
                this.handleTasksChange(beginningTasksList.defaultTasksList, tasks, 'BEGINNING')
              }
            />
            <h3>End tasks</h3>
            <TaskEditor
              tasks={endTasksList.tasks}
              updateTasks={tasks =>
                this.handleTasksChange(endTasksList.defaultTasksList, tasks, 'END')
              }
            />
            <Divider variant="middle" className={classes.mv25} />
            <h2>Copy CLI token :</h2>
            <Button variant="contained" onClick={this.copyToken}>
              Copy
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={1} md={2} />
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withDefaultTasks,
)(Settings);
