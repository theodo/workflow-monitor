const { sequelize } = require('../../models');

const SELECT_PROBLEM_CATEGORY_COUNT_QUERY = `
  SELECT "categories".id, "categories"."description", COUNT("problemsWithOvertime"."problemCategoryId"), SUM("problemsWithOvertime"."overtime") as "overTime"
  FROM (SELECT * FROM "problemCategories" WHERE "problemCategories"."projectId" = :projectId) AS "categories"
  LEFT OUTER JOIN (
    SELECT "problems".id, "problems"."problemCategoryId", SUM(CASE WHEN "estimatedTime" < "realTime" THEN "realTime" - "estimatedTime" ELSE 0 END) AS "overtime"
    FROM "tasks", "problems"
    WHERE "problems"."taskId" = "tasks".id
    GROUP BY "problems".id
  ) as "problemsWithOvertime"
  ON "categories".id = "problemsWithOvertime"."problemCategoryId"
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

  getCountAndOvertime(projectId) {
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
