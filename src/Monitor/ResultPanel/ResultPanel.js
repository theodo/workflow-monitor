import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { formatMilliSecondToTime } from '../../Utils/TimeUtils';
import { setFavicon } from '../../Utils/FaviconUtils';
import './ResultPanel.css';

class ResultRow extends Component {
  componentWillMount() {
    document.title = 'Worklow Monitor';
    setFavicon('favicon');
  }
  getRealTimeClass(estimatedTime, realTime) {
    return estimatedTime ?
      (estimatedTime < realTime ? 'red' : 'green')
      : '';
  }
  getRowClass(addedOnTheFly) {
    return addedOnTheFly ?
      'addedOnTheFly'
      : '';
  }
  render() {
    const { addedOnTheFly, label, estimatedTime, realTime, problems} = this.props;
    return (
      <tr className={this.getRowClass(addedOnTheFly)}>
        <td>{label}</td>
        <td>{formatMilliSecondToTime(estimatedTime)}</td>
        <td className={this.getRealTimeClass(estimatedTime, realTime)}>
          {formatMilliSecondToTime(realTime)}
        </td>
        <td>{problems}</td>
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
  getTotalTime(results, timeType) {
    return results
      .filter(({ label }) => label !== 'Planning')
      .map((result) => result[timeType])
      .reduce((totalTime, time) => totalTime + time, 0);
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
              {this.props.results.map(({ addedOnTheFly, label, estimatedTime, realTime, problems}, index) =>
                <ResultRow
                  key={index}
                  addedOnTheFly={addedOnTheFly}
                  label={label}
                  estimatedTime={estimatedTime}
                  realTime={realTime}
                  problems={problems}
                />)
              }
              <ResultRow
                addedOnTheFly={false}
                label="Total"
                estimatedTime={this.getTotalTime(this.props.results, 'estimatedTime')}
                realTime={this.getTotalTime(this.props.results, 'realTime')}
                problems=""
              />
            </tbody>
          </table>
        </div>
        <br />
        <Button raised onClick={this.printResults}>Print results</Button>
      </div>
    );
  }
}

export default ResultPanel;
