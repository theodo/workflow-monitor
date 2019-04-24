import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { getTotalTime } from 'Utils/TaskUtils';
import { saveResultsInTrello } from 'Utils/TrelloApiUtils';
import { setFavicon } from 'Utils/FaviconUtils';

import ResultRow from '../ResultRow';
import './style.css';

function getRealTimeClass(estimatedTime, realTime) {
  return estimatedTime ? (estimatedTime < realTime ? 'red' : 'green') : '';
}

class ResultPanel extends Component {
  componentDidMount() {
    document.title = '#' + this.props.currentTrelloCard.idShort + ' ' + this.props.currentTrelloCard.name;
    setFavicon('caspr');
  }

  componentWillUnmount() {
    document.title = 'Caspr';
  }

  printResults() {
    window.print();
  }

  saveResultsInTrello() {
    saveResultsInTrello(this.props.currentTrelloCard.id, this.props.results);
  }

  saveResults() {
    this.props.saveResults();
  }

  render() {
    return (
      <div className="ResultPanel">
        <Grid container spacing={0}>
          <Grid className="no-print" item xs={1} />
          <Grid className="maximize-width" item xs={10}>
            <Grid className="no-print" container spacing={0}>
              <Grid item xs={6}>
                <h2>Results :</h2>
              </Grid>
              <Grid container spacing={8} alignItems="center" item xs={6}>
                <Grid item xs>
                  <Button variant="contained" color="primary" onClick={() => this.saveResults()}>
                    Save results
                  </Button>
                </Grid>
                <Grid item xs>
                  <Button variant="contained" onClick={() => this.printResults()}>
                    Print results
                  </Button>
                </Grid>
                <Grid item xs>
                  <Button variant="contained" onClick={() => this.saveResultsInTrello()}>
                    Save results in Trello
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <div className="printArea">
              <h2 className="displayOnlyOnPrint">
                {this.props.currentTrelloCard
                  ? '#' + this.props.currentTrelloCard.idShort + ' ' + this.props.currentTrelloCard.name
                  : ''}
              </h2>
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
                  {this.props.results.map(
                    ({ addedOnTheFly, label, estimatedTime, realTime, problems, problemCategory }, index) => (
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
                        handleEditTime={(index, timeType, newTime) =>
                          this.setState({
                            results: Object.assign(this.props.results, {
                              [index]: { ...this.props.results[index], [timeType]: newTime }
                            })
                          })
                        }
                      />
                    )
                  )}
                  <tr className="total-row">
                    <td>Total</td>
                    <td>{getTotalTime(this.props.results, 'estimatedTime')}</td>
                    <td
                      className={getRealTimeClass(
                        getTotalTime(this.props.results, 'estimatedTime'),
                        getTotalTime(this.props.results, 'realTime')
                      )}
                    >
                      {getTotalTime(this.props.results, 'realTime')}
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
              <br />
            </div>
          </Grid>
          <Grid className="no-print" item xs={1} />
        </Grid>
      </div>
    );
  }
}

export default ResultPanel;
