/* eslint-disable @typescript-eslint/no-unused-vars */
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { configService } from 'src/config/config.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface Payload {
  login: string;
  id: number;
}

@Injectable()
export class AuthService {
  @Inject()
  private readonly userService: UserService;
  @Inject()
  private readonly jwtService: JwtService;
  @Inject()
  private eventEmitter: EventEmitter2;

  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.userService.findOne(login);
    if (!user) {
      throw new ForbiddenException('Пользователь не найден !');
    }
    if (!user.isActive) {
      throw new ForbiddenException('Пользователь не активен !');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (passwordValid) {
      return user;
    }
    return null;
  }

  async login(user: Payload) {
    if (!user.id || !user.login) {
      throw new ForbiddenException('Пользователь не определен ! !');
    }
    const payload: Payload = { login: user.login, id: user.id }; // save to jwt
    const secret1 = configService.getJwtSecret();
    const expires1 = configService.getJwtTokenExpires();
    const secret2 = configService.getJwtRefreshSecret();
    const expires2 = configService.getJwtRefreshTokenExpires();

    const access_token = this.jwtService.sign(payload, {
      secret: secret1,
      expiresIn: expires1,
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: secret2,
      expiresIn: expires2,
    });

    // Сохраняем refresh токен в БД
    await this.userService.saveRefreshToken(user.login, refresh_token);
    await this.eventEmitter.emit('user.login', payload);
    return {
      access_token,
      refresh_token,
      user,
    };
  }

  async refreshToken(payload: Payload) {
    const { login } = payload;
    const user = await this.userFromLogin(login);
    const tokens = await this.login(payload);
    await this.eventEmitter.emit('user.refresh', user);
    return {
      ...tokens,
      user,
    };
  }

  async logout(payload: Payload) {
    const { login } = payload;
    await this.userService.saveRefreshToken(login, null);
    await this.eventEmitter.emit('user.logout', payload);
    return true;
  }

  async userFromLogin(login: string) {
    return await this.userService.findOne(login);
  }
}
