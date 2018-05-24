import React, { Component, PureComponent } from 'react';
import { formatMilliSecondToTime } from '../../../Utils/TimeUtils';
import Chrono from '../Chrono/Chrono';
import './TasksLateralPanel.css';

class TaskRow extends PureComponent {
  getRowClass() {
    return (this.props.isDone ? 'done' : '') + ' ' + ( this.props.isCurrent ? 'current' : '' );
  }
  getRealTimeClass() {
    if (this.props.isDone)
      return (this.props.task.realTime > this.props.task.estimatedTime ? 'red' : 'green');
    return '';
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
            <div className={'TaskRow-real-time ' + this.getRealTimeClass()}>
              { this.props.isDone && formatMilliSecondToTime(this.props.task.realTime) }
              { this.props.isCurrent &&
                <Chrono chrono={this.props.taskChrono} dateLastPause={this.props.dateLastPause} threshold={this.props.task.estimatedTime} /> }
            </div>
            { this.props.isCurrent && <div className="TaskRow-estimated-time">{ formatMilliSecondToTime(this.props.task.estimatedTime) }</div> }
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
                  taskChrono={this.props.taskChrono}
                  dateLastPause={this.props.dateLastPause}
                />
            )
          }
        </ul>
      </div>
    );
  }
}

export default TasksLateralPanel;
