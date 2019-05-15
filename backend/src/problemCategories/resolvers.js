const problemCategoryDB = require('./db');

module.exports = {
  Mutation: {
    addProblemCategory: (_, { problemCategoryDescription }, { user }) => {
      return problemCategoryDB.add(problemCategoryDescription, user.currentProject.id);
    },
  },
  Query: {
    problemCategories: (_, args, { user }) =>
      problemCategoryDB.getAllByProject(user.currentProject.id),

    problemCategoriesWithCount: (_, args, { user }) => {
      const projectId = user.currentProject.id;
      return problemCategoryDB.getWithCount(projectId);
    },
  },
};
