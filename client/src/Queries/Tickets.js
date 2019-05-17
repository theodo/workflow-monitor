import gql from 'graphql-tag';

export const GET_TICKETS_HISTORY = gql`
  query GetTicketHistory($pagination: PaginationInput!) {
    tickets(pagination: $pagination) {
      rows {
        id
        createdAt
        description
        thirdPartyId
        complexity
        status
        allocatedTime
        estimatedTime
        realTime
      }
      count
    }
  }
`;

export const GET_TICKET = gql`
  query GetTicket($ticketId: Int!) {
    ticket(ticketId: $ticketId) {
      id
      description
      thirdPartyId
      complexity
      status
      tasks {
        id
        description
        estimatedTime
        realTime
        addedOnTheFly
        problems {
          id
          description
          problemCategory {
            id
            description
          }
        }
      }
    }
  }
`;

export const GET_DAILY_PERFORMANCE_HISTORY = gql`
  query GetDailyPerformanceHistory($startDate: String!, $endDate: String!) {
    dailyPerformanceHistory(startDate: $startDate, endDate: $endDate) {
      creationDay
      celerityFailedTicketsCount
      casprFailedTicketsCount
      overtime
    }
  }
`;
