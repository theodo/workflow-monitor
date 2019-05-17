import React from 'react';
import ProblemCategoryChangeButton from './view';
import { ADD_PROBLEM_CATEGORY, GET_PROBLEM_CATEGORIES } from 'Queries/Categories';
import { Query } from 'react-apollo';
import { gqlClient } from 'Utils/Graphql';
import { computeFullProblemCategoryDescription } from 'Main/ProblemCategoryPage/AddProblemCategoryForm';

const getSelectedProblemCategory = problemCategory => {
  return problemCategory
    ? { id: problemCategory.id, description: problemCategory.description }
    : { id: null, description: null };
};

class ProblemCategoryChangeButtonContainer extends React.Component {
  state = {
    dialogStatus: {
      isOpen: false,
      createMode: false,
    },
    mutatingProblemCategory: false,
    searchProblemCategoryTerm: '',
    problemCategoryInCreation: {
      name: null,
      type: null,
    },
    problemCategoryInSelection: getSelectedProblemCategory(this.props.value),
  };

  handleSelectProblemCategory = problemCategoryClicked => {
    const problemCategory =
      this.state.problemCategoryInSelection.id === problemCategoryClicked.id
        ? { id: null, description: null }
        : {
            id: problemCategoryClicked.id,
            description: problemCategoryClicked.description,
          };

    this.props.onChange(problemCategory);
    this.setState({ problemCategoryInSelection: problemCategory });
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
    this.setState(state => ({
      ...state,
      dialogStatus: { ...state.dialogStatus, isOpen: false },
      problemCategoryInSelection: newProblemCategory,
    }));

    this.props.onChange(newProblemCategory);
  };

  handleChangeProblemCategory = () => {
    this.setState(state => ({
      ...state,
      dialogStatus: { ...state.dialogStatus, createMode: false, isOpen: true },
      mutatingProblemCategory: false,
      problemCategoryInCreation: {
        name: null,
        type: null,
      },
      searchProblemCategoryTerm: '',
    }));
  };

  handleSearchProblemCategory = term => {
    this.setState(state => ({
      ...state,
      searchProblemCategoryTerm: term,
      problemCategoryInCreation: { ...state.problemCategoryInCreation, name: term },
    }));
  };

  closeEditDialog = () => {
    this.setState({ dialogStatus: { createMode: false, isOpen: false } });
  };

  setCreateProblemCategoryMode = createMode => () => {
    this.setState(state => ({
      ...state,
      dialogStatus: { ...state.dialogStatus, createMode: createMode },
    }));
  };

  setProblemCategoryInCreationName = name => {
    this.setState(state => ({
      ...state,
      problemCategoryInCreation: { ...state.problemCategoryInCreation, name },
    }));
  };

  setProblemCategoryInCreationType = type => {
    this.setState(state => ({
      ...state,
      problemCategoryInCreation: { ...state.problemCategoryInCreation, type },
    }));
  };

  render() {
    const problemCategoryDescription =
      this.state.problemCategoryInSelection.description || 'Select a problem Category';
    return (
      <Query query={GET_PROBLEM_CATEGORIES}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return 'Unexpected error';
          if (!data.problemCategories) return 'Unexpected error';

          return (
            <ProblemCategoryChangeButton
              dialogStatus={this.state.dialogStatus}
              handleCreateProblemCategory={this.handleCreateProblemCategory}
              handleChangeProblemCategory={this.handleChangeProblemCategory}
              handleSearchProblemCategory={this.handleSearchProblemCategory}
              handleSelectProblemCategory={this.handleSelectProblemCategory}
              mutatingProblemCategory={this.state.mutatingProblemCategory}
              onProblemCategoryChange={this.props.onChange}
              problemCategories={data.problemCategories}
              problemCategoryDescription={problemCategoryDescription}
              searchProblemCategoryTerm={this.state.searchProblemCategoryTerm}
              problemCategoryInCreation={this.state.problemCategoryInCreation}
              problemCategoryInSelection={this.state.problemCategoryInSelection}
              setCreateProblemCategoryMode={this.setCreateProblemCategoryMode}
              closeEditDialog={this.closeEditDialog}
              setProblemCategoryInCreationName={this.setProblemCategoryInCreationName}
              setProblemCategoryInCreationType={this.setProblemCategoryInCreationType}
            />
          );
        }}
      </Query>
    );
  }
}

export default ProblemCategoryChangeButtonContainer;
