import React from 'react';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import CreateProblemCategory from './CreateProblemCategory';
import { appColors } from 'ui';

const style = {
  dialog: { padding: '5px 30px 20px' },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogBody: {},
  textInput: {
    width: '100%',
  },
  addProblemContainer: {
    textAlign: 'center',
  },
  addProblem: {
    color: appColors.casprBlue,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  loadingContainer: {
    padding: '100px',
    textAlign: 'center',
  },
};

const CreateProblemCategoryWithStyle = withStyles(style)(CreateProblemCategory);

const ProblemCategoryChangeButton = ({
  classes,
  dialogStatus,
  handleCreateProblemCategory,
  handleChangeProblemCategory,
  handleSearchProblemCategory,
  handleSelectProblemCategory,
  mutatingProblemCategory,
  problemCategoryInCreation,
  problemCategories,
  problemCategoryDescription,
  setCreateProblemCategoryMode,
  searchProblemCategoryTerm,
  problemCategoryInSelection,
  closeEditDialog,
  setProblemCategoryInCreationName,
  setProblemCategoryInCreationType,
}) => {
  return (
    <div>
      <Chip clickable label={problemCategoryDescription} onClick={handleChangeProblemCategory} />
      <Dialog fullWidth maxWidth="sm" onClose={closeEditDialog} open={dialogStatus.isOpen}>
        <div className={classes.dialog}>
          {!dialogStatus.createMode && (
            <div>
              <MuiDialogTitle>
                <div className={classes.dialogTitle}>
                  <Typography variant="h6">Chose a Problem Category</Typography>
                  <IconButton aria-label="Close" onClick={closeEditDialog}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </MuiDialogTitle>
              <div className={classes.dialogBody}>
                <TextField
                  className={classes.textInput}
                  label="Search a Problem Category"
                  margin="normal"
                  variant="outlined"
                  value={searchProblemCategoryTerm}
                  onChange={e => handleSearchProblemCategory(e.target.value)}
                />
                <List>
                  {problemCategories
                    .filter(problem => {
                      return problem.description
                        .toLowerCase()
                        .includes(searchProblemCategoryTerm.toLowerCase());
                    })
                    .map(problemCategory => (
                      <ListItem
                        key={problemCategory.id}
                        button
                        onClick={() => handleSelectProblemCategory(problemCategory)}
                      >
                        <ListItemText primary={problemCategory.description} />
                        {problemCategoryInSelection.id === problemCategory.id && <DoneIcon />}
                      </ListItem>
                    ))}
                </List>
                <div className={classes.addProblemContainer}>
                  <span className={classes.addProblem} onClick={setCreateProblemCategoryMode(true)}>
                    Add a Problem Category
                  </span>
                </div>
              </div>
            </div>
          )}
          {dialogStatus.createMode && (
            <CreateProblemCategoryWithStyle
              handleCreateProblemCategory={handleCreateProblemCategory}
              mutatingProblemCategory={mutatingProblemCategory}
              problemCategoryInCreation={problemCategoryInCreation}
              onBack={setCreateProblemCategoryMode(false)}
              onClose={closeEditDialog}
              setProblemCategoryInCreationName={setProblemCategoryInCreationName}
              setProblemCategoryInCreationType={setProblemCategoryInCreationType}
            />
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default withStyles(style)(ProblemCategoryChangeButton);
