import React, { Component } from 'react';
import { connect } from 'react-redux';

import { formatStringToTasks } from '../../Utils/StringUtils';
import { changeTasks, changeTitle } from './action';
import Button from 'material-ui/Button';
import './PlanningPanel.css';

const tasksPlaceholder = 'Task description (time in minutes)\nExample :\nSet up environment (2)\nCreate branch (1)\n...\nCreate Pull Request (1)';
const titlePlaceholder = '[574] ETQU, sur l\'étape 2B, je vois 1 question supplémentaire ...';

export class PlanningPanel extends Component {
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
          <div className="PlanningPanel-save-button-container">
            <Button raised onClick={() => this.saveDefaultTasks()}>Save tasks as default tasks</Button>
          </div>
          <h2>Task title:</h2>
          <input placeholder={titlePlaceholder} className="PlanningPanel-title-input" onChange={this.props.onChangeTitle}/>
          <h2>Task list:</h2>
          <textarea placeholder={tasksPlaceholder} className="PlanningPanel-tasks-textarea" onChange={this.props.onChangeTasks}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tasks: state.PlanningPanelReducers.tasks,
    title: state.PlanningPanelReducers.title,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeTasks: (event) => {
      dispatch(changeTasks(formatStringToTasks(event.target.value)));
    },
    onChangeTitle: (event) => {
      dispatch(changeTitle(event.target.value));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlanningPanel);
