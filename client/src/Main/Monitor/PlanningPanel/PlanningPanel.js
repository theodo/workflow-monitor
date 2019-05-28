import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { debounce } from 'throttle-debounce';

import { initAlarm, cancelAlarm } from 'Utils/AlarmUtils';
import { getTotalTime } from 'Utils/TaskUtils';
import { filterEmptyTasks, formatStringToTasks } from 'Utils/TaskUtils';

import TaskEditor from 'Main/TaskEditor/TaskEditor';
import './PlanningPanel.css';
import withDefaultTasks from 'Main/shared/WithDefaultTasks.hoc';

const planningMaxTime = 600000;

class PlanningPanel extends Component {
  constructor(props) {
    super(props);
    this.savePlanningTask = debounce(1000, this.savePlanningTask);
    const tasks = localStorage.getItem('planningTasks')
      ? JSON.parse(localStorage.getItem('planningTasks'))
      : [];
    this.state = {
      tasks,
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

  handleTasksChange = async (key, tasks) => {
    await this.setState({ [key]: tasks });
    if (key === 'tasks') {
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
      this.handleTasksDefinitionChange(formatStringToTasks(tasksAsString));
    });
  };
  buildAllTasks = () => {
    return [
      ...filterEmptyTasks(this.state.beginningTasks),
      ...filterEmptyTasks(this.state.tasks),
      ...filterEmptyTasks(this.state.endTasks),
    ];
  };

  savePlanningTask = () => {
    localStorage.setItem('planningTasks', JSON.stringify(this.state.tasks));
  };
  render() {
    const { tasks, selectedChecklist, checklists, beginningTasks, endTasks } = this.state;
    return (
      <div className="PlanningPanel">
        <Grid container spacing={24}>
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
              <h5>Start Tasks :</h5>
              <TaskEditor
                tasks={beginningTasks}
                updateTasks={tasks => this.handleTasksChange('beginningTasks', tasks)}
                noAdd
              />
              <h5>Tickets Tasks :</h5>
              <TaskEditor
                tasks={tasks}
                updateTasks={tasks => this.handleTasksChange('tasks', tasks)}
              />
              <h5>End Tasks :</h5>
              <TaskEditor
                tasks={endTasks}
                updateTasks={tasks => this.handleTasksChange('endTasks', tasks)}
                noAdd
              />
              <p>
                Total estimated time :{' '}
                {tasks ? getTotalTime(this.buildAllTasks(tasks), 'estimatedTime') : ''}
              </p>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withDefaultTasks(PlanningPanel);
