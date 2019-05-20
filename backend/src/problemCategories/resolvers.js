const problemCategoryDB = require('./db');

module.exports = {
  Mutation: {
    addProblemCategory: (_, { problemCategoryDescription }, { user }) => {
      return problemCategoryDB.add(problemCategoryDescription, user.currentProject.id);
    },
    updateProblemCategoryDescription: async (_, { problemCategory }) => {
      await problemCategoryDB.updateDescription(problemCategory.id, problemCategory.description);
      return 1;
    },
  },
  Query: {
    problemCategories: (_, args, { user }) =>
      problemCategoryDB.getAllByProject(user.currentProject.id),

    problemCategoriesWithPareto: (_, { startDate, endDate }, { user }) => {
      const projectId = user.currentProject.id;
      return problemCategoryDB.getCountAndOvertime(projectId, startDate, endDate);
    },
  },
};
