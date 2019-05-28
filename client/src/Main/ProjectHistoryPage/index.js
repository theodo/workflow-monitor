import React from 'react';
import { Query } from 'react-apollo';
import { GET_TICKETS_HISTORY } from '../../Queries/Tickets';
import ProjectHistoryPage from './view';
import LoadingSpinner from '../../Components/LoadingSpinner';
import { gqlClient } from 'Utils/Graphql';
import { GET_PROJECT_PERFORMANCE_TYPE } from 'Queries/Projects';
import { SET_PROJECT_PERFORMANCE_TYPE } from 'Queries/Projects';

class ProjectHistoryPageContainer extends React.Component {
  state = {
    performanceType: 'CASPR_TIME',
  };

  componentWillMount = async () => {
    const response = await gqlClient.query({
      query: GET_PROJECT_PERFORMANCE_TYPE,
    });
    this.setState({ performanceType: response.data.getProjectPerformanceType });
  };

  setPerformanceType = performanceType => {
    this.setState({ performanceType });

    gqlClient.mutate({
      mutation: SET_PROJECT_PERFORMANCE_TYPE,
      variables: {
        projectPerformanceType: performanceType,
      },
      refetchQueries: [{ query: GET_PROJECT_PERFORMANCE_TYPE }],
    });
  };

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
          if (loading) return <LoadingSpinner />;
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
              performanceType={this.state.performanceType}
              setPerformanceType={this.setPerformanceType}
            />
          );
        }}
      </Query>
    );
  }
}

export default ProjectHistoryPageContainer;
