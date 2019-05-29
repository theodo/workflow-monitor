import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Credentials } from './interfaces/credentials.dto';

const REFRESH_TOKEN = 'refreshToken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('jwt/create')
  async createJwt(@Body() credentials: Credentials, @Res() res): Promise<{ access: string }> {
    const { access, refresh } = await this.authService.checkCredentials(credentials);

    res.cookie('REFRESH_TOKEN', refresh, {
      httpOnly: true,
      secure: true,
    });

    return res.send({ access });
  }

  @Post('jwt/refresh')
  async refreshJwt(@Req() req): Promise<{ access: string }> {
    const access = await this.authService.checkRefreshToken(req.cookies[REFRESH_TOKEN]);

    return { access };
  }
}
