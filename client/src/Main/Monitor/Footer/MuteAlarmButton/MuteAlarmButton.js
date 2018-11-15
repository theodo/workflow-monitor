import React, { Component } from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import SvgIcon from '@material-ui/core/SvgIcon';
import { saveSettings } from '../../../Settings/SettingsActions';
import { setMuted } from '../../../../Utils/AlarmUtils';

const MuteAlarmButtonStyle = {
  color: 'white',
};

const MusicOffIcon = () => (
  <SvgIcon>
    <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2z"/>
  </SvgIcon>
);

class MuteAlarmButton extends Component {
  constructor(props){
    super(props);
    this.toggleMute = this.toggleMute.bind(this);
  }
  toggleMute() {
    setMuted(!this.props.isAlarmMuted);
    this.props.saveSettings({
      isAlarmMuted: !this.props.isAlarmMuted
    });
  }
  render() {
    return (
      <IconButton className="MuteAlarmButton" aria-label="on/off" color="primary" tabIndex="-1" onClick={this.toggleMute} style={{ ...MuteAlarmButtonStyle }}>
        {this.props.isAlarmMuted ? <MusicOffIcon /> : <MusicNoteIcon/>}
      </IconButton>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAlarmMuted: state.SettingsReducers.isAlarmMuted
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveSettings: (settings) => {
      dispatch(saveSettings(settings));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MuteAlarmButton);
