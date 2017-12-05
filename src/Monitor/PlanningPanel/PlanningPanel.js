import React, { Component } from 'react';
import { formatStringToTasks } from '../../Utils/StringUtils'
import './PlanningPanel.css';

const tasksPlaceholder = `Task description (time in minutes)\nExample :\nSet up environment (2)\nCreate branch (1)\n...\nCreate Pull Request (1)`;

class PlanningPanel extends Component {
  constructor(props){
    super(props);
    this.handleTasksDefinitionChange = this.handleTasksDefinitionChange.bind(this);
  }
  handleTasksDefinitionChange = (event) => {
    this.props.handlePlanningPanelChange({
      planningPanelChanges: {
        tasks: formatStringToTasks(event.target.value),
      },
    });
  }
  render() {
    return (
      <div className="PlanningPanel">
        <div className="PlanningPanel-content">
          <h2>Task list :</h2>
          <textarea placeholder={tasksPlaceholder} className="PlanningPanel-tasks-textarea" onChange={this.handleTasksDefinitionChange}/>
        </div>
      </div>
    );
  }
}

export default PlanningPanel;