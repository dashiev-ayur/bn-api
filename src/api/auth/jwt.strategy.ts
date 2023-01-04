/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { configService } from '../../config/config.service';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getJwtSecret(),
    });
  }

  async validate(payload: any, done: VerifiedCallback) {
    const user = await this.authService.userFromPayload(payload);
    if (!user || !user.isActive) {
      return done(
        new HttpException(
          'From token: user not found or user is not active !',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    }
    const { password, ...rest } = user;
    return done(null, rest, payload.iat);
  }
}
