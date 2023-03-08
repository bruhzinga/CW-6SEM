import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePeopleDto } from './DTO/create-people-dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  async createPeople(@Body() createPeopleDto: CreatePeopleDto) {
    return this.peopleService.createPeople(createPeopleDto);
  }
  @Get(':id')
  async getPeople(@Param('id') id: string) {
    return this.peopleService.findOne(+id);
  }

  @Post('AddPeopleToMovie')
  async AddPeopleToMovie(@Body() body) {
    const { peopleId, movieId, role } = body;
    return this.peopleService.AddPeopleToMovie(+peopleId, +movieId, role);
  }
}
