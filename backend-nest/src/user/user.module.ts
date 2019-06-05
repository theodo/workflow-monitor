import { Module, HttpModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolvers } from './user.resolver';
import { DatabaseModule } from '../database/database.module';
import { usersProvider } from './user.provider';
import { PassportModule } from '@nestjs/passport';
import { projectsProvider } from 'src/project/project.provider';

@Module({
  imports: [HttpModule, DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [UserResolvers, UserService, ...usersProvider, ...projectsProvider],
  exports: [UserResolvers, UserService, ...usersProvider],
})
export class UserModule {}
