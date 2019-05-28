module.exports = `
type Query {
  dailyPerformanceHistory(startDate: String, endDate: String): [DailyTicketPerformance]
  tickets(pagination: PaginationInput): TicketList
  ticket(ticketId: Int): Ticket
}

type Project {
  id: Int
  name: String
  dailyDevelopmentTime: Int
  celerity: Float
  thirdPartyType: String
  thirdPartyId: String
  performanceType: String
}
input ProjectInput {
  name: String
  thirdPartyId: String
}
input ProjectSpeedInput {
  celerity: Float
  dailyDevelopmentTime: Int
}
type Mutation {
  selectProject(project: ProjectInput): Project,
  setCurrentProjectSpeed(projectSpeed: ProjectSpeedInput!): Int
}

`;
