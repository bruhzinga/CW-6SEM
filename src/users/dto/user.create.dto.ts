import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../entities/Role';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role[];
}
