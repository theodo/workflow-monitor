import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import { debounce } from 'throttle-debounce';

import { initAlarm, cancelAlarm } from 'Utils/AlarmUtils';
import { getTotalTime } from 'Utils/TaskUtils';
import { filterEmptyTasks, formatStringToTasks } from 'Utils/TaskUtils';

import TaskEditor from 'Main/TaskEditor/TaskEditor';
import './PlanningPanel.css';
import withDefaultTasks from 'Main/shared/WithDefaultTasks.hoc';

const planningMaxTime = 600000;

const styles = () => ({
  spacing: {
    width: '100%',
    margin: 0,
  },
});

class PlanningPanel extends Component {
  constructor(props) {
    super(props);
    this.savePlanningTask = debounce(1000, this.savePlanningTask);
    const ticketTasks = localStorage.getItem('planningTasks')
      ? JSON.parse(localStorage.getItem('planningTasks'))
      : [];
    this.state = {
      ticketTasks,
      beginningTasks: filterEmptyTasks(props.beginningTasksList.tasks),
      endTasks: filterEmptyTasks(props.endTasksList.tasks),
      checklists: [],
      selectedChecklist: '',
    };
    if (!this.props.dateLastPause)
      initAlarm(planningMaxTime - this.props.taskChrono.elapsedTime, false);
    window.Trello.get(`/cards/${this.props.currentTrelloCard.id}/checklists`).then(checklists => {
      this.setState({ checklists });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dateLastPause && !this.props.dateLastPause) {
      cancelAlarm();
    } else if (!nextProps.dateLastPause && this.props.dateLastPause) {
      initAlarm(planningMaxTime - nextProps.taskChrono.elapsedTime, false);
    }
  }

  componentWillUnmount() {
    cancelAlarm();
  }

  handleTasksChange = async (taskType, tasks) => {
    await this.setState({ [taskType]: tasks });
    if (taskType === 'ticketTasks') {
      this.savePlanningTask();
    }
    this.props.handlePlanningPanelChange({
      planningPanelChanges: {
        tasks: this.buildAllTasks(),
      },
    });
  };

  handleTrelloChecklistSelection = event => {
    this.setState({ selectedChecklist: event.target.value });
    window.Trello.get(`/checklists/${event.target.value}/checkItems`).then(checklist => {
      let tasksAsString = '';
      checklist
        .sort((a, b) => (a.pos < b.pos ? -1 : 1))
        .forEach(task => {
          tasksAsString += `${task.name}\n`;
        });
      this.handleTasksChange('ticketTasks', formatStringToTasks(tasksAsString));
    });
  };
  buildAllTasks = () => {
    return [
      ...filterEmptyTasks(this.state.beginningTasks),
      ...filterEmptyTasks(this.state.ticketTasks),
      ...filterEmptyTasks(this.state.endTasks),
    ];
  };

  savePlanningTask = () => {
    localStorage.setItem('planningTasks', JSON.stringify(this.state.ticketTasks));
  };
  render() {
    const { beginningTasks, ticketTasks, endTasks, selectedChecklist, checklists } = this.state;
    const { classes } = this.props;
    return (
      <div className="PlanningPanel">
        <Grid className={classes.spacing} container spacing={3}>
          <Grid item xs={1} lg={2} />
          <Grid item xs={10} lg={8}>
            <div className="PlanningPanel-content">
              <Grid container spacing={0}>
                <Grid item xs={8}>
                  <h2>Task list</h2>
                </Grid>
                <Grid item xs={4} className="PlanningPanel-save-button-container">
                  <Button variant="contained" color="primary" component={Link} to="/settings">
                    Edit default tasks
                  </Button>
                  <FormControl style={{ marginTop: 8 }}>
                    <InputLabel htmlFor="selected-checklist">Import trello checklist</InputLabel>
                    <Select
                      style={{ width: 200 }}
                      value={selectedChecklist}
                      onChange={this.handleTrelloChecklistSelection}
                      inputProps={{
                        name: 'checklist',
                        id: 'selected-checklist',
                      }}
                    >
                      {checklists.map(checklist => (
                        <MenuItem key={checklist.id} value={checklist.id}>
                          {checklist.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <h5>Start Tasks</h5>
              {beginningTasks.length === 0 ? (
                <div style={{ fontStyle: 'italic', fontSize: '12px', marginTop: '5px' }}>
                  Your default tasks are now related to your team project! Go to your settings page
                  to add start tasks.
                </div>
              ) : (
                <TaskEditor
                  tasks={beginningTasks}
                  updateTasks={tasks => this.handleTasksChange('beginningTasks', tasks)}
                  isDefaultTask
                />
              )}
              <h5>Tickets Tasks</h5>
              <TaskEditor
                tasks={ticketTasks}
                updateTasks={tasks => this.handleTasksChange('ticketTasks', tasks)}
              />
              <h5>End Tasks</h5>
              {endTasks.length === 0 ? (
                <div style={{ fontStyle: 'italic', fontSize: '12px', marginTop: '5px' }}>
                  Your default tasks are now related to your team project! Go to the settings page
                  to add end tasks.
                </div>
              ) : (
                <TaskEditor
                  tasks={endTasks}
                  updateTasks={tasks => this.handleTasksChange('endTasks', tasks)}
                  isDefaultTask
                />
              )}
              <p>
                Total estimated time :{' '}
                {ticketTasks ? getTotalTime(this.buildAllTasks(ticketTasks), 'estimatedTime') : ''}
              </p>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(withDefaultTasks(PlanningPanel));
