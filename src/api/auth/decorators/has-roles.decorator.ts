import { SetMetadata } from '@nestjs/common';
import { AppRoles } from '../../../app.roles';

export const HasRoles = (...roles: AppRoles[]) => SetMetadata('roles', roles);
