import React, { Component } from 'react';
import { formatStringToTasks } from '../../Utils/StringUtils'
import './PlanningPanel.css';

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
          <h2>Tasks list :</h2>
          <textarea className="PlanningPanel-tasks-textarea" onChange={this.handleTasksDefinitionChange}/>
        </div>
      </div>
    );
  }
}

export default PlanningPanel;
