module.exports = `
type Query {
  hello: String!
  currentUser: User
}
type User {
  id: String,
  fullName: String,
  trelloId: String,
  currentProject: Project,
  state: String,
}
`;
