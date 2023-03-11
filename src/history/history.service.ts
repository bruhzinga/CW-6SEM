import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, movieId: number) {
    return this.prisma.history.create({
      data: {
        Movie: {
          connect: {
            id: movieId,
          },
        },
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
