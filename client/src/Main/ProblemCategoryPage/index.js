import React, { Component } from 'react';
import { Query } from 'react-apollo';

import { gqlClient } from 'Utils/Graphql';

import ProblemCategoryPage from './view';
import {
  GET_PROBLEM_CATEGORIES,
  GET_PROBLEM_CATEGORIES_WITH_COUNT,
  ADD_PROBLEM_CATEGORY,
} from 'Apollo/Queries/Categories';
import { GET_TICKETS_HISTORY } from 'Apollo/Queries/Tickets';

class ProblemCategoryPageContainer extends Component {
  render() {
    return (
      <Query query={GET_PROBLEM_CATEGORIES_WITH_COUNT}>
        {({ loading, error, data }) => {
          if (error) return 'Unexpected error';
          return (
            <ProblemCategoryPageMutationContainer
              loading={loading}
              problemCategories={data.problemCategoriesWithCount}
            />
          );
        }}
      </Query>
    );
  }
}

class ProblemCategoryPageMutationContainer extends Component {
  state = {
    loading: false,
  };
  addProblemCategory = description => {
    this.setState({ loading: true });
    gqlClient
      .mutate({
        mutation: ADD_PROBLEM_CATEGORY,
        variables: {
          description,
        },
        refetchQueries: [
          { query: GET_PROBLEM_CATEGORIES },
          { query: GET_PROBLEM_CATEGORIES_WITH_COUNT },
          { query: GET_TICKETS_HISTORY },
        ],
      })
      .then(() => {
        this.setState({ loading: false });
      });
  };
  render() {
    const { loading: loadingQuery, problemCategories } = this.props;
    const { loading: loadingMutation } = this.state;
    return (
      <ProblemCategoryPage
        loading={loadingQuery || loadingMutation}
        addProblemCategory={this.addProblemCategory}
        problemCategories={problemCategories}
      />
    );
  }
}

export default ProblemCategoryPageContainer;
