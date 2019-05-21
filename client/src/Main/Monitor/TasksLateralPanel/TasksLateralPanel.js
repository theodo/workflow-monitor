import React, { Component, PureComponent } from 'react';

import { formatMilliSecondToTime } from 'Utils/TimeUtils';

import Chrono, { getTimer } from '../Chrono/Chrono';
import './TasksLateralPanel.css';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { playOrPauseSession, updateTaskTimer } from '../MonitorActions';
import { TimePicker } from 'material-ui-pickers';
import { OffSetHours } from '../../../Utils/TimeUtils';

class TaskRow extends PureComponent {
  state = {
    editTimeMode: false,
    wasPausedBeforeEdit: false,
    editedTime: null,
  };

  startEditTime = () => {
    if (this.props.dateLastPause) {
      this.setState({
        wasPausedBeforeEdit: true,
        editTimeMode: true,
        editedTime: new Date(
          getTimer(this.props.taskChrono, this.props.dateLastPause) - OffSetHours(),
        ),
      });
    } else {
      this.props.playOrPauseSession();
      this.setState({
        wasPausedBeforeEdit: false,
        editTimeMode: true,
        editedTime: new Date(
          getTimer(this.props.taskChrono, this.props.dateLastPause) - OffSetHours(),
        ),
      });
    }
  };

  saveEditedTime = () => {
    this.setState({ ...this.state, editTimeMode: false });
    const delta =
      getTimer(this.props.taskChrono, this.props.dateLastPause) -
      OffSetHours() -
      new Date(this.state.editedTime).getTime();
    this.props.updateTaskTimer(delta);
    if (!this.state.wasPausedBeforeEdit) {
      this.props.playOrPauseSession();
    }
  };

  handleTimerChange = time => {
    this.setState({
      ...this.state,
      editedTime: time,
    });
  };

  cancelEditedTime = () => {
    this.setState({ ...this.state, editTimeMode: false });
    if (!this.state.wasPausedBeforeEdit) {
      this.props.playOrPauseSession();
    }
  };
  getRowClass() {
    return (this.props.isDone ? 'done' : '') + ' ' + (this.props.isCurrent ? 'current' : '');
  }
  getRealTimeClass() {
    if (this.props.isDone)
      return this.props.task.realTime > this.props.task.estimatedTime ? 'red' : 'green';
    return '';
  }
  render() {
    return (
      <li className={'TaskRow ' + this.getRowClass()}>
        <div className="TaskRow-label">{this.props.task.label}</div>
        <div className="TaskRow-bottom">
          <div className="TaskRow-empty" />
          {this.props.isCurrent && !this.state.editTimeMode && (
            <IconButton color="primary" onClick={this.startEditTime} title="Edit time">
              <EditIcon />
            </IconButton>
          )}
          {this.props.isCurrent && this.state.editTimeMode && (
            <>
              <IconButton color="primary" onClick={this.saveEditedTime} title="Save time">
                <SaveIcon />
              </IconButton>
              <IconButton color="primary" onClick={this.cancelEditedTime} title="Cancel">
                <CancelIcon />
              </IconButton>
            </>
          )}
          <div className="TaskRow-time">
            <div className={'TaskRow-real-time ' + this.getRealTimeClass()}>
              {this.props.isDone && formatMilliSecondToTime(this.props.task.realTime)}
              {this.props.isCurrent && !this.state.editTimeMode && (
                <Chrono
                  chrono={this.props.taskChrono}
                  dateLastPause={this.props.dateLastPause}
                  threshold={this.props.task.estimatedTime}
                />
              )}
              {this.props.isCurrent && this.state.editTimeMode && (
                <TimePicker
                  seconds
                  ampm={false}
                  format="HH:mm:ss"
                  keyboard
                  label="Timer"
                  mask={[/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/]}
                  disableOpenOnEnter
                  value={this.state.editedTime}
                  onChange={time => this.handleTimerChange(time)}
                />
              )}
            </div>
            {this.props.isCurrent && (
              <div className="TaskRow-estimated-time">
                {formatMilliSecondToTime(this.props.task.estimatedTime)}
              </div>
            )}
          </div>
        </div>
      </li>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    playOrPauseSession: () => {
      dispatch(playOrPauseSession());
    },
    updateTaskTimer: delta => {
      dispatch(updateTaskTimer(delta));
    },
  };
};

const ConnectedTaskRow = connect(
  null,
  mapDispatchToProps,
)(TaskRow);

class TasksLateralPanel extends Component {
  isNotTaskInResults(task) {
    return this.props.results.find(arrayTask => arrayTask.id === task.id) === undefined;
  }
  render() {
    return (
      <div className="TasksLateralPanel">
        <ul>
          {this.props.tasks.map((task, index) => (
            <ConnectedTaskRow
              key={index}
              task={task}
              isDone={index < this.props.currentTaskIndex}
              isCurrent={index === this.props.currentTaskIndex}
              taskChrono={this.props.taskChrono}
              dateLastPause={this.props.dateLastPause}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default TasksLateralPanel;
