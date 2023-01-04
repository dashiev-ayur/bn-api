import { Controller, Get, Version } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppService } from './app.service';
import { User } from './entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    //
  }

  @Get('test')
  @Version('1')
  getTest(): string {
    return this.appService.test();
  }

  @OnEvent('user.created')
  eventCreateUser(payload: User) {
    console.log('=======================');
    console.log('= USER CREATE =');
    console.log(payload);
    console.log('=======================');
  }
}
