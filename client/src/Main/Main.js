import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import Monitor from './Monitor/Monitor';
import Home from './Home/Home';
import Settings from './Settings/Settings';
import Project from './Project/Project';
import ProblemCategoryPage from './ProblemCategoryPage';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import CategoryIcon from '@material-ui/icons/Category';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import SettingsIcon from '@material-ui/icons/Settings';

// The code of this component come from https://material-ui-next.com/demos/drawers/

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    height: '100%,',
    maxHeight: '100%',
    minHeight: '100%',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
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
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
  },
  // custom code
  mainContent: {
    height: 'calc(100% - 64px)',
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

const isCurrentPage = page => window.location.hash === `#/${page}`;

export class Main extends Component {
  constructor(props){
    super(props);
    this.state = { open: false };
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  preventOn = condition => e => {
    if(condition) e.preventDefault();
  }
  render() {
    const { classes, theme, isTrelloCardSelected, isProjectSelected } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: this.state.open,
          })}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, this.state.isDrawerOpen && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <img src="./casper.png" height="50px" alt="logo"/>
            <Typography variant="h6" color="inherit" className={classes.title} noWrap>
              Caspr - The Ghost Programming Companion
            </Typography>
            <a href="https://goo.gl/forms/QEUYWJFubYwcYPrf1" target="_blank" className={classes.feedbackButton} rel="noopener noreferrer">Give feedback</a>
          </Toolbar>
        </AppBar>
        <Drawer
          className="no-print"
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <div>
            <Link to="/" onClick={this.preventOn(!isProjectSelected)} >
              <ListItem selected={isCurrentPage('')} disabled={!isProjectSelected} button>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home page" />
              </ListItem>
            </Link>
            <Link to="/monitor" onClick={this.preventOn(!isTrelloCardSelected || !isProjectSelected)} >
              <ListItem selected={isCurrentPage('monitor')} disabled={!isProjectSelected || !isTrelloCardSelected} button>
                <ListItemIcon>
                  <TrackChangesIcon />
                </ListItemIcon>
                <ListItemText primary="Session monitor" />
              </ListItem>
            </Link>
            <Link to="/settings" onClick={this.preventOn(!isProjectSelected)} >
              <ListItem selected={isCurrentPage('settings')} disabled={!isProjectSelected} button>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
            </Link>
            <Link to="/project">
              <ListItem selected={isCurrentPage('project')} button>
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary="Projects" />
              </ListItem>
            </Link>
            <Link to="/problem-categories" onClick={this.preventOn(!isProjectSelected)}>
              <ListItem selected={isCurrentPage('problem-categories')} disabled={!isProjectSelected} button>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Problem types" />
              </ListItem>
            </Link>
          </div>
          <Divider />
        </Drawer>
        <main className={classes.content}>
          <div className={'no-print ' + classes.toolbar} />
          <div className={classes.mainContent} >
          <Route exact path="/" component={Home}/>
          <Route path="/monitor" component={Monitor}/>
          <Route path="/settings" component={Settings}/>
          <Route path="/project" component={Project}/>
          <Route path="/problem-categories" component={ProblemCategoryPage}/>
          </div>
        </main>
      </div>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
  isProjectSelected: !!state.LoginReducers.currentProject,
  isTrelloCardSelected: !!state.MonitorReducers.currentTrelloCard,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Main));
