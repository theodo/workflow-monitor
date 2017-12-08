import React, { Component } from 'react';
import { formatMilliSecondToTime } from '../../Utils/TimeUtils';
import './ResultPanel.css';

class ResultRow extends Component {
  componentWillMount() {
    document.title = 'Worklow Monitor';
  }
  getRealTimeClass() {
    return this.props.result.estimatedTime ?
      (this.props.result.estimatedTime < this.props.result.realTime ? 'red' : 'green')
      : '';
  }
  getRowClass() {
    return this.props.result.addedOnTheFly ?
      'addedOnTheFly'
      : '';
  }
  render() {
    return (
      <tr className={this.getRowClass()}>
        <td>{this.props.result.label}</td>
        <td>{formatMilliSecondToTime(this.props.result.estimatedTime)}</td>
        <td className={this.getRealTimeClass()}>{formatMilliSecondToTime(this.props.result.realTime)}</td>
        <td>{this.props.result.problems}</td>
      </tr>
    );
  }
}

class ResultPanel extends Component {
  printResults() {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    const title = 'Récapitulatif de ticket';
    mywindow.document.write('<html><head><title>' + title  + '</title>');
    const css =`
      table, th, td {
          border: 1px solid black;
      }
      td.red {
        background: #ffa3a3;
        -webkit-print-color-adjust: exact;
      }
      td.green {
        background: #a2e5a7;
        -webkit-print-color-adjust: exact;
      }
      tr.addedOnTheFly {
        background: #ffe6e6;
        -webkit-print-color-adjust: exact;
      }`;
    mywindow.document.write('<style>' + css +'</style>');
    mywindow.document.write('</head><body>');
    mywindow.document.write('<h1>' + title  + '</h1>');
    mywindow.document.write(document.getElementsByClassName('printArea')[0].innerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
  }
  render() {
    return (
      <div className="ResultPanel">
        <div className="printArea">
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
        <button onClick={this.printResults}>Print résults</button>
      </div>
    );
  }
}

export default ResultPanel;
