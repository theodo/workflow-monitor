const defaultTasksListDB = require('./db');

module.exports = {
  Mutation: {
    saveDefaultTasksList: async (_, { defaultTasksList }, { user }) => {
      const project = user.currentProject;

      const { id, defaultTasks, ...rest } = defaultTasksList;

      const persistedDefaultTasksList = await defaultTasksListDB.upsert(
        { id, ...rest, projectId: project.id },
        { id },
      );

      const formatedDefaultTasks = defaultTasks.map(defaultTask => ({
        ...defaultTask,
        defaultTasksListId: persistedDefaultTasksList.id,
      }));
      await defaultTasksListDB.refreshWithTasks(persistedDefaultTasksList.id, formatedDefaultTasks);

      return persistedDefaultTasksList.id;
    },
  },
  Query: {
    defaultTasksLists: (_, args, { user }) => {
      const project = user.currentProject;
      return defaultTasksListDB.getDefaultTasksListsByProject(project.id);
    },
    defaultTasksList: (_, { defaultTasksListId }) => {
      return defaultTasksListDB.getDefaultTasksList(defaultTasksListId);
    },
  },
};
