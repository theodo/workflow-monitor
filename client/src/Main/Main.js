import React, { Component } from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Drawer from 'material-ui/Drawer';
import Monitor from './Monitor/Monitor';
import Home from './Home/Home';
import Settings from './Settings/Settings';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import HomeIcon from 'material-ui-icons/Home';
import TrackChangesIcon from 'material-ui-icons/TrackChanges';
import SettingsIcon from 'material-ui-icons/Settings';

// The code of this component come from https://material-ui-next.com/demos/drawers/

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.navDrawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: 'red',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 12,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    width: 60,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerInner: {
    // Make the items inside not wrap when transitioning:
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
  title: {
    marginLeft: 20,
  },
  feedbackButton: {
    position: 'absolute',
    color: 'white',
    right: 24,
  }
});


export class Main extends Component {
  constructor(props){
    super(props);
    this.state = { isDrawerOpen: false };
  }
  toggleDrawer(isDrawerOpen){
    this.setState({ isDrawerOpen });
  }
  render() {
    const { classes, theme } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classNames(classes.appBar, this.state.isDrawerOpen && classes.appBarShift)}>
            <Toolbar disableGutters={!this.state.isDrawerOpen}>
              <IconButton
                color="contrast"
                aria-label="open drawer"
                onClick={() => this.toggleDrawer(true)}
                className={classNames(classes.menuButton, this.state.isDrawerOpen && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit" className={classes.title} noWrap>
                New Caspr website is available! You can now use <a href="https://caspr.theo.do">https://caspr.theo.do</a> :)
              </Typography>
              <a href="https://goo.gl/forms/QEUYWJFubYwcYPrf1" target="_blank" className={classes.feedbackButton} rel="noopener noreferrer">Give feedback</a>
            </Toolbar>
          </AppBar>
          <Drawer
            type="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.isDrawerOpen && classes.drawerPaperClose),
            }}
            open={this.state.isDrawerOpen}
          >
            <div className={classes.drawerInner}>
              <div className={classes.drawerHeader}>
                <IconButton onClick={() => this.toggleDrawer(false)}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
              <div>
                <Link to="/">
                  <ListItem button>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home page" />
                  </ListItem>
                </Link>
                <Link to="/monitor">
                  <ListItem button>
                    <ListItemIcon>
                      <TrackChangesIcon />
                    </ListItemIcon>
                    <ListItemText primary="Session monitor" />
                  </ListItem>
                </Link>
                <Link to="/settings">
                  <ListItem button>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItem>
                </Link>
              </div>
              <Divider />
            </div>
          </Drawer>
          <main className={classes.content}>
            <Route exact path="/" component={Home}/>
            <Route path="/monitor" component={Monitor}/>
            <Route path="/settings" component={Settings}/>
          </main>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Main);
