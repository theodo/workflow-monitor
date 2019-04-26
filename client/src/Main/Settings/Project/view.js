import React, { Component } from 'react';
import Select from 'react-select';
import gql from 'graphql-tag';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';

import { gqlClient } from 'Utils/Graphql';

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
});

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: {},
      selectedProject: this.props.project
        ? { value: this.props.project.thirdPartyId, label: this.props.project.name }
        : null,
    };

    window.Trello.get('/member/me/boards', { filter: 'open' }).then(boards => {
      this.setState({
        boards: boards.reduce((acc, board) => {
          acc[board.id] = board;
          return acc;
        }, {}),
      });
    });
  }

  handleChange = async selectedProject => {
    await this.setState({ selectedProject });
    this.selectProject();
  };

  selectProject() {
    const selectedProject = this.state.selectedProject;
    const graphqlProject = {
      name: selectedProject.label,
      thirdPartyId: selectedProject.value,
    };

    gqlClient
      .mutate({
        mutation: gql`
          mutation($project: ProjectInput) {
            selectProject(project: $project) {
              id
              name
              thirdPartyId
            }
          }
        `,
        variables: {
          project: graphqlProject,
        },
      })
      .then(result => {
        this.props.selectProject(result.data.selectProject);
        this.props.enqueueSnackbar('Project changed to ' + this.state.selectedProject.label, {
          variant: 'success',
        });
      });
  }

  onSelectedProjectCelerityChange = value => {
    this.setState(previousState => ({ ...previousState, selectedProjectCelerity: value }));
  };

  onSelectedProjectWorkHoursPerDayChange = value => {
    this.setState(previousState => ({ ...previousState, selectedProjectWorkHoursPerDay: value }));
  };

  render() {
    return (
      <div className="Project">
        <h2>Select your project :</h2>
        <Select
          className={this.props.classes.mb10}
          value={this.state.selectedProject}
          onChange={this.handleChange}
          options={Object.keys(this.state.boards)
            .map(boardId => this.state.boards[boardId])
            .map(board => ({ value: board.id, label: board.name }))}
          placeholder="Select project"
        />
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
          value={this.state.selectedProjectCelerity}
          onChange={event => this.onSelectedProjectCelerityChange(event.target.value)}
        />
        <label for="project-work-hours-per-day" className={this.props.classes.mr20}>
          <span>Work hours per day :</span>
        </label>
        <Input
          className={this.props.classes.mr40}
          id="project-work-hours-per-day"
          name="project-work-hours-per-day"
          type="time"
          value={this.state.selectedProjectWorkHoursPerDay}
          onChange={event => this.onSelectedProjectWorkHoursPerDayChange(event.target.value)}
        />
        <Button variant="contained" onClick={this.props.updateSelectedProjectSettings}>
          Save
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(withSnackbar(Projects));
