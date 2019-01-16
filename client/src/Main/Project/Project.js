import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Project.css';
import { selectProject } from '../../Login/LoginActions';
import { saveSettings } from '../Settings/SettingsActions';
import { initSession } from '../Monitor/MonitorActions';
import { gqlClient } from '../../Utils/Graphql';
import gql from 'graphql-tag';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';

class Projects extends Component {
  constructor(props){
    super(props);
    this.state = {
      boards: {},
      selectedProjectId: this.props.project ? this.props.project.thirdPartyId : '',
    };
    this.selectProject = this.selectProject.bind(this);
    this.handleChange = this.handleChange.bind(this);
    window.Trello.get('/member/me/boards', {filter: 'open'}).then((boards) => {
      this.setState({
        boards: boards.reduce((acc, board) => {
          acc[board.id] = board;
          return acc;
        }, {})
      });
    });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  selectProject(){
    const selectedProject = (this.state.boards[this.state.selectedProjectId]);
    const graphqlProject = {
      name: selectedProject.name,
      thirdPartyId: selectedProject.id,
    };

    gqlClient
      .mutate({
        mutation: gql`
          mutation ($project: ProjectInput){
            selectProject(project: $project) {
              id,
              name,
              thirdPartyId,
            }
          }
        `,
        variables: {
          project: graphqlProject,
        }
      })
      .then(result => this.props.selectProject(result.data.selectProject));
  }
  render() {
    return (
      <div className="Project">
        <form autoComplete="off">
          <FormControl>
            <InputLabel htmlFor="selectedProjectId">Project</InputLabel>
            <Select
              className="select"
              autoWidth={true}
              value={this.state.selectedProjectId}
              onChange={this.handleChange}
              input={<Input name="selectedProjectId" id="selectedProjectId" />}
            >
              {
                Object.keys(this.state.boards)
                  .map((boardId) => this.state.boards[boardId])
                  .map((board) =>
                    <MenuItem value={board.id} key={ board.id }>{ board.name }</MenuItem>)
              }
            </Select>
            <Button onClick={this.selectProject}>Select</Button>
          </FormControl>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    project: state.LoginReducers.currentProject,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectProject: (project) => {
      dispatch(initSession());
      dispatch(saveSettings({selectedBacklogId: undefined}));
      dispatch(selectProject(project));
      window.location.hash = '#/';
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
