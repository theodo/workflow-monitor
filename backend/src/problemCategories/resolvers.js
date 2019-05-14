const problemCategoryDB = require('./db');

module.exports = {
  Mutation: {
    addProblemCategory: (_, { problemCategoryDescription }) => {
      return problemCategoryDB.add(problemCategoryDescription);
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
