import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { validate, ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common/exceptions';

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
      // const errors1 = await validate(body);
      // errors1.map((err: ValidationError) => {
      //   console.log('error field>', err.toString());
      // });
      // if (errors1.length > 0) {
      //   throw new BadRequestException('Некорректный запрос !');
      // }
      // throw new BadRequestException('OK !');

      const user = new User();
      user.name = body.name;
      user.login = body.login;
      user.role = body.role;
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(body.password, salt);
      user.password = hashedPassword;
      const errors = await validate(user);

      errors.map((err: ValidationError) => {
        console.log('error field>', err.toString());
      });
      if (errors.length > 0) {
        throw new BadRequestException('Некорректный запрос !');
      }
      const result = await this.repUser.save(user);
      this.eventEmitter.emit('user.created', result);
      return result;
    } catch (err) {
      throw new BadRequestException(err.message);
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

  async activate(val: boolean) {
    try {
      const user = await this.repUser.findOneBy({ login: 'admin' });
      if (!user) {
        throw new UnauthorizedException('Пользователь не найден !');
      }
      user.isActive = val;
      return await this.repUser.save(user);
    } catch (err) {
      throw err;
    }
  }

  async delete() {
    return await this.repUser.clear();
  }
}
