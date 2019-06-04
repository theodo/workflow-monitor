import { Injectable, UnauthorizedException, HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly http: HttpService,
    private readonly userDB: UserService,
  ) {}

  login = async req => {
    const trelloToken = req.body.trelloToken;
    // TODO: put this key in an .env file!
    const trelloKey = '0314242ee352e79b01e16d6c79a6dee9';
    const response = await this.http
      .get(`https://api.trello.com/1/members/me?key=${trelloKey}&token=${trelloToken}`)
      .toPromise();
    if (response && response.status === 200) {
      const user = await this.userDB.findOrCreateUser(response.data.id, response.data.fullName);
      const loginView = {
        user,
        jwt: this.jwtService.sign({ id: user.id, trelloId: response.data.id }),
      };
      return loginView;
    } else {
      throw new UnauthorizedException('User not authorized!');
    }
  };

  validateUser = async (payload: JwtPayload) => {
    const user = await this.userDB.findUser(payload.trelloId);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('User not authorized!');
    }
  };
}
