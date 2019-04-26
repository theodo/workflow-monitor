import React, { Component } from 'react';

import { formatMilliSecondToSentence } from 'Utils/TimeUtils';
import { setFavicon } from 'Utils/FaviconUtils';

import './ReverseChrono.css';

class ReverseChrono extends Component {
  constructor(props) {
    super(props);
    this.state = {
      now: new Date().getTime()
    };
    this.interval = setInterval(() => {
      this.updateDocumentTitle();
      setFavicon(this.isTimeOver() ? 'red-light' : 'green-light');
      this.setState({
        now: new Date().getTime()
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate() {
    this.updateDocumentTitle();
  }

  updateDocumentTitle() {
    document.title = this.isTimeOver() ? formatMilliSecondToSentence(this.getTime()) : this.props.currentTaskLabel;
  }

  getRealElapsedTime() {
    if (!this.props.taskChrono.dateLastStart) return 0;
    return this.props.dateLastPause
      ? this.props.taskChrono.elapsedTime + (this.props.dateLastPause - this.props.taskChrono.dateLastStart)
      : this.props.taskChrono.elapsedTime + (this.state.now - this.props.taskChrono.dateLastStart);
  }

  getTime() {
    return this.props.estimatedTaskTime - this.getRealElapsedTime();
  }

  isTimeOver() {
    return this.getTime() < 0;
  }

  render() {
    return (
      <span className={'ReverseChrono ' + (this.isTimeOver() ? 'red' : 'green')}>
        {this.isTimeOver() && formatMilliSecondToSentence(this.getTime())}
      </span>
    );
  }
}

export default ReverseChrono;
