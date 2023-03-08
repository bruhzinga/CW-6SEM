import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePeopleDto } from './DTO/create-people-dto';
import { People } from '@prisma/client';

@Injectable()
export class PeopleService {
  constructor(private readonly prisma: PrismaService) {}

  async createPeople(createPeopleDto: CreatePeopleDto): Promise<People> {
    return this.prisma.people.create({
      data: {
        name: createPeopleDto.name,
        profession: createPeopleDto.profession,
        Image: {
          connect: {
            id: createPeopleDto.imageId,
          },
        },
      },
    });
  }
  async findOne(id: number): Promise<People[]> {
    return this.prisma.people.findMany({
      where: {
        id: id,
      },
    });
  }

  async AddPeopleToMovie(peopleId: number, movieId: number, role: string) {
    await this.prisma.peopleOnMovies.create({
      data: {
        Movie: {
          connect: {
            id: movieId,
          },
        },
        People: {
          connect: {
            id: peopleId,
          },
        },
        Role: role,
      },
    });
    return this.prisma.people.findFirst({
      where: {
        id: peopleId,
      },
      select: {
        name: true,

        movies: {
          select: {
            Role: true,
            Movie: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
  }
}
