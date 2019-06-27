import copy from 'copy-to-clipboard';
import withDefaultTasks from 'Main/shared/WithDefaultTasks.hoc';
import { withSnackbar } from 'notistack/build';
import { GET_DEFAULT_TASKS_LISTS, SAVE_DEFAULT_TASKS_LIST } from 'Queries/DefaultTasksLists';
import React from 'react';
import { compose } from 'redux';
import { gqlClient } from 'Utils/Graphql';
import { formatDefaultTasksList } from 'Utils/TaskUtils';
import Settings from './view';

const SettingsContainer = ({ enqueueSnackbar, ...rest }) => {
  const handleTasksChange = async (tasksList, type, tasks) => {
    const defaultTasksList = tasksList
      ? {
          // Update List
          id: tasksList.id,
          type,
          defaultTasks: formatDefaultTasksList(tasks),
        }
      : {
          // Create new List
          type,
          defaultTasks: formatDefaultTasksList(tasks),
        };
    try {
      await gqlClient.mutate({
        mutation: SAVE_DEFAULT_TASKS_LIST,
        variables: {
          defaultTasksList,
        },
        refetchQueries: tasksList ? [] : [{ query: GET_DEFAULT_TASKS_LISTS }],
      });
    } catch (e) {
      enqueueSnackbar(e.message, {
        variant: 'error',
      });
    }
  };

  const copyToken = () => {
    copy(localStorage.getItem('jwt_token'));
    alert('Token copied');
  };

  const props = {
    copyToken,
    handleTasksChange,
  };
  return <Settings {...props} {...rest} />;
};

export default compose(
  withDefaultTasks,
  withSnackbar,
)(SettingsContainer);
