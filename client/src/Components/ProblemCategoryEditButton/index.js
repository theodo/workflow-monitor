import React from 'react';
import ProblemCategoryEditButton from './view';
import { ADD_PROBLEM_CATEGORY, GET_PROBLEM_CATEGORIES } from 'Queries/Categories';
import { Query } from 'react-apollo';
import { gqlClient } from 'Utils/Graphql';
import { computeFullProblemCategoryDescription } from 'Main/ProblemCategoryPage/AddProblemCategoryForm';

const getSelectedProblemCategory = problemCategory => {
  return problemCategory
    ? { id: problemCategory.id, description: problemCategory.description }
    : { id: null, description: null };
};

class ProblemCategoryEditButtonContainer extends React.Component {
  state = {
    createProblemCategoryMode: false,
    isEditDialogOpen: false,
    mutatingProblemCategory: false,
    newProblemCategory: {
      name: null,
      type: null,
    },
    searchProblemCategoryTerm: '',
    selectedProblemCategory: getSelectedProblemCategory(this.props.value),
  };

  handleSelectProblemCategory = problemCategoryClicked => {
    const problemCategory =
      this.state.selectedProblemCategory.id === problemCategoryClicked.id
        ? { id: null, description: null }
        : {
            id: problemCategoryClicked.id,
            description: problemCategoryClicked.description,
          };

    this.props.onChange(problemCategory);
    this.setState({ selectedProblemCategory: problemCategory });
    this.setIsEditDialogOpen(false)();
  };

  handleCreateProblemCategory = async () => {
    const description = computeFullProblemCategoryDescription(
      this.state.newProblemCategory.type,
      this.state.newProblemCategory.name,
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
    this.setState({
      createProblemCategoryMode: false,
      isEditDialogOpen: false,
      mutatingProblemCategory: false,
      searchProblemCategoryTerm: '',
      selectedProblemCategory: newProblemCategory,
    });
    this.props.onChange(newProblemCategory);
  };

  handleSearchProblemCategory = term => {
    this.setState(state => ({
      ...state,
      searchProblemCategoryTerm: term,
      newProblemCategory: { ...state.newProblemCategory, name: term },
    }));
  };

  setIsEditDialogOpen = isEditDialogOpen => () => {
    this.setState({ isEditDialogOpen });
  };

  setCreateProblemCategoryMode = createMode => () => {
    this.setState({ createProblemCategoryMode: createMode });
  };

  setNewProblemCategoryName = name => {
    this.setState(state => ({
      ...state,
      newProblemCategory: { ...state.newProblemCategory, name },
    }));
  };

  setNewProblemCategoryType = type => {
    this.setState(state => ({
      ...state,
      newProblemCategory: { ...state.newProblemCategory, type },
    }));
  };

  render() {
    const problemCategoryDescription =
      this.state.selectedProblemCategory.description || 'Select a problem Category';
    return (
      <Query query={GET_PROBLEM_CATEGORIES}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return 'Unexpected error';
          if (!data.problemCategories) return 'Unexpected error';

          return (
            <ProblemCategoryEditButton
              createProblemCategoryMode={this.state.createProblemCategoryMode}
              handleCreateProblemCategory={this.handleCreateProblemCategory}
              handleSearchProblemCategory={this.handleSearchProblemCategory}
              handleSelectProblemCategory={this.handleSelectProblemCategory}
              isEditDialogOpen={this.state.isEditDialogOpen}
              mutatingProblemCategory={this.state.mutatingProblemCategory}
              newProblemCategory={this.state.newProblemCategory}
              onProblemCategoryChange={this.props.onChange}
              problemCategories={data.problemCategories}
              problemCategoryDescription={problemCategoryDescription}
              searchProblemCategoryTerm={this.state.searchProblemCategoryTerm}
              selectedProblemCategory={this.state.selectedProblemCategory}
              setCreateProblemCategoryMode={this.setCreateProblemCategoryMode}
              setIsEditDialogOpen={this.setIsEditDialogOpen}
              setNewProblemCategoryName={this.setNewProblemCategoryName}
              setNewProblemCategoryType={this.setNewProblemCategoryType}
            />
          );
        }}
      </Query>
    );
  }
}

export default ProblemCategoryEditButtonContainer;
