import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import './Home.css';
import SimpleCard from './SimpleCard/SimpleCard';
import { saveSettings } from '../Settings/SettingsActions';
import { resetMonitor } from '../Monitor/MonitorActions';

class Home extends Component {
  constructor(props){
    super(props);
    this.isRefreshButtonDisabled = this.isRefreshButtonDisabled.bind(this);
    this.loadCardsFromTrello = this.loadCardsFromTrello.bind(this);
    this.state = {
      project: this.props.project,
      lists: [],
      backlog: this.props.backlog,
      cards: [],
    };
    if (this.props.project) {
      window.Trello.get(`/boards/${this.props.project.thirdPartyId}/lists`).then((lists) => {
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
        selectedBacklogId: this.state.backlog,
      });
    });
    if (event.target.name === 'backlog') {
      this.loadCardsFromTrello(event.target.value);
    }
  }
  loadCardsFromTrello(backlogId) {
    this.setState({ cards: [] });
    window.Trello.get(`/lists/${backlogId}/cards`).then((cards) => {
      this.setState({ cards });
    });
  }
  isRefreshButtonDisabled() {
    const isRefreshButtonDisabled = !this.state.lists || this.state.lists.length === 0 || !this.state.backlog || this.state.lists.map(list => list.id).indexOf(this.state.backlog) === -1;
    return !!isRefreshButtonDisabled;
  }
  render() {
    return (
      <div className="Home">
        <div className="Home-left-panel">
          <form autoComplete="on">
            Project : { this.state.project.name }
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
            <br />
            <br />
            <Button onClick={() => this.loadCardsFromTrello(this.state.backlog)} disabled={this.isRefreshButtonDisabled()}>
              Refresh cards
            </Button>
          </form>
        </div>
        <div className="Home-right-panel">
          {
            this.state.cards.length === 0 ?
              'Select your project and the current backlog'
              : this.state.cards.map((card, index) =>
                <SimpleCard
                  key={index}
                  card={card}
                  isCurrentTicket={this.props.currentTicket && this.props.currentTicket.id === card.id}
                  handleCardStartClick={this.props.handleCardStartClick}
                  handleCardContinueClick={this.props.handleCardContinueClick}
                ></SimpleCard>)
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    project: state.LoginReducers.currentProject,
    backlog: state.SettingsReducers.selectedBacklogId ? state.SettingsReducers.selectedBacklogId : '',
    currentTicket: state.MonitorReducers.currentTrelloCard,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveSettings: (settings) => {
      dispatch(saveSettings(settings));
    },
    handleCardStartClick: (card) => {
      dispatch(resetMonitor(card));
      window.location.hash = '#/monitor';
    },
    handleCardContinueClick: () => {
      window.location.hash = '#/monitor';
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
