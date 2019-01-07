function upsert(model, value, condition) {
    return model
        .findOne({ where: condition })
        .then(function(obj) {
            if(obj) { // update
                return obj.update(value);
            }
            else { // insert
                return model.create(value);
            }
        });
    }

const SELECT_PROBLEM_CATEGORY_COUNT_QUERY = `
  SELECT * from "problemCategories" LEFT OUTER JOIN
    ( SELECT tasks."problemCategoryId", COUNT(tasks."problemCategoryId")
      FROM tasks, tickets
      WHERE tasks."ticketId" = tickets.id AND "problemCategoryId" > 0 AND tickets."projectId" = ?
      GROUP BY tasks."problemCategoryId") as "currentProjectCategoriesCount"
  ON ("problemCategories".id = "currentProjectCategoriesCount"."problemCategoryId");
`

module.exports = { upsert, SELECT_PROBLEM_CATEGORY_COUNT_QUERY }
