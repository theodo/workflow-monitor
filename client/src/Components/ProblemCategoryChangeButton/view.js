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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import CreateOrEditProblemCategory from './CreateOrEditProblemCategory';
import { appColors } from 'ui';

const style = {
  dialog: { padding: '5px 30px 20px' },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
  problemCategoryItemContainer: {
    display: 'flex',
  },
  emptyDeleteIcon: {
    width: 60,
  },
};

const CreateOrEditProblemCategoryWithStyle = withStyles(style)(CreateOrEditProblemCategory);

const ProblemCategoryChangeButton = ({
  classes,
  closeEditDialog,
  creationMode,
  editionMode,
  handleCreateProblemCategory,
  handleChangeProblemCategory,
  handleDeleteProblemCategory,
  handleEditProblemCategory,
  handleSaveProblemCategoryInEdition,
  handleSearchProblemCategory,
  handleSelectProblemCategory,
  isDialogOpen,
  mutatingProblemCategory,
  problemCategoryInCreation,
  problemCategories,
  problemCategoryDescription,
  setDialogStatusMode,
  searchProblemCategoryTerm,
  problemCategoryInSelection,
  problemCategoryInEdition,
  setProblemCategoryInCreation,
  setProblemCategoryInEdition,
}) => {
  return (
    <div>
      <Chip clickable label={problemCategoryDescription} onClick={handleChangeProblemCategory} />
      <Dialog fullWidth maxWidth="sm" onClose={closeEditDialog} open={isDialogOpen}>
        <div className={classes.dialog}>
          {!creationMode && !editionMode && (
            <div>
              <MuiDialogTitle>
                <div className={classes.dialogTitle}>
                  <Typography variant="h6">Chose a Problem Category</Typography>
                  <IconButton aria-label="Close" onClick={closeEditDialog}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </MuiDialogTitle>
              <div>
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
                      <div
                        className={classes.problemCategoryItemContainer}
                        key={problemCategory.id}
                      >
                        <ListItem
                          button
                          onClick={() => handleSelectProblemCategory(problemCategory)}
                        >
                          <ListItemText primary={problemCategory.description} />
                          {problemCategoryInSelection.id === problemCategory.id && <DoneIcon />}
                        </ListItem>
                        <IconButton
                          aria-label="Edit"
                          title="Edit"
                          onClick={handleEditProblemCategory(problemCategory)}
                        >
                          <EditIcon />
                        </IconButton>
                        {problemCategory.problemCount ? (
                          <div className={classes.emptyDeleteIcon} />
                        ) : (
                          <IconButton
                            aria-label="Delete"
                            title="Delete"
                            onClick={handleDeleteProblemCategory(problemCategory.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </div>
                    ))}
                </List>
                <div className={classes.addProblemContainer}>
                  <span
                    className={classes.addProblem}
                    onClick={setDialogStatusMode('creationMode')(true)}
                  >
                    Add a Problem Category
                  </span>
                </div>
              </div>
            </div>
          )}
          {creationMode && !editionMode && (
            <CreateOrEditProblemCategoryWithStyle
              handleProblemCategoryChange={setProblemCategoryInCreation}
              handleSubmit={handleCreateProblemCategory}
              mutatingProblemCategory={mutatingProblemCategory}
              onBack={setDialogStatusMode('creationMode')(false)}
              onClose={closeEditDialog}
              problemCategory={problemCategoryInCreation}
              type="create"
            />
          )}
          {!creationMode && editionMode && (
            <CreateOrEditProblemCategoryWithStyle
              handleProblemCategoryChange={setProblemCategoryInEdition}
              handleSubmit={handleSaveProblemCategoryInEdition}
              mutatingProblemCategory={mutatingProblemCategory}
              onBack={setDialogStatusMode('editionMode')(false)}
              onClose={closeEditDialog}
              problemCategory={problemCategoryInEdition}
              type="edit"
            />
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default withStyles(style)(ProblemCategoryChangeButton);
