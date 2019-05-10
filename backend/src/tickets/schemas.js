module.exports = `
type Query {
  dailyPerformanceHistory(startDate: String, endDate: String): [DailyTicketPerformance]
  tickets(pagination: PaginationInput): TicketList
  ticket(ticketId: Int): Ticket
}
type DailyTicketPerformance {
  creationDay: String,
  celerityFailedTicketsCount: Int,
  casprFailedTicketsCount: Int,
  overtime: Int
}
type TicketList {
  count: Int
  rows: [Ticket]
}
type Ticket {
  id: Int
  createdAt: String
  description: String
  thirdPartyId: String
  complexity: Int
  status: String
  tasks: [Task]
  allocatedTime: Int
  realTime: Int
}
type Mutation {
  saveTicket(state: String!): Int
  setTicketThirdPartyId(ticketId: Int!, idShort: String!): Int
}
`;
