import { KeyboardTimePicker } from '@material-ui/pickers';
import React, { Component } from 'react';
import { OffSetHours, resetDayjsDateToUnixEpoch } from 'Utils/TimeUtils';
import { Button, TextField } from '@material-ui/core';
import { gqlClient } from 'Utils/Graphql';
import { SET_PROJECT_SPEED } from '../../../../Queries/Projects';

export const styles = () => ({
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
  w150: {
    width: '150px',
  },
});

class ProjectSpeed extends Component {
  state = {
    celerity: this.props.project ? this.props.project.celerity : null,
    dailyDevelopmentTime: this.props.project ? this.props.project.dailyDevelopmentTime : null,
  };

  updateProjectSpeed = () => {
    const projectSpeed = {
      celerity: parseFloat(this.state.celerity),
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
        <TextField
          className={`${this.props.classes.mr40} ${this.props.classes.w150}`}
          id="project-celerity"
          name="project-celerity"
          type="number"
          label="Project celerity :"
          min="0"
          step="0.1"
          value={this.state.celerity}
          onChange={event => this.onSelectedProjectCelerityChange(event.target.value)}
        />
        <KeyboardTimePicker
          className={this.props.classes.mr40}
          id="project-work-hours-per-day"
          name="project-work-hours-per-day"
          ampm={false}
          format="HH:mm"
          views={['hours', 'minutes']}
          label="Work hours per day :"
          value={new Date(this.state.dailyDevelopmentTime - OffSetHours())}
          onChange={time =>
            this.onSelectedProjectDailyDevelopmentTimeChange(
              resetDayjsDateToUnixEpoch(time).getTime(),
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

export default ProjectSpeed;
