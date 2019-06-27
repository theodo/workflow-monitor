import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { StateResolver } from './state.resolver';
import { pubSubProvider } from './pubsub.provider';

@Module({
  imports: [DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [StateResolver, ...pubSubProvider],
  exports: [StateResolver, ...pubSubProvider],
})
export class StateModule {}
