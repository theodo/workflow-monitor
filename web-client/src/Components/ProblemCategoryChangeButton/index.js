import React from 'react';
import ProblemCategoryChangeButton from './view';
import {
  ADD_PROBLEM_CATEGORY,
  GET_PROBLEM_CATEGORIES,
  UPDATE_PROBLEM_CATEGORY_DESCRIPTION,
} from 'Queries/Categories';
import { Query } from 'react-apollo';
import { gqlClient } from 'Utils/Graphql';
import { withSnackbar } from 'notistack';
import { PROBLEM_LEAN_CATEGORY_VALUES } from './constants';
import { DELETE_PROBLEM_CATEGORY } from 'Queries/Categories';
import LoadingSpinner from 'Components/LoadingSpinner';

const getSelectedProblemCategory = problemCategory => {
  return problemCategory
    ? { id: problemCategory.id, description: problemCategory.description }
    : { id: null, description: null };
};

const getProblemCategoryTypeAndName = problemCategory => {
  const eclatedDescription = problemCategory.description.split(' / ');
  const typeKey = Object.keys(PROBLEM_LEAN_CATEGORY_VALUES).find(
    key => PROBLEM_LEAN_CATEGORY_VALUES[key] === eclatedDescription[0],
  );
  return {
    type: typeKey,
    name: eclatedDescription[1],
  };
};

const computeFullProblemCategoryDescription = (category, description) =>
  `${PROBLEM_LEAN_CATEGORY_VALUES[category]} / ${description}`;

class ProblemCategoryChangeButtonContainer extends React.Component {
  state = {
    isDialogOpen: false,
    creationMode: false,
    editionMode: false,
    mutatingProblemCategory: false,
    searchProblemCategoryTerm: '',
    problemCategoryInCreation: {
      name: null,
      type: null,
    },
    problemCategoryInEdition: {
      id: null,
      name: null,
      type: null,
    },
  };

  handleSelectProblemCategory = (problemCategoryClicked, wasSelected) => {
    const problemCategory = wasSelected
      ? { id: null, description: null }
      : {
          id: problemCategoryClicked.id,
          description: problemCategoryClicked.description,
        };

    this.props.onChange(problemCategory);
    this.closeEditDialog();
  };

  handleCreateProblemCategory = async () => {
    const description = computeFullProblemCategoryDescription(
      this.state.problemCategoryInCreation.type,
      this.state.problemCategoryInCreation.name,
    );

    this.setState({ mutatingProblemCategory: true });
    const result = await gqlClient.mutate({
      mutation: ADD_PROBLEM_CATEGORY,
      variables: {
        description,
      },
      refetchQueries: [{ query: GET_PROBLEM_CATEGORIES }],
    });
    const newProblemCategory = {
      id: result.data.addProblemCategory.id,
      description: result.data.addProblemCategory.description,
    };
    this.props.enqueueSnackbar('Created with success!', {
      variant: 'success',
    });
    this.setState({ isDialogOpen: false, problemCategoryInSelection: newProblemCategory });

    this.props.onChange(newProblemCategory);
  };

  handleChangeProblemCategory = () => {
    this.setState({
      isDialogOpen: true,
      creationMode: false,
      editionMode: false,
      mutatingProblemCategory: false,
      problemCategoryInCreation: {
        name: null,
        type: null,
      },
      problemCategoryInEdition: {
        id: null,
        name: null,
        type: null,
      },
      searchProblemCategoryTerm: '',
    });
  };

  handleEditProblemCategory = problemCategoryToEdit => () => {
    const problemCategory = getProblemCategoryTypeAndName(problemCategoryToEdit);
    this.setState({
      problemCategoryInEdition: {
        id: problemCategoryToEdit.id,
        type: problemCategory.type,
        name: problemCategory.name,
      },
      editionMode: true,
    });
  };

