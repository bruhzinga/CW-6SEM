import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put, UseGuards,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import {HasRoles} from "../auth/has-roles.decorator";
import {Role} from "../users/entities/Role";
import {RolesGuard} from "../auth/roles.guard";

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @HasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(+id);
  }

  @Put(':id')
  @HasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateGenreDto: CreateGenreDto) {
    return this.genresService.update(+id, updateGenreDto);
  }

  @Delete(':id')
  @HasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.genresService.remove(+id);
  }
}
