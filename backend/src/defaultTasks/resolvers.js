const defaultTaskListDB = require('./db');

module.exports = {
  Mutation: {
    saveDefaultTaskList: async (_, { defaultTaskList }, { user }) => {
      const project = user.currentProject;

      const { id, type } = defaultTaskList;

      const persistedDefaultTaskList = await defaultTaskListDB.upsert(
        { id, type, projectId: project.id },
        { id },
      );

      const defaultTasks = defaultTaskList.defaultTasks.map(defaultTask => ({
        ...defaultTask,
        defaultTaskListId: persistedDefaultTaskList.id,
      }));
      await defaultTaskListDB.refreshWithTasks(persistedDefaultTaskList.id, defaultTasks);

      return persistedDefaultTaskList.id;
    },
  },
  Query: {
    defaultTaskLists: (_, args, { user }) => {
      const project = user.currentProject;
      return defaultTaskListDB.getDefaultTaskListsByProject(project.id);
    },
    defaultTaskList: (_, { defaultTaskListId }) => {
      return defaultTaskListDB.getDefaultTaskList(defaultTaskListId);
    },
  },
};
