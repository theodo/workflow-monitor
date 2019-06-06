import { Module, HttpModule } from '@nestjs/common';
import { DefaultTaskService } from './defaultTask.service';
import { DefaultTaskResolvers } from './defaultTask.resolver';
import { DatabaseModule } from '../database/database.module';
import { defaultTasksProvider } from './defaultTask.provider';
import { PassportModule } from '@nestjs/passport';
import { DefaultTasksListsProvider } from '../defaultTasksList/defaultTasksList.provider';

@Module({
  imports: [HttpModule, DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    DefaultTaskResolvers,
    DefaultTaskService,
    ...defaultTasksProvider,
    ...DefaultTasksListsProvider,
  ],
  exports: [DefaultTaskResolvers, DefaultTaskService, ...defaultTasksProvider],
})
export class DefaultTaskModule {}
