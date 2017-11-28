import React, { Component } from 'react'
import { formatSecondToTime } from '../../Utils/TimeUtils'
import './ResultPanel.css'

class ResultRow extends Component {
  getRealTimeClass = () => (
    this.props.result.estimatedTime ?
      (this.props.result.estimatedTime < this.props.result.realTime ? 'red' : 'green')
      : ''
    );
  getRowClass = () => (
    this.props.result.addedOnTheFly ?
      'addedOnTheFly'
      : ''
  );
  render() {
    return (
      <tr className={this.getRowClass()}>
        <td>{this.props.result.label}</td>
        <td>{formatSecondToTime(this.props.result.estimatedTime)}</td>
        <td className={this.getRealTimeClass()}>{formatSecondToTime(this.props.result.realTime)}</td>
        <td>{this.props.result.problems}</td>
      </tr>
    );
  }
}

class ResultPanel extends Component {
  render() {
    return (
      <div className="ResultPanel">
        Results :
        <table>
          <thead>
          <tr>
            <th>Task</th>
            <th>Estimated time</th>
            <th>Real Time</th>
            <th>Problem</th>
          </tr>
          </thead>
          <tbody>
          {this.props.results.map((result, index) => <ResultRow key={index} result={result} />)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ResultPanel;
