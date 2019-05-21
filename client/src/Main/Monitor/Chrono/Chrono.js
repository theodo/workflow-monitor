import React, { Component } from 'react';

import { formatMilliSecondToTime } from 'Utils/TimeUtils';

import './Chrono.css';

export const getTimer = (chrono, dateLastPause) => {
  if (!chrono.dateLastStart) return 0;
  return dateLastPause
    ? chrono.elapsedTime + (dateLastPause - chrono.dateLastStart)
    : chrono.elapsedTime + (new Date().getTime() - chrono.dateLastStart);
};

class Chrono extends Component {
  constructor(props) {
    super(props);
    this.state = {
      now: new Date().getTime(),
    };
    this.interval = setInterval(() => {
      this.setState({
        now: new Date().getTime(),
      });
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  getColorClass(time) {
    if (!this.props.threshold) return '';
    return time < this.props.threshold ? 'green' : 'red';
  }
  render() {
    const time = getTimer(this.props.chrono, this.props.dateLastPause);
    return (
      <span className={'Chrono ' + this.getColorClass(time)}>{formatMilliSecondToTime(time)}</span>
    );
  }
}

export default Chrono;
