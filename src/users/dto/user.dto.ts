import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../entity/role.enum';

export class UserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  createdOn?: Date;

  role: Role[];
}
