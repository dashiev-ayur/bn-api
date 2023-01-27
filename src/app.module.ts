import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { UserModule } from './api/user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './api/auth/auth.module';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
        password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'Keys',
      useValue: {
        key1: '567sdfs4t3tgdfgd',
        key2: '3245drfgfdh45',
      },
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    //
  }
}
