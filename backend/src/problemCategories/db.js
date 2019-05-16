const { sequelize } = require('../../models');

const SELECT_PROBLEM_CATEGORY_COUNT_QUERY = `
  SELECT * from "problemCategories" LEFT OUTER JOIN
    ( SELECT problems."problemCategoryId", COUNT(problems."problemCategoryId")
      FROM tasks, tickets, problems
      WHERE tasks."ticketId" = tickets.id AND tasks.id = problems."taskId" AND problems."problemCategoryId" > 0 AND tickets."projectId" = ?
      GROUP BY problems."problemCategoryId") as "currentProjectCategoriesCount"
  ON ("problemCategories".id = "currentProjectCategoriesCount"."problemCategoryId");
`;

class ProblemCategoryDB {
  constructor(db) {
    this.db = db;
    this.model = this.db.models.problemCategory;
  }

  getAll() {
    return this.model.findAll();
  }

  getAllByProject(projectId) {
    return this.model.findAll({ where: { projectId } });
  }

  getWithCount(projectId) {
    return this.db.query(SELECT_PROBLEM_CATEGORY_COUNT_QUERY, {
      replacements: [projectId],
      type: this.db.QueryTypes.SELECT,
    });
  }

  add(description, projectId) {
    return this.db.create({
      description: description,
      projectId,
    });
  }
}

module.exports = new ProblemCategoryDB(sequelize);
