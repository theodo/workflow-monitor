import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { gqlClient } from '../../Utils/Graphql';
import ProblemCategoryPage from './design';

const ADD_PROBLEM_CATEGORY = gql`
  mutation AddProblemCategory($description: String!) {
    addProblemCategory(problemCategoryDescription: $description) {
      id
      description
    }
  }
`;

const GET_PROBLEM_CATEGORIES = gql`
  {
    problemCategoriesWithCount {
      id
      description
      count
    }
  }
`;

class ProblemCategoryPageContainer extends Component {
  render(){
    return (
      <Query query={GET_PROBLEM_CATEGORIES}>
        {({ loading, error, data, refetch }) => {
          if (error) return 'Unexpected error';
          return <ProblemCategoryPageMutationContainer refetch={refetch} loading={loading} problemCategories={data.problemCategoriesWithCount}/>;
        }}
      </Query>
    );
  }
}

class ProblemCategoryPageMutationContainer extends Component {
  state = {
    loading: false,
  }
  addProblemCategory = (description) => {
    this.setState({loading: true});
    gqlClient
      .mutate({
        mutation: ADD_PROBLEM_CATEGORY,
        variables: {
          description,
        }
      })
      .then(() => {
        this.props.refetch();
        this.setState({loading: false});
      });
  }
  render(){
    const { loading: loadingQuery, problemCategories } = this.props;
    const { loading: loadingMutation } = this.state;
    return <ProblemCategoryPage
      loading={loadingQuery || loadingMutation}
      addProblemCategory={this.addProblemCategory}
      problemCategories={problemCategories}
    />;
  }
}

export default ProblemCategoryPageContainer;
