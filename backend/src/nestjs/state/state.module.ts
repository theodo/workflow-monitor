import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { StateResolver } from './state.resolver';

@Module({
  imports: [DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [StateResolver],
  exports: [StateResolver],
})
export class StateModule {}
