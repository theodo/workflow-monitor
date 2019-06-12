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
    defaultTasksLists: async (_, args, { user }) => {
      if (!user.currentProject) {
        return [];
      }
      const project = user.currentProject;
      const defaultTasksLists = await this.defaultTasksListDB.getDefaultTasksListsByProject(
        project.id,
      );
      return defaultTasksLists ? defaultTasksLists : [];
    },
    defaultTasksList: (_, { defaultTasksListId }) => {
      return defaultTasksListDB.getDefaultTasksList(defaultTasksListId);
    },
  },
};
