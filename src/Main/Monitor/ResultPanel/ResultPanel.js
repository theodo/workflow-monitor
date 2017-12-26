import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { formatMilliSecondToTime, parseMillisecondFromFormattedTime } from '../../../Utils/TimeUtils';
import { setFavicon } from '../../../Utils/FaviconUtils';
import './ResultPanel.css';

function getRealTimeClass(estimatedTime, realTime) {
  return estimatedTime ?
    (estimatedTime < realTime ? 'red' : 'green')
    : '';
}
function getRowClass(addedOnTheFly) {
  return addedOnTheFly ?
    'addedOnTheFly'
    : '';
}

class ResultRow extends Component {
  constructor(props) {
    super(props);
    this.initialEstimatedTime = props.estimatedTime;
    this.initialRealTime = props.realTime;
  }
  componentWillMount() {
    document.title = 'Worklow Monitor';
    setFavicon('favicon');
  }
  render() {
    const { index, addedOnTheFly, label, estimatedTime, realTime, problems} = this.props;
    const contentEditableProps = {
      contentEditable: true,
      suppressContentEditableWarning: true,
    };
    return (
      <tr className={getRowClass(addedOnTheFly)}>
        <td className="editable" {...contentEditableProps}>{label}</td>
        <td
          className="editable"
          {...contentEditableProps}
          onInput={(event) =>
            this.props.handleEditTime(index, 'estimatedTime', parseMillisecondFromFormattedTime(event.target.innerHTML))
          }
        >
          {formatMilliSecondToTime(this.initialEstimatedTime)}
        </td>
        <td
          className={`editable ${getRealTimeClass(estimatedTime, realTime)}`}
          {...contentEditableProps}
          onInput={(event) =>
            this.props.handleEditTime(index, 'realTime', parseMillisecondFromFormattedTime(event.target.innerHTML))
          }
        >
          {formatMilliSecondToTime(this.initialRealTime)}
        </td>
        <td className="editable problems-cell" {...contentEditableProps}>{problems}</td>
      </tr>
    );
  }
}

class ResultPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: this.props.results,
    };
  }

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
    return formatMilliSecondToTime(results
      .filter(({ label }) => label !== 'Planning')
      .map((result) => result[timeType])
      .reduce((totalTime, time) => totalTime + time, 0)
    );
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
              {this.state.results.map(({ addedOnTheFly, label, estimatedTime, realTime, problems}, index) =>
                <ResultRow
                  key={index}
                  index={index}
                  addedOnTheFly={addedOnTheFly}
                  label={label}
                  estimatedTime={estimatedTime}
                  realTime={realTime}
                  problems={problems}
                  handleEditTime={(index, timeType, newTime) => this.setState({
                    results: Object.assign(
                      this.state.results,
                      { [index]: { ...this.state.results[index], [timeType]: newTime } }
                    )
                  })}
                />)
              }
              <tr className='total-row'>
                <td>Total</td>
                <td>{this.getTotalTime(this.state.results, 'estimatedTime')}</td>
                <td
                  className={getRealTimeClass(
                    this.getTotalTime(this.state.results, 'estimatedTime'),
                    this.getTotalTime(this.state.results, 'realTime')
                  )}
                >
                  {this.getTotalTime(this.state.results, 'realTime')}</td>
                <td />
              </tr>
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
