const { sequelize } = require('../../models');

const SELECT_PROBLEM_CATEGORY_COUNT_AND_OVERTIME_QUERY = `
  SELECT "categories".id, "categories"."description", COUNT("problemsWithOvertime"."problemCategoryId"),
  SUM("problemsWithOvertime"."overtime") as "overtime"
  FROM (SELECT * FROM "problemCategories" WHERE "problemCategories"."projectId" = :projectId) AS "categories"
  INNER JOIN (
    SELECT "problems".id, "problems"."problemCategoryId", "tasks"."realTime" - "tasks"."estimatedTime" AS "overtime"
    FROM "tasks", "problems"
    WHERE "problems"."taskId" = "tasks".id AND "tasks"."estimatedTime" < "tasks"."realTime" 
    AND "tasks"."createdAt" > :startDate AND "tasks"."createdAt" < :endDate
  ) as "problemsWithOvertime"
  ON "categories".id = "problemsWithOvertime"."problemCategoryId"
  GROUP BY "categories".id, "categories"."description"
  ORDER BY "overtime" DESC
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

  getCountAndOvertime(projectId, startDate, endDate) {
    startDate = startDate ? startDate : new Date(0);
    endDate = endDate ? endDate : new Date();
    return this.db.query(SELECT_PROBLEM_CATEGORY_COUNT_AND_OVERTIME_QUERY, {
      replacements: { projectId, startDate, endDate },
      type: this.db.QueryTypes.SELECT,
    });
  }

  add(description, projectId) {
    return this.model.create({
      description: description,
      projectId: projectId,
    });
  }

  updateDescription(problemCategoryId, description) {
    return this.model.update({ description: description }, { where: { id: problemCategoryId } });
  }
}

module.exports = new ProblemCategoryDB(sequelize);
