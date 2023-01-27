/* eslint-disable @typescript-eslint/no-unused-vars */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configService } from 'src/config/config.service';
import { Request } from 'express';
import { AuthService, Payload } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getJwtRefreshSecret(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Payload) {
    const user = await this.authService.userFromLogin(payload.login);
    const refresh_token = req.get('Authorization').replace('Bearer', '').trim();

    if (!user) {
      throw new ForbiddenException('Refresh token: not found user !');
    }
    if (!user.isActive) {
      throw new ForbiddenException('Refresh token: user is not active !');
    }
    if (user.refreshToken !== refresh_token) {
      throw new ForbiddenException('Refresh token: incorrect token !');
    }
    // return { ...payload, refresh_token };
    const { password, refreshToken, ...rest } = user;
    return rest;
  }
}
