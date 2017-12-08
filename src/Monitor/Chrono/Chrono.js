import React, { Component } from 'react';
import { formatMilliSecondToTime } from '../../Utils/TimeUtils';
import './Chrono.css';

class Chrono extends Component {
  constructor(props){
    super(props);
    this.state = {
      now: (new Date()).getTime(),
    };
    this.interval = setInterval(() => {
      this.setState({
        now: (new Date()).getTime(),
      });
    }, 1000);
  }
  componentWillUnmount(){
    clearInterval(this.interval);
  }
  getTime(){
    if (!this.props.chrono.dateLastStart) return 0;
    return this.props.dateLastPause ?
      this.props.chrono.elapsedTime + (this.props.dateLastPause - this.props.chrono.dateLastStart)
      : this.props.chrono.elapsedTime + (this.state.now - this.props.chrono.dateLastStart);
  }
  render() {
    return (
      <div className="Chrono">
        {formatMilliSecondToTime(this.getTime())}
      </div>
    );
  }
}

export default Chrono;
