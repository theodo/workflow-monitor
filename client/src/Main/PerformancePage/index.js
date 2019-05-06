import React from 'react';
import { Query } from 'react-apollo';
import { GET_DAILY_PERFORMANCE_HISTORY } from 'Apollo/Queries/Tickets';
import PerformancePage from './view';

const PerformancePageContainer = () => (
  <Query
    query={GET_DAILY_PERFORMANCE_HISTORY}
    variables={{
      startDate: '2019-04-29',
      endDate: '2019-05-05',
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return 'Unexpected error';
      return <PerformancePage failureHistory={JSON.stringify(data.dailyPerformanceHistory)} />;
    }}
  </Query>
);

export default PerformancePageContainer;
