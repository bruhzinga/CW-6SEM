import { SetMetadata } from '@nestjs/common';
import { Role } from '../users/entities/Role';

export const HasRoles = (roles: Role.Admin) => SetMetadata('roles', roles);
