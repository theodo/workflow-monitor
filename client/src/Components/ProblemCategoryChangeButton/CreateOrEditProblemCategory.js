import React from 'react';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import CloseIcon from '@material-ui/icons/Close';
import BackIcon from '@material-ui/icons/ArrowBack';
import { PROBLEM_LEAN_CATEGORY } from './constants';

const CreateOrEditProblemCategory = ({
  classes,
  problemCategory,
  onBack,
  onClose,
  handleSubmit,
  mutatingProblemCategory,
  handleProblemCategoryChange,
  type,
}) => {
  const title = type === 'create' ? 'Create a new Problem Category' : 'Edit this Problem Category';
  const submitText = type === 'create' ? 'Create a Problem Category' : 'Save';
  return (
    <div>
      <MuiDialogTitle disableTypography className={classes.dialogTitle}>
        <IconButton aria-label="Back" onClick={onBack}>
          <BackIcon />
        </IconButton>
        <Typography variant="h6">{title}</Typography>
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
            value={problemCategory.name}
            onChange={e => handleProblemCategoryChange(problemCategory.type, e.target.value)}
          />
          <List>
            {Object.keys(PROBLEM_LEAN_CATEGORY).map(problemTypeKey => (
              <ListItem
                key={problemTypeKey}
                button
                onClick={() => handleProblemCategoryChange(problemTypeKey, problemCategory.name)}
                selected={problemTypeKey === problemCategory.type}
              >
                <ListItemText primary={PROBLEM_LEAN_CATEGORY[problemTypeKey]} />
              </ListItem>
            ))}
          </List>
          <div className={classes.addProblemContainer}>
            <Button
              color="primary"
              disabled={!problemCategory.name || !problemCategory.type}
              onClick={handleSubmit}
            >
              {submitText}
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

export default CreateOrEditProblemCategory;
