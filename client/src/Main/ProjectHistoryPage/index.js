import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { GET_TICKETS_HISTORY } from 'Apollo/Queries/Tickets';
import ProjectHistoryPage from './view';

class ProjectHistoryPageContainer extends Component {
  goToTicket = ticketId => (window.location.hash = `#/history/${ticketId}`);
  render() {
    return (
      <Query
        query={GET_TICKETS_HISTORY}
        variables={{
          pagination: {
            offset: 0,
            limit: 30,
          },
        }}
        fetchPolicy="network-only"
      >
        {({ loading, error, data, fetchMore }) => {
          if (loading) return 'Loading...';
          if (error) return 'Unexpected error';
          const loadMore = () =>
            fetchMore({
              variables: {
                pagination: {
                  offset: data.tickets.rows.length,
                  limit: 10,
                },
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
                  tickets: {
                    ...prev.tickets,
                    rows: [...prev.tickets.rows, ...fetchMoreResult.tickets.rows],
                  },
                };
              },
            });
          return (
            <ProjectHistoryPage
              goToTicket={this.goToTicket}
              loadMore={loadMore}
              loading={loading}
              tickets={data.tickets}
            />
          );
        }}
      </Query>
    );
  }
}

export default ProjectHistoryPageContainer;
