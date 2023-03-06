import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['poster', 'actor', 'director'])
  type: string;
}
