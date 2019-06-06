import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { TaskResolvers } from './task.resolver';
import { TaskService } from './task.service';
import { taskProvider } from './task.provider';
import { problemsProvider } from '../problem/problem.provider';

@Module({
  imports: [DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [TaskResolvers, TaskService, ...taskProvider, ...problemsProvider],
  exports: [TaskResolvers, TaskService, ...taskProvider, ...problemsProvider],
})
export class TaskModule {}
