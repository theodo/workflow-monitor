import React, { Component } from 'react';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { gqlClient } from 'Utils/Graphql';

import ResultPanel from './view';

const mapStateToProps = state => ({
  monitorState: state.MonitorReducers,
});

class ResultPanelContainer extends Component {
  state = {};

  componentDidMount() {
      gqlClient
      .mutate({
      mutation: gql`
        mutation {
          saveTicket(state:${JSON.stringify(JSON.stringify(this.props.monitorState))})
        }
        `,
    })
    .then((result) => {
      this.setState({ticketId: result.data.saveTicket})
    });
  }

  render() {
    return <ResultPanel ticketId={this.state.ticketId} />;
  }
}

export default connect(mapStateToProps)(ResultPanelContainer);
