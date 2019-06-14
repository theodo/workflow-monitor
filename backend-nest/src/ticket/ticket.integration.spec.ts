import { mockServer, makeExecutableSchema } from 'graphql-tools';
// import { importSchema } from 'graphql-import';
import { TicketService } from './ticket.service';
import { TestingModule, Test } from '@nestjs/testing';
import { TicketResolvers } from './ticket.resolver';
import { ticketsProvider } from './ticket.provider';
import { taskProvider } from '../task/task.provider';
import { problemsProvider } from '../problem/problem.provider';
import { TaskService } from '../task/task.service';
import { User } from '../user/user.entity';
import { graphql, GraphQLSchema } from 'graphql';
import { GraphQlClient } from '../../test/graphql.client';

// const schema = importSchema('src/ticket/ticket.graphql');
// const myMockServer = mockServer(schema, {}, true);

// const userMock = new User({
//   // id: 1,
//   fullName: 'John Doe',
//   trelloId: 'TRELLO_ID',
//   currentProject: {
//     id: 1,
//   },
// });

describe('API Tickets Tests', () => {
  let app: TestingModule;
  let ticketService: TicketService;
  let graphQLClient: GraphQlClient;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        TicketService,
        TicketResolvers,
        TaskService,
        ...ticketsProvider,
        ...taskProvider,
        ...problemsProvider,
      ],
    }).compile();
    ticketService = app.get<TicketService>(TicketService);
    graphQLClient = new GraphQlClient();

    await graphQLClient.init();
  });

  describe('Queries', () => {
    it('should fetch daily performance history with 5 failed tickets on one day', async () => {
      const dailyPerformanceHistory = [
        {
          creationDay: '2019-05-08',
          celerityFailedTicketsCount: 0,
          casprFailedTicketsCount: 0,
        },
      ];

      jest
        .spyOn(ticketService, 'getDailyPerformanceHistory')
        .mockImplementation(async () => dailyPerformanceHistory);

      // const res = await myMockServer.query(
      //   `{
      //   dailyPerformanceHistory(startDate: $startDate, endDate: $endDate) {
      //     creationDay
      //     celerityFailedTicketsCount
      //     casprFailedTicketsCount
      //   }
      // }`,
      //   { startDate: '2019-04-29', endDate: '2019-07-05' },
      // );

      const user = { fullName: 'Debora' };

      const query = `query GetDailyPerformanceHistory($startDate: String!, $endDate: String!) {
        dailyPerformanceHistory(startDate: $startDate, endDate: $endDate) {
          creationDay
          celerityFailedTicketsCount
          casprFailedTicketsCount
        }
      }`;

      const response = await graphQLClient.query(
        query,
        {
          startDate: '2019-04-29',
          endDate: '2019-06-05',
        },
        {
          currentProject: {
            id: 3,
          },
        },
      );

      expect(response.body.data.dailyPerformanceHistory).toEqual(dailyPerformanceHistory);
    });
  });
});
