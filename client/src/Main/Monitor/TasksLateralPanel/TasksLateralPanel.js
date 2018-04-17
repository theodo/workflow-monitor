import React, { Component, PureComponent } from 'react';
import { getTotalTime } from '../../../Utils/TaskUtils';
import { formatMilliSecondToTime } from '../../../Utils/TimeUtils';
import './TasksLateralPanel.css';

class TaskRow extends PureComponent {
  getRowClass() {
    return (this.props.isDone ? 'done' : '') + ' ' + ( this.props.isCurrent ? 'current' : '' );
  }
  getRealTimeClass() {
    return this.props.isDone ?
      (this.props.task.realTime > this.props.task.estimatedTime ? 'red' : 'green')
      : '';
  }
  render() {
    return (
      <li className={'TaskRow ' + this.getRowClass()}>
        <div className="TaskRow-label">
          {this.props.task.label}
        </div>
        <div className="TaskRow-bottom">
          <div className="TaskRow-empty"></div>
          <div className="TaskRow-time">
            <div className={'TaskRow-real-time ' + this.getRealTimeClass()}>{ this.props.isDone && formatMilliSecondToTime(this.props.task.realTime) }</div>
            <div className="TaskRow-estimated-time">{ formatMilliSecondToTime(this.props.task.estimatedTime) }</div>
          </div>
        </div>
      </li>
    );
  }
}

class TasksLateralPanel extends Component {
  isNotTaskInResults(task) {
    return this.props.results.find(arrayTask => arrayTask.id === task.id) === undefined;
  }
  render() {
    return (
      <div className="TasksLateralPanel">
        <ul>
          {
            this.props.tasks.map(
              (task, index) =>
                <TaskRow
                  key={index}
                  task={task}
                  isDone={index < this.props.currentTaskIndex}
                  isCurrent={index === this.props.currentTaskIndex}
                />
            )
          }
        </ul>
        <div>
          <div className="TotalRow-label">Total :</div>
          <div className="TotalRow-time">
            { getTotalTime(this.props.tasks, 'estimatedTime') }
          </div>
        </div>
      </div>
    );
  }
}

export default TasksLateralPanel;
