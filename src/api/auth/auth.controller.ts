import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    //
  }

  @Post('login')
  @UseGuards(LocalAuthGuard) // Проверка логина пароля
  login(@Request() req): Promise<any> {
    return this.authService.getToken(req.user); // Генерирование токена
  }

  @Get()
  info() {
    return 'INFO';
  }

  @ApiBearerAuth()
  @Get('secret')
  @UseGuards(JwtAuthGuard)
  secretInfo(@Request() req) {
    return req.user;
  }
}
