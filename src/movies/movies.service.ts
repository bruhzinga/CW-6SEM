import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './DTO/Create-movie-dto';
import { Movie } from '@prisma/client';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.prisma.movie.create({
      data: {
        title: createMovieDto.title,
        description: createMovieDto.description,
        releaseDate: new Date(createMovieDto.releaseDate),
        duration: createMovieDto.duration,
        Genre: {
          connect:
            createMovieDto.genre.map((genre) => ({ name: genre })) || undefined,
        },
        Video: {
          connect:
            createMovieDto.video.map((video) => ({ id: video })) || undefined,
        },
        Image: {
          connect:
            createMovieDto.image.map((image) => ({ id: image })) || undefined,
        },
      },
    });
  }
}
