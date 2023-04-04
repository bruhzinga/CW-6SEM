import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, movieId: number, progress: number) {
    return this.prisma.history.create({
      data: {
        progress: progress ? progress : 0,
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

  getHistoryById(userID, filmId: number) {
    return this.prisma.history.findMany({
      orderBy: {
        time: 'desc',
      },
      where: {
        userId: userID,
        movieId: filmId,
      },
      select: {
        progress: true,
      },
      take: 1,
    });
  }

  getHistoryByUser(userId: string) {
    return this.prisma.history.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        time: 'desc',
      },
      select: {
        time: true,
        Movie: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }
}
