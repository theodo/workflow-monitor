import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';

const styles = {
  toggleButtonContainer: {
    background: 'none',
    boxShadow: 'none',
    padding: '10px',
  },
};

const TooltipToggleButton = ({ children, title, ...props }) => (
  <Tooltip title={title}>
    <ToggleButton {...props}>{children}</ToggleButton>
  </Tooltip>
);

class ToggleStandardTime extends React.Component {
  state = {
    performanceType: this.props.initialPerformanceType,
  };

  handlePerformanceTypeChange = (_, performanceType) => {
    if (performanceType) {
      this.setState({ performanceType });
      this.props.changePerformanceType(performanceType);
    }
  };

  render() {
    const { classes } = this.props;
    const { performanceType } = this.state;

    return (
      <ToggleButtonGroup
        className={classes.toggleButtonContainer}
        value={performanceType}
        exclusive
        onChange={this.handlePerformanceTypeChange}
      >
        <TooltipToggleButton value="celerityTime" title="Dev time compared to Ticket points">
          Celerity Time
        </TooltipToggleButton>
        <TooltipToggleButton value="casprTime" title="Dev time compared to Caspr planning">
          Caspr Time
        </TooltipToggleButton>
      </ToggleButtonGroup>
    );
  }
}

export default withStyles(styles)(ToggleStandardTime);