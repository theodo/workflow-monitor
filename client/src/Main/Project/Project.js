import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';

import { gqlClient } from 'Utils/Graphql';

import './Project.css';
import { selectProject } from '../../Login/LoginActions';
import { saveSettings } from '../Settings/SettingsActions';
import { initSession } from '../Monitor/MonitorActions';

const formStyle = {
  width: 300,
  margin: 'auto'
};

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: {},
      selectedProject: this.props.project
        ? { value: this.props.project.thirdPartyId, label: this.props.project.name }
        : null
    };
    this.selectProject = this.selectProject.bind(this);
    this.handleChange = this.handleChange.bind(this);
    window.Trello.get('/member/me/boards', { filter: 'open' }).then(boards => {
      this.setState({
        boards: boards.reduce((acc, board) => {
          acc[board.id] = board;
          return acc;
        }, {})
      });
    });
  }
  handleChange(selectedProject) {
    this.setState({ selectedProject });
  }
  selectProject() {
    const selectedProject = this.state.selectedProject;
    const graphqlProject = {
      name: selectedProject.label,
      thirdPartyId: selectedProject.value
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
          project: graphqlProject
        }
      })
      .then(result => this.props.selectProject(result.data.selectProject));
  }
  render() {
    return (
      <div className="Project">
        <h2>Trello Project Selection :</h2>
        <form autoComplete="off" style={formStyle}>
          <Select
            value={this.state.selectedProject}
            onChange={this.handleChange}
            options={Object.keys(this.state.boards)
              .map(boardId => this.state.boards[boardId])
              .map(board => ({ value: board.id, label: board.name }))}
            placeholder="Select project"
          />
          <Button onClick={this.selectProject}>Select</Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    project: state.LoginReducers.currentProject
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectProject: project => {
      dispatch(initSession());
      dispatch(saveSettings({ selectedBacklogId: undefined }));
      dispatch(selectProject(project));
      window.location.hash = '#/';
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Projects);
