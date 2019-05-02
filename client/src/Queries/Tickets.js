import gql from 'graphql-tag';

export const GET_TICKETS_HISTORY = gql`
  query GetTicketHistory($pagination: PaginationInput!) {
    tickets(pagination: $pagination) {
      rows {
        id
        description
        thirdPartyId
        complexity
        status
        allocatedTime
        tasks {
          realTime
        }
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
