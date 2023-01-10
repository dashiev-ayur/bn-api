import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRoles } from '../../../app.roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AppRoles[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    // console.log('==============================================');
    // console.log('requiredRoles>>', requiredRoles);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // console.log('user>>', user);
    return requiredRoles.some((role) => user?.role === role);
  }
}
