import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import './Home.css';

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      boards: [],
      project: '',
    };
    window.Trello.get('/member/me/boards').then((boards) => {
      this.setState({ boards });
    });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  render() {
    return (
      <div className="Home">
        <h1>Welcome Home</h1>
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
        </form>
      </div>
    );
  }
}
