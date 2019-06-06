import { UseGuards } from '@nestjs/common';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
import { User as CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { TicketService } from './ticket.service';

@Resolver()
export class TicketResolvers {
  constructor(private readonly ticketService: TicketService) {}
  @Query()
  @UseGuards(GraphqlAuthGuard)
  tickets(@CurrentUser() user: User, @Args('pagination') pagination: { limit: any; offset: any }) {
    const project = user.currentProject;
    return this.ticketService.getTicketsByProject(project.id, pagination.limit, pagination.offset);
  }

  @Query()
  @UseGuards(GraphqlAuthGuard)
  dailyPerformanceHistory(
    @CurrentUser() user: User,
    @Args('startDate') startDate,
    @Args('endDate') endDate,
  ) {
    const projectId = user.currentProject.id;
    return this.ticketService.getDailyPerformanceHistory(startDate, endDate, projectId);
  }

  @Query()
  @UseGuards(GraphqlAuthGuard)
  ticket(@Args('ticketId') ticketId) {
    return this.ticketService.getTicket(ticketId);
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  async saveTicket(@CurrentUser() user: User, @Args('state') state) {
    return await this.ticketService.saveTicket(user, state);
  }
}
