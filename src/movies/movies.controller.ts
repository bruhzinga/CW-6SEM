import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './DTO/Create-movie-dto';
import { Prisma } from '@prisma/client';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async createMovie(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Get(':id')
  async GetMovie(@Param('id') id: string) {
    return this.moviesService.FindMovie(+id);
  }

  // http://localhost:3000/movies?skip=0&take=5&genre=Horror
  @Get()
  async GetMovies(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('genre') genre: string,
  ) {
    return this.moviesService.FindMoviesByGenre(genre, +skip, +take);
  }
}
