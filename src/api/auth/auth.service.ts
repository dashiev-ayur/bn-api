/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { configService } from 'src/config/config.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface Payload {
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
      throw new NotAcceptableException('Пользователь не найден !');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (passwordValid) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    if (!user) {
      throw new NotAcceptableException('Пользователь не определен ! !');
    }
    const payload: Payload = { login: user.login, id: user.id };
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
    };
  }

  async checkPayload(payload) {
    const { login, refresh_token } = payload;

    const user = await this.userFromPayload(payload);
    if (!user || !user.isActive) {
      throw new ForbiddenException('Not found active user !');
    }

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied !');

    const tokenValid = refresh_token === user.refreshToken;
    if (!tokenValid) throw new ForbiddenException('Access Denied');

    return user;
  }

  async refreshToken(payload) {
    await this.checkPayload(payload);
    const tokens = await this.login(payload);
    await this.eventEmitter.emit('user.refresh', payload);
    return tokens;
  }

  async logout(payload) {
    const user = await this.checkPayload(payload);
    await this.userService.saveRefreshToken(user.login, null);
    await this.eventEmitter.emit('user.logout', payload);
    return true;
  }

  async userFromPayload(payload: Payload) {
    const { login } = payload;
    return await this.userService.findOne(login);
  }
}
