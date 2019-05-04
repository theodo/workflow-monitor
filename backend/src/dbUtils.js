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
  SELECT date("ticketsTime"."createdAt") as "creationDay", count(*) AS "failedTicketsCount"
  FROM(
      SELECT "ticketsTasks"."id", "ticketsTasks"."createdAt", "ticketsTasks"."allocatedTime", sum("ticketsTasks"."realTime") AS "developmentTime"
      FROM(
          SELECT "tickets"."id", "tickets"."createdAt", "allocatedTime", "realTime"
          FROM tickets
          INNER JOIN tasks ON "tasks"."ticketId"="tickets"."id"
          WHERE(
              ("tickets"."createdAt" BETWEEN :startDate AND :endDate)
              AND ("allocatedTime" IS NOT NULL)
              AND "tickets"."projectId"=:projectId
          )
      ) AS "ticketsTasks"
      GROUP BY "ticketsTasks"."id", "ticketsTasks"."createdAt", "ticketsTasks"."allocatedTime"
  ) AS "ticketsTime"
  GROUP BY date("ticketsTime"."createdAt")
  ORDER BY "creationDay" ASC;
`;

module.exports = {
  upsert,
  SELECT_PROBLEM_CATEGORY_COUNT_QUERY,
  SELECT_DAILY_PERFORMANCE_HISTORY_QUERY,
};
