module.exports = `
type Query {
  problemCategories: [ProblemCategory]
  problemCategoriesWithCount: [ProblemCategoryWithCount]
}
type ProblemCategory {
  id: Int
  description: String
}
input ProblemCategoryInput {
  id: Int
  description: String
}
type ProblemCategoryWithCount {
  id: Int
  description: String
  count: Int
}
type Mutation {
  addProblemCategory(problemCategoryDescription: String): ProblemCategory
}
`;
