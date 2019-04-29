import React, { Component } from 'react';
import Zoom from '@material-ui/core/Zoom';

const countdownStyle = {
  position: 'absolute',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.6)',
  zIndex: '1',
  width: '100%',
};

const numberStyle = {
  color: 'white',
  fontSize: '100px',
};

const TEXT_TO_DISPLAY_MAP = {
  0: '3',
  1: '2',
  2: '1',
  3: 'START',
};

export default class Countdown extends Component {
  constructor() {
    super();
    this.state = { isVisible: false, step: 3 };
  }

  componentDidMount() {
    setInterval(() => {
      let step;
      if (this.state.step === 3) step = 0;
      else step = this.state.step + 1;
      this.setState({ isVisible: true, step }, () => {
        setTimeout(() => {
          this.setState({ isVisible: false });
        }, 900);
      });
    }, 1200);
  }
  render() {
    const { isOpen } = this.props;
    const { isVisible, step } = this.state;
    const finalCountdownStyle = {
      ...countdownStyle,
      display: isOpen ? 'block' : 'hidden',
    };
    return (
      <div style={finalCountdownStyle}>
        <Zoom timeout={{ enter: 800, exit: 200 }} in={isVisible}>
          <div style={numberStyle}>{TEXT_TO_DISPLAY_MAP[step]}</div>
        </Zoom>
      </div>
    );
  }
}
