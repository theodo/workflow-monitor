import React, { Component } from 'react';
import { GET_TICKET } from 'Queries/Tickets';
import { gqlClient } from 'Utils/Graphql';
import TicketResultsTable from './view';
import { UPDATE_TASK } from 'Queries/Tasks';
import { WithTicketData } from 'Main/shared';

const nestedTask = (task, ticketId) => ({
  id: task.id,
  description: task.description,
  estimatedTime: task.estimatedTime,
  realTime: task.realTime,
  addedOnTheFly: task.addedOnTheFly,
  problems: (task.problems || task.problemCategory) && [
    {
      description: task.problems || '',
      problemCategory: task.problemCategory
        ? {
            id: task.problemCategory.id || task.problemCategory.value,
            description: task.problemCategory.description || task.problemCategory.label,
          }
        : null,
    },
  ],
  ticketId,
});

class TicketResultsTableContainer extends Component {
  updateTask = task => {
    const nested = nestedTask(task, this.props.ticketId);

    gqlClient.mutate({
      mutation: UPDATE_TASK,
      variables: {
        task: nested,
      },
      refetchQueries: [
        {
          query: GET_TICKET,
          variables: {
            ticketId: this.props.ticketId,
          },
        },
      ],
    });
  };
  render() {
    const TicketResultsTableWithData = WithTicketData(TicketResultsTable, this.props.ticketId);

    return <TicketResultsTableWithData updateTask={this.updateTask} />;
  }
}

export default TicketResultsTableContainer;
