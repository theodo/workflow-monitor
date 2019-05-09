const {
  startTestServer,
  launchAPIServer,
  toPromise,
  mockAuthenticationMiddleware,
} = require('../testUtils');
const gql = require('graphql-tag');

const GET_DAILY_PERFORMANCE_HISTORY = gql`
  query GetDailyPerformanceHistory($startDate: String!, $endDate: String!) {
    dailyPerformanceHistory(startDate: $startDate, endDate: $endDate) {
      creationDay
      failedTicketsCount
    }
  }
`;

jest.mock('./dao', () => ({
  getDailyPerformanceHistory: async () => {
    return [
      {
        creationDay: '2019-05-06',
        failedTicketsCount: 5,
      },
    ];
  },
}));

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

  beforeAll(async done => {
    mockAuthenticationMiddleware(userMock);
    httpServer = await launchAPIServer();
    done();
  });

  afterAll(async done => {
    await httpServer.close();
    done();
  });

  beforeEach(async () => {
    const testServer = await startTestServer();
    graphql = testServer.graphql;
  });

  describe('Queries', () => {
    it('should fetch daily performance history with 5 failed tickets on one day', async () => {
      const res = await toPromise(
        graphql({
          query: GET_DAILY_PERFORMANCE_HISTORY,
          variables: { startDate: '2019-04-29', endDate: '2019-07-05' },
        }),
      );

      expect(res.data).toEqual({
        dailyPerformanceHistory: [
          {
            creationDay: '2019-05-06',
            failedTicketsCount: 5,
          },
        ],
      });
    });
  });
});
