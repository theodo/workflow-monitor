import React, { Component } from 'react';
import { connect } from 'react-redux';

import ResultPanel from './view';

const mapStateToProps = state => ({
  ticketId: state.MonitorReducers.ticketId,
});

class ResultPanelContainer extends Component {
  render() {
    return <ResultPanel ticketId={this.props.ticketId} />;
  }
}

export default connect(mapStateToProps)(ResultPanelContainer);
