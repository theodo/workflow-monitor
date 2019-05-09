const gql = require('graphql-tag');

const {
  startTestServer,
  launchAPIServer,
  toPromise,
  mockAuthenticationMiddleware,
} = require('../testUtils');

jest.mock('./dao'); // Mock database
const db = require('./dao');

const GET_DAILY_PERFORMANCE_HISTORY = gql`
  query GetDailyPerformanceHistory($startDate: String!, $endDate: String!) {
    dailyPerformanceHistory(startDate: $startDate, endDate: $endDate) {
      creationDay
      failedTicketsCount
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

describe('API Tickets Tests', () => {
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
    it('should fetch daily performance history with 5 failed tickets on one day', async () => {
      db.getDailyPerformanceHistory.mockImplementation(async () => dailyPerformanceHistory);
      httpServer = await launchAPIServer();

      const dailyPerformanceHistory = [
        {
          creationDay: '2019-05-06',
          failedTicketsCount: 5,
        },
      ];

      const res = await toPromise(
        graphql({
          query: GET_DAILY_PERFORMANCE_HISTORY,
          variables: { startDate: '2019-04-29', endDate: '2019-07-05' },
        }),
      );

      expect(res.data).toEqual({ dailyPerformanceHistory });
    });
  });
});
