const projectDB = require('./db');

module.exports = {
  Mutation: {
    selectProject: (_, { project }, { user }) => {
      project.thirdPartyType = 'TRELLO';
      return projectDB.findOrCreateProject(project, user);
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
    setProjectPerformanceType: async (_, { projectPerformanceType }, { user }) => {
      const project = user.get('currentProject');
      await projectDB.setProjectPerformanceType(projectPerformanceType, project.id);
      return 1;
    },
  },
  Query: {
    getProjectPerformanceType: (_, args, { user }) => {
      const project = user.currentProject;
      return project.performanceType;
    },
  },
};
