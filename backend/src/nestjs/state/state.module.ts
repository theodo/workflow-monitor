import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { StateResolver } from './state.resolver';
import { PubsubService } from './pubsub.service';

@Module({
  imports: [DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [StateResolver, PubsubService],
  exports: [StateResolver],
})
export class StateModule {}
