const { startTestServer, launchAPIServer } = require('./__utils');
const jwt = require('jsonwebtoken');
const gql = require('graphql-tag');
const { toPromise } = require('apollo-link');
const { db } = require('../');

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

const headers = {
  Authentication:
    'Bearer ' + jwt.sign({ id: userMock.id, trelloId: userMock.trelloId }, 'JWT_SECRET'),
};

describe('API Tickets Tests', () => {
  let graphql, httpServer;

  beforeAll(async done => {
    httpServer = await launchAPIServer();
    db.findUser = jest.fn(() => Promise.resolve(userMock));
    done();
  });

  afterAll(async done => {
    await httpServer.close();
    done();
  });

  beforeEach(async () => {
    const testServer = await startTestServer(headers);
    graphql = testServer.graphql;
  });

  describe('Queries', () => {
    it('fetches daily performance history with 5 failed tickets on one day', async () => {
      db.getDailyPerformanceHistory = jest.fn(() => [
        {
          creationDay: '2019-05-06',
          failedTicketsCount: 5,
        },
      ]);

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
