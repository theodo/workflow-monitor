import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Req() req): Promise<{ user: User; jwt: string }> {
    // tslint:disable-next-line: no-console
    console.log('Login');
    return await this.authService.login(req);
  }
}
