import React from 'react';
import { Query } from 'react-apollo';
import LoadingSpinner from 'Components/LoadingSpinner';
import { GET_DEFAULT_TASKS_LISTS } from 'Queries/DefaultTasksLists';
import { getFirstList } from 'Utils/TaskUtils';

const withDefaultTasks = WrappedComponent => props => (
  <Query query={GET_DEFAULT_TASKS_LISTS} fetchPolicy="cache-and-network">
    {({ loading, error, data }) => {
      if (loading) return <LoadingSpinner size={50} />;
      if (error) return 'Unexpected error';
      if (!data.defaultTasksLists) return 'Unexpected error';
      const beginningTasksList = data.defaultTasksLists
        .filter(defaultTasksList => defaultTasksList.type === 'BEGINNING')
        .reduce(getFirstList, { defaultTasksList: null, tasks: [] });
      const endTasksList = data.defaultTasksLists
        .filter(defaultTasksList => defaultTasksList.type === 'END')
        .reduce(getFirstList, { defaultTasksList: null, tasks: [] });
      return <WrappedComponent {...{ beginningTasksList }} {...{ endTasksList }} {...props} />;
    }}
  </Query>
);

export default withDefaultTasks;
