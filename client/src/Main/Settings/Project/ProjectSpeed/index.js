import React, { useState, useEffect } from 'react';
import { formatMilliSecondToTime, parseMilliSecondFromFormattedTime } from 'Utils/TimeUtils';
import { Input, withStyles, Button, TextField } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { SET_PROJECT_SPEED } from 'Apollo/Queries/Projects';
import { Mutation } from 'react-apollo';

const styles = () => ({
  mr20: {
    marginRight: 20,
  },
  mr40: {
    marginRight: 40,
  },
  w40: {
    width: '40px',
  },
});

const ProjectSpeed = props => {
  const [projectSpeed, setProjectSpeed] = useState({
    celerity: props.celerity,
    dailyDevelopmentTime: props.dailyDevelopmentTime,
  });

  useEffect(() => {
    setProjectSpeed({
      celerity: props.celerity,
      dailyDevelopmentTime: props.dailyDevelopmentTime,
    });
  }, [props.dailyDevelopmentTime, props.celerity]);

  return (
    <Mutation
      mutation={SET_PROJECT_SPEED}
      onCompleted={() =>
        props.enqueueSnackbar('Speed settings saved', {
          variant: 'success',
        })
      }
    >
      {mutateProjectSpeed => {
        return (
          <div>
            <label className={props.classes.mr20}>
              <span>Project celerity :</span>
            </label>
            <Input
              className={`${props.classes.mr40} ${props.classes.w40}`}
              id="project-celerity"
              name="project-celerity"
              type="number"
              min="0"
              step="0.1"
              value={projectSpeed.celerity}
              onChange={event =>
                setProjectSpeed({ ...projectSpeed, celerity: parseInt(event.target.value) })
              }
            />
            <label className={props.classes.mr20}>
              <span>Work hours per day :</span>
            </label>
            <TextField
              className={props.classes.mr40}
              id="project-work-hours-per-day"
              name="project-work-hours-per-day"
              type="time"
              value={formatMilliSecondToTime(projectSpeed.dailyDevelopmentTime)}
              onChange={event =>
                setProjectSpeed({
                  ...projectSpeed,
                  dailyDevelopmentTime: parseMilliSecondFromFormattedTime(event.target.value),
                })
              }
            />
            <Button
              variant="contained"
              onClick={() => mutateProjectSpeed({ variables: { projectSpeed } })}
            >
              Save
            </Button>
          </div>
        );
      }}
    </Mutation>
  );
};

export default withStyles(styles)(withSnackbar(ProjectSpeed));
