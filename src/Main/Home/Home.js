import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import './Home.css';
import SimpleCard from './SimpleCard/SimpleCard';
import { saveSettings } from '../Settings/SettingsActions';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      boards: [],
      project: this.props.project,
      lists: [],
      backlog: this.props.backlog,
      cards: [],
    };
    window.Trello.get('/member/me/boards').then((boards) => {
      this.setState({ boards });
    });
    if (this.props.project !== '') {
      window.Trello.get(`/boards/${this.props.project}/lists`).then((lists) => {
        this.setState({ lists });
      });
    }
    if (this.props.backlog !== '') {
      window.Trello.get(`/lists/${this.props.backlog}/cards`).then((cards) => {
        this.setState({ cards });
      });
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.props.saveSettings({
        selectedProjectId: this.state.project,
        selectedBacklogId: this.state.backlog,
      });
    });
    if (event.target.name === 'project') {
      this.setState({ lists: [], cards: [] });
      window.Trello.get(`/boards/${event.target.value}/lists`).then((lists) => {
        this.setState({ lists });
      });
    }
    if (event.target.name === 'backlog') {
      this.setState({ cards: [] });
      window.Trello.get(`/lists/${event.target.value}/cards`).then((cards) => {
        this.setState({ cards });
      });
    }
  }
  render() {
    return (
      <div className="Home">
        <div className="Home-left-panel">
          <form autoComplete="on">
            <FormControl>
              <InputLabel htmlFor="project">Project</InputLabel>
              <Select
                className="select"
                autoWidth={true}
                value={this.state.project}
                onChange={(event) => this.handleChange(event)}
                input={<Input name="project" id="project" />}
              >
                {
                  this.state.boards.map((board) =>
                    <MenuItem value={board.id} key={ board.id }>{ board.name }</MenuItem>)
                }
              </Select>
            </FormControl>
            <br />
            <FormControl>
              <InputLabel htmlFor="backlog">Backlog</InputLabel>
              <Select
                className="select"
                autoWidth={true}
                value={this.state.backlog}
                onChange={(event) => this.handleChange(event)}
                input={<Input name="backlog" id="backlog" />}
              >
                {
                  this.state.lists.map((list) =>
                    <MenuItem value={list.id} key={ list.id }>{ list.name }</MenuItem>)
                }
              </Select>
            </FormControl>
          </form>
        </div>
        <div className="Home-right-panel">
          {
            this.state.cards.length === 0 ?
              'Select your project and the current backlog'
              : this.state.cards.map((card, index) =>
                <SimpleCard key={index} idShort={card.idShort} userStory={card.name}></SimpleCard>)
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    project: state.SettingsReducers.selectedProjectId ? state.SettingsReducers.selectedProjectId : '',
    backlog: state.SettingsReducers.selectedBacklogId ? state.SettingsReducers.selectedBacklogId : '',
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveSettings: (settings) => {
      dispatch(saveSettings(settings));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
