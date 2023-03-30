import {
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  releaseDate: Date;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsArray()
  @IsNotEmpty()
  genre: number[];

  @IsArray()
  @IsNotEmpty()
  video: number[];

  @IsArray()
  @IsNotEmpty()
  image: number[];

  @IsNumber()
  @IsNotEmpty()
  mainPoster: number;
}
