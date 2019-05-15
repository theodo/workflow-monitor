const { sequelize } = require('../../models');

const SELECT_PROBLEM_CATEGORY_COUNT_QUERY = `
SELECT "categories".id, "categories"."description", COUNT("problems"."problemCategoryId")
FROM (SELECT * FROM "problemCategories" WHERE "problemCategories"."projectId" = :projectId) AS "categories"
LEFT OUTER JOIN "problems"
ON "categories".id = "problems"."problemCategoryId"
GROUP BY "categories".id, "categories"."description"
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
      replacements: { projectId },
      type: this.db.QueryTypes.SELECT,
    });
  }

  add(description, projectId) {
    return this.model.create({
      description: description,
      projectId: projectId,
    });
  }
}

module.exports = new ProblemCategoryDB(sequelize);
