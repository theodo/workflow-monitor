import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import { AppModule } from '../src/app/app.module';
import { GraphqlAuthGuard } from '../src/auth/gqlAuthguard';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TicketService } from '../src/ticket/ticket.service';
import { JwtStrategy } from '../src/auth/jwt.strategy';

let loggedInUser: any;
/* tslint:disable */

class GqlAuthGuardMock extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    return super.canActivate(new ExecutionContextHost([req]));
  }

  handleRequest() {
    return loggedInUser;
  }
}

class JwtStrategyMock extends JwtStrategy {
  async validate(payload: any): Promise<any> {
    console.log('yesss');

    return {
      currentProject: {
        id: 1,
      },
    };
  }
}

export class GraphQlClient {
  private app: INestApplication;
  private ticketService: TicketService;

  public async init() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(GraphqlAuthGuard)
      .useClass(GqlAuthGuardMock)
      .overrideProvider(JwtStrategy)
      .useClass(JwtStrategyMock)
      .compile();

    this.app = await module.createNestApplication();

    await this.app.init();
    this.ticketService = this.app.get<TicketService>(TicketService);
  }

  public query(query: any, variables: any, currentUser?: any): Promise<any> {
    loggedInUser = currentUser;
    const dailyPerformanceHistory = [
      {
        creationDay: '2019-05-08',
        celerityFailedTicketsCount: 0,
        casprFailedTicketsCount: 0,
      },
    ];
    jest
      .spyOn(this.ticketService, 'getDailyPerformanceHistory')
      .mockImplementation(async () => dailyPerformanceHistory);

    return new Promise((resolve, reject) => {
      request(this.app.getHttpServer())
        .post('/graphql')
        .send({ query, variables: { ...variables } })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', '')
        .end((err, res) => {
          if (err) {
            console.log(err);
            reject(err);
          }

          resolve(res);
        });
    });
  }
}
