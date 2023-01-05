import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repUser: Repository<User>;
  @Inject()
  private eventEmitter: EventEmitter2;

  async findOne(login) {
    return this.repUser.findOneBy({ login });
  }

  async getAll() {
    return await this.repUser.find();
  }

  async create(body: CreateUserDto) {
    try {
      const user = new User();
      user.name = body.name;
      user.login = body.login;
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(body.password, salt);
      user.password = hashedPassword;
      const result = await this.repUser.save(user);
      this.eventEmitter.emit('user.created', result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async saveRefreshToken(login: string, refreshToken: string) {
    try {
      const user = await this.repUser.findOneBy({ login });
      if (!user) {
        throw new UnauthorizedException('Пользователь не найден !');
      }
      user.refreshToken = refreshToken;
      return await this.repUser.save(user);
    } catch (err) {
      throw err;
    }
  }

  async delete() {
    return await this.repUser.clear();
  }
}
