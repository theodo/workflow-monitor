import React, { Component, PureComponent } from 'react';
import './TasksLateralPanel.css';

class TaskRow extends PureComponent {
  getRowClass() {
    return (this.props.isDone ? 'done' : '') + ' ' + ( this.props.isCurrent ? 'current' : '' );
  }
  render() {
    return (
      <li className={this.getRowClass()}>
        {this.props.task.label}
      </li>
    );
  }
}

class TasksLateralPanel extends Component {
  isNotTaskInResults(task) {
    return this.props.results.find(arrayTask => arrayTask.id === task.id) === undefined;
  }
  render() {
    console.log(this.props.results, 'result');
    return (
      <div className="TasksLateralPanel">
        <ul>
          {this.props.results.map((task, index) => <TaskRow key={index} task={task} isDone={true} />)}
          <TaskRow
            task={this.props.tasks.filter((task) => this.isNotTaskInResults(task))[0]}
            isCurrent={true}
          />
          {this.props.tasks.filter((task) => this.isNotTaskInResults(task)).slice(1).map((task, index) => <TaskRow key={index} task={task} />)}
        </ul>
      </div>
    );
  }
}

export default TasksLateralPanel;