  handleDeleteProblemCategory = problemCategoryId => async () => {
    try {
      await gqlClient.mutate({
        mutation: DELETE_PROBLEM_CATEGORY,
        variables: {
          problemCategoryId,
        },
        refetchQueries: [{ query: GET_PROBLEM_CATEGORIES }],
      });

      if (
        this.state.problemCategoryInSelection &&
        this.state.problemCategoryInSelection.id === problemCategoryId
      ) {
        this.props.onChange({ id: null, description: null });
        this.setState({ problemCategoryInSelection: { id: null, description: null } });
      }
      this.props.enqueueSnackbar('Problem category deleted!', {
        variant: 'success',
      });
    } catch (e) {
      this.props.enqueueSnackbar(e.message, {
        variant: 'error',
      });
    }
  };

  handleSaveProblemCategoryInEdition = async () => {
    const description = computeFullProblemCategoryDescription(
      this.state.problemCategoryInEdition.type,
      this.state.problemCategoryInEdition.name,
    );

    this.setState({ mutatingProblemCategory: true });

    await gqlClient.mutate({
      mutation: UPDATE_PROBLEM_CATEGORY_DESCRIPTION,
      variables: {
        problemCategory: {
          id: this.state.problemCategoryInEdition.id,
          description,
        },
      },
      refetchQueries: [{ query: GET_PROBLEM_CATEGORIES }],
    });
    this.props.enqueueSnackbar('Edition successful!', {
      variant: 'success',
    });
    this.setState({
      editionMode: false,
      mutatingProblemCategory: false,
    });
  };

  handleSearchProblemCategory = term => {
    this.setState(state => ({
      ...state,
      searchProblemCategoryTerm: term,
      problemCategoryInCreation: { ...state.problemCategoryInCreation, name: term },
    }));
  };

  closeEditDialog = () => {
    this.setState({ creationMode: false, isDialogOpen: false, editionMode: false });
  };

  setDialogStatusMode = mode => status => () => {
    this.setState({ [mode]: status });
  };

  setProblemCategoryInCreation = (type, name) => {
    this.setState({ problemCategoryInCreation: { type, name } });
  };

  setProblemCategoryInEdition = (type, name) => {
    this.setState(state => ({
      problemCategoryInEdition: { ...state.problemCategoryInEdition, type, name },
    }));
  };

  render() {
    const selectedProblemCategory = getSelectedProblemCategory(this.props.value);
    const problemCategoryDescription =
      selectedProblemCategory.description || 'Select a problem Category';
    return (
      <Query query={GET_PROBLEM_CATEGORIES}>
        {({ loading, error, data }) => {
          if (loading) return <LoadingSpinner size={50} />;
          if (error) return 'Unexpected error';
          if (!data.problemCategories) return 'Unexpected error';

          return (
            <ProblemCategoryChangeButton
              closeEditDialog={this.closeEditDialog}
              creationMode={this.state.creationMode}
              editionMode={this.state.editionMode}
              handleSaveProblemCategoryInEdition={this.handleSaveProblemCategoryInEdition}
              handleCreateProblemCategory={this.handleCreateProblemCategory}
              handleChangeProblemCategory={this.handleChangeProblemCategory}
              handleDeleteProblemCategory={this.handleDeleteProblemCategory}
              handleEditProblemCategory={this.handleEditProblemCategory}
              handleSearchProblemCategory={this.handleSearchProblemCategory}
              handleSelectProblemCategory={this.handleSelectProblemCategory}
              isDialogOpen={this.state.isDialogOpen}
              mutatingProblemCategory={this.state.mutatingProblemCategory}
              onProblemCategoryChange={this.props.onChange}
              problemCategories={data.problemCategories}
              problemCategoryDescription={problemCategoryDescription}
              searchProblemCategoryTerm={this.state.searchProblemCategoryTerm}
              problemCategoryInCreation={this.state.problemCategoryInCreation}
              problemCategoryInEdition={this.state.problemCategoryInEdition}
              problemCategoryInSelection={selectedProblemCategory}
              setDialogStatusMode={this.setDialogStatusMode}
              setProblemCategoryInCreation={this.setProblemCategoryInCreation}
              setProblemCategoryInEdition={this.setProblemCategoryInEdition}
            />
          );
        }}
      </Query>
    );
  }
}

export default withSnackbar(ProblemCategoryChangeButtonContainer);
