import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { GET_TICKET } from '../../Queries/Tickets';
import { gqlClient } from '../../Utils/Graphql';
import TicketHistoryPage from './view';
import { UPDATE_TASK } from '../../Queries/Tasks';

const flattenTasks = tasks =>
  tasks.map(task => task.problems && task.problems.length > 0 ?
    {
      ...task,
      problems: task.problems[0].description,
      problemCategory: task.problems[0].problemCategory,
    }
    : {
      ...task,
      problems: null,
      problemCategory: null,
    });

const nestedTask = (task) => ( {
  id: task.id,
  description: task.description,
  estimatedTime: task.estimatedTime,
  realTime: task.realTime,
  addedOnTheFly: task.addedOnTheFly,
  problems: (task.problems || task.problemCategory) && [{
    description: task.problems || '',
    problemCategory: task.problemCategory ? {
      id: task.problemCategory.value || task.problemCategory.id,
      description: task.problemCategory.label || task.problemCategory.description,
    } : null,
  }]
});

class TicketHistoryPageContainer extends Component {
  updateTask = (task) => {
    const nested = nestedTask(task);
    gqlClient
      .mutate({
        mutation: UPDATE_TASK,
        variables: {
          task: nested,
        },
        refetchQueries: [
          { query: GET_TICKET,
            variables: {
              ticketId: this.props.match.params.ticketId,
            }
          },
        ],
      });
  }
  render(){
    return (
      <Query query={GET_TICKET} variables={{
        ticketId: this.props.match.params.ticketId,
      }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return 'Unexpected error';
          const flattenData = {
            ticket: {
              ...data.ticket,
              tasks: flattenTasks(data.ticket.tasks).sort((a, b) => (a.id - b.id)),
            },
          };

          return <TicketHistoryPage loading={loading} ticket={flattenData.ticket} updateTask={this.updateTask} />;
        }}
      </Query>
    );
  }
}



export default TicketHistoryPageContainer;
