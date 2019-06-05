import { Module, HttpModule } from '@nestjs/common';
import { DefaultTaskService } from './defaultTask.service';
import { DefaultTaskResolvers } from './defaultTask.resolver';
import { DatabaseModule } from '../database/database.module';
import { defaultTasksProvider } from './defaultTask.provider';
import { PassportModule } from '@nestjs/passport';
import { DefaultTaskListsProvider } from 'src/defaultTaskList/defaultTaskList.provider';

@Module({
  imports: [HttpModule, DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    DefaultTaskResolvers,
    DefaultTaskService,
    ...defaultTasksProvider,
    ...DefaultTaskListsProvider,
  ],
  exports: [DefaultTaskResolvers, DefaultTaskService, ...defaultTasksProvider],
})
export class DefaultTaskModule {}
