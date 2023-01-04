import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { configService } from '../../config/config.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: configService.getJwtSecret(),
      signOptions: { expiresIn: configService.getJwtTokenExpires() },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {
  //
}
