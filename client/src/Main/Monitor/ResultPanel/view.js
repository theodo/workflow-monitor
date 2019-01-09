import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { formatMilliSecondToTime, parseMillisecondFromFormattedTime } from '../../../Utils/TimeUtils';
import { setFavicon } from '../../../Utils/FaviconUtils';
import { getTotalTime } from '../../../Utils/TaskUtils';
import { saveResultsInTrello } from '../../../Utils/TrelloApiUtils';
import ProblemCategoryAutocomplete from '../ProblemCategoryAutocomplete/ProblemCategoryAutocomplete';
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

  componentDidMount() {
    document.title = 'Worklow Monitor';
    setFavicon('favicon');
  }

  handleProblemCategoryValueChange = (selectedOption) => {
    this.props.handleTaskChange(this.props.index, { problemCategory: selectedOption });
  };

  render() {
    const { index, addedOnTheFly, label, estimatedTime, realTime, problems, problemCategory} = this.props;
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
        <td>
          <ProblemCategoryAutocomplete
            value={problemCategory || null}
            onChange={this.handleProblemCategoryValueChange}
          />
        </td>
      </tr>
    );
  }
}

class ResultPanel extends Component {
  printResults() {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    let title = '';
    if(this.props.currentTrelloCard) title = '#' + this.props.currentTrelloCard.idShort + ' ' + this.props.currentTrelloCard.name;
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
    mywindow.document.write('<h4>' + title  + '</h4>');
    mywindow.document.write(document.getElementsByClassName('printArea')[0].innerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
  }

  saveResultsInTrello(){
    saveResultsInTrello(this.props.currentTrelloCard.id, this.props.results);
  }

  render() {
    return (
      <div className="ResultPanel">
        <Grid container spacing={0}>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={10}>
            <Grid container spacing={0}>
              <Grid item xs={8}>
                <h2>Results :</h2>
              </Grid>
              <Grid item xs={4} className="PlanningPanel-save-button-container">
                <Button variant="contained" className="ResultPanel-button" onClick={() => this.printResults()}>Print results</Button>
                <Button variant="contained" className="ResultPanel-button" onClick={() => this.saveResultsInTrello()}>Save results in Trello</Button>
              </Grid>
            </Grid>
            <div className="printArea">
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Estimated time</th>
                    <th>Real Time</th>
                    <th>Problem</th>
                    <th>Root Cause Category</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.results.map(({ addedOnTheFly, label, estimatedTime, realTime, problems, problemCategory }, index) =>
                    <ResultRow
                      key={index}
                      index={index}
                      addedOnTheFly={addedOnTheFly}
                      label={label}
                      estimatedTime={estimatedTime}
                      realTime={realTime}
                      problems={problems}
                      problemCategory={problemCategory}
                      handleTaskChange={this.props.handleTaskChange}
                      handleEditTime={(index, timeType, newTime) => this.setState({
                        results: Object.assign(
                          this.props.results,
                          { [index]: { ...this.props.results[index], [timeType]: newTime } }
                        )
                      })}
                    />)
                  }
                  <tr className='total-row'>
                    <td>Total</td>
                    <td>{getTotalTime(this.props.results, 'estimatedTime')}</td>
                    <td
                      className={getRealTimeClass(
                        getTotalTime(this.props.results, 'estimatedTime'),
                        getTotalTime(this.props.results, 'realTime')
                      )}
                    >
                      {getTotalTime(this.props.results, 'realTime')}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </Grid>
          <Grid item xs={1}>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default ResultPanel;
