import { SetMetadata } from '@nestjs/common';
import { Role } from '../users/entity/role.enum';

export const HasRoles = (roles: Role.Admin) => SetMetadata('roles', roles);
