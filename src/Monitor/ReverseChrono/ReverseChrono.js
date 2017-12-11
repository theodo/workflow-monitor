import React, { Component } from 'react';
import { formatMilliSecondToTime } from '../../Utils/TimeUtils';
import { setFavicon } from '../../Utils/FaviconUtils';
import './ReverseChrono.css';

class ReverseChrono extends Component {
  constructor(props){
    super(props);
    this.state = {
      now: (new Date()).getTime(),
    };
    this.interval = setInterval(() => {
      document.title = this.formatTimeLeft();
      setFavicon(this.isTimeOver() ? 'red' : 'green');
      this.setState({
        now: (new Date()).getTime(),
      });
    }, 1000);
  }
  componentWillUnmount(){
    clearInterval(this.interval);
  }
  getRealElapsedTime(){
    if (!this.props.taskChrono.dateLastStart) return 0;
    return this.props.dateLastPause ?
      this.props.taskChrono.elapsedTime + (this.props.dateLastPause - this.props.taskChrono.dateLastStart)
      : this.props.taskChrono.elapsedTime + (this.state.now - this.props.taskChrono.dateLastStart);
  }
  getTime(){
    return this.props.estimatedTaskTime - this.getRealElapsedTime();
  }
  isTimeOver(){
    return this.getTime() < 0;
  }
  formatTimeLeft() {
    const prefix = this.isTimeOver() ? '-' : ' ';
    return `${prefix} ${formatMilliSecondToTime(Math.abs(this.getTime()))}`;
  }
  render() {
    return (
      <span className={'ReverseChrono ' + (this.isTimeOver() ? 'red' : 'green')}>
        {this.formatTimeLeft()}
      </span>
    );
  }
}

export default ReverseChrono;
