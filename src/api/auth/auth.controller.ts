import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    //
  }

  @Post('login')
  @UseGuards(LocalAuthGuard) // Проверка логина пароля
  @ApiOperation({ summary: 'Аутентификация' })
  login(@Request() req): Promise<any> {
    return this.authService.login(req.user); // Генерирование токенов
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токенов' })
  @UseGuards(JwtRefreshGuard) // Проверка токена refresh
  refresh(@Request() req): Promise<any> {
    return this.authService.refreshToken(req.user); // Генерирование токенов
  }

  @Post('logout')
  @ApiOperation({ summary: 'Обнуление refresh токена' })
  @UseGuards(JwtRefreshGuard)
  logout(@Request() req): Promise<any> {
    return this.authService.logout(req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Тест без авторизации' })
  info() {
    return 'INFO';
  }

  @Get('secret')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Тест c авторизацией' })
  secretInfo(@Request() req) {
    return req.user;
  }
}
