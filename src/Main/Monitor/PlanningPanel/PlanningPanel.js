import React, { Component } from 'react';
import { formatStringToTasks } from '../../../Utils/StringUtils';
import Button from 'material-ui/Button';
import './PlanningPanel.css';

const tasksPlaceholder = 'Task description (time in minutes)\nExample :\nSet up environment (2)\nCreate branch (1)\n...\nCreate Pull Request (1)';

class PlanningPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      tasks: localStorage.getItem('defaultTasks') ? localStorage.getItem('defaultTasks') : '',
    };
  }
  handleTasksDefinitionChange(event) {
    this.setState({ tasks: event.target.value });
    this.props.handlePlanningPanelChange({
      planningPanelChanges: {
        tasks: formatStringToTasks(event.target.value),
      },
    });
  }
  saveDefaultTasks(){
    localStorage.setItem('defaultTasks',this.state.tasks);
  }
  render() {
    return (
      <div className="PlanningPanel">
        <div className="PlanningPanel-content">
          <h2>Task list :</h2>
          <div className="PlanningPanel-save-button-container">
            <Button raised onClick={() => this.saveDefaultTasks()}>Save tasks as default tasks</Button>
          </div>
          <textarea
            placeholder={tasksPlaceholder}
            value={this.state.tasks}
            className="PlanningPanel-tasks-textarea"
            onChange={(event) => this.handleTasksDefinitionChange(event)}
          />
        </div>
      </div>
    );
  }
}

export default PlanningPanel;
