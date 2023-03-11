import { IsEnum, IsNotEmpty } from 'class-validator';
export enum Type {
  Movie = 'Movie',
  Trailer = 'Trailer',
}

export class CreateVideoDto {
  @IsNotEmpty()
  filename: string;

  @IsEnum(Type)
  @IsNotEmpty()
  type: Type;
}
