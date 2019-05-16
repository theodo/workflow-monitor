module.exports = `
type Query {
  problemCategories: [ProblemCategory]
  problemCategoriesWithPareto: [ProblemCategoryPareto]
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
type ProblemCategoryPareto {
  id: Int
  description: String
  count: Int
  overtime: Int
  projectId: Int
}
type Mutation {
  addProblemCategory(problemCategoryDescription: String): ProblemCategory
}
`;
