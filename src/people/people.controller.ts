import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePeopleDto } from './DTO/create-people.dto';
import { AddPeopleToMovieDto } from './DTO/add-people-to-movie.dto';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../users/entities/Role';
import { RolesGuard } from '../auth/roles.guard';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post('AddPeopleToMovie')
  @HasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  async AddPeopleToMovie(@Body() body: AddPeopleToMovieDto) {
    const { peopleId, movieId, role } = body;
    return this.peopleService.AddPeopleToMovie(+peopleId, +movieId, role);
  }

  @Delete('RemovePeopleFromMovie')
  @HasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  async RemovePeopleFromMovie(@Body() body: AddPeopleToMovieDto) {
    const { peopleId, movieId, role } = body;
    return this.peopleService.RemovePeopleFromMovie(+peopleId, +movieId, role);
  }

  @Post()
  @HasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  async createPeople(@Body() createPeopleDto: CreatePeopleDto) {
    return this.peopleService.createPeople(createPeopleDto);
  }
  @Get(':id')
  async getPeople(@Param('id') id: string) {
    return this.peopleService.findOne(+id);
  }
  @Delete(':id')
  @HasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  async deletePeople(@Param('id') id: string) {
    return this.peopleService.deletePeople(+id);
  }

  @Put(':id')
  @HasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  async updatePeople(@Param('id') id: string, @Body() body: CreatePeopleDto) {
    return this.peopleService.updatePeople(+id, body);
  }

  @Get()
  async getAllPeople() {
    return this.peopleService.findAll();
  }
}
