function upsert(model, value, condition) {
  return model.findOne({ where: condition }).then(function(obj) {
    if (obj) {
      // update
      return obj.update(value);
    } else {
      // insert
      return model.create(value);
    }
  });
}

const SELECT_PROBLEM_CATEGORY_COUNT_QUERY = `
  SELECT * from "problemCategories" LEFT OUTER JOIN
    ( SELECT problems."problemCategoryId", COUNT(problems."problemCategoryId")
      FROM tasks, tickets, problems
      WHERE tasks."ticketId" = tickets.id AND tasks.id = problems."taskId" AND problems."problemCategoryId" > 0 AND tickets."projectId" = ?
      GROUP BY problems."problemCategoryId") as "currentProjectCategoriesCount"
  ON ("problemCategories".id = "currentProjectCategoriesCount"."problemCategoryId");
`;

module.exports = {
  upsert,
  SELECT_PROBLEM_CATEGORY_COUNT_QUERY,
};
