import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { formatMilliSecondToTime, parseMilliSecondFromFormattedTime } from 'Utils/TimeUtils';
import ProblemCategoryAutocomplete from '../ProblemCategoryAutocomplete/ProblemCategoryAutocomplete';
import './style.css';

function getRealTimeClass(estimatedTime, realTime) {
  return estimatedTime ? (estimatedTime < realTime ? 'red' : 'green') : '';
}
function getRowClass(addedOnTheFly) {
  return addedOnTheFly ? 'addedOnTheFly' : '';
}

class ResultRow extends Component {
  constructor(props) {
    super(props);
    this.initialEstimatedTime = props.estimatedTime;
    this.initialRealTime = props.realTime;
  }

  handleProblemCategoryValueChange = selectedOption => {
    this.props.handleTaskChange(this.props.index, { problemCategory: selectedOption });
  };

  handleProblemsValueChange = event => {
    this.props.handleTaskChange(this.props.index, { problems: event.target.value });
  };

  render() {
    const {
      index,
      addedOnTheFly,
      description,
      estimatedTime,
      realTime,
      problems,
      problemCategory,
    } = this.props;
    const contentEditableProps = {
      contentEditable: true,
      suppressContentEditableWarning: true,
    };
    return (
      <tr className={getRowClass(addedOnTheFly)}>
        <td className="editable" {...contentEditableProps}>
          {description}
        </td>
        <td
          className="editable"
          {...contentEditableProps}
          onInput={event =>
            this.props.handleEditTime(
              index,
              'estimatedTime',
              parseMilliSecondFromFormattedTime(event.target.innerHTML),
            )
          }
        >
          {formatMilliSecondToTime(this.initialEstimatedTime)}
        </td>
        <td
          className={`editable ${getRealTimeClass(estimatedTime, realTime)}`}
          {...contentEditableProps}
          onInput={event =>
            this.props.handleEditTime(
              index,
              'realTime',
              parseMilliSecondFromFormattedTime(event.target.innerHTML),
            )
          }
        >
          {formatMilliSecondToTime(this.initialRealTime)}
        </td>
        <td>
          <TextField
            multiline
            rowsMax="4"
            value={problems || ''}
            onChange={event => this.handleProblemsValueChange(event)}
          />
        </td>
        <td>
          <ProblemCategoryAutocomplete
            value={problemCategory || null}
            onChange={this.handleProblemCategoryValueChange}
            placeholder={''}
          />
        </td>
      </tr>
    );
  }
}

export default ResultRow;
