import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './DTO/Create-movie-dto';
import { Prisma } from '@prisma/client';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('/search')
  async SearchMovies(
    @Query('page', ParseIntPipe) page: number,
    @Query('genres') genres: string,
    @Query('title') title: string,
    @Query('years') years: number,
    @Query('country') country: string,
    @Query('rating') rating: number,
    @Query('sort') sort: string,
  ) {
    return this.moviesService.SearchMovies(
      genres,
      title,
      years,
      country,
      +page,
      +rating,
      sort,
    );
  }
  @Get('titles')
  async GetTitles() {
    return this.moviesService.GetTitles();
  }

  @Post()
  async createMovie(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Get(':id')
  async GetMovie(@Param('id', ParseIntPipe) id: string) {
    /* return (
      (await this.moviesService.FindMovie(+id)) ?? throw new HttpException('Movie not found', HttpStatus.NOT_FOUND)
    );*/
    const movie = await this.moviesService.FindMovie(+id);
    if (movie) {
      return movie;
    } else {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
  }

  // http://localhost:3000/movies?skip=0&take=5&genre=Horror
  @Get()
  async GetMovies(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
    @Query('genre') genre: string,
  ) {
    return this.moviesService.FindMoviesByGenre(genre, +skip, +take);
  }

  @Get(':id/people')
  async GetPeople(@Param('id', ParseIntPipe) id: string) {
    return this.moviesService.GetPeople(+id);
  }

  @Get(':id/comments')
  async GetComments(@Param('id', ParseIntPipe) id: string) {
    return this.moviesService.GetComments(+id);
  }

  @Put(':id')
  async UpdateMovie(
    @Param('id', ParseIntPipe) id: string,
    @Body() movie: CreateMovieDto,
  ) {
    return this.moviesService.UpdateMovie(+id, movie);
  }

  @Delete(':id')
  async DeleteMovie(@Param('id', ParseIntPipe) id: string) {
    return this.moviesService.DeleteMovie(+id);
  }
}
