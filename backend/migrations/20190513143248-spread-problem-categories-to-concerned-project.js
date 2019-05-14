'use strict';

const SELECT_PROBLEM_CATEGORIES_PROJECT_ID = `
  SELECT "problemCategories".id, "problemCategories"."createdAt", "problemCategories"."description", "problemCategories"."updatedAt", "tickets"."projectId"
  FROM "problemCategories", "problems", "tasks", "tickets"
  WHERE "problemCategories".id = "problems"."problemCategoryId"
  AND "tasks".id = "problems"."taskId"
  AND "tickets".id = "tasks"."ticketId"
  GROUP BY "problemCategories".id, "tickets"."projectId"
`;

const SELECT_PROBLEM_AND_PROBLEM_CATEGORIES_PROJECT_ID = `
  SELECT "problems"."problemCategoryId", "problems".id as "problemId", "problems"."createdAt", "problems"."description", "problems"."taskId", "problems"."updatedAt", "tickets"."projectId"
  FROM "problemCategories", "problems", "tasks", "tickets"
  WHERE "problemCategories".id = "problems"."problemCategoryId"
  AND "tasks".id = "problems"."taskId"
  AND "tickets".id = "tasks"."ticketId"
`;

const DELETE_ALL_PROBLEM_CATEGORIES = `
  DELETE FROM "problemCategories"
`;

const DELETE_ALL_PROBLEMS = `
  DELETE FROM "problems"
`;

const SELECT_PROBLEM_CATEGORY_DESCRIPTION_WITH_PROBLEM = `
  SELECT "problems".id, "problemCategories"."description" as "problemCategoryDescription", "problems"."createdAt", "problems"."description", "problems"."taskId", "problems"."updatedAt"
  FROM "problemCategories", "problems"
  WHERE "problems"."problemCategoryId" = "problemCategories".id
`;

const SELECT_PROBLEM_CATEGORY_DESCRIPTION = `
  SELECT "problemCategories"."description"
  FROM "problemCategories"
  GROUP BY "problemCategories"."description"
`;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      const [problemCategories] = await queryInterface.sequelize.query(
        SELECT_PROBLEM_CATEGORIES_PROJECT_ID,
      );
      const [problems] = await queryInterface.sequelize.query(
        SELECT_PROBLEM_AND_PROBLEM_CATEGORIES_PROJECT_ID,
        { transaction: t },
      );

      await queryInterface.sequelize.query(DELETE_ALL_PROBLEMS, { transaction: t });
      await queryInterface.sequelize.query(DELETE_ALL_PROBLEM_CATEGORIES, { transaction: t });

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

      await queryInterface.bulkInsert(
        'problemCategories',
        problemCategories.map((problemCategory, index) => ({
          id: index,
          description: problemCategory.description,
          createdAt: problemCategory.createdAt,
          updatedAt: problemCategory.updatedAt,
          projectId: problemCategory.projectId,
        })),
        { transaction: t },
      );

      await queryInterface.bulkInsert(
        'problems',
        problems.map((problem, index) => ({
          id: index,
          description: problem.description,
          createdAt: problem.createdAt,
          updatedAt: problem.updatedAt,
          taskId: problem.taskId,
          problemCategoryId: problemCategories.findIndex(el => {
            return el.id === problem.problemCategoryId && el.projectId === problem.projectId;
          }),
        })),
        { transaction: t },
      );
    });
  },

  down: async queryInterface => {
    return queryInterface.sequelize.transaction(async t => {
      const [problemCategories] = await queryInterface.sequelize.query(
        SELECT_PROBLEM_CATEGORY_DESCRIPTION,
        { transaction: t },
      );
      const [problems] = await queryInterface.sequelize.query(
        SELECT_PROBLEM_CATEGORY_DESCRIPTION_WITH_PROBLEM,
        { transaction: t },
      );

      await queryInterface.sequelize.query(DELETE_ALL_PROBLEMS, { transaction: t });
      await queryInterface.sequelize.query(DELETE_ALL_PROBLEM_CATEGORIES, { transaction: t });

      await queryInterface.removeColumn('problemCategories', 'projectId', { transaction: t });

      await queryInterface.bulkInsert(
        'problemCategories',
        problemCategories.map((problemCategory, index) => ({
          id: index,
          description: problemCategory.description,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction: t },
      );

      await queryInterface.bulkInsert(
        'problems',
        problems.map((problem, index) => ({
          id: index,
          description: problem.description,
          createdAt: problem.createdAt,
          updatedAt: problem.updatedAt,
          taskId: problem.taskId,
          problemCategoryId: problemCategories.findIndex(problemCategory => {
            return problemCategory.description === problem.problemCategoryDescription;
          }),
        })),
        { transaction: t },
      );
    });
  },
};
