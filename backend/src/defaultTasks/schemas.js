module.exports = `
type Query {
  defaultTaskLists: [DefaultTaskList]
  defaultTaskList(defaultTaskListId: Int): DefaultTaskList
}
type DefaultTaskList {
  id: Int
  type: String
  defaultTasks: [DefaultTask]
}
type DefaultTask {
    id: Int
    description: String
    estimatedTime: Int
}
input DefaultTaskListDTO {
  id: Int
  type: String
  defaultTasks: [DefaultTaskDTO]
}
input DefaultTaskDTO {
    description: String
    estimatedTime: Int
}
type Mutation {
  saveDefaultTaskList(defaultTaskList: DefaultTaskListDTO): Int
}
`;
