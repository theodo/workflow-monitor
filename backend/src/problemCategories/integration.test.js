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
      const problemCategories = [
        {
          id: 0,
          projectId: 1,
          description: 'Problem Description 1',
        },
        {
          id: 1,
          projectId: 1,
          description: 'Problem Description 2',
        },
      ];

      db.getWithCount.mockImplementation(async () => problemCategories);
      httpServer = await launchAPIServer();

      const res = await toPromise(
        graphql({
          query: GET_CURRENT_PROJECT_PROBLEM_CATEGORIES,
        }),
      );

      expect(res.data).toEqual({ problemCategories });
    });
  });
});
