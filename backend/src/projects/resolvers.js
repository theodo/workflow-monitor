const projectDB = require('./db');

module.exports = {
  Mutation: {
    selectProject: async (_, { project }, { user }) => {
      project.thirdPartyType = 'TRELLO';
      return await projectDB.findOrCreateProject(project, user);
    },
    setCurrentProjectSpeed: async (_, { projectSpeed }, { user }) => {
      const project = user.get('currentProject');
      await projectDB.updateProject(
        projectSpeed.celerity,
        projectSpeed.dailyDevelopmentTime,
        project.id,
      );
      return 1;
    },
  },
};
