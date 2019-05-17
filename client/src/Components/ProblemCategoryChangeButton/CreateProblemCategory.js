import React from 'react';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import BackIcon from '@material-ui/icons/ArrowBack';
import { PROBLEM_LEAN_CATEGORY } from 'Main/ProblemCategoryPage/AddProblemCategoryForm/constants';

const style = {
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createInput: {
    width: '100%',
  },
};

const CreateProblemCategory = ({
  classes,
  problemCategoryInCreation,
  onBack,
  onClose,
  handleCreateProblemCategory,
  mutatingProblemCategory,
  setProblemCategoryInCreationName,
  setProblemCategoryInCreationType,
}) => {
  return (
    <div>
      <MuiDialogTitle disableTypography className={classes.dialogTitle}>
        <IconButton aria-label="Back" onClick={onBack}>
          <BackIcon />
        </IconButton>
        <Typography variant="h6">Create a new Problem Category</Typography>
        <IconButton aria-label="Close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      {!mutatingProblemCategory ? (
        <div>
          <TextField
            className={classes.textInput}
            label="Root cause"
            margin="normal"
            variant="outlined"
            value={problemCategoryInCreation.name}
            onChange={e => setProblemCategoryInCreationName(e.target.value)}
          />
          <List>
            {Object.keys(PROBLEM_LEAN_CATEGORY).map(problemTypeKey => (
              <ListItem
                key={problemTypeKey}
                button
                onClick={() => setProblemCategoryInCreationType(problemTypeKey)}
                selected={problemTypeKey === problemCategoryInCreation.type}
              >
                <ListItemText primary={PROBLEM_LEAN_CATEGORY[problemTypeKey]} />
              </ListItem>
            ))}
          </List>
          <div className={classes.addProblemContainer}>
            <Button
              color="primary"
              disabled={!problemCategoryInCreation.name || !problemCategoryInCreation.type}
              onClick={handleCreateProblemCategory}
            >
              Create a Problem Category
            </Button>
          </div>
        </div>
      ) : (
        <div className={classes.loadingContainer}>
          <span>Loading</span>
        </div>
      )}
    </div>
  );
};

export default withStyles(style)(CreateProblemCategory);
