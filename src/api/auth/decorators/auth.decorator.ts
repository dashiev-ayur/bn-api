import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RolesGuard } from '../guard/roles.guard';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AppRoles } from '../../../app.roles';

export function Auth(...roles: AppRoles[]) {
  return applyDecorators(
    SetMetadata('roles', roles || null),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
