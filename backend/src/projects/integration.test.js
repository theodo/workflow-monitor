// const gql = require('graphql-tag');

// const {
//   startTestServer,
//   launchAPIServer,
//   toPromise,
//   mockAuthenticationMiddleware,
// } = require('../testUtils');

// jest.mock('./db'); // Mock database
// const db = require('./db');

// const GET_DAILY_PERFORMANCE_HISTORY = gql`
//   query GetDailyPerformanceHistory($startDate: String!, $endDate: String!) {
//     dailyPerformanceHistory(startDate: $startDate, endDate: $endDate) {
//       creationDay
//       celerityFailedTicketsCount
//       casprFailedTicketsCount
//     }
//   }
// `;

// const userMock = {
//   id: '1',
//   fullName: 'John Doe',
//   trelloId: 'TRELLO_ID',
//   currentProject: {
//     id: 1,
//   },
// };

// describe('API Tickets Tests', () => {
//   let graphql, httpServer;

//   beforeEach(async () => {
//     mockAuthenticationMiddleware(userMock);
//     const testServer = await startTestServer();
//     graphql = testServer.graphql;
//   });

//   afterEach(async () => {
//     await httpServer.close();
//   });

//   describe('Queries', () => {
//     it('should fetch daily performance history with 5 failed tickets on one day', async () => {
//       const dailyPerformanceHistory = [
//         {
//           creationDay: '2019-05-08',
//           celerityFailedTicketsCount: 0,
//           casprFailedTicketsCount: 0,
//         },
//       ];

//       db.getDailyPerformanceHistory.mockImplementation(async () => dailyPerformanceHistory);
//       httpServer = await launchAPIServer();

//       const res = await toPromise(
//         graphql({
//           query: GET_DAILY_PERFORMANCE_HISTORY,
//           variables: { startDate: '2019-04-29', endDate: '2019-07-05' },
//         }),
//       );

//       expect(res.data).toEqual({ dailyPerformanceHistory });
//     });
//   });
// });
