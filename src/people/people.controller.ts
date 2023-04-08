import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePeopleDto } from './DTO/create-people.dto';
import { AddPeopleToMovieDto } from './DTO/add-people-to-movie.dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post('AddPeopleToMovie')
  async AddPeopleToMovie(@Body() body: AddPeopleToMovieDto) {
    const { peopleId, movieId, role } = body;
    return this.peopleService.AddPeopleToMovie(+peopleId, +movieId, role);
  }

  @Delete('RemovePeopleFromMovie')
  async RemovePeopleFromMovie(@Body() body: AddPeopleToMovieDto) {
    const { peopleId, movieId, role } = body;
    return this.peopleService.RemovePeopleFromMovie(+peopleId, +movieId, role);
  }

  @Post()
  async createPeople(@Body() createPeopleDto: CreatePeopleDto) {
    return this.peopleService.createPeople(createPeopleDto);
  }
  @Get(':id')
  async getPeople(@Param('id') id: string) {
    return this.peopleService.findOne(+id);
  }
  @Delete(':id')
  async deletePeople(@Param('id') id: string) {
    return this.peopleService.deletePeople(+id);
  }

  @Put(':id')
  async updatePeople(@Param('id') id: string, @Body() body: CreatePeopleDto) {
    return this.peopleService.updatePeople(+id, body);
  }

  @Get()
  async getAllPeople() {
    return this.peopleService.findAll();
  }
}
