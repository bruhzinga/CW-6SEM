import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WatchLaterService {
  constructor(private readonly prisma: PrismaService) {}

  async createWatchLater(movieId: number, userId: string) {
    return this.prisma.watchLater.create({
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

  async deleteWatchLater(movieId: number, userId: string) {
    return this.prisma.watchLater.delete({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });
  }


  async getWatchLater(id: string) {
    return this.prisma.watchLater.findMany({
      where: {
        userId: id,
      },
      include: {
        Movie: true,
      },
    });
  }

}
