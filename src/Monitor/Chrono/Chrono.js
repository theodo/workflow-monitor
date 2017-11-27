import React, { Component } from 'react';
import { formatSecondToTime } from '../../Utils/TimeUtils'
import './Chrono.css';

class Chrono extends Component {
  constructor(props){
    super(props);
    this.state = {
      time: 0,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isPaused && nextProps.isPaused !== this.props.isPaused) {
      this.pause();
    }
    if (!nextProps.isPaused && nextProps.isPaused !== this.props.isPaused) {
      this.start();
    }
  }
  start = () => {
    this.interval = setInterval(() => {
      this.setState({
        time: this.state.time + 1,
      })
    }, 1000)
  }
  pause = () => {
    clearInterval(this.interval)
  }
  reset(){
    this.setState({
      time: 0,
    })
  }
  getTime(){
    return this.state.time;
  }
  render() {
    return (
      <div className="Chrono">
        {formatSecondToTime(this.state.time)}
      </div>
    );
  }
}

export default Chrono;
