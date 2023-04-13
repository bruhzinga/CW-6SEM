import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './DTO/Create-movie-dto';
import { Movie, Prisma } from '@prisma/client';
import { retry } from 'rxjs';

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
        country:createMovieDto.country,
        Genre: {
          connect:
            createMovieDto.genre.map((genre) => ({ id: genre })) || undefined,
        },
        mainPoster: {
          connect: {
            id: createMovieDto.mainPoster,
          },
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

  async FindMovie(num: number) {
    return this.prisma.movie.findUnique({
      where: {
        id: num,
      },
      include: {
        Genre: {
          select: {
            id: true,
            name: true,
          },
        },
        Video: {
          select: {
            id: true,
            type: true,
            filename: true,
          },
        },
        Image: {
          select: {
            id: true,
            filename: true,
          },
        },
        People: true,
      },
    });
  }

  FindMoviesByGenre(genre: string, skip: number, take: number) {
    return this.prisma.movie.findMany({
      where: {
        Genre: {
          some: {
            name: genre,
          },
        },
      },
      include: {
        Image: true,
      },
      skip: skip,
      take: take,
    });
  }

  GetPeople(filmID: number) {
    return this.prisma.movie.findUnique({
      where: {
        id: filmID,
      },
      select: {
        People: {
          select: {
            id: true,
            Role: true,
            People: {
              select: {
                id: true,
                name: true,
                Image: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  GetComments(filmID: number) {
    return this.prisma.movie.findUnique({
      where: {
        id: filmID,
      },
      select: {
        Comment: {
          include: {
            User: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
  }

  GetTitles() {
    return this.prisma.movie.findMany({
      select: {
        title: true,
        id: true,
      },
    });
  }

  UpdateMovie(MovieID: number, createMovieDto: CreateMovieDto) {
    return this.prisma.movie.update({
      where: {
        id: MovieID,
      },
      data: {
        country: createMovieDto.country,
        title: createMovieDto.title,
        description: createMovieDto.description,
        releaseDate: new Date(createMovieDto.releaseDate),
        duration: createMovieDto.duration,
        Genre: {
          set:
            createMovieDto.genre.map((genre) => ({ id: genre })) || undefined,
        },
        Video: {
          set:
            createMovieDto.video.map((video) => ({ id: video })) || undefined,
        },
        Image: {
          set:
            createMovieDto.image.map((image) => ({ id: image })) || undefined,
        },
        mainPoster: {
          connect: {
            id: createMovieDto.mainPoster,
          },
        },
      },
    });
  }

  DeleteMovie(id: number) {
    return this.prisma.movie.delete({
      where: {
        id: id,
      },
    });
  }
}
