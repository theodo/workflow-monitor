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

const SELECT_DAILY_PERFORMANCE_HISTORY_QUERY = `
  SELECT date("createdAt") as "creationDay",
  SUM(CASE WHEN "allocatedTime" < "realTime" THEN 1 ELSE 0 END) AS "celerityFailedTicketsCount",
  SUM(CASE WHEN "estimatedTime" < "realTime" THEN 1 ELSE 0 END) AS "casprFailedTicketsCount"
  FROM "tickets"
  WHERE
    "projectId"=:projectId
    AND "createdAt" BETWEEN :startDate AND :endDate
  GROUP BY date("createdAt")
  ORDER BY date("createdAt");
`;

module.exports = {
  upsert,
  SELECT_PROBLEM_CATEGORY_COUNT_QUERY,
  SELECT_DAILY_PERFORMANCE_HISTORY_QUERY,
};
