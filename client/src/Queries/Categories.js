import gql from 'graphql-tag';

export const ADD_PROBLEM_CATEGORY = gql`
  mutation AddProblemCategory($description: String!) {
    addProblemCategory(problemCategoryDescription: $description) {
      id
      description
    }
  }
`;

export const UPDATE_PROBLEM_CATEGORY_DESCRIPTION = gql`
  mutation UpdateProblemCategoryDescription($problemCategory: ProblemCategory) {
    updateProblemCategoryDescription(problemCategory: $problemCategory)
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
