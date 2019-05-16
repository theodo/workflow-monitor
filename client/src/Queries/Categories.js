import gql from 'graphql-tag';

export const ADD_PROBLEM_CATEGORY = gql`
  mutation AddProblemCategory($description: String!) {
    addProblemCategory(problemCategoryDescription: $description) {
      id
      description
    }
  }
`;

export const GET_PROBLEM_CATEGORIES = gql`
  {
    problemCategories {
      id
      description
    }
  }
`;

export const GET_PROBLEM_CATEGORIES_PARETO = gql`
  {
    problemCategoriesWithPareto {
      id
      description
      count
      overtime
    }
  }
`;
