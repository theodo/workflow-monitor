import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import { withStyles } from '@material-ui/core';

const styles = () => ({
  loader: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    position: 'absolute',
  },
});

const LoadingSpinner = ({ classes, size = 150, absolute }) => (
  <div className={`${classes.loader} ${absolute ? classes.absolute : ''}`}>
    <CircularProgress size={size} />
  </div>
);

export default withStyles(styles)(LoadingSpinner);
