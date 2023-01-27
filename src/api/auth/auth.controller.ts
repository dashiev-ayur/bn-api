import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasRoles } from './decorators/has-roles.decorator';
import { acl, AppRoles } from '../../app.roles';

import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Auth } from './decorators/auth.decorator';

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
    const payload = req.user; // local strategy
    return this.authService.login(payload); // Генерирование токенов
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токенов' })
  @UseGuards(JwtRefreshGuard) // Проверка токена refresh
  refresh(@Request() req): Promise<any> {
    const payload = req.user; // refresh strategy
    return this.authService.refreshToken(payload); // Генерирование токенов
  }

  @Post('logout')
  @ApiOperation({ summary: 'Обнуление refresh токена' })
  @UseGuards(JwtRefreshGuard)
  logout(@Request() req): Promise<any> {
    const payload = req.user; // refresh strategy
    return this.authService.logout(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Тест без авторизации' })
  info() {
    return 'INFO';
  }

  @Get('secret')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Тест c авторизацией' })
  secretInfo(@Request() req) {
    return req.user;
  }

  @Get('secret2')
  @HasRoles(AppRoles.ADMIN, AppRoles.CLIENT, AppRoles.USER)
  @Auth()
  secretInfo2(@Request() req) {
    const permission = acl.can('admin').readOwn('news');
    const data = {
      id: 1,
      views: 125,
      title: 'Заголовок 1',
    };

    return {
      ...req.user,
      granted: permission.granted,
      attributes: permission.attributes,
      data: permission.filter(data),
    };
  }
}
