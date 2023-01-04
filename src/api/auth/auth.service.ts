/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';

interface Payload {
  login: string;
  id: number;
}

@Injectable()
export class AuthService {
  @Inject()
  private readonly userService: UserService;
  @Inject()
  private jwtService: JwtService;

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

  async getToken(user: User) {
    if (!user) {
      throw new NotAcceptableException('Пользователь не определен ! !');
    }
    const payload: Payload = { login: user.login, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async userFromPayload(payload: Payload) {
    const { login } = payload;
    return await this.userService.findOne(login);
  }
}
