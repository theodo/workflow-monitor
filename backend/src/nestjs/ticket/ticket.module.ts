import { Module, HttpModule } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketResolvers } from './ticket.resolver';
import { DatabaseModule } from '../database/database.module';
import { ticketsProvider } from './ticket.provider';
import { PassportModule } from '@nestjs/passport';
import { taskProvider } from '../task/task.provider';
import { TaskService } from '../task/task.service';
import { problemsProvider } from '../problem/problem.provider';

@Module({
  imports: [HttpModule, DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    TicketResolvers,
    TicketService,
    TaskService,
    ...ticketsProvider,
    ...taskProvider,
    ...problemsProvider,
  ],
  exports: [TicketResolvers, TicketService, ...ticketsProvider],
})
export class TicketModule {}
