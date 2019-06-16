import { TicketService } from './ticket.service';
import { GraphQlClient } from '../../test/graphql.client';

describe('API Tickets Tests', () => {
  let ticketService: TicketService;
  let graphQLClient: GraphQlClient;

  beforeAll(async () => {
    graphQLClient = new GraphQlClient();

    const app = await graphQLClient.init();
    ticketService = app.get<TicketService>(TicketService);
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
