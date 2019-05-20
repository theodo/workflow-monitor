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
  mutation UpdateProblemCategoryDescription($problemCategory: ProblemCategoryInput!) {
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
  query GetCurrentProjectProblemCategoriesPareto($startDate: String, $endDate: String) {
    problemCategoriesWithPareto(startDate: $startDate, endDate: $endDate) {
      id
      description
      count
      overtime
    }
  }
`;
