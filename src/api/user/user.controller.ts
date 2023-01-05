import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@ApiTags('Пользователи')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Get()
  @ApiOperation({ summary: 'Получение всех пользователей' })
  getAll() {
    return this.userService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Создание пользователя' })
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Delete()
  @ApiOperation({ summary: 'Очистка таблицы пользователей' })
  deleteUser() {
    return this.userService.delete();
  }
}
