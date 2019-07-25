'use strict';

const SELECT_PROBLEM_CATEGORIES_PROJECT_ID = `
SELECT \`problemCategories\`.id, \`problemCategories\`.\`createdAt\`, \`problemCategories\`.\`description\`, \`problemCategories\`.\`updatedAt\`, \`tickets\`.\`projectId\`
FROM \`problemCategories\`, \`problems\`, \`tasks\`, \`tickets\`
WHERE \`problemCategories\`.id = \`problems\`.\`problemCategoryId\`
AND \`tasks\`.id = \`problems\`.\`taskId\`
AND \`tickets\`.id = \`tasks\`.\`ticketId\`
GROUP BY \`problemCategories\`.id, \`tickets\`.\`projectId\`
`;

const SELECT_PROBLEM_AND_PROBLEM_CATEGORIES_PROJECT_ID = `
SELECT \`problems\`.\`problemCategoryId\`, \`problems\`.id as \`problemId\`, \`problems\`.\`createdAt\`, \`problems\`.\`description\`, \`problems\`.\`taskId\`, \`problems\`.\`updatedAt\`, \`tickets\`.\`projectId\`
FROM \`problemCategories\`, \`problems\`, \`tasks\`, \`tickets\`
WHERE \`problemCategories\`.id = \`problems\`.\`problemCategoryId\`
AND \`tasks\`.id = \`problems\`.\`taskId\`
AND \`tickets\`.id = \`tasks\`.\`ticketId\`
`;

const SELECT_PROBLEMS_WITHOUT_CATEGORIES = `
SELECT * FROM \`problems\` WHERE \`problems\`.\`problemCategoryId\` IS NULL
`;

const DELETE_ALL_PROBLEM_CATEGORIES = `
DELETE FROM \`problemCategories\`
`;

const DELETE_ALL_PROBLEMS = `
DELETE FROM \`problems\`
`;

const SELECT_PROBLEM_CATEGORY_DESCRIPTION_WITH_PROBLEM = `
SELECT \`problems\`.id, \`problemCategories\`.\`description\` as \`problemCategoryDescription\`, \`problems\`.\`createdAt\`, \`problems\`.\`description\`, \`problems\`.\`taskId\`, \`problems\`.\`updatedAt\`
FROM \`problemCategories\`, \`problems\`
WHERE \`problems\`.\`problemCategoryId\` = \`problemCategories\`.id
`;

const SELECT_PROBLEM_CATEGORY_DESCRIPTION = `
SELECT \`problemCategories\`.\`description\`
FROM \`problemCategories\`
GROUP BY \`problemCategories\`.\`description\`
`;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      // Select all problemCategories with their projectIds
      const [problemCategories] = await queryInterface.sequelize.query(
        SELECT_PROBLEM_CATEGORIES_PROJECT_ID,
        { transaction: t },
      );

      // Select all problems related to problemCategories
      const [problemsWithCategories] = await queryInterface.sequelize.query(
        SELECT_PROBLEM_AND_PROBLEM_CATEGORIES_PROJECT_ID,
        { transaction: t },
      );

      // Select all problems with no problemCategories
      const [problemsWithoutCategories] = await queryInterface.sequelize.query(
        SELECT_PROBLEMS_WITHOUT_CATEGORIES,
        { transaction: t },
      );

      // Delete all problems and problemCategories
      await queryInterface.sequelize.query(DELETE_ALL_PROBLEMS, { transaction: t });
      await queryInterface.sequelize.query(DELETE_ALL_PROBLEM_CATEGORIES, { transaction: t });

      // Add Column projectId in problemCategories
      await queryInterface.addColumn(
        'problemCategories',
        'projectId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'projects',
            key: 'id',
          },
        },
        { transaction: t },
      );

      // ReAdd all problemCategories
      if (problemCategories.length > 0) {
        await queryInterface.bulkInsert(
          'problemCategories',
          problemCategories.map((problemCategory, index) => ({
            id: index + 1, // To start with index of 1
            description: problemCategory.description,
            createdAt: problemCategory.createdAt,
            updatedAt: problemCategory.updatedAt,
            projectId: problemCategory.projectId,
          })),
          { transaction: t },
        );
      }

      // ReAdd all problems with the problemCategories
      if (problemsWithCategories.length > 0) {
        await queryInterface.bulkInsert(
          'problems',
          problemsWithCategories.map((problem, index) => ({
            id: index + 1, // To start with index of 1 and not 0
            description: problem.description,
            createdAt: problem.createdAt,
            updatedAt: problem.updatedAt,
            taskId: problem.taskId,
            problemCategoryId:
              problemCategories.findIndex(el => {
                return el.id === problem.problemCategoryId && el.projectId === problem.projectId;
              }) + 1,
          })),
          { transaction: t },
        );
      }

      // ReAdd all problems with no problemCategories
      if (problemsWithoutCategories.length > 0) {
        await queryInterface.bulkInsert(
          'problems',
          problemsWithoutCategories.map(problem => ({
            description: problem.description,
            createdAt: problem.createdAt,
            updatedAt: problem.updatedAt,
            taskId: problem.taskId,
          })),
          { transaction: t },
        );
      }
    });
  },

  down: async queryInterface => {
    return queryInterface.sequelize.transaction(async t => {
      const [problemCategories] = await queryInterface.sequelize.query(
        SELECT_PROBLEM_CATEGORY_DESCRIPTION,
        { transaction: t },
      );
      const [problemsWithCategories] = await queryInterface.sequelize.query(
        SELECT_PROBLEM_CATEGORY_DESCRIPTION_WITH_PROBLEM,
        { transaction: t },
      );
      const [problemsWithoutCategories] = await queryInterface.sequelize.query(
        SELECT_PROBLEMS_WITHOUT_CATEGORIES,
        { transaction: t },
      );
      await queryInterface.sequelize.query(DELETE_ALL_PROBLEMS, { transaction: t });
      await queryInterface.sequelize.query(DELETE_ALL_PROBLEM_CATEGORIES, { transaction: t });
      await queryInterface.removeColumn('problemCategories', 'projectId', { transaction: t });
      if (problemCategories.length > 0) {
        await queryInterface.bulkInsert(
          'problemCategories',
          problemCategories.map((problemCategory, index) => ({
            id: index + 1,
            description: problemCategory.description,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          { transaction: t },
        );
      }
      if (problemsWithCategories.length > 0) {
        await queryInterface.bulkInsert(
          'problems',
          problemsWithCategories.map((problem, index) => ({
            id: index + 1,
            description: problem.description,
            createdAt: problem.createdAt,
            updatedAt: problem.updatedAt,
            taskId: problem.taskId,
            problemCategoryId:
              problemCategories.findIndex(problemCategory => {
                return problemCategory.description === problem.problemCategoryDescription;
              }) + 1,
          })),
          { transaction: t },
        );
      }

      if (problemsWithoutCategories.length > 0) {
        await queryInterface.bulkInsert(
          'problems',
          problemsWithoutCategories.map(problem => ({
            description: problem.description,
            createdAt: problem.createdAt,
            updatedAt: problem.updatedAt,
            taskId: problem.taskId,
          })),
          { transaction: t },
        );
      }
    });
  },
};
