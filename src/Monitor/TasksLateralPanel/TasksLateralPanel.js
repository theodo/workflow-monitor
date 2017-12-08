import React, { Component, PureComponent } from 'react'
import './TasksLateralPanel.css'

class TaskRow extends PureComponent {
  getRowClass = () => (
    (this.props.isDone ? 'done' : '') + ' ' + ( this.props.isCurrent ? 'current' : '' )
  );
  render() {
    return (
      <li className={this.getRowClass()}>
        {this.props.task.label}
      </li>
    );
  }
}

class TasksLateralPanel extends Component {
  isNotTaskInResults = (task) => {
    return this.props.results.find(arrayTask => arrayTask.id === task.id) === undefined;
  }
  render() {
    return (
      <div className="TasksLateralPanel">
        <ul>
            {this.props.results.map((task, index) => <TaskRow key={index} task={task} isDone={true} />)}
            <TaskRow task={this.props.tasks.filter(this.isNotTaskInResults)[0]} isCurrent={true}/>
            {this.props.tasks.filter(this.isNotTaskInResults).slice(1).map((task, index) => <TaskRow key={index} task={task} />)}
        </ul>
      </div>
    );
  }
}

export default TasksLateralPanel;
