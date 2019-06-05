import { Module, HttpModule } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketResolvers } from './ticket.resolver';
import { DatabaseModule } from '../database/database.module';
import { ticketsProvider } from './ticket.provider';
import { PassportModule } from '@nestjs/passport';
import { taskProvider } from '../task/task.provider';
import { TaskService } from 'src/task/task.service';

@Module({
  imports: [HttpModule, DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [TicketResolvers, TicketService, TaskService, ...ticketsProvider, ...taskProvider],
  exports: [TicketResolvers, TicketService, ...ticketsProvider],
})
export class TicketModule {}
