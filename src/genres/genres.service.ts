import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';

import { GenreDto } from './dto/genre.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Genre } from '@prisma/client';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const Genre = await this.prisma.genre.create({
      data: {
        name: createGenreDto.name,
      },
    });
    return Genre;
  }

  async findAll(): Promise<Genre[]> {
    const Genres = await this.prisma.genre.findMany();
    return Genres;
  }

  async findOne(id: number): Promise<GenreDto> {
    const Genre = await this.prisma.genre.findUnique({
      where: { id },
    });
    if (!Genre)
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    return Genre;
  }

  async update(id: number, updateGenreDto: CreateGenreDto) {
    return this.prisma.genre.update({
      where: { id },
      data: {
        name: updateGenreDto.name,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.genre.delete({
      where: { id },
    });
  }
}
