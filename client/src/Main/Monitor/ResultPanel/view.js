import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { getTotalTime } from '../../../Utils/TaskUtils';
import { saveResultsInTrello } from '../../../Utils/TrelloApiUtils';
import ResultRow from '../ResultRow';
import './style.css';
import ResultPanelTable from '../ResultPanelTable';

function getRealTimeClass(estimatedTime, realTime) {
  return estimatedTime ?
    (estimatedTime < realTime ? 'red' : 'green')
    : '';
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
      }
      svg {
        display: none;
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

  saveResults(){
    this.props.saveResults();
  }

  render() {
    return (
      <div className="ResultPanel">
        <Grid container spacing={0}>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={10}>
            <ResultPanelTable datas={this.props.results} />
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <h2>Results :</h2>
              </Grid>
              <Grid container spacing={8} alignItems="center" item xs={6}>
                <Grid item xs>
                  <Button variant="contained" color="primary" onClick={() => this.saveResults()}>Save results</Button>
                </Grid>
                <Grid item xs>
                  <Button variant="contained" onClick={() => this.printResults()}>Print results</Button>
                </Grid>
                <Grid item xs>
                  <Button variant="contained" onClick={() => this.saveResultsInTrello()}>Save results in Trello</Button>
                </Grid>
              </Grid>
            </Grid>
            <div className="printArea">
              <table>
                <thead>
                  <tr>
                    <th width="30%">Task</th>
                    <th>Estimated time</th>
                    <th>Real Time</th>
                    <th width="40%">Problem</th>
                    <th width="20%">Root Cause Category</th>
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
