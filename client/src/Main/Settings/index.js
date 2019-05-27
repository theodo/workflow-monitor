import copy from 'copy-to-clipboard';
import { SAVE_DEFAULT_TASKS_LIST } from 'Queries/DefaultTasksLists';
import React from 'react';
import { gqlClient } from 'Utils/Graphql';
import { formatDefaultTasksList } from 'Utils/TaskUtils';
import Settings from './view';

const handleTasksChange = async (tasksListId, type, tasks) => {
  const defaultTasksList = tasksListId
    ? {
        // Update List
        id: tasksListId,
        type: type,
        defaultTasks: formatDefaultTasksList(tasks),
      }
    : {
        // Create new List
        type,
        defaultTasks: formatDefaultTasksList(tasks),
      };
  await gqlClient.mutate({
    mutation: SAVE_DEFAULT_TASKS_LIST,
    variables: {
      defaultTasksList,
    },
  });
};

const copyToken = () => {
  copy(localStorage.getItem('jwt_token'));
  alert('Token copied');
};

const props = {
  copyToken,
  handleTasksChange,
};

export default () => <Settings {...props} />;
