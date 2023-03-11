import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddPeopleToMovieDto {
  @IsNumber()
  @IsNotEmpty()
  peopleId: number;

  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @IsString()
  @IsNotEmpty()
  role: string;
}
