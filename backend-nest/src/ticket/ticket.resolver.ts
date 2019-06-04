import { UseGuards } from '@nestjs/common';
import { Query, Resolver, Mutation } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
import { User as CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { TicketService } from './ticket.service';
import { Ticket } from './ticket.entity';

@Resolver()
export class TicketResolvers {
  constructor(private readonly ticketService: TicketService) {}
  @Query()
  @UseGuards(GraphqlAuthGuard)
  tickets(@CurrentUser() user: User, pagination: { limit: any; offset: any }) {
    // const project = user.currentProject;
    const project = {
      id: 1,
    };
    // TODO: implement after implementing project
    // return this.ticketService.getTicketsByProject(project.id, pagination.limit, pagination.offset);
    return 0;
  }

  @Query()
  @UseGuards(GraphqlAuthGuard)
  dailyPerformanceHistory(@CurrentUser() user: User, { startDate, endDate }) {
    // const projectId = user.currentProject.id;
    const projectId = 1;
    return this.ticketService.getDailyPerformanceHistory(startDate, endDate, projectId);
  }

  @Query()
  @UseGuards(GraphqlAuthGuard)
  ticket(@CurrentUser() user: User, ticketId) {
    return this.ticketService.getTicket(ticketId);
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  async saveTicket(@CurrentUser() user: User, state) {
    return await this.ticketService.saveTicket(user, state);
  }
}
