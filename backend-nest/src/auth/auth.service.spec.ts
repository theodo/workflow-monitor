import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { HttpService, HttpModule } from '@nestjs/common/http';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common/exceptions';

class UserServiceMock {
  async findOrCreateUser(userTrelloId: string, fullName: string) {
    return {
      id: 1,
      fullName,
      trelloId: userTrelloId,
    };
  }
}

describe('AuthService', () => {
  let app: TestingModule;
  let authService: AuthService;
  let httpService: HttpService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const UserServiceProvider = {
      provide: UserService,
      useClass: UserServiceMock,
    };
    app = await Test.createTestingModule({
      imports: [
        HttpModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      providers: [AuthService, UserServiceProvider],
    }).compile();
    authService = app.get<AuthService>(AuthService);
    httpService = app.get<HttpService>(HttpService);
    jwtService = app.get<JwtService>(JwtService);
  });

  describe('login', () => {
    // it('should send user and jwt token if user is valid', async () => {
    //   const req = {
    //     body: { trelloToken: 'validTrelloTokenMock' },
    //   };
    //   const response: AxiosResponse = {
    //     data: {
    //       id: 'id',
    //       fullName: 'Jane Doe',
    //     },
    //     status: 200,
    //     statusText: 'OK',
    //     headers: {},
    //     config: {},
    //   };

    //   const user = {
    //     id: 1,
    //     fullName: 'Jane Doe',
    //     trelloId: 'id',
    //   };

    //   const loginView = {
    //     user,
    //     jwt: 'jwt_mock',
    //   };

    //   jest.spyOn(jwtService, 'sign').mockImplementationOnce(() => 'jwt_mock');
    //   jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));

    //   const loginRes = await authService.login(req);
    //   expect(loginRes).toEqual(loginView);
    // });

    it('should not send user and jwt token if user is not valid', async () => {
      const req = {
        body: { trelloToken: 'invalidTrelloTokenMock' },
      };
      jest.spyOn(jwtService, 'sign').mockImplementationOnce(() => 'jwt_mock');
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));

      const response: AxiosResponse = {
        data: {},
        status: 400,
        statusText: '',
        headers: {},
        config: {},
      };

      expect(async () => await authService.login(req)).toThrow(UnauthorizedException);
    });
  });
});
