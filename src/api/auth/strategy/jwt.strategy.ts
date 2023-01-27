/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { configService } from '../../../config/config.service';
import { AuthService, Payload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getJwtSecret(),
    });
  }

  async validate(payload: Payload, done: VerifiedCallback) {
    const user = await this.authService.userFromLogin(payload.login);
    if (!user) {
      return done(
        new HttpException(
          'From token: user not found !',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    }
    if (!user.isActive) {
      return done(
        new HttpException(
          'From token: user not active !',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    }
    const { password, refreshToken, ...rest } = user;
    return done(null, rest);
  }
}
