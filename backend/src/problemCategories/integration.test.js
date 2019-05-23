const gql = require('graphql-tag');

const {
  startTestServer,
  launchAPIServer,
  toPromise,
  mockAuthenticationMiddleware,
} = require('../testUtils');

jest.mock('./db'); // Mock database
const db = require('./db');

const GET_CURRENT_PROJECT_PROBLEM_CATEGORIES = gql`
  {
    problemCategories {
      id
      description
      problemCount
    }
  }
`;

const GET_CURRENT_PROJECT_PROBLEM_CATEGORIES_PARETO = gql`
  query GetCurrentProjectProblemCategoriesPareto($startDate: String, $endDate: String) {
    problemCategoriesWithPareto(startDate: $startDate, endDate: $endDate) {
      id
      description
      count
      overtime
    }
  }
`;

const ADD_PROBLEM_CATEGORY = gql`
  mutation AddProblemCategory($description: String!) {
    addProblemCategory(problemCategoryDescription: $description) {
      id
      description
    }
  }
`;

const userMock = {
  id: '1',
  fullName: 'John Doe',
  trelloId: 'TRELLO_ID',
  currentProject: {
    id: 1,
  },
};

describe('API problemCategories Tests', () => {
  let graphql, httpServer;

  beforeEach(async () => {
    mockAuthenticationMiddleware(userMock);
    const testServer = await startTestServer();
    graphql = testServer.graphql;
  });

  afterEach(async () => {
    await httpServer.close();
  });

  describe('Queries', () => {
    it('should fetch all the problem categories of the current project', async () => {
      const mockGetAllByProject = [
        {
          dataValues: {
            id: 0,
            description: 'Problem Description 1',
            problemCount: 2,
          },
        },
        {
          dataValues: {
            id: 1,
            description: 'Problem Description 2',
            problemCount: 0,
          },
        },
      ];
      const problemCategories = [
        {
          id: 0,
          description: 'Problem Description 1',
          problemCount: 2,
        },
        {
          id: 1,
          description: 'Problem Description 2',
          problemCount: 0,
        },
      ];

      db.getAllByProject.mockImplementation(async () => mockGetAllByProject);
      httpServer = await launchAPIServer();

      const res = await toPromise(
        graphql({
          query: GET_CURRENT_PROJECT_PROBLEM_CATEGORIES,
        }),
      );

      expect(res.data).toEqual({ problemCategories });
    });
    it('should fetch all the problem categories of the current project with count an overtime for pareto', async () => {
      const problemCategoriesWithPareto = [
        {
          id: 0,
          description: 'Tools / problem 2',
          count: 1,
          overtime: 10,
        },
        {
          id: 80,
          description: 'A new Category',
          overtime: 0,
          count: null,
        },
      ];

      db.getCountAndOvertime.mockImplementation(async () => problemCategoriesWithPareto);
      httpServer = await launchAPIServer();

      const res = await toPromise(
        graphql({
          query: GET_CURRENT_PROJECT_PROBLEM_CATEGORIES_PARETO,
        }),
      );

      expect(res.data).toEqual({ problemCategoriesWithPareto });
    });
  });

  describe('Mutations', () => {
    it('should add a problem category with the current project id', async () => {
      const problemCategory = {
        description: 'A new Problem',
      };
      db.add.mockImplementation();
      httpServer = await launchAPIServer();

      await toPromise(
        graphql({
          query: ADD_PROBLEM_CATEGORY,
          variables: problemCategory,
        }),
      );

      expect(db.add).toBeCalledWith(problemCategory.description, userMock.currentProject.id);
    });
  });
});
