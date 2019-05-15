module.exports = `
type Query {
  problemCategories: [ProblemCategory]
  problemCategoriesWithCount: [ProblemCategoryWithCount]
}
type ProblemCategory {
  id: Int
  description: String
  projectId: Int
}
input ProblemCategoryInput {
  id: Int
  description: String
}
type ProblemCategoryWithCount {
  id: Int
  description: String
  count: Int
  projectId: Int
}
type Mutation {
  addProblemCategory(problemCategoryDescription: String): ProblemCategory
}
`;
