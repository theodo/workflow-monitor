import React, { Component } from 'react';
import { formatSecondToTime, parseSecondFromFormattedTime } from '../../../../Utils/TimeUtils';
import { Input, withStyles, Button, TextField } from '@material-ui/core';
import { gqlClient } from 'Utils/Graphql';
import { withSnackbar } from 'notistack';
import { SET_PROJECT_SPEED } from '../../../../Queries/Projects';

const styles = () => ({
  mt10: {
    marginTop: '10px',
  },
  mb10: {
    marginBottom: 10,
  },
  mr20: {
    marginRight: 20,
  },
  mr40: {
    marginRight: 40,
  },
  w40: {
    width: '40px',
  },
  noAmPM: {
    '*::-webkit-datetime-edit-ampm-field': {
      display: 'none',
    },
  },
});

class ProjectSpeed extends Component {
  state = {
    celerity: this.props.project.celerity,
    dailyDevelopmentTime: this.props.project.dailyDevelopmentTime,
  };

  updateProjectSpeed = () => {
    const projectSpeed = {
      celerity: this.state.celerity,
      dailyDevelopmentTime: this.state.dailyDevelopmentTime,
    };
    gqlClient
      .mutate({
        mutation: SET_PROJECT_SPEED,
        variables: {
          projectSpeed,
        },
      })
      .then(() => {
        this.props.updateSelectedProjectSettings(projectSpeed);
        this.props.enqueueSnackbar('Speed settings saved', {
          variant: 'success',
        });
      });
  };

  onSelectedProjectCelerityChange = celerity => {
    this.setState({ celerity: celerity });
  };

  onSelectedProjectDailyDevelopmentTimeChange = time => {
    this.setState({ dailyDevelopmentTime: time });
  };

  render() {
    return (
      <div>
        <label for="project-celerity" className={this.props.classes.mr20}>
          <span>Project celerity :</span>
        </label>
        <Input
          className={`${this.props.classes.mr40} ${this.props.classes.w40}`}
          id="project-celerity"
          name="project-celerity"
          type="number"
          min="0"
          step="0.1"
          value={this.state.celerity}
          onChange={event => this.onSelectedProjectCelerityChange(event.target.value)}
        />
        <label for="project-work-hours-per-day" className={this.props.classes.mr20}>
          <span>Work hours per day :</span>
        </label>
        <TextField
          className={`${this.props.classes.mr40} ${this.props.classes.noAmPM}`}
          id="project-work-hours-per-day"
          name="project-work-hours-per-day"
          type="time"
          value={formatSecondToTime(this.state.dailyDevelopmentTime)}
          onChange={event =>
            this.onSelectedProjectDailyDevelopmentTimeChange(
              parseSecondFromFormattedTime(event.target.value),
            )
          }
        />
        <Button variant="contained" onClick={this.updateProjectSpeed}>
          Save
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(withSnackbar(ProjectSpeed));
