import React, { Component } from 'react';
import copy from 'copy-to-clipboard';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import { filterEmptyTasks } from 'Utils/TaskUtils';

import Project from './Project';
import TaskEditor from '../TaskEditor/TaskEditor';
import './Settings.css';

const styles = () => ({
  mv25: {
    marginTop: '25px',
    marginBottom: '25px'
  }
});

class Settings extends Component {
  constructor(props) {
    super(props);
    this.handleTasksChange = this.handleTasksChange.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.copyToken = this.copyToken.bind(this);
    this.state = {
      beginTasks: this.props.settings.beginTasks ? this.props.settings.beginTasks : [],
      endTasks: this.props.settings.endTasks ? this.props.settings.endTasks : []
    };
  }

  handleTasksChange(taskCategory, tasks) {
    this.setState({ [taskCategory]: tasks });
  }

  saveSettings() {
    this.props.saveSettings({
      beginTasks: filterEmptyTasks(this.state.beginTasks),
      endTasks: filterEmptyTasks(this.state.endTasks)
    });
  }

  copyToken() {
    copy(localStorage.getItem('jwt_token'));
    alert('Token copied');
  }

  render() {
    const { classes } = this.props;
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
              tasks={this.state.beginTasks}
              updateTasks={tasks => this.handleTasksChange('beginTasks', tasks)}
            />
            <h3>End tasks</h3>
            <TaskEditor tasks={this.state.endTasks} updateTasks={tasks => this.handleTasksChange('endTasks', tasks)} />
            <Button variant="contained" onClick={this.saveSettings}>
              Sauvegarder
            </Button>
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

export default withStyles(styles)(Settings);
