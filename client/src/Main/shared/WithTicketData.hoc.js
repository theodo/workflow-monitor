import React from 'react';
import { Query } from 'react-apollo';
import { GET_TICKET } from 'Queries/Tickets';
import LoadingSpinner from 'Components/LoadingSpinner';

const flattenTasks = tasks =>
  tasks.map(task =>
    task.problems && task.problems.length > 0
      ? {
          ...task,
          problems: task.problems[0].description,
          problemCategory: task.problems[0].problemCategory,
        }
      : {
          ...task,
          problems: null,
          problemCategory: null,
        },
  );

const withTicketData = (WrappedComponent, ticketId) => props => (
  <Query
    query={GET_TICKET}
    variables={{
      ticketId: ticketId,
    }}
    fetchPolicy="cache-and-network"
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingSpinner />;
      if (error) return 'Unexpected error';
      const flattenData = {
        ticket: {
          ...data.ticket,
          tasks: flattenTasks(data.ticket.tasks).sort((a, b) => a.id - b.id),
        },
      };

      return <WrappedComponent ticketData={flattenData.ticket} {...props} />;
    }}
  </Query>
);

export default withTicketData;
