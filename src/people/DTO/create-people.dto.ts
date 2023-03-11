import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
enum Profession {
  Actor = 'Actor',
  Director = 'Director',
  Producer = 'Producer',
  Writer = 'Writer',
}
export class CreatePeopleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  imageId: number;

  @IsEnum(Profession)
  @IsNotEmpty()
  profession: Profession;
}
