import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolvers } from './project.resolver';
import { DatabaseModule } from '../database/database.module';
import { projectsProvider } from './project.provider';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [ProjectResolvers, ProjectService, ...projectsProvider],
  exports: [ProjectResolvers, ProjectService, ...projectsProvider],
})
export class ProjectModule {}
