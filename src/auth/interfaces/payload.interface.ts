import { Role } from '../../users/entity/role.enum';

export interface JwtPayload {
  username: string;

  role: Role[];
}
