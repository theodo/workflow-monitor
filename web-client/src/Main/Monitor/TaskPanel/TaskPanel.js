import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core';

import { initAlarm, cancelAlarm } from 'Utils/AlarmUtils';
import { formatMilliSecondToTime } from 'Utils/TimeUtils';
import { filterEmptyTasks } from 'Utils/TaskUtils';

import ProblemCategoryChangeButton from 'Components/ProblemCategoryChangeButton';
import ReverseChrono from '../ReverseChrono';
import TaskEditor from '../../TaskEditor/TaskEditor';
import './TaskPanel.css';

const TEXT_AREA_BORDER = '1px solid #CACFD2';

const problemsTextFieldStyle = {
  borderLeft: TEXT_AREA_BORDER,
  borderTop: TEXT_AREA_BORDER,
  borderRight: TEXT_AREA_BORDER,
  borderRadius: '4px 4px 0 0',
  backgroundColor: 'white',
  width: '100%',
};

const fullPageHeightStyle = {
  height: '100%',
  overflow: 'auto',
};

const styles = () => ({
  spacing: {
    width: '100%',
    margin: 0,
  },
});

class TaskPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTasks: [],
      currentTaskCheckOK: false,
    };
    this.handleNewTasksValueChange = this.handleNewTasksValueChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleProblemCategoryValueChange = this.handleProblemCategoryValueChange.bind(this);
    if (!this.props.dateLastPause)
      initAlarm(props.currentTask.estimatedTime - this.props.taskChrono.elapsedTime);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dateLastPause && !this.props.dateLastPause) {
      cancelAlarm();
    } else if (!nextProps.dateLastPause && this.props.dateLastPause) {
      initAlarm(this.props.currentTask.estimatedTime - nextProps.taskChrono.elapsedTime);
    }

    if (nextProps.currentTask && nextProps.currentTask.id !== this.props.currentTask.id) {
      cancelAlarm();
      initAlarm(nextProps.currentTask.estimatedTime);

      this.setState({
        newTasks: [],
        currentTaskCheckOK: false,
      });
    }
  }

  componentWillUnmount() {
    cancelAlarm();
  }

  getFormattedTasks(tasks) {
    return tasks
      ? filterEmptyTasks(tasks).map(task => ({ ...task, addedOnTheFly: true }))
      : undefined;
  }

  handleTaskPanelChange() {
    this.props.handleTaskPanelChange({
      taskPanelChanges: {
        newTasks: this.getFormattedTasks(this.state.newTasks),
        currentTaskCheckOK: this.state.currentTaskCheckOK,
      },
    });
  }

  handleProblemsValueChange(event) {
    this.props.handleCurrentTaskChange({ problems: event.target.value });
  }

  handleProblemCategoryValueChange(problemCategory) {
    this.props.handleCurrentTaskChange({
      problemCategory,
    });
  }

  handleNewTasksValueChange(tasks) {
    this.setState({ newTasks: tasks }, this.handleTaskPanelChange);
  }

  handleCheckChange(event) {
    this.setState({ currentTaskCheckOK: event.target.checked }, this.handleTaskPanelChange);
  }

  render() {
    const { currentTask, dateLastPause, taskChrono, classes } = this.props;
    return (
      <Grid
        className={`TaskPanel ${classes.spacing}`}
        container
        spacing={3}
        style={fullPageHeightStyle}
      >
        <Grid item xs={1} />
        <Grid item xs={10}>
          {/* TODO Remove the check and currentTask.label, let only currentTask.description,
           it was quick fix for a migration issue*/}
          <h2>{currentTask.description ? currentTask.description : currentTask.label}</h2>
          {currentTask.estimatedTime && (
            <div>
              <h3>Estimated time : {formatMilliSecondToTime(currentTask.estimatedTime)}</h3>
              <h3>
                {/* TODO Remove the check and currentTask.label, let only currentTask.description,
                it was quick fix for a migration issue*/}
                <ReverseChrono
                  currentTaskDescription={
                    currentTask.description ? currentTask.description : currentTask.label
                  }
                  dateLastPause={dateLastPause}
                  estimatedTaskTime={currentTask.estimatedTime}
                  taskChrono={taskChrono}
                />
              </h3>
            </div>
          )}
          {currentTask.check && currentTask.check.length > 0 && (
            <div>
              <h3>Checks :</h3>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.currentTaskCheckOK}
                    onChange={this.handleCheckChange}
                    value="check"
                  />
                }
                label={currentTask.check}
              />
            </div>
          )}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={7}>
              <h3>Root cause (why the problem occurred)</h3>
              <TextField
                style={{ ...problemsTextFieldStyle }}
                id="multiline-flexible"
                label="Root cause"
                multiline
                rowsMax="4"
                value={currentTask.problems || ''}
                onChange={event => this.handleProblemsValueChange(event)}
                className="TaskPanel-problem-textarea"
                margin="normal"
              />
            </Grid>
            <Grid item xs={5}>
              <h3>Root cause category</h3>
              <ProblemCategoryChangeButton
                value={currentTask.problemCategory || null}
                onChange={this.handleProblemCategoryValueChange}
                placeholder={'Select the root cause category'}
              />
            </Grid>
          </Grid>
          <h3>Add tasks after this one :</h3>
          <TaskEditor tasks={this.state.newTasks} updateTasks={this.handleNewTasksValueChange} />
        </Grid>
        <Grid item xs={1} />
      </Grid>
    );
  }
}

export default withStyles(styles)(TaskPanel);
